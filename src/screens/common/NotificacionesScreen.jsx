import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";

// Formatear hora
const formatHora = (horaStr) => {
  if (!horaStr) return "";
  return horaStr.substring(0, 5);
};

// Componente de tarjeta de notificación
const NotificacionCard = ({ notificacion, onPress }) => {
  const getIcono = (tipo) => {
    switch (tipo) {
      case "inscripcion":
        return "📋";
      case "cupos_completados":
        return "🏆";
      case "actividad_fecha_cambio":
        return "📅";
      default:
        return "🔔";
    }
  };

  const getColor = (tipo, leido) => {
    if (!leido) return "#dbeafe";
    if (tipo === "inscripcion") return "#dcfce7";
    if (tipo === "cupos_completados") return "#fef3c7";
    if (tipo === "actividad_fecha_cambio") return "#ede9fe";
    return "#f5f5f5";
  };

  const fechaFormateada = (fecha, hora) => {
    if (!fecha) return "";
    const partes = fecha.split("-");
    const fechaObj = new Date(partes[0], partes[1] - 1, partes[2]);
    return `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()} ${formatHora(hora)}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: getColor(notificacion.tipo, notificacion.leido) },
      ]}
      onPress={() => onPress(notificacion)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardIcon}>{getIcono(notificacion.tipo)}</Text>
          <Text style={styles.cardTitulo}>{notificacion.titulo}</Text>
        </View>
        {!notificacion.leido && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.cardMensaje}>{notificacion.mensaje}</Text>
      <Text style={styles.cardFecha}>
        {fechaFormateada(notificacion.fecha, notificacion.hora)}
      </Text>
    </TouchableOpacity>
  );
};

export default function NotificacionesScreen({ navigation }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);

  const cargarNotificaciones = async () => {
    try {
      const response = await api.get("/notificaciones");
      setNotificaciones(response.data.notificaciones);
      setNoLeidas(response.data.no_leidas);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarNotificaciones();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarNotificaciones();
  };

  const handleMarcarTodas = async () => {
    try {
      await api.patch("/notificaciones/marcar-todas");
      await cargarNotificaciones();
    } catch (error) {
      Alert.alert("Error", "No se pudieron marcar todas como leídas");
    }
  };

  const handlePressNotificacion = async (notificacion) => {
    // Marcar como leída si no lo está
    if (!notificacion.leido) {
      try {
        await api.patch(`/notificaciones/${notificacion.id}/leer`);
      } catch (error) {
        console.error("Error marcando como leída:", error);
      }
    }

    // // Redirigir según la URL de la notificación
    // if (notificacion.url) {
    //   // Limpiar el prefijo /mobile/ si existe
    //   let url = notificacion.url;
    //   if (url.startsWith("/mobile/")) {
    //     url = url.replace("/mobile/", "/");
    //   }
    //   navigation.navigate(url);
    // }
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {noLeidas > 0 && (
          <TouchableOpacity
            onPress={handleMarcarTodas}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {notificaciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No hay notificaciones</Text>
            <Text style={styles.emptySubtext}>
              Las notificaciones aparecerán aquí cuando tengas novedades
            </Text>
          </View>
        ) : (
          notificaciones.map((notif) => (
            <NotificacionCard
              key={notif.id}
              notificacion={notif}
              onPress={handlePressNotificacion}
            />
          ))
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1a2a3a" },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  markAllText: { fontSize: 12, color: "#2A5A8D", fontWeight: "500" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardIcon: { fontSize: 20 },
  cardTitulo: { fontSize: 14, fontWeight: "bold", color: "#333" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2A5A8D",
  },
  cardMensaje: { fontSize: 13, color: "#666", marginBottom: 8, lineHeight: 18 },
  cardFecha: { fontSize: 10, color: "#999", textAlign: "right" },
  emptyContainer: { alignItems: "center", padding: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: { fontSize: 14, color: "#999", textAlign: "center" },
  bottomSpacing: { height: 40 },
});
