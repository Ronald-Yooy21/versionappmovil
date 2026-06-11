import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BitacoraPendienteCard({ pasante_nombre, pasantia_titulo, fecha }) {
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-BO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.pasante}>{pasante_nombre}</Text>
        <Text style={styles.fecha}>{fechaFormateada}</Text>
      </View>
      <Text style={styles.pasantia} numberOfLines={2}>
        {pasantia_titulo}
      </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pasante: { fontWeight: "600", color: "#1E293B", fontSize: 14 },
  fecha: { color: "#94A3B8", fontSize: 12 },
  pasantia: { color: "#64748B", fontSize: 13 },
});