import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import api from "../../services/api";

export default function ModalEvaluarBitacora({
  visible,
  actividad,
  pasanteId,
  onClose,
  onSuccess,
}) {
  const [modo, setModo] = useState("create"); // "create" o "view"
  const [form, setForm] = useState({
    nota: "",
    estado: "COMPLETADA",
    observacion: "",
    descripcion: "",
    recomendacion: "",
  });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (actividad) {
      if (actividad.tiene_bitacora) {
        setModo("view");
        setForm({
          nota: actividad.bitacora.nota?.toString() || "",
          estado: actividad.bitacora.estado || "COMPLETADA",
          observacion: actividad.bitacora.observacion || "",
          descripcion: actividad.bitacora.descripcion || "",
          recomendacion: actividad.bitacora.recomendacion || "",
        });
      } else {
        setModo("create");
        setForm({
          nota: "",
          estado: "COMPLETADA",
          observacion: "",
          descripcion: "",
          recomendacion: "",
        });
      }
    }
  }, [actividad]);

  const handleSubmit = async () => {
    if (modo === "view") return;
    setEnviando(true);
    try {
      await api.post("/jefe/bitacoras/evaluar", {
        id_actividad: actividad.id_actividad,
        idU_pasante: pasanteId,
        ...form,
        nota: parseInt(form.nota),
      });
      Alert.alert("Éxito", "Evaluación registrada exitosamente.");
      onSuccess?.();
      onClose();
    } catch (e) {
      Alert.alert("Error", "No se pudo registrar la evaluación.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.titulo}>
              {modo === "create" ? "Evaluar Actividad" : "Detalle de Bitácora"}
            </Text>
            <View style={styles.actividadContainer}>
              <Text style={styles.actividadLabel}>ACTIVIDAD</Text>
              <Text style={styles.actividad}>{actividad?.nombre_act}</Text>
            </View>

            <Text style={styles.label}>Nota (0-100)</Text>
            <TextInput
              style={[styles.input, styles.inputNota, modo === "view" && styles.inputDisabled]}
              value={form.nota}
              onChangeText={(text) => setForm({ ...form, nota: text })}
              keyboardType="numeric"
              editable={modo === "create"}
              placeholder="Ej. 85"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Estado del Cumplimiento</Text>
            <View style={styles.pickerContainer}>
              {["COMPLETADA", "COMPLETADA PARCIALMENTE", "NO REALIZADA"].map(
                (estado) => (
                  <TouchableOpacity
                    key={estado}
                    onPress={() =>
                      modo === "create" && setForm({ ...form, estado })
                    }
                    style={[
                      styles.estadoOption,
                      form.estado === estado && styles.estadoSeleccionado,
                    ]}
                    disabled={modo === "view"}
                  >
                    <Text
                      style={[
                        styles.estadoText,
                        form.estado === estado && styles.estadoSeleccionadoText,
                      ]}
                    >
                      {estado}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              style={[
                styles.input,
                styles.multiline,
                modo === "view" && styles.inputDisabled,
              ]}
              value={form.observacion}
              onChangeText={(text) => setForm({ ...form, observacion: text })}
              multiline
              numberOfLines={3}
              editable={modo === "create"}
              placeholder="Escribe las observaciones aquí..."
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Descripción de Actividades</Text>
            <TextInput
              style={[
                styles.input,
                styles.multiline,
                modo === "view" && styles.inputDisabled,
              ]}
              value={form.descripcion}
              onChangeText={(text) => setForm({ ...form, descripcion: text })}
              multiline
              numberOfLines={3}
              editable={modo === "create"}
              placeholder="Detalles de lo realizado..."
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Recomendación</Text>
            <TextInput
              style={[
                styles.input,
                styles.multiline,
                modo === "view" && styles.inputDisabled,
              ]}
              value={form.recomendacion}
              onChangeText={(text) => setForm({ ...form, recomendacion: text })}
              multiline
              numberOfLines={3}
              editable={modo === "create"}
              placeholder="Sugerencias para mejora..."
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.botones}>
              <TouchableOpacity style={styles.cerrarBtn} onPress={onClose}>
                <Text style={styles.cerrarBtnText}>
                  {modo === "view" ? "Regresar" : "Cancelar"}
                </Text>
              </TouchableOpacity>
              {modo === "create" && (
                <TouchableOpacity
                  style={[styles.enviarBtn, enviando && styles.botonDisabled]}
                  onPress={handleSubmit}
                  disabled={enviando}
                >
                  <Text style={styles.enviarBtnText}>
                    {enviando ? "Guardando..." : "Asentar Evaluación"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Fondo oscuro Slate más sofisticado
    padding: 16,
  },
  modalWrapper: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    overflow: "hidden",
  },
  container: {
    padding: 24,
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 16
  },
  actividadContainer: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  actividadLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 4,
  },
  actividad: { 
    color: "#0284C7", 
    fontSize: 15, 
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  inputNota: {
    width: 120,
    fontWeight: "600",
    fontSize: 16,
  },
  multiline: { 
    height: 90, 
    textAlignVertical: "top",
    paddingTop: 12,
  },
  inputDisabled: { 
    backgroundColor: "#F8FAFC", 
    borderColor: "#E2E8F0",
    color: "#64748B" 
  },
  pickerContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap",
    gap: 8, 
    marginBottom: 6 
  },
  estadoOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  estadoSeleccionado: { 
    backgroundColor: "#0F172A", 
    borderColor: "#0F172A" 
  },
  estadoText: { 
    fontSize: 11, 
    color: "#64748B",
    fontWeight: "500" 
  },
  estadoSeleccionadoText: { 
    color: "#FFFFFF", 
    fontWeight: "600" 
  },
  botones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 28,
    marginBottom: 32, // Espacio extra para el scroll inferior
  },
  cerrarBtn: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cerrarBtnText: { 
    color: "#475569", 
    fontWeight: "600",
    fontSize: 14,
  },
  enviarBtn: {
    backgroundColor: "#0284C7", // Azul corporativo vibrante moderno
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  enviarBtnText: { 
    color: "#FFFFFF", 
    fontWeight: "600",
    fontSize: 14,
  },
  botonDisabled: { 
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});
