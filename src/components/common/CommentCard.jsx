import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CommentCard({ autor, texto, calificacion, fecha }) {
  const iniciales = autor
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const estrellas = "★".repeat(calificacion) + "☆".repeat(5 - calificacion);

  // Formatear fecha simple
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-BO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.autor}>{autor}</Text>
          <Text style={styles.fecha}>{fechaFormateada}</Text>
        </View>
        <Text style={styles.stars}>{estrellas}</Text>
      </View>
      <Text style={styles.texto} numberOfLines={3}>
        {texto}
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
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  info: { flex: 1 },
  autor: { fontWeight: "600", color: "#1E293B", fontSize: 14 },
  fecha: { color: "#94A3B8", fontSize: 12 },
  stars: { color: "#F59E0B", fontSize: 16 },
  texto: { color: "#475569", fontSize: 14, lineHeight: 20 },
});