import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";

export default function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/admin/usuarios");
      setUsuarios(response.data.usuarios);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

    const toggleEstado = async (id, estadoActual) => {
    try {
        // 1. Se elimina el segundo parámetro (el objeto {estado}) porque el backend no lo lee.
        await api.patch(`admin/usuarios/${id}/estado`);
        
        // 2. Si la petición es exitosa, se invierte el estado en la interfaz.
        setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, estado: !estadoActual } : u))
        );
    } catch (error) {
        Alert.alert("Error", "No se pudo cambiar el estado");
    }
    };


  const renderUsuario = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nombre}>
          {item.nombre} {item.ap_paterno} {item.ap_materno}
        </Text>
        <Text style={styles.detalle}>Correo: {item.correo}</Text>
        <Text style={styles.detalle}>Rol: {item.rol}</Text>
        <Text style={styles.detalle}>CI: {item.ci}</Text>
      </View>
      <View style={styles.actions}>
        <Text style={styles.estadoLabel}>
          {item.estado ? "Activo" : "Inactivo"}
        </Text>
        <Switch
          value={item.estado}
          onValueChange={() => toggleEstado(item.id, item.estado)}
          trackColor={{ false: "#CBD5E1", true: "#2A5A8D" }}
          thumbColor="#FFF"
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  detalle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  actions: { alignItems: "center" },
  estadoLabel: { fontSize: 12, color: "#64748B", marginBottom: 4 },
});