import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView, // ← Agregar SafeAreaView
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function PerfilGerenteScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    ci: "",
    numero_cel: "",
    correo: "",
    fecha_nac: "",
    nro_secun: "",
  });
  const [originalForm, setOriginalForm] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/gerente/perfil");
      const data = response.data;
      setForm({
        nombre: data.nombre || "",
        ap_paterno: data.ap_paterno || "",
        ap_materno: data.ap_materno || "",
        ci: data.ci || "",
        numero_cel: data.numero_cel || "",
        correo: data.correo || "",
        fecha_nac: data.fecha_nac || "",
        nro_secun: data.nro_secun || "",
      });
      setOriginalForm({
        nombre: data.nombre || "",
        ap_paterno: data.ap_paterno || "",
        ap_materno: data.ap_materno || "",
        ci: data.ci || "",
        numero_cel: data.numero_cel || "",
        correo: data.correo || "",
        fecha_nac: data.fecha_nac || "",
        nro_secun: data.nro_secun || "",
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
      Alert.alert("Error", "No se pudo cargar la información del perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const guardarCambios = async () => {
    setLoading(true);
    try {
      await api.put("/gerente/perfil", form);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setEditando(false);
      setOriginalForm({ ...form });
    } catch (error) {
      console.error("Error guardando perfil:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo guardar los cambios",
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setForm({ ...originalForm });
    setEditando(false);
  };

  if (loading && !editando) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header con foto de perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.nombre?.charAt(0)}
                  {user?.ap_paterno?.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {user?.nombre} {user?.ap_paterno}
          </Text>
          <Text style={styles.userRole}>Gerente de Empresa</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Información Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Información Personal</Text>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Apellido Paterno *</Text>
                <TextInput
                  style={[styles.input, !editando && styles.inputDisabled]}
                  value={form.ap_paterno}
                  onChangeText={(text) => handleChange("ap_paterno", text)}
                  editable={editando}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Apellido Materno *</Text>
                <TextInput
                  style={[styles.input, !editando && styles.inputDisabled]}
                  value={form.ap_materno}
                  onChangeText={(text) => handleChange("ap_materno", text)}
                  editable={editando}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nombres *</Text>
              <TextInput
                style={[styles.input, !editando && styles.inputDisabled]}
                value={form.nombre}
                onChangeText={(text) => handleChange("nombre", text)}
                editable={editando}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Carnet de Identidad *</Text>
                <TextInput
                  style={[styles.input, !editando && styles.inputDisabled]}
                  value={form.ci}
                  onChangeText={(text) => handleChange("ci", text)}
                  editable={editando}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Fecha de Nacimiento *</Text>
                <TextInput
                  style={[styles.input, !editando && styles.inputDisabled]}
                  value={form.fecha_nac}
                  onChangeText={(text) => handleChange("fecha_nac", text)}
                  editable={editando}
                  placeholderTextColor="#999"
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
          </View>

          {/* Contacto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📞 Contacto</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Número de Celular *</Text>
              <TextInput
                style={[styles.input, !editando && styles.inputDisabled]}
                value={form.numero_cel}
                onChangeText={(text) => handleChange("numero_cel", text)}
                editable={editando}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Celular Secundario</Text>
              <TextInput
                style={[styles.input, !editando && styles.inputDisabled]}
                value={form.nro_secun}
                onChangeText={(text) => handleChange("nro_secun", text)}
                editable={editando}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={[styles.input, !editando && styles.inputDisabled]}
                value={form.correo}
                onChangeText={(text) => handleChange("correo", text)}
                editable={editando}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Botones de acción */}
          {!editando ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditando(true)}
            >
              <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelarEdicion}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={guardarCambios}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Espacio extra al final para evitar que el último elemento quede tapado */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  },
  scrollContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#2A5A8D",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2A5A8D",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userRole: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginTop: 4,
  },
  formContainer: {
    padding: 16,
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
    marginBottom: 12,
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
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#333",
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
    height: 30,
  },
});
