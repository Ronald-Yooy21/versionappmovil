import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { toDisplayDate } from "../../utils/dateUtils";

export default function ModalVerEvaluacion({ visible, onClose, evaluacion }) {
  if (!evaluacion) return null;

  const getEstadoColor = () => {
    if (evaluacion.estado === "COMPLETADA") return "#10b981";
    if (evaluacion.estado === "COMPLETADA PARCIALMENTE") return "#f59e0b";
    if (evaluacion.estado === "NO REALIZADA") return "#ef4444";
    return "#6b7280";
  };

  const getEstadoTexto = () => {
    if (evaluacion.estado === "COMPLETADA") return "Completada";
    if (evaluacion.estado === "COMPLETADA PARCIALMENTE")
      return "Completada parcialmente";
    if (evaluacion.estado === "NO REALIZADA") return "No realizada";
    return "Pendiente";
  };

  const formatFechaHora = (fecha, hora) => {
    if (!fecha) return "";
    return `${toDisplayDate(fecha)} ${hora ? hora.substring(0, 5) : ""}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalle de Evaluación</Text>

          <View style={styles.notaContainer}>
            <Text style={styles.notaValor}>{evaluacion.nota || 0}</Text>
            <Text style={styles.notaTotal}>/100</Text>
          </View>

          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: getEstadoColor() + "20" },
            ]}
          >
            <Text style={[styles.estadoText, { color: getEstadoColor() }]}>
              {getEstadoTexto()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📝 Descripción:</Text>
            <Text style={styles.infoValue}>
              {evaluacion.descripcion || "Sin descripción"}
            </Text>
          </View>

          {evaluacion.observacion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💬 Observación:</Text>
              <Text style={styles.infoValue}>{evaluacion.observacion}</Text>
            </View>
          )}

          {evaluacion.recomendacion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📌 Recomendación:</Text>
              <Text style={styles.infoValue}>{evaluacion.recomendacion}</Text>
            </View>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              📅 {formatFechaHora(evaluacion.fecha, evaluacion.hora)}
            </Text>
            <Text style={styles.metaText}>
              👤 {evaluacion.jefe_nombre || "Jefe"}
            </Text>
          </View>

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
  modalContent: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A5A8D",
    textAlign: "center",
    marginBottom: 20,
  },
  notaContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 12,
  },
  notaValor: { fontSize: 48, fontWeight: "bold", color: "#2A5A8D" },
  notaTotal: { fontSize: 20, color: "#666" },
  estadoBadge: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  estadoText: { fontSize: 13, fontWeight: "bold" },
  infoRow: { marginBottom: 12 },
  infoLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  infoValue: { fontSize: 13, color: "#333", lineHeight: 18 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  metaText: { fontSize: 11, color: "#999" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
