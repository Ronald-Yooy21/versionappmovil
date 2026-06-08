import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import api from "../../services/api";
import ModalSeleccionarJefe from "./ModalSeleccionarJefe";

export default function ModalInscritos({
  visible,
  onClose,
  pasantia,
  onRefresh,
}) {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAsignarJefe, setModalAsignarJefe] = useState({
    visible: false,
    pasante: null,
  });

  const cargarInscritos = async () => {
    if (!pasantia?.id) {
      console.warn("No hay pasantía seleccionada");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(
        `/gerente/pasantias/${pasantia.id}/inscritos`,
      );
      setInscritos(response.data.inscritos || []);
    } catch (error) {
      console.error("Error cargando inscritos:", error);
      Alert.alert("Error", "No se pudieron cargar los pasantes inscritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && pasantia?.id) {
      cargarInscritos();
    }
  }, [visible, pasantia?.id]);

  const handleDesignarJefe = (pasante) => {
    if (!pasantia?.id) return;

    Alert.alert(
      "Desasignar Jefe",
      `¿Estás seguro de desasignar al jefe de ${pasante.nombre} ${pasante.ap_paterno}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desasignar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.patch(
                `/gerente/pasantias/${pasantia.id}/designar-jefe/${pasante.idU_pasante}`,
              );
              await cargarInscritos();
              if (onRefresh) onRefresh();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Error al desasignar jefe",
              );
            }
          },
        },
      ],
    );
  };

  const handleJefeAsignado = () => {
    cargarInscritos();
    if (onRefresh) onRefresh();
    setModalAsignarJefe({ visible: false, pasante: null });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const filteredInscritos = inscritos.filter((inscrito) => {
    const nombreCompleto =
      `${inscrito.ap_paterno} ${inscrito.ap_materno} ${inscrito.nombre}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pasantes Inscritos</Text>
            <Text style={styles.subtitle}>
              {pasantia?.nombre || "Cargando..."}
            </Text>
            <Text style={styles.totalText}>
              Total: {inscritos.length} pasantes
            </Text>

            {/* Buscador */}
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Buscar por nombre..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#2A5A8D"
                style={styles.loader}
              />
            ) : filteredInscritos.length === 0 ? (
              <Text style={styles.emptyText}>No hay pasantes inscritos</Text>
            ) : (
              <ScrollView style={styles.listaInscritos}>
                {filteredInscritos.map((inscrito, index) => (
                  <View key={inscrito.id} style={styles.inscritoCard}>
                    <View style={styles.inscritoHeader}>
                      <Text style={styles.inscritoNombre}>
                        {index + 1}. {inscrito.ap_paterno} {inscrito.ap_materno}
                        , {inscrito.nombre}
                      </Text>
                      <Text style={styles.inscritoCi}>CI: {inscrito.ci}</Text>
                    </View>

                    <View style={styles.inscritoDetalles}>
                      <Text style={styles.detalleText}>
                        📅 Fecha inscripción: {formatFecha(inscrito.fecha_insc)}
                      </Text>
                      {/* <Text style={styles.detalleText}>
                        ⏰ Hora: {inscrito.hora_insc}
                      </Text> */}
                      <Text style={styles.detalleText}>
                        📚 Matrícula: {inscrito.matricula}
                      </Text>
                      <Text style={styles.detalleText}>
                        🎓 Semestre: {inscrito.semestre}
                      </Text>
                      <Text style={styles.detalleText}>
                        📖 Mención: {inscrito.mencion}
                      </Text>
                    </View>

                    {/* Jefe asignado */}
                    <View style={styles.jefeSection}>
                      <Text style={styles.jefeLabel}>👔 Jefe Asignado:</Text>
                      {inscrito.jefe ? (
                        <View style={styles.jefeInfo}>
                          <Text style={styles.jefeNombre}>
                            {inscrito.jefe.ap_paterno}{" "}
                            {inscrito.jefe.ap_materno}, {inscrito.jefe.nombre}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDesignarJefe(inscrito)}
                          >
                            <Text style={styles.designarBtn}>Desasignar</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.jefeInfo}>
                          <Text style={styles.sinJefe}>No asignado</Text>
                          <TouchableOpacity
                            style={styles.asignarBtn}
                            onPress={() =>
                              setModalAsignarJefe({
                                visible: true,
                                pasante: inscrito,
                              })
                            }
                          >
                            <Text style={styles.asignarBtnText}>
                              + Asignar Jefe
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar jefe */}
      <ModalSeleccionarJefe
        visible={modalAsignarJefe.visible}
        onClose={() => setModalAsignarJefe({ visible: false, pasante: null })}
        pasantiaId={pasantia?.id}
        pasante={modalAsignarJefe.pasante}
        onAsignado={handleJefeAsignado}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A5A8D",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  totalText: {
    fontSize: 13,
    color: "#2A5A8D",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  loader: { padding: 20 },
  emptyText: { textAlign: "center", color: "#999", padding: 20 },
  listaInscritos: { maxHeight: 450 },
  inscritoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  inscritoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  inscritoNombre: { fontSize: 14, fontWeight: "bold", color: "#333", flex: 1 },
  inscritoCi: { fontSize: 12, color: "#666" },
  inscritoDetalles: { marginBottom: 12 },
  detalleText: { fontSize: 12, color: "#666", marginBottom: 4 },
  jefeSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 4,
  },
  jefeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  jefeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  jefeNombre: { fontSize: 13, color: "#2A5A8D", fontWeight: "500", flex: 1 },
  designarBtn: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 10,
  },
  sinJefe: { fontSize: 13, color: "#999", fontStyle: "italic" },
  asignarBtn: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  asignarBtnText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
