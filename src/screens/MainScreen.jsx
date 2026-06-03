import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function MainScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, cerrar sesión",
        onPress: async () => {
          await logout();
          Alert.alert("Éxito", "Sesión cerrada correctamente");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>
          {user?.nombre} {user?.ap_paterno}
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Rol:</Text> {user?.rol?.toUpperCase()}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Usuario:</Text> {user?.nombre_user}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Correo:</Text> {user?.correo}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A5A8D",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#2A5A8D",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
