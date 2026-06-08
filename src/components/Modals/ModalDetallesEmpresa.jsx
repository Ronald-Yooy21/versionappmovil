import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

export default function ModalDetallesEmpresa({ visible, onClose, empresa }) {
  if (!empresa) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalles de la Empresa</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏢 Nombre:</Text>
            <Text style={styles.infoValue}>{empresa.nombre}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👔 Gerente:</Text>
            <Text style={styles.infoValue}>{empresa.gerente_nombre}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📄 NIT:</Text>
            <Text style={styles.infoValue}>
              {empresa.nit || "No registrado"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍Dirección:</Text>
            <Text style={styles.infoValue}>
              {empresa.direccion || "No registrada"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📞 Teléfono:</Text>
            <Text style={styles.infoValue}>
              {empresa.telefono || "No registrado"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 Email:</Text>
            <Text style={styles.infoValue}>
              {empresa.email || "No registrado"}
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
  infoRow: { flexDirection: "row", marginBottom: 12, flexWrap: "wrap" },
  infoLabel: { width: 90, fontSize: 14, fontWeight: "500", color: "#666" },
  infoValue: { flex: 1, fontSize: 14, color: "#333" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
