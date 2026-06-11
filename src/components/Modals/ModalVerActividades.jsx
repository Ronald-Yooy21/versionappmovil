import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { toDisplayDate } from "../../utils/dateUtils"; // Asegúrate de tener este helper

export default function ModalVerActividades({
  visible,
  onClose,
  actividades,
  nombrePasantia,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Actividades de la Pasantía</Text>
          <Text style={styles.subtitle}>
            {nombrePasantia || "Pasantía"}
          </Text>

          {!actividades || actividades.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay actividades registradas
            </Text>
          ) : (
            <ScrollView style={styles.actividadesList}>
              {actividades.map((act) => (
                <View key={act.id_actividad} style={styles.actividadCard}>
                  <View style={styles.actividadHeader}>
                    <Text style={styles.actividadNombre}>
                      {act.nombre_act}
                    </Text>
                  </View>
                  <Text style={styles.actividadTipo}>{act.tipo}</Text>
                  <Text style={styles.actividadFechas}>
                    {toDisplayDate(act.fecha_ini)} →{" "}
                    {toDisplayDate(act.fecha_fin)}
                  </Text>
                  {act.descripcion ? (
                    <Text style={styles.actividadDesc} numberOfLines={3}>
                      {act.descripcion}
                    </Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A5A8D",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    padding: 20,
  },
  actividadesList: {
    maxHeight: 400,
  },
  actividadCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  actividadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actividadNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  actividadTipo: {
    fontSize: 12,
    color: "#2A5A8D",
    fontWeight: "500",
    marginBottom: 4,
  },
  actividadFechas: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  actividadDesc: {
    fontSize: 12,
    color: "#999",
  },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
});