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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function CuentaGerenteScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [form, setForm] = useState({
    nombre_user: "",
    correo: "",
  });
  const [originalForm, setOriginalForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        nombre_user: user.nombre_user || "",
        correo: user.correo || "",
      });
      setOriginalForm({
        nombre_user: user.nombre_user || "",
        correo: user.correo || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
  };

  const guardarCambios = async () => {
    setLoading(true);
    try {
      await api.put("/gerente/cuenta", form);
      await refreshUser();
      Alert.alert("Éxito", "Datos de cuenta actualizados correctamente");
      setEditando(false);
      setOriginalForm({ ...form });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudieron guardar los cambios",
      );
    } finally {
      setLoading(false);
    }
  };

  const guardarPassword = async () => {
    if (passwordForm.password !== passwordForm.password_confirmation) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await api.put("/gerente/password", passwordForm);
      Alert.alert("Éxito", "Contraseña actualizada correctamente");
      setCambiandoPassword(false);
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo cambiar la contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setForm({ ...originalForm });
    setEditando(false);
  };

  const cancelarPassword = () => {
    setCambiandoPassword(false);
    setPasswordForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mi Cuenta</Text>
            <Text style={styles.headerSubtitle}>
              Gestiona tus datos de acceso
            </Text>
          </View>

          {/* Datos de la cuenta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔐 Datos de la Cuenta</Text>

            {!editando ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre de usuario:</Text>
                  <Text style={styles.infoValue}>{form.nombre_user}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Correo electrónico:</Text>
                  <Text style={styles.infoValue}>{form.correo}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditando(true)}
                >
                  <Text style={styles.editButtonText}>✏️ Editar Cuenta</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                <View style={styles.field}>
                  <Text style={styles.label}>Nombre de usuario *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.nombre_user}
                    onChangeText={(text) => handleChange("nombre_user", text)}
                    placeholder="Tu nombre de usuario"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Correo electrónico *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.correo}
                    onChangeText={(text) => handleChange("correo", text)}
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={cancelarEdicion}
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
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Cambiar contraseña */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔒 Seguridad</Text>

            {!cambiandoPassword ? (
              <TouchableOpacity
                style={styles.passwordButton}
                onPress={() => setCambiandoPassword(true)}
              >
                <Text style={styles.passwordButtonText}>
                  Cambiar contraseña
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View style={styles.field}>
                  <Text style={styles.label}>Contraseña actual *</Text>
                  <TextInput
                    style={styles.input}
                    value={passwordForm.current_password}
                    onChangeText={(text) =>
                      handlePasswordChange("current_password", text)
                    }
                    secureTextEntry
                    placeholder="••••••••"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Nueva contraseña *</Text>
                  <TextInput
                    style={styles.input}
                    value={passwordForm.password}
                    onChangeText={(text) =>
                      handlePasswordChange("password", text)
                    }
                    secureTextEntry
                    placeholder="••••••••"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Confirmar nueva contraseña *</Text>
                  <TextInput
                    style={styles.input}
                    value={passwordForm.password_confirmation}
                    onChangeText={(text) =>
                      handlePasswordChange("password_confirmation", text)
                    }
                    secureTextEntry
                    placeholder="••••••••"
                  />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={cancelarPassword}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={guardarPassword}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>
                        Cambiar contraseña
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  keyboardView: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#1a2a3a" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
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
  },
  infoRow: { flexDirection: "row", marginBottom: 12, paddingVertical: 4 },
  infoLabel: { width: 130, fontSize: 14, color: "#666" },
  infoValue: { flex: 1, fontSize: 14, color: "#333", fontWeight: "500" },
  editButton: {
    backgroundColor: "#2A5A8D",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  editButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  passwordButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  passwordButtonText: { color: "#333", fontSize: 14, fontWeight: "500" },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", color: "#666", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#e5e7eb" },
  cancelButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
  saveButton: { backgroundColor: "#2A5A8D" },
  saveButtonText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  bottomSpacing: { height: 40 },
});
