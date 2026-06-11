import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function RegistroPendienteScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>⏳</Text>
        </View>
        <Text style={styles.title}>¡Solicitud Recibida!</Text>
        <Text style={styles.message}>
          Tu requerimiento de registro ha sido enviado exitosamente al equipo
          administrativo del sistema.
        </Text>
        <View style={styles.avisoBox}>
          <Text style={styles.avisoText}>
            Tu solicitud será evaluada para su aprobación o rechazo. Te
            notificaremos la resolución directamente a tu correo electrónico
            institucional.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          ¿Tienes dudas? Contacta al soporte de tu área académica.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA", justifyContent: "center" },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: { fontSize: 40 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  avisoBox: {
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    padding: 14,
    borderRadius: 10,
    marginBottom: 24,
  },
  avisoText: { color: "#92400E", fontSize: 13, lineHeight: 18 },
  button: {
    backgroundColor: "#2A5A8D",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  footerText: { color: "#94A3B8", fontSize: 12, textAlign: "center" },
});
