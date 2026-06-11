import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ModalProgresoHistorico({
  visible,
  historial,
  onClose,
  nombreActividad,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Historial: {nombreActividad}</Text>
          {historial?.length === 0 ? (
            <Text style={styles.vacio}>Sin registros de progreso.</Text>
          ) : (
            <FlatList
              data={historial}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.row}>
                    <Text style={styles.fecha}>{item.fecha}</Text>
                    <Text style={styles.hora}>{item.hora}</Text>
                  </View>
                  <Text style={styles.descripcion}>{item.descripcion}</Text>
                  <View style={styles.porcentajeBadge}>
                    <Text style={styles.porcentajeText}>
                      {item.porcentaje}%
                    </Text>
                  </View>
                </View>
              )}
            />
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
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  titulo: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  vacio: { color: "#94A3B8", textAlign: "center", marginVertical: 20 },
  item: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  fecha: { fontWeight: "600", color: "#1E293B" },
  hora: { color: "#64748B", fontSize: 12 },
  descripcion: { color: "#475569", fontSize: 14 },
  porcentajeBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#2A5A8D20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  porcentajeText: { color: "#2A5A8D", fontWeight: "700", fontSize: 12 },
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
