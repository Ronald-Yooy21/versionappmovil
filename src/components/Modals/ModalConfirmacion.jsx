import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

export default function ModalConfirmacion({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  type = "warning",
}) {
  const getColors = () => {
    if (type === "danger") return { bg: "#ef4444", hover: "#dc2626" };
    if (type === "success") return { bg: "#10b981", hover: "#059669" };
    return { bg: "#2A5A8D", hover: "#1e3a5f" };
  };

  const colors = getColors();

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.bg }]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonRow: { flexDirection: "row", gap: 12 },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButtonText: { color: "#666", fontSize: 14, fontWeight: "500" },
  confirmButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
