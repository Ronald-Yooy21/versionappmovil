import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  toDisplayDate,
  toBackendDate,
  isValidDate,
} from "../../utils/dateUtils";

// Opciones predefinidas
const MENCIONES = [
  "Desarrollo de Software e Innovación Tecnológica",
  "Inteligencia Artificial y Ciencias de Datos",
  "Ciencias de la Computación",
  "Informática Industrial",
  "Ingeniería de Sistemas",
  "Redes y TIC",
  "Seguridad de la Información",
];

const TURNOS = ["Tiempo completo", "Medio tiempo", "Mañana", "Tarde", "Noche"];
const TIPOS_ACTIVIDAD = ["OPERATIVA", "TECNICA"];
const CUPOS = Array.from({ length: 20 }, (_, i) => i + 1);

// Modal para selección de opciones
const SelectModal = ({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
}) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View style={styles.modalOverlay}>
      <View style={styles.pickerModalContent}>
        <Text style={styles.pickerModalTitle}>{title}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            onSelect(itemValue);
            onClose();
          }}
        >
          <Picker.Item label={`Seleccionar ${title.toLowerCase()}`} value="" />
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.pickerCloseButton} onPress={onClose}>
          <Text style={styles.pickerCloseText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Modal para agregar/editar actividad
const ActividadModal = ({
  visible,
  onClose,
  onSave,
  actividad,
  fechaIniPasantia,
  fechaFinPasantia,
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

  React.useEffect(() => {
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
      fechaIniPasantia &&
      form.fecha_ini &&
      form.fecha_ini < fechaIniPasantia
    ) {
      newErrors.fecha_ini = `Debe ser >= ${toDisplayDate(fechaIniPasantia)}`;
    }

    if (
      fechaFinPasantia &&
      form.fecha_fin &&
      form.fecha_fin > fechaFinPasantia
    ) {
      newErrors.fecha_fin = `Debe ser <= ${toDisplayDate(fechaFinPasantia)}`;
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

  const handleSubmit = () => {
    if (validar()) {
      onSave({ ...form, descripcion: form.descripcion || "sin descripción" });
      onClose();
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
            <Text style={styles.modalError}>{errors.nombre_act}</Text>
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
          {errors.tipo && <Text style={styles.modalError}>{errors.tipo}</Text>}

          <TextInput
            style={[styles.modalInput, styles.modalTextArea]}
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChangeText={(text) => setForm({ ...form, descripcion: text })}
            multiline
            numberOfLines={3}
          />

          <View style={styles.modalRow}>
            <View style={styles.modalHalf}>
              <TextInput
                style={styles.modalInput}
                placeholder="DD/MM/YYYY"
                value={fechaIniDisplay}
                onChangeText={handleFechaIniChange}
                //keyboardType="numeric"
              />
              {errors.fecha_ini && (
                <Text style={styles.modalError}>{errors.fecha_ini}</Text>
              )}
            </View>
            <View style={styles.modalHalf}>
              <TextInput
                style={styles.modalInput}
                placeholder="DD/MM/YYYY"
                value={fechaFinDisplay}
                onChangeText={handleFechaFinChange}
                //keyboardType="numeric"
              />
              {errors.fecha_fin && (
                <Text style={styles.modalError}>{errors.fecha_fin}</Text>
              )}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleSubmit}
            >
              <Text style={styles.modalSaveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <SelectModal
        visible={showTipoPicker}
        onClose={() => setShowTipoPicker(false)}
        options={TIPOS_ACTIVIDAD}
        selectedValue={form.tipo}
        onSelect={(value) => setForm({ ...form, tipo: value })}
        title="Tipo de Actividad"
      />
    </Modal>
  );
};

export default function CrearPasantiaScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [actividadEditando, setActividadEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [showMencionPicker, setShowMencionPicker] = useState(false);
  const [showTurnoPicker, setShowTurnoPicker] = useState(false);
  const [showCuposPicker, setShowCuposPicker] = useState(false);

  const [form, setForm] = useState({
    nombre_pas: "",
    mencion: "",
    cupos: "",
    turno: "",
    carga_horaria: "",
    detalles_horario: "",
    fecha_ini: "",
    fecha_fin: "",
  });
  const [fechaIniDisplay, setFechaIniDisplay] = useState("");
  const [fechaFinDisplay, setFechaFinDisplay] = useState("");
  const [errors, setErrors] = useState({});

  const limpiarFormulario = () => {
    setForm({
      nombre_pas: "",
      mencion: "",
      cupos: "",
      turno: "",
      carga_horaria: "",
      detalles_horario: "",
      fecha_ini: "",
      fecha_fin: "",
    });
    setFechaIniDisplay("");
    setFechaFinDisplay("");
    setActividades([]);
    setActividadEditando(null);
    setErrors({});
  };

  const scrollViewRef = useRef();

  const validarCamposPasantia = () => {
    const newErrors = {};
    if (!form.nombre_pas.trim())
      newErrors.nombre_pas = "El nombre es requerido";
    if (!form.mencion) newErrors.mencion = "La mención es requerida";
    if (!form.cupos) newErrors.cupos = "Los cupos son requeridos";
    if (!form.turno) newErrors.turno = "El turno es requerido";
    if (!form.fecha_ini)
      newErrors.fecha_ini = "La fecha de inicio es requerida";
    if (!form.fecha_fin) newErrors.fecha_fin = "La fecha de fin es requerida";

    if (form.fecha_ini && form.fecha_fin && form.fecha_ini > form.fecha_fin) {
      newErrors.fecha_fin = "Debe ser posterior a la fecha de inicio";
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

  const validarActividades = () => {
    if (actividades.length === 0) {
      Alert.alert("Error", "Debe agregar al menos una actividad");
      return false;
    }

    for (const act of actividades) {
      if (!act.fecha_ini || !act.fecha_fin) {
        Alert.alert(
          "Error",
          `La actividad "${act.nombre_act}" tiene fechas vacías`,
        );
        return false;
      }
      if (act.fecha_ini < form.fecha_ini) {
        Alert.alert(
          "Error",
          `La actividad "${act.nombre_act}" comienza antes que la pasantía`,
        );
        return false;
      }
      if (act.fecha_fin > form.fecha_fin) {
        Alert.alert(
          "Error",
          `La actividad "${act.nombre_act}" termina después que la pasantía`,
        );
        return false;
      }
    }
    return true;
  };

  const handleAgregarActividad = (actividad) => {
    if (actividadEditando !== null) {
      const nuevas = [...actividades];
      nuevas[actividadEditando] = actividad;
      setActividades(nuevas);
      setActividadEditando(null);
    } else {
      setActividades([...actividades, actividad]);
    }
  };

  const handleEditarActividad = (index) => {
    setActividadEditando(index);
    setModalVisible(true);
  };

  const handleEliminarActividad = (index) => {
    Alert.alert(
      "Eliminar Actividad",
      "¿Estás seguro de eliminar esta actividad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const nuevas = actividades.filter((_, i) => i !== index);
            setActividades(nuevas);
            if (actividadEditando === index) setActividadEditando(null);
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (!validarCamposPasantia()) return;
    if (!validarActividades()) return;

    setLoading(true);
    try {
      const dataToSend = {
        ...form,
        carga_horaria: form.carga_horaria || 0,
        detalles_horario: form.detalles_horario || null,
        actividades: actividades.map((a) => ({
          nombre_act: a.nombre_act,
          tipo: a.tipo,
          descripcion: a.descripcion,
          fecha_ini: a.fecha_ini,
          fecha_fin: a.fecha_fin,
        })),
      };

      await api.post("/gerente/pasantias", dataToSend);
      Alert.alert("Éxito", "Pasantía publicada exitosamente", [
        {
          text: "OK",
          onPress: () => {
            limpiarFormulario();
            navigation.navigate("Pasantias");
          },
        },
      ]);
    } catch (error) {
      console.error("Error publicando:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al publicar la pasantía",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
        enableOnAndroid={true}
      >
        {/* Datos de la Pasantía */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Datos de la Pasantía</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de la pasantía *"
            value={form.nombre_pas}
            onChangeText={(text) => setForm({ ...form, nombre_pas: text })}
          />
          {errors.nombre_pas && (
            <Text style={styles.errorText}>{errors.nombre_pas}</Text>
          )}

          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowMencionPicker(true)}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !form.mencion && styles.pickerButtonPlaceholder,
              ]}
            >
              {form.mencion || "Seleccionar mención *"}
            </Text>
          </TouchableOpacity>
          {errors.mencion && (
            <Text style={styles.errorText}>{errors.mencion}</Text>
          )}

          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCuposPicker(true)}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !form.cupos && styles.pickerButtonPlaceholder,
              ]}
            >
              {form.cupos ? `${form.cupos} cupos` : "Seleccionar cupos *"}
            </Text>
          </TouchableOpacity>
          {errors.cupos && <Text style={styles.errorText}>{errors.cupos}</Text>}

          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTurnoPicker(true)}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !form.turno && styles.pickerButtonPlaceholder,
              ]}
            >
              {form.turno || "Seleccionar turno *"}
            </Text>
          </TouchableOpacity>
          {errors.turno && <Text style={styles.errorText}>{errors.turno}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Carga Horaria (hrs/semana) - Opcional"
            value={form.carga_horaria}
            onChangeText={(text) => setForm({ ...form, carga_horaria: text })}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles de horario (opcional). Ej: Lunes a Viernes de 14:00 a 16:00"
            value={form.detalles_horario}
            onChangeText={(text) =>
              setForm({ ...form, detalles_horario: text })
            }
            multiline
            numberOfLines={2}
          />

          {/* Fechas en línea horizontal con formato DD/MM/YYYY */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Fecha Inicio *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={fechaIniDisplay}
                onChangeText={handleFechaIniChange}
                //keyboardType="numeric"
              />
              {errors.fecha_ini && (
                <Text style={styles.errorText}>{errors.fecha_ini}</Text>
              )}
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Fecha Fin *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={fechaFinDisplay}
                onChangeText={handleFechaFinChange}
                //keyboardType="numeric"
              />
              {errors.fecha_fin && (
                <Text style={styles.errorText}>{errors.fecha_fin}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Sección de Actividades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📝 Actividades</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setActividadEditando(null);
                setModalVisible(true);
              }}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {actividades.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay actividades. Agrega al menos una.
            </Text>
          ) : (
            actividades.map((act, index) => (
              <View key={index} style={styles.actividadCard}>
                <View style={styles.actividadHeader}>
                  <Text style={styles.actividadNombre}>{act.nombre_act}</Text>
                  <View style={styles.actividadButtons}>
                    <TouchableOpacity
                      onPress={() => handleEditarActividad(index)}
                    >
                      <Text style={styles.editActText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEliminarActividad(index)}
                    >
                      <Text style={styles.deleteActText}>🗑️</Text>
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
            ))
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                limpiarFormulario();
                navigation.goBack();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Publicar Pasantía</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </KeyboardAwareScrollView>

      {/* Modales de selección */}
      <SelectModal
        visible={showMencionPicker}
        onClose={() => setShowMencionPicker(false)}
        options={MENCIONES}
        selectedValue={form.mencion}
        onSelect={(value) => setForm({ ...form, mencion: value })}
        title="Mención"
      />

      <SelectModal
        visible={showCuposPicker}
        onClose={() => setShowCuposPicker(false)}
        options={CUPOS.map((c) => c.toString())}
        selectedValue={form.cupos ? form.cupos.toString() : ""}
        onSelect={(value) => setForm({ ...form, cupos: parseInt(value) })}
        title="Cupos"
      />

      <SelectModal
        visible={showTurnoPicker}
        onClose={() => setShowTurnoPicker(false)}
        options={TURNOS}
        selectedValue={form.turno}
        onSelect={(value) => setForm({ ...form, turno: value })}
        title="Turno"
      />

      {/* Modal de Actividad */}
      <ActividadModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setActividadEditando(null);
        }}
        onSave={handleAgregarActividad}
        actividad={
          actividadEditando !== null ? actividades[actividadEditando] : null
        }
        fechaIniPasantia={form.fecha_ini}
        fechaFinPasantia={form.fecha_fin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: { fontSize: 13, fontWeight: "500", color: "#666", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  pickerButtonText: { fontSize: 15, color: "#333" },
  pickerButtonPlaceholder: { color: "#999" },
  addButton: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#999", padding: 20 },
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
  editActText: { fontSize: 18 },
  deleteActText: { fontSize: 18 },
  actividadTipo: {
    fontSize: 12,
    color: "#2A5A8D",
    fontWeight: "500",
    marginBottom: 4,
  },
  actividadFechas: { fontSize: 12, color: "#666", marginBottom: 4 },
  actividadDesc: { fontSize: 12, color: "#999" },
  buttonContainer: {
    marginBottom: Platform.OS === "android" ? 20 : 10,
  },
  buttonRow: { flexDirection: "row", gap: 12 },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#e5e7eb" },
  cancelButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
  saveButton: { backgroundColor: "#2A5A8D" },
  saveButtonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  errorText: { color: "#dc2626", fontSize: 11, marginTop: -8, marginBottom: 8 },
  bottomSpacing: { height: 40 },

  // Modal styles
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
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  modalTextArea: { height: 80, textAlignVertical: "top" },
  modalRow: { flexDirection: "row", gap: 12 },
  modalHalf: { flex: 1 },
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
  modalError: { color: "#dc2626", fontSize: 11, marginBottom: 8 },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCancelText: { color: "#666", fontSize: 15, fontWeight: "500" },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#2A5A8D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalSaveText: { color: "#fff", fontSize: 15, fontWeight: "bold" },

  // Picker Modal styles
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
