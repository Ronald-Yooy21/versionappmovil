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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../services/api";
import {
  toDisplayDate,
  toBackendDate,
  isValidDate,
} from "../../utils/dateUtils";

const TIPOS_ACTIVIDAD = ["OPERATIVA", "TECNICA"];

const ActividadFormModal = ({
  visible,
  onClose,
  onSave,
  actividad,
  pasantia,
  pasantiaFechaIni,
  pasantiaFechaFin,
}) => {
  const [form, setForm] = useState({
    nombre_act: "",
    tipo: "",
    descripcion: "",
    fecha_ini: "",
    fecha_fin: "",
  });
  const [fechaIniDisplay, setFechaIniDisplay] = useState("");
  const [fechaFinDisplay, setFechaFinDisplay] = useState("");
  const [errors, setErrors] = useState({});
  const [showTipoPicker, setShowTipoPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actividad) {
      setForm({
        nombre_act: actividad.nombre_act || "",
        tipo: actividad.tipo || "",
        descripcion: actividad.descripcion || "",
        fecha_ini: actividad.fecha_ini || "",
        fecha_fin: actividad.fecha_fin || "",
      });
      setFechaIniDisplay(toDisplayDate(actividad.fecha_ini || ""));
      setFechaFinDisplay(toDisplayDate(actividad.fecha_fin || ""));
    } else {
      setForm({
        nombre_act: "",
        tipo: "",
        descripcion: "",
        fecha_ini: "",
        fecha_fin: "",
      });
      setFechaIniDisplay("");
      setFechaFinDisplay("");
    }
    setErrors({});
  }, [actividad, visible]);

  const validar = () => {
    const newErrors = {};
    if (!form.nombre_act.trim())
      newErrors.nombre_act = "El nombre es requerido";
    if (!form.tipo) newErrors.tipo = "El tipo es requerido";
    if (!form.fecha_ini) newErrors.fecha_ini = "Fecha inicio requerida";
    if (!form.fecha_fin) newErrors.fecha_fin = "Fecha fin requerida";

    if (form.fecha_ini && form.fecha_fin && form.fecha_ini > form.fecha_fin) {
      newErrors.fecha_fin = "La fecha fin debe ser posterior a la fecha inicio";
    }

    if (
      pasantiaFechaIni &&
      form.fecha_ini &&
      form.fecha_ini < pasantiaFechaIni
    ) {
      newErrors.fecha_ini = `Debe ser >= ${toDisplayDate(pasantiaFechaIni)}`;
    }

    if (
      pasantiaFechaFin &&
      form.fecha_fin &&
      form.fecha_fin > pasantiaFechaFin
    ) {
      newErrors.fecha_fin = `Debe ser <= ${toDisplayDate(pasantiaFechaFin)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFechaIniChange = (text) => {
    setFechaIniDisplay(text);
    if (isValidDate(text)) {
      setForm({ ...form, fecha_ini: toBackendDate(text) });
    } else if (text === "") {
      setForm({ ...form, fecha_ini: "" });
    }
  };

  const handleFechaFinChange = (text) => {
    setFechaFinDisplay(text);
    if (isValidDate(text)) {
      setForm({ ...form, fecha_fin: toBackendDate(text) });
    } else if (text === "") {
      setForm({ ...form, fecha_fin: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al guardar la actividad",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {actividad ? "Editar Actividad" : "Nueva Actividad"}
          </Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Nombre de la actividad *"
            value={form.nombre_act}
            onChangeText={(text) => setForm({ ...form, nombre_act: text })}
          />
          {errors.nombre_act && (
            <Text style={styles.errorText}>{errors.nombre_act}</Text>
          )}

          <TouchableOpacity
            style={styles.modalPickerButton}
            onPress={() => setShowTipoPicker(true)}
          >
            <Text
              style={[
                styles.modalPickerText,
                !form.tipo && styles.modalPickerPlaceholder,
              ]}
            >
              {form.tipo || "Seleccionar tipo *"}
            </Text>
          </TouchableOpacity>
          {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}

          <TextInput
            style={[styles.modalInput, styles.textArea]}
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChangeText={(text) => setForm({ ...form, descripcion: text })}
            multiline
            numberOfLines={3}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <TextInput
                style={styles.modalInput}
                placeholder="DD/MM/YYYY"
                value={fechaIniDisplay}
                onChangeText={handleFechaIniChange}
                keyboardType="numeric"
              />
              {errors.fecha_ini && (
                <Text style={styles.errorText}>{errors.fecha_ini}</Text>
              )}
            </View>
            <View style={styles.halfField}>
              <TextInput
                style={styles.modalInput}
                placeholder="DD/MM/YYYY"
                value={fechaFinDisplay}
                onChangeText={handleFechaFinChange}
                keyboardType="numeric"
              />
              {errors.fecha_fin && (
                <Text style={styles.errorText}>{errors.fecha_fin}</Text>
              )}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showTipoPicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>Tipo de Actividad</Text>
            <Picker
              selectedValue={form.tipo}
              onValueChange={(value) => {
                setForm({ ...form, tipo: value });
                setShowTipoPicker(false);
              }}
            >
              <Picker.Item label="Seleccionar tipo" value="" />
              {TIPOS_ACTIVIDAD.map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowTipoPicker(false)}
            >
              <Text style={styles.pickerCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default function ModalActividadesPasantia({
  visible,
  onClose,
  pasantia,
  onRefresh,
}) {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editandoActividad, setEditandoActividad] = useState(null);

  const cargarActividades = async () => {
    if (!pasantia?.id) {
      console.warn("No hay pasantía seleccionada");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(
        `/gerente/pasantias/${pasantia.id}/actividades`,
      );
      setActividades(response.data.actividades || []);
    } catch (error) {
      console.error("Error cargando actividades:", error);
      Alert.alert("Error", "No se pudieron cargar las actividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && pasantia?.id) {
      cargarActividades();
    }
  }, [visible, pasantia?.id]);

  const handleGuardarActividad = async (actividadData) => {
    if (!pasantia?.id) return;

    if (editandoActividad) {
      await api.put(
        `/gerente/pasantias/actividades/${editandoActividad.id_actividad}`,
        actividadData,
      );
    } else {
      await api.post(
        `/gerente/pasantias/${pasantia.id}/actividades`,
        actividadData,
      );
    }
    await cargarActividades();
    if (onRefresh) onRefresh();
    setEditandoActividad(null);
  };

  const handleEliminarActividad = (id) => {
    Alert.alert(
      "Eliminar Actividad",
      "¿Estás seguro de eliminar esta actividad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await api.delete(`/gerente/pasantias/actividades/${id}`);
            await cargarActividades();
            if (onRefresh) onRefresh();
          },
        },
      ],
    );
  };

  const handleEditar = (actividad) => {
    setEditandoActividad(actividad);
    setFormVisible(true);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Actividades de la Pasantía</Text>
            <Text style={styles.subtitle}>
              {pasantia?.nombre || "Cargando..."}
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditandoActividad(null);
                setFormVisible(true);
              }}
            >
              <Text style={styles.addButtonText}>+ Agregar Actividad</Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#2A5A8D"
                style={styles.loader}
              />
            ) : actividades.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay actividades registradas
              </Text>
            ) : (
              <ScrollView style={styles.actividadesList}>
                {actividades.map((act) => (
                  <View key={act.id_actividad} style={styles.actividadCard}>
                    <View style={styles.actividadHeader}>
                      <Text style={styles.actividadNombre}>
                        {act.nombre_act}
                      </Text>
                      <View style={styles.actividadButtons}>
                        <TouchableOpacity onPress={() => handleEditar(act)}>
                          <Text style={styles.editText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleEliminarActividad(act.id_actividad)
                          }
                        >
                          <Text style={styles.deleteText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.actividadTipo}>{act.tipo}</Text>
                    <Text style={styles.actividadFechas}>
                      {toDisplayDate(act.fecha_ini)} →{" "}
                      {toDisplayDate(act.fecha_fin)}
                    </Text>
                    <Text style={styles.actividadDesc} numberOfLines={2}>
                      {act.descripcion}
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

      <ActividadFormModal
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditandoActividad(null);
        }}
        onSave={handleGuardarActividad}
        actividad={editandoActividad}
        pasantia={pasantia}
        pasantiaFechaIni={pasantia?.fecha_ini}
        pasantiaFechaFin={pasantia?.fecha_fin}
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
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#2A5A8D",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  loader: { padding: 20 },
  emptyText: { textAlign: "center", color: "#999", padding: 20 },
  actividadesList: { maxHeight: 400 },
  actividadCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  actividadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actividadNombre: { fontSize: 16, fontWeight: "bold", color: "#333" },
  actividadButtons: { flexDirection: "row", gap: 12 },
  editText: { fontSize: 18 },
  deleteText: { fontSize: 18 },
  actividadTipo: {
    fontSize: 12,
    color: "#2A5A8D",
    fontWeight: "500",
    marginBottom: 4,
  },
  actividadFechas: { fontSize: 12, color: "#666", marginBottom: 4 },
  actividadDesc: { fontSize: 12, color: "#999" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
  // Formulario actividad
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  halfField: { flex: 1 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  modalPickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  modalPickerText: { fontSize: 15, color: "#333" },
  modalPickerPlaceholder: { color: "#999" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
  saveButton: {
    flex: 1,
    backgroundColor: "#2A5A8D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  errorText: { color: "#dc2626", fontSize: 11, marginBottom: 8 },
  pickerModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 16,
    textAlign: "center",
  },
  pickerCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    alignItems: "center",
  },
  pickerCloseText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
