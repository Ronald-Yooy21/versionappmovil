import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function EmpresaScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);
  const [empresa, setEmpresa] = useState({
    id_empresa: "",
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [originalEmpresa, setOriginalEmpresa] = useState({});

  const scrollViewRef = useRef();

  const cargarEmpresa = async () => {
    setLoading(true);
    try {
      const response = await api.get("/gerente/empresa");
      const data = response.data;
      setEmpresa({
        id_empresa: data.id_empresa || "",
        nombre: data.nombre || "",
        nit: data.nit || "",
        direccion: data.direccion || "",
        telefono: data.telefono || "",
        email: data.email || "",
      });
      setOriginalEmpresa({
        id_empresa: data.id_empresa || "",
        nombre: data.nombre || "",
        nit: data.nit || "",
        direccion: data.direccion || "",
        telefono: data.telefono || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error cargando empresa:", error);
      Alert.alert("Error", "No se pudo cargar la información de la empresa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresa();
  }, []);

  const handleChange = (field, value) => {
    setEmpresa({ ...empresa, [field]: value });
  };

  const guardarCambios = async () => {
    setSaving(true);
    try {
      await api.put("/gerente/empresa", {
        nombre: empresa.nombre,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        email: empresa.email,
      });
      Alert.alert("Éxito", "Datos de la empresa actualizados correctamente");
      setEditando(false);
      setOriginalEmpresa({ ...empresa });
    } catch (error) {
      console.error("Error guardando empresa:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo guardar los cambios",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelarEdicion = () => {
    setEmpresa({ ...originalEmpresa });
    setEditando(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </SafeAreaView>
    );
  }

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
        {/* Header con información del gerente */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Empresa</Text>
          <Text style={styles.headerSubtitle}>
            {user?.nombre} {user?.ap_paterno} - Gerente
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Datos de la empresa */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏢 Información de la Empresa
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre de la Empresa *</Text>
              <TextInput
                style={[styles.input, !editando && styles.inputDisabled]}
                value={empresa.nombre}
                onChangeText={(text) => handleChange("nombre", text)}
                editable={editando}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>NIT *</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={empresa.nit}
                editable={false}
                placeholderTextColor="#999"
              />
              <Text style={styles.helperText}>
                El NIT no puede ser modificado
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={[styles.input, !editando && styles.inputDisabled]}
                value={empresa.direccion}
                onChangeText={(text) => handleChange("direccion", text)}
                editable={editando}
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={[styles.input, !editando && styles.inputDisabled]}
                  value={empresa.telefono}
                  onChangeText={(text) => handleChange("telefono", text)}
                  editable={editando}
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                  style={[styles.input, !editando && styles.inputDisabled]}
                  value={empresa.email}
                  onChangeText={(text) => handleChange("email", text)}
                  editable={editando}
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          {!editando ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditando(true)}
            >
              <Text style={styles.editButtonText}>✏️ Editar Empresa</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelarEdicion}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={guardarCambios}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
  },
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#333",
  },
  helperText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#2A5A8D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: Platform.OS === "android" ? 20 : 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#2A5A8D",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 40,
  },
});
