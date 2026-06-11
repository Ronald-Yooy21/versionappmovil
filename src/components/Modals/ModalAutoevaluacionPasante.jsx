import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ModalAutoevaluacionPasante({
  visible,
  autoevaluacion,
  nombreActividad,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Autoevaluación - {nombreActividad}</Text>
          {autoevaluacion ? (
            <>
              <Text style={styles.nota}>Nota: {autoevaluacion.nota}/100</Text>
              <Text style={styles.fecha}>Fecha: {autoevaluacion.fecha}</Text>
              <Text style={styles.comentario}>
                {autoevaluacion.comentario || "Sin comentarios adicionales."}
              </Text>
            </>
          ) : (
            <Text style={styles.vacio}>No hay autoevaluación disponible.</Text>
          )}
          <TouchableOpacity style={styles.botonCerrar} onPress={onClose}>
            <Text style={styles.botonCerrarText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  container: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  titulo: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  nota: { fontSize: 20, fontWeight: "800", color: "#2A5A8D", marginBottom: 5 },
  fecha: { color: "#64748B", marginBottom: 10 },
  comentario: { color: "#1E293B", fontSize: 14, lineHeight: 20 },
  vacio: { color: "#94A3B8", textAlign: "center", marginVertical: 20 },
  botonCerrar: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "#2A5A8D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  botonCerrarText: { color: "#fff", fontWeight: "600" },
});
