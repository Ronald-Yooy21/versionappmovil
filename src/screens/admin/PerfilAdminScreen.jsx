import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import DashboardHeader from "../../components/headers/DashboardHeader";

export default function PerfilAdminScreen({ navigation }) {
  const { user, refreshUser } = useAuth();

  // Estados del formulario
  const [editando, setEditando] = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState({});

  // Datos del perfil (se cargan desde API)
  const [data, setData] = useState({
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    nombre_user: "",
    correo: "",
    numero_cel: "",
    ci: "",
    correo_secundario: "",
    password: "",
    password_confirmation: "",
  });

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);

  // Cargar perfil al montar
  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const response = await api.get("/admin/perfil");
      const perfil = response.data;
      setData({
        nombre: perfil.nombre || "",
        ap_paterno: perfil.ap_paterno || "",
        ap_materno: perfil.ap_materno || "",
        nombre_user: perfil.nombre_user || "",
        correo: perfil.correo || "",
        numero_cel: perfil.numero_cel?.toString() || "",
        ci: perfil.ci?.toString() || "",
        correo_secundario: perfil.correo_secundario || "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el perfil.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setErrors({});
    try {
      const payload = {
        ...data,
        numero_cel: parseInt(data.numero_cel) || data.numero_cel,
      };
      // Si no se va a cambiar contraseña, no enviar campos de password
      if (!cambiandoPass) {
        delete payload.password;
        delete payload.password_confirmation;
      }
      await api.put("/admin/perfil", payload);
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
      setEditando(false);
      setCambiandoPass(false);
      refreshUser();
      cargarPerfil(); // Recargar datos frescos
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Alert.alert("Error", "No se pudo guardar el perfil.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setCambiandoPass(false);
    setErrors({});
    // Recargar datos originales del backend
    cargarPerfil();
  };

  // --- Avatar ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a la galería para cambiar la foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      // Validar tipo (JPG/PNG) y tamaño (2MB)
      if (!asset.type.match(/image\/(jpeg|png)/)) {
        Alert.alert("Error", "Solo se permiten archivos JPG y PNG.");
        return;
      }
      if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
        Alert.alert("Error", "La imagen no debe superar los 2MB.");
        return;
      }
      setAvatarFile(asset);
      setAvatarPreview(asset.uri);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) return;
    setSubiendoAvatar(true);
    const formData = new FormData();
    formData.append("avatar", {
      uri: avatarFile.uri,
      name: avatarFile.fileName || "avatar.jpg",
      type: avatarFile.type || "image/jpeg",
    });
    try {
      await api.post("/avatar/actualizar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refrescar el usuario global (para que se actualice en DashboardHeader)
      await refreshUser();
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Error al subir la foto.");
    } finally {
      setSubiendoAvatar(false);
    }
  };

  const cancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
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
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Cabecera similar a la web */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            {avatarPreview ? (
              <Image source={{ uri: avatarPreview }} style={styles.avatarImage} />
            ) : user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {data.nombre?.charAt(0) || ""}
                  {data.ap_paterno?.charAt(0) || ""}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.nombreCompleto}>
              {data.nombre} {data.ap_paterno}
            </Text>
            <Text style={styles.rol}>Administrador</Text>
          </View>
          <TouchableOpacity
            style={[styles.botonEditar, editando && styles.botonCancelar]}
            onPress={editando ? cancelarEdicion : () => setEditando(true)}
          >
            <Text style={styles.botonEditarText}>
              {editando ? "Cancelar" : "Editar Perfil"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección Foto de Perfil */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          <View style={styles.avatarSection}>
            <View style={styles.avatarLarge}>
              {avatarPreview ? (
                <Image source={{ uri: avatarPreview }} style={styles.avatarLargeImage} />
              ) : user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatarLargeImage} />
              ) : (
                <View style={styles.avatarLargePlaceholder}>
                  <Text style={styles.avatarLargeText}>
                    {data.nombre?.charAt(0) || ""}
                    {data.ap_paterno?.charAt(0) || ""}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Text style={styles.cameraIcon}>📷</Text>
              </TouchableOpacity>
            </View>
            {avatarFile && (
              <View style={styles.avatarActions}>
                <TouchableOpacity
                  style={styles.guardarFotoBtn}
                  onPress={handleAvatarSubmit}
                  disabled={subiendoAvatar}
                >
                  <Text style={styles.guardarFotoText}>
                    {subiendoAvatar ? "Subiendo..." : "Guardar foto"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelarFotoBtn} onPress={cancelAvatar}>
                  <Text style={styles.cancelarFotoText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.avatarHint}>Formatos: JPG, PNG | Máx: 2MB</Text>
          </View>
        </View>

        {/* Formulario */}
        {/* Información Personal */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <InputField label="Nombre(s)" value={data.nombre} editable={editando} onChangeText={(t) => handleChange("nombre", t)} error={errors.nombre} />
          <InputField label="Nombre de Usuario" value={data.nombre_user} editable={editando} onChangeText={(t) => handleChange("nombre_user", t)} error={errors.nombre_user} />
          <InputField label="Apellido Paterno" value={data.ap_paterno} editable={editando} onChangeText={(t) => handleChange("ap_paterno", t)} error={errors.ap_paterno} />
          <InputField label="Apellido Materno" value={data.ap_materno} editable={editando} onChangeText={(t) => handleChange("ap_materno", t)} error={errors.ap_materno} />
        </View>

        {/* Seguridad (cambio de contraseña) */}
        {editando && (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setCambiandoPass(!cambiandoPass)} style={styles.togglePassBtn}>
              <Text style={styles.togglePassText}>
                {cambiandoPass ? "Mantener contraseña actual" : "¿Deseas cambiar tu contraseña?"}
              </Text>
            </TouchableOpacity>
            {cambiandoPass && (
              <>
                <InputField
                  label="Nueva Contraseña"
                  value={data.password}
                  editable={true}
                  onChangeText={(t) => handleChange("password", t)}
                  secureTextEntry
                  error={errors.password}
                />
                <InputField
                  label="Confirmar Nueva Contraseña"
                  value={data.password_confirmation}
                  editable={true}
                  onChangeText={(t) => handleChange("password_confirmation", t)}
                  secureTextEntry
                />
              </>
            )}
          </View>
        )}

        {/* Contacto y Cuenta */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contacto y Cuenta</Text>
          <InputField label="Cédula de Identidad (CI)" value={data.ci} editable={editando} onChangeText={(t) => handleChange("ci", t)} error={errors.ci} />
          <InputField label="Número de Celular" value={data.numero_cel} editable={editando} onChangeText={(t) => handleChange("numero_cel", t)} error={errors.numero_cel} keyboardType="phone-pad" />
          <InputField label="Correo Principal" value={data.correo} editable={editando} onChangeText={(t) => handleChange("correo", t)} error={errors.correo} keyboardType="email-address" />
          <InputField label="Correo de Respaldo" value={data.correo_secundario} editable={editando} onChangeText={(t) => handleChange("correo_secundario", t)} error={errors.correo_secundario} keyboardType="email-address" />
        </View>

        {/* Botón Guardar */}
        {editando && (
          <TouchableOpacity
            style={[styles.guardarBtn, guardando && styles.guardarBtnDisabled]}
            onPress={handleGuardar}
            disabled={guardando}
          >
            <Text style={styles.guardarBtnText}>
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente reutilizable para cada campo
const InputField = ({ label, value, editable, onChangeText, error, secureTextEntry, keyboardType }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#94A3B8"
    />
    {error && <Text style={styles.errorText}>{Array.isArray(error) ? error[0] : error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollView: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarContainer: { marginRight: 15 },
  avatarImage: { width: 70, height: 70, borderRadius: 35 },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  headerInfo: { flex: 1 },
  nombreCompleto: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  rol: { fontSize: 13, color: "#2A5A8D", fontWeight: "600", marginTop: 4 },
  botonEditar: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  botonCancelar: { backgroundColor: "#EF4444" },
  botonEditarText: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
  },
  avatarSection: { alignItems: "center" },
  avatarLarge: { position: "relative", marginBottom: 10 },
  avatarLargeImage: { width: 110, height: 110, borderRadius: 55 },
  avatarLargePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLargeText: { color: "#FFF", fontSize: 30, fontWeight: "bold" },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2A5A8D",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  cameraIcon: { color: "#FFF", fontSize: 16 },
  avatarActions: { flexDirection: "row", gap: 10, marginBottom: 10 },
  guardarFotoBtn: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  guardarFotoText: { color: "#FFF", fontWeight: "600" },
  cancelarFotoBtn: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelarFotoText: { color: "#1E293B", fontWeight: "600" },
  avatarHint: { fontSize: 12, color: "#94A3B8" },
  fieldContainer: { marginBottom: 15 },
  label: { fontWeight: "600", color: "#1E293B", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#1E293B",
  },
  inputDisabled: { backgroundColor: "#F1F5F9", color: "#475569" },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4 },
  togglePassBtn: { marginBottom: 15 },
  togglePassText: { color: "#2A5A8D", fontWeight: "600", fontSize: 14 },
  guardarBtn: {
    backgroundColor: "#2A5A8D",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2A5A8D",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  guardarBtnDisabled: { opacity: 0.6 },
  guardarBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});