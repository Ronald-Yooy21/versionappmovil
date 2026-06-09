import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../services/api";

export default function ModalAutoEva({
  visible,
  onClose,
  actividad,
  readOnly,
  onRefresh,
}) {
  const [comentario, setComentario] = useState("");
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState(false);
  const yaExiste = actividad?.autoevaluacion !== null;

  useEffect(() => {
    if (visible && actividad) {
      if (actividad.autoevaluacion) {
        setComentario(actividad.autoevaluacion.comentario || "");
        setNota(actividad.autoevaluacion.nota?.toString() || "");
      } else {
        setComentario("");
        setNota("");
      }
    }
  }, [visible, actividad]);

  const guardar = async () => {
    if (!comentario.trim()) {
      Alert.alert("Error", "Debes escribir una justificación");
      return;
    }

    setLoading(true);
    try {
      await api.post("/pasante/auto-eva", {
        id_actividad: actividad.id,
        comentario: comentario,
        nota: parseInt(nota),
      });
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la autoevaluación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Autoevaluación</Text>
          <Text style={styles.subtitle}>{actividad?.nombre}</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nota que te asignas (0-100):</Text>
            <TextInput
              style={[styles.input, readOnly && styles.inputDisabled]}
              placeholder="Ej: 85"
              value={nota}
              onChangeText={setNota}
              keyboardType="numeric"
              editable={!readOnly && !yaExiste}
            />

            <Text style={styles.label}>Justificación del puntaje:</Text>
            <TextInput
              style={[styles.textArea, readOnly && styles.inputDisabled]}
              placeholder="¿Qué logros o dificultades justifican esta nota?"
              value={comentario}
              onChangeText={setComentario}
              multiline
              numberOfLines={4}
              editable={!readOnly}
            />

            {!readOnly && (
              <TouchableOpacity
                style={styles.guardarButton}
                onPress={guardar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.guardarButtonText}>
                    Guardar autoevaluación
                  </Text>
                )}
              </TouchableOpacity>
            )}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "500", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  inputDisabled: { backgroundColor: "#f5f5f5", color: "#999" },
  guardarButton: {
    backgroundColor: "#2A5A8D",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  guardarButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
