import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PasantiaCard({ pasantia, onVerActividades }) {
  const {
    nombre,
    estado,
    mencion,
    fecha_ini,
    fecha_fin,
    cupos,
    cupos_disponibles,
    carga_horaria,
    turno,
    total_inscritos,
  } = pasantia;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.nombre}>{nombre}</Text>
        <View style={[styles.estadoBadge, 
          { backgroundColor: estado === "INICIADO" ? "#10B981" : estado === "ABIERTA" ? "#F59E0B" : "#94A3B8" }]}>
          <Text style={styles.estadoText}>{estado}</Text>
        </View>
      </View>
      <Text style={styles.mencion}>{mencion}</Text>
      <View style={styles.detalles}>
        <Text style={styles.detalle}>📅 {fecha_ini} – {fecha_fin}</Text>
        <Text style={styles.detalle}>🕒 {carga_horaria}h · {turno}</Text>
        <Text style={styles.detalle}>👥 {total_inscritos}/{cupos} cupos ({cupos_disponibles} libres)</Text>
      </View>
      <TouchableOpacity style={styles.boton} onPress={onVerActividades}>
        <Text style={styles.botonText}>📋 Ver actividades</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nombre: { fontSize: 16, fontWeight: "700", color: "#1E293B", flex: 1 },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: { color: "#FFF", fontSize: 11, fontWeight: "600" },
  mencion: { color: "#64748B", fontSize: 13, marginBottom: 8 },
  detalles: { marginBottom: 12 },
  detalle: { fontSize: 12, color: "#475569", marginBottom: 3 },
  boton: {
    alignSelf: "flex-start",
    backgroundColor: "#2A5A8D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botonText: { color: "#FFF", fontWeight: "600", fontSize: 13 },
});