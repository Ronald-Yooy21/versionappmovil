import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";

export default function SolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarSolicitudes = async () => {
    try {
      const response = await api.get("/admin/solicitudes");
      setSolicitudes(response.data.solicitudes);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const manejarSolicitud = async (id, accion) => {
    try {
      await api.post(`/admin/solicitudes/${id}/${accion}`);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      Alert.alert("Éxito", `Solicitud ${accion === "aprobar" ? "aprobada" : "rechazada"}`);
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la solicitud");
    }
  };

  const renderSolicitud = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre_user}</Text>
        <Text style={styles.detalle}>Nombre completo: {item.nombre}</Text>
        <Text style={styles.detalle}>Correo: {item.correo}</Text>
        <Text style={styles.detalle}>Rol solicitado: {item.rol}</Text>
      </View>
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.boton, styles.aprobar]}
          onPress={() => manejarSolicitud(item.id, "aprobar")}
        >
          <Text style={styles.botonTexto}>Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, styles.rechazar]}
          onPress={() => manejarSolicitud(item.id, "rechazar")}
        >
          <Text style={styles.botonTexto}>Rechazar</Text>
        </TouchableOpacity>
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
        data={solicitudes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSolicitud}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay solicitudes pendientes</Text>
        }
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
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: { marginBottom: 12 },
  nombre: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  detalle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  botones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  boton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  aprobar: { backgroundColor: "#2A5A8D" },
  rechazar: { backgroundColor: "#EF4444" },
  botonTexto: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  empty: { textAlign: "center", marginTop: 40, color: "#94A3B8", fontSize: 16 },
});