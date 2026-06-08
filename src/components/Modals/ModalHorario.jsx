import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { toDisplayDate } from "../../utils/dateUtils";

export default function ModalHorario({ visible, onClose, pasantia }) {
  if (!pasantia) return null;

  const formatFechaCompleta = (fecha) => {
    if (!fecha) return "";
    const [anio, mes, dia] = fecha.split("-");
    const fechaObj = new Date(anio, mes - 1, dia);
    return fechaObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Horario y Fechas</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Turno:</Text>
              <Text style={styles.infoValue}>
                {pasantia.turno || "No especificado"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⏰ Carga Horaria:</Text>
              <Text style={styles.infoValue}>
                {pasantia.carga_horaria
                  ? `${pasantia.carga_horaria} hrs/semana`
                  : "No especificado"}
              </Text>
            </View>

            {pasantia.detalles_horario && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📝 Detalles:</Text>
                <Text style={styles.infoValue}>
                  {pasantia.detalles_horario}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📆 Fecha Inicio:</Text>
              <Text style={styles.infoValue}>
                {formatFechaCompleta(pasantia.fecha_ini)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📆 Fecha Fin:</Text>
              <Text style={styles.infoValue}>
                {formatFechaCompleta(pasantia.fecha_fin)}
              </Text>
            </View>
          </ScrollView>

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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#2A5A8D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
