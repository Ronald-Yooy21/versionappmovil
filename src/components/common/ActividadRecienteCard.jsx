import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ActividadRecienteCard({ pasante, completitud, fecha_limite, id_pasantia }) {
  const fechaFormateada = new Date(fecha_limite).toLocaleDateString("es-BO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.pasante}>{pasante}</Text>
        <Text style={[styles.completitud, completitud === 100 ? styles.completo : styles.pendiente]}>
          {completitud}%
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detalle}>Pasantía #{id_pasantia}</Text>
        <Text style={styles.detalle}>Entrega: {fechaFormateada}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pasante: { fontWeight: "600", color: "#1E293B", fontSize: 14 },
  completitud: { fontSize: 14, fontWeight: "600" },
  completo: { color: "#10B981" },
  pendiente: { color: "#EF4444" },
  detalle: { color: "#94A3B8", fontSize: 12 },
});