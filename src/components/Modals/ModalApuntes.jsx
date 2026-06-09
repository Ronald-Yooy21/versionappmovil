import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";

export default function ModalApuntes({
  visible,
  onClose,
  actividad,
  readOnly,
  onRefresh,
}) {
  const [descripcion, setDescripcion] = useState("");
  const [porcentaje, setPorcentaje] = useState(0);
  const [progresos, setProgresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargarProgresos = async () => {
    if (!actividad?.id) return;
    setLoading(true);
    try {
      const response = await api.get(`/pasante/progresos/${actividad.id}`);
      setProgresos(response.data);
    } catch (error) {
      console.error("Error cargando progresos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && actividad) {
      cargarProgresos();
      setDescripcion("");
      setPorcentaje(0);
    }
  }, [visible, actividad]);

  const guardarApunte = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Error", "Escribe una descripción del apunte");
      return;
    }

    setSaving(true);
    try {
      await api.post("/pasante/progreso", {
        id_actividad: actividad.id,
        descripcion: descripcion,
        porcentaje: porcentaje,
      });
      await cargarProgresos();
      setDescripcion("");
      setPorcentaje(0);
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el apunte");
    } finally {
      setSaving(false);
    }
  };

  const formatFechaHora = (fecha, hora) => {
    if (!fecha) return "";
    return `${toDisplayDate(fecha)} ${hora ? hora.substring(0, 5) : ""}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mis Apuntes</Text>
          <Text style={styles.subtitle}>{actividad?.nombre}</Text>

          {!readOnly && (
            <View style={styles.formContainer}>
              <View style={styles.porcentajeContainer}>
                <Text style={styles.label}>Progreso:</Text>
                <View style={styles.porcentajeButtons}>
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.porcentajeBtn,
                        porcentaje === val && styles.porcentajeBtnActive,
                      ]}
                      onPress={() => setPorcentaje(val)}
                    >
                      <Text
                        style={[
                          styles.porcentajeBtnText,
                          porcentaje === val && styles.porcentajeBtnTextActive,
                        ]}
                      >
                        {val}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.textArea}
                placeholder="¿Cómo vas? Describe tu avance..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={styles.guardarButton}
                onPress={guardarApunte}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.guardarButtonText}>Guardar apunte</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.historialTitle}>Historial de avances</Text>

          {loading ? (
            <ActivityIndicator size="small" color="#2A5A8D" />
          ) : progresos.length === 0 ? (
            <Text style={styles.emptyText}>No hay apuntes registrados</Text>
          ) : (
            <ScrollView style={styles.progresosList}>
              {progresos.map((p) => (
                <View key={p.id_progresoact} style={styles.progresoCard}>
                  <View style={styles.progresoHeader}>
                    <Text style={styles.progresoPorcentaje}>
                      {p.porcentaje}%
                    </Text>
                    <Text style={styles.progresoFecha}>
                      {formatFechaHora(p.fecha, p.hora)}
                    </Text>
                  </View>
                  <Text style={styles.progresoDesc}>
                    {p.descripcion || "Sin descripción"}
                  </Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  formContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
    marginBottom: 16,
  },
  porcentajeContainer: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "500", color: "#333", marginBottom: 8 },
  porcentajeButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  porcentajeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  porcentajeBtnActive: { backgroundColor: "#2A5A8D" },
  porcentajeBtnText: { fontSize: 12, color: "#666" },
  porcentajeBtnTextActive: { color: "#fff" },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  guardarButton: {
    backgroundColor: "#2A5A8D",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  guardarButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  historialTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progresosList: { maxHeight: 300 },
  progresoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  progresoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progresoPorcentaje: { fontSize: 13, fontWeight: "bold", color: "#2A5A8D" },
  progresoFecha: { fontSize: 11, color: "#999" },
  progresoDesc: { fontSize: 13, color: "#555" },
  emptyText: { textAlign: "center", color: "#999", padding: 20 },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
