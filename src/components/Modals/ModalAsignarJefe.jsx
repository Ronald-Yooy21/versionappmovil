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

export default function ModalAsignarJefe({
  visible,
  onClose,
  pasantia,
  onRefresh,
}) {
  const [jefes, setJefes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarJefes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/gerente/pasantias/jefes-disponibles");
      setJefes(response.data.jefes || []);
    } catch (error) {
      console.error("Error cargando jefes:", error);
      Alert.alert("Error", "No se pudieron cargar los jefes disponibles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      cargarJefes();
    }
  }, [visible]);

  const handleAsignarJefe = (jefe) => {
    if (!pasantia?.id) return;

    Alert.alert(
      "Asignar Jefe",
      `¿Estás seguro de asignar a ${jefe.ap_paterno} ${jefe.ap_materno}, ${jefe.nombre} como jefe de esta pasantía?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Asignar",
          onPress: async () => {
            try {
              await api.patch(
                `/gerente/pasantias/${pasantia.id}/asignar-jefe-pasantia`,
                { idU_jefe: jefe.id },
              );
              if (onRefresh) onRefresh();
              onClose();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Error al asignar jefe",
              );
            }
          },
        },
      ],
    );
  };

  const handleDesasignarJefe = () => {
    if (!pasantia?.id) return;

    Alert.alert(
      "Desasignar Jefe",
      "¿Estás seguro de desasignar al jefe responsable de esta pasantía?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desasignar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.patch(
                `/gerente/pasantias/${pasantia.id}/designar-jefe-pasantia`,
              );
              if (onRefresh) onRefresh();
              onClose();
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

  const filteredJefes = jefes.filter((jefe) => {
    const nombreCompleto =
      `${jefe.ap_paterno} ${jefe.ap_materno} ${jefe.nombre}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  const tieneJefeAsignado =
    pasantia?.jefe_asignado !== null && pasantia?.jefe_asignado !== undefined;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Jefe de Pasantía</Text>
          <Text style={styles.subtitle}>
            {pasantia?.nombre || "Cargando..."}
          </Text>

          {/* Jefe actual */}
          {tieneJefeAsignado && pasantia?.jefe_asignado && (
            <View style={styles.jefeActualContainer}>
              <Text style={styles.jefeActualLabel}>Jefe actual:</Text>
              <Text style={styles.jefeActualNombre}>
                {pasantia.jefe_asignado?.ap_paterno || ""}{" "}
                {pasantia.jefe_asignado?.ap_materno || ""},{" "}
                {pasantia.jefe_asignado?.nombre || ""}
              </Text>
              <TouchableOpacity
                style={styles.desasignarBtn}
                onPress={handleDesasignarJefe}
              >
                <Text style={styles.desasignarBtnText}>Desasignar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Buscador de jefes */}
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar jefe por nombre..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2A5A8D"
              style={styles.loader}
            />
          ) : filteredJefes.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay jefes disponibles para asignar
            </Text>
          ) : (
            <ScrollView style={styles.listaJefes}>
              {filteredJefes.map((jefe, index) => (
                <TouchableOpacity
                  key={jefe.id}
                  style={styles.jefeCard}
                  onPress={() => handleAsignarJefe(jefe)}
                >
                  <View style={styles.jefeHeader}>
                    <Text style={styles.jefeNombre}>
                      {index + 1}. {jefe.ap_paterno} {jefe.ap_materno},{" "}
                      {jefe.nombre}
                    </Text>
                    <Text style={styles.asignarText}>Asignar →</Text>
                  </View>
                  <Text style={styles.jefeDetalle}>CI: {jefe.ci}</Text>
                  <Text style={styles.jefeDetalle}>📞 {jefe.numero_cel}</Text>
                  <Text style={styles.jefeDetalle}>📧 {jefe.correo}</Text>
                  <Text style={styles.jefeDetalle}>💼 Cargo: {jefe.cargo}</Text>
                  {jefe.area && (
                    <Text style={styles.jefeDetalle}>🏢 Área: {jefe.area}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    marginBottom: 16,
  },
  jefeActualContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  jefeActualLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  jefeActualNombre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 8,
  },
  desasignarBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  desasignarBtnText: { color: "#fff", fontSize: 12, fontWeight: "500" },
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
  listaJefes: { maxHeight: 400 },
  jefeCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  jefeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jefeNombre: { fontSize: 14, fontWeight: "bold", color: "#333", flex: 1 },
  asignarText: { fontSize: 13, color: "#2A5A8D", fontWeight: "500" },
  jefeDetalle: { fontSize: 12, color: "#666", marginBottom: 2 },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
