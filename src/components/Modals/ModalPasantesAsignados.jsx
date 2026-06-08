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
} from "react-native";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";

export default function ModalPasantesAsignados({ visible, onClose, jefe }) {
  const [pasantes, setPasantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPasantes = async () => {
    if (!jefe?.id) return;

    setLoading(true);
    try {
      const response = await api.get(`/gerente/jefes/${jefe.id}/pasantes`);
      setPasantes(response.data);
    } catch (error) {
      console.error("Error cargando pasantes:", error);
      Alert.alert("Error", "No se pudieron cargar los pasantes asignados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && jefe) {
      cargarPasantes();
    }
  }, [visible, jefe]);

  const getEstadoColor = (estado) => {
    if (estado === "iniciado") return "#10b981";
    if (estado === "inscrito") return "#f59e0b";
    return "#6b7280";
  };

  const getEstadoTexto = (estado) => {
    if (estado === "iniciado") return "En curso";
    if (estado === "inscrito") return "Inscrito";
    return estado;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pasantes Asignados</Text>
          <Text style={styles.subtitle}>
            {jefe?.ap_paterno} {jefe?.ap_materno}, {jefe?.nombre}
          </Text>
          <Text style={styles.totalText}>
            Total: {pasantes.length} pasantes
          </Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2A5A8D"
              style={styles.loader}
            />
          ) : pasantes.length === 0 ? (
            <Text style={styles.emptyText}>No tiene pasantes asignados</Text>
          ) : (
            <ScrollView style={styles.listaPasantes}>
              {pasantes.map((pasante, index) => (
                <View key={pasante.id} style={styles.pasanteCard}>
                  <Text style={styles.pasanteNombre}>
                    {index + 1}. {pasante.ap_paterno} {pasante.ap_materno},{" "}
                    {pasante.nombre}
                  </Text>
                  <Text style={styles.pasanteDetalle}>📄 CI: {pasante.ci}</Text>
                  <Text style={styles.pasanteDetalle}>
                    📚 Pasantía: {pasante.pasantia_nombre}
                  </Text>
                  <View style={styles.estadoContainer}>
                    <Text
                      style={[
                        styles.estadoText,
                        { color: getEstadoColor(pasante.estado_inscripcion) },
                      ]}
                    >
                      Estado: {getEstadoTexto(pasante.estado_inscripcion)}
                    </Text>
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
  loader: { padding: 20 },
  emptyText: { textAlign: "center", color: "#999", padding: 20 },
  listaPasantes: { maxHeight: 450 },
  pasanteCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  pasanteNombre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  pasanteDetalle: { fontSize: 12, color: "#666", marginBottom: 2 },
  estadoContainer: { marginTop: 6 },
  estadoText: { fontSize: 12, fontWeight: "500" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
