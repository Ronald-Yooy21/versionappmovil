import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../services/api";
import RadioGroup from "../../components/common/RadioGroup";
import SelectField from "../../components/common/SelectField";

const roleOptions = [
  { value: "pasante", label: "Pasante (Estudiante)" },
  { value: "jefe", label: "Jefe de Pasante" },
  { value: "tutor", label: "Tutor Académico" },
  { value: "gerente", label: "Gerente de Empresa" },
];

const mencionOptions = [
  "Desarrollo de Software e Innovación Tecnológica",
  "Inteligencia Artificial y Ciencias de Datos",
  "Ciencias de la Computación",
  "Informática Industrial",
  "Ingeniería de Sistemas",
  "Redes y TIC",
  "Seguridad de la Información",
].map((m) => ({ label: m, value: m }));

const gradoOptions = ["Lic.", "Ing.", "M.Sc.", "Mg.", "Dr.", "Ph.D."].map(
  (g) => ({ label: g, value: g }),
);
const semestreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
  label: `${n}`,
  value: n.toString(),
}));

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [empresas, setEmpresas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    role: "pasante",
    nombre_user: "",
    password: "",
    password_confirmation: "",
    numero_cel: "",
    ci: "",
    correo: "",
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    fecha_nac: "",
    ru: "",
    matricula: "",
    semestre: "",
    mencion: "",
    cargo: "",
    area: "",
    id_empresa: "",
    especialidad: "",
    grado_aca: "",
    nro_secun: "",
    empresa_nombre: "",
    empresa_direccion: "",
    empresa_email: "",
    empresa_nit: "",
    empresa_telefono: "",
  });

useEffect(() => {
  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/register");

      // Validación ultra segura basada en tu JSON real
      if (data && Array.isArray(data.empresas)) {
        const formateadas = data.empresas.map((empresa) => ({
          // Usamos String() por seguridad y garantizamos que label no sea null
          label: empresa.nombre || "Empresa sin nombre",
          value: String(empresa.id_empresa), 
        }));
        
        setEmpresas(formateadas);
      } else {
        throw new Error("Estructura de respuesta inválida");
      }
    } catch (error) {
      console.error("Error al mapear empresas desde Laravel:", error);
      Alert.alert(
        "Error de red", 
        "No pudimos conectar con el servidor para listar las empresas."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchEmpresas();
}, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const c = { ...prev };
        delete c[field];
        return c;
      });
  };

  const handleRoleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      role: value,
      ru: "",
      matricula: "",
      semestre: "",
      mencion: "",
      cargo: "",
      area: "",
      id_empresa: "",
      especialidad: "",
      grado_aca: "",
      nro_secun: "",
      empresa_nombre: "",
      empresa_direccion: "",
      empresa_email: "",
      empresa_nit: "",
      empresa_telefono: "",
    }));
    setErrors({});
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.nombre_user.trim()) e.nombre_user = "Requerido";
    if (!form.password) e.password = "Requerido";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (form.password !== form.password_confirmation)
      e.password_confirmation = "No coinciden";
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.ap_paterno.trim()) e.ap_paterno = "Requerido";
    if (!form.ap_materno.trim()) e.ap_materno = "Requerido";
    if (!form.ci.trim()) e.ci = "Requerido";
    if (!form.numero_cel.trim()) e.numero_cel = "Requerido";
    if (!form.correo.trim()) e.correo = "Requerido";
    if (!form.fecha_nac) e.fecha_nac = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        semestre: form.semestre ? parseInt(form.semestre) : "",
      };
      await api.post("/registro", payload);
      navigation.replace("RegistroPendiente");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.error || "Error al registrar",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleChange("fecha_nac", selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Crear una cuenta</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Ingresa tus datos personales"
              : "Completa tu perfil según tu rol"}
          </Text>

          {/* Indicador de pasos */}
          <View style={styles.stepsRow}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  step === 1 && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    step === 1 && styles.stepNumberActive,
                  ]}
                >
                  1
                </Text>
              </View>
              <Text
                style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}
              >
                Datos básicos
              </Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  step === 2 && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    step === 2 && styles.stepNumberActive,
                  ]}
                >
                  2
                </Text>
              </View>
              <Text
                style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}
              >
                Perfil de rol
              </Text>
            </View>
          </View>

          {step === 1 && (
            <View>
              <InputField
                label="Nombre de usuario"
                value={form.nombre_user}
                onChangeText={(t) => handleChange("nombre_user", t)}
                error={errors.nombre_user}
              />
              <InputField
                label="Correo electrónico"
                value={form.correo}
                onChangeText={(t) => handleChange("correo", t)}
                keyboardType="email-address"
                error={errors.correo}
              />
              <InputField
                label="Contraseña"
                value={form.password}
                onChangeText={(t) => handleChange("password", t)}
                secureTextEntry
                error={errors.password}
              />
              <InputField
                label="Confirmar contraseña"
                value={form.password_confirmation}
                onChangeText={(t) => handleChange("password_confirmation", t)}
                secureTextEntry
                error={errors.password_confirmation}
              />
              <InputField
                label="Nombre(s)"
                value={form.nombre}
                onChangeText={(t) => handleChange("nombre", t)}
                error={errors.nombre}
              />
              <InputField
                label="Apellido Paterno"
                value={form.ap_paterno}
                onChangeText={(t) => handleChange("ap_paterno", t)}
                error={errors.ap_paterno}
              />
              <InputField
                label="Apellido Materno"
                value={form.ap_materno}
                onChangeText={(t) => handleChange("ap_materno", t)}
                error={errors.ap_materno}
              />
              <InputField
                label="Carnet de Identidad"
                value={form.ci}
                onChangeText={(t) => handleChange("ci", t)}
                error={errors.ci}
              />
              <InputField
                label="Número de Celular"
                value={form.numero_cel}
                onChangeText={(t) => handleChange("numero_cel", t)}
                keyboardType="phone-pad"
                error={errors.numero_cel}
              />

              {/* Fecha de nacimiento */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Fecha de Nacimiento <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.input, errors.fecha_nac && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={[
                      styles.inputText,
                      !form.fecha_nac && styles.placeholder,
                    ]}
                  >
                    {form.fecha_nac || "Seleccionar fecha"}
                  </Text>
                </TouchableOpacity>
                {errors.fecha_nac && (
                  <Text style={styles.errorText}>{errors.fecha_nac}</Text>
                )}
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={form.fecha_nac ? new Date(form.fecha_nac) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  if (validateStep1()) setStep(2);
                }}
              >
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.sectionTitle}>
                Selecciona tu tipo de usuario
              </Text>
              <RadioGroup
                options={roleOptions}
                selected={form.role}
                onChange={handleRoleChange}
              />

              {form.role === "pasante" && (
                <View style={styles.roleFields}>
                  <InputField
                    label="Registro Universitario"
                    value={form.ru}
                    onChangeText={(t) => handleChange("ru", t)}
                    error={errors.ru}
                  />
                  <InputField
                    label="Matrícula"
                    value={form.matricula}
                    onChangeText={(t) => handleChange("matricula", t)}
                    error={errors.matricula}
                  />
                  <SelectField
                    label="Semestre"
                    value={form.semestre}
                    onValueChange={(v) => handleChange("semestre", v)}
                    options={semestreOptions}
                    placeholder="Seleccionar semestre"
                    error={errors.semestre}
                  />
                  <SelectField
                    label="Mención"
                    value={form.mencion}
                    onValueChange={(v) => handleChange("mencion", v)}
                    options={mencionOptions}
                    placeholder="Seleccionar mención"
                    error={errors.mencion}
                  />
                </View>
              )}
              {form.role === "jefe" && (
                <View style={styles.roleFields}>
                  <InputField
                    label="Cargo"
                    value={form.cargo}
                    onChangeText={(t) => handleChange("cargo", t)}
                    error={errors.cargo}
                  />
                  <InputField
                    label="Área"
                    value={form.area}
                    onChangeText={(t) => handleChange("area", t)}
                    error={errors.area}
                  />
                  <SelectField
                    label="Empresa"
                    value={form.id_empresa}
                    onValueChange={(v) => handleChange("id_empresa", v)}
                    options={empresas}
                    placeholder="Seleccionar empresa"
                    error={errors.id_empresa}
                  />
                </View>
              )}
              {form.role === "tutor" && (
                <View style={styles.roleFields}>
                  <InputField
                    label="Especialidad"
                    value={form.especialidad}
                    onChangeText={(t) => handleChange("especialidad", t)}
                    error={errors.especialidad}
                  />
                  <SelectField
                    label="Grado Académico"
                    value={form.grado_aca}
                    onValueChange={(v) => handleChange("grado_aca", v)}
                    options={gradoOptions}
                    placeholder="Seleccionar grado"
                    error={errors.grado_aca}
                  />
                </View>
              )}
              {form.role === "gerente" && (
                <View style={styles.roleFields}>
                  <Text style={styles.subsectionTitle}>Datos del Gerente</Text>
                  <InputField
                    label="Celular secundario (opcional)"
                    value={form.nro_secun}
                    onChangeText={(t) => handleChange("nro_secun", t)}
                  />
                  <Text style={styles.subsectionTitle}>
                    Datos de la Empresa
                  </Text>
                  <InputField
                    label="Nombre de la Empresa"
                    value={form.empresa_nombre}
                    onChangeText={(t) => handleChange("empresa_nombre", t)}
                    error={errors.empresa_nombre}
                  />
                  <InputField
                    label="Dirección"
                    value={form.empresa_direccion}
                    onChangeText={(t) => handleChange("empresa_direccion", t)}
                  />
                  <InputField
                    label="Email corporativo"
                    value={form.empresa_email}
                    onChangeText={(t) => handleChange("empresa_email", t)}
                    keyboardType="email-address"
                  />
                  <InputField
                    label="Teléfono"
                    value={form.empresa_telefono}
                    onChangeText={(t) => handleChange("empresa_telefono", t)}
                    keyboardType="phone-pad"
                  />
                  <InputField
                    label="NIT"
                    value={form.empresa_nit}
                    onChangeText={(t) => handleChange("empresa_nit", t)}
                  />
                </View>
              )}

              {errors.error && (
                <Text style={styles.generalError}>{errors.error}</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.secondaryButtonText}>← Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginLeft: 10 }]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Registrarse</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar InputField
const InputField = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      {label} <Text style={styles.required}>*</Text>
    </Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#94A3B8"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepCircleActive: { borderColor: "#2A5A8D", backgroundColor: "#2A5A8D" },
  stepNumber: { color: "#CBD5E1", fontWeight: "700" },
  stepNumberActive: { color: "#FFF" },
  stepLabel: { fontSize: 12, color: "#94A3B8" },
  stepLabelActive: { color: "#2A5A8D", fontWeight: "600" },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  fieldContainer: { marginBottom: 15 },
  label: { fontWeight: "600", color: "#1E293B", marginBottom: 5 },
  required: { color: "#EF4444" },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#1E293B",
  },
  inputError: { borderColor: "#EF4444" },
  inputText: { fontSize: 14, color: "#1E293B" },
  placeholder: { color: "#94A3B8" },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4 },
  generalError: { color: "#EF4444", textAlign: "center", marginVertical: 10 },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 15,
  },
  subsectionTitle: {
    fontWeight: "600",
    fontSize: 15,
    color: "#2A5A8D",
    marginTop: 10,
    marginBottom: 8,
  },
  roleFields: { marginTop: 15 },
  buttonRow: { flexDirection: "row", marginTop: 20 },
  primaryButton: {
    backgroundColor: "#2A5A8D",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    flex: 1,
  },
  secondaryButtonText: { color: "#1E293B", fontWeight: "600", fontSize: 16 },
  linkRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  linkText: { color: "#64748B" },
  link: { color: "#2A5A8D", fontWeight: "600" },
});
