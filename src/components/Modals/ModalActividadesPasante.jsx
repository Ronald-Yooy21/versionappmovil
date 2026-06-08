import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { toDisplayDate } from "../../utils/dateUtils";

export default function ModalActividadesPasante({
  visible,
  onClose,
  pasantia,
}) {
  if (!pasantia) return null;

  // Validar que actividades sea un array, si no, usar array vacío
  const actividades = Array.isArray(pasantia.actividades)
    ? pasantia.actividades
    : [];

  // Ordenar actividades: por fecha_ini ASC, luego por fecha_fin ASC
  const actividadesOrdenadas = useMemo(() => {
    if (actividades.length === 0) return [];

    return [...actividades].sort((a, b) => {
      // Primero por fecha_ini (más próxima primero)
      if (a.fecha_ini && b.fecha_ini && a.fecha_ini !== b.fecha_ini) {
        return a.fecha_ini.localeCompare(b.fecha_ini);
      }
      // Si una no tiene fecha_ini, ponerla al final
      if (!a.fecha_ini) return 1;
      if (!b.fecha_ini) return -1;
      // Luego por fecha_fin (más próxima a terminar primero)
      if (a.fecha_fin && b.fecha_fin) {
        return a.fecha_fin.localeCompare(b.fecha_fin);
      }
      return 0;
    });
  }, [actividades]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Actividades de la Pasantía</Text>
          <Text style={styles.subtitle}>
            {pasantia.nombre || "Cargando..."}
          </Text>

          <ScrollView style={styles.actividadesList}>
            {actividadesOrdenadas.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay actividades registradas
              </Text>
            ) : (
              actividadesOrdenadas.map((act, index) => (
                <View key={act.id || index} style={styles.actividadCard}>
                  <Text style={styles.actividadNombre}>
                    {index + 1}.{" "}
                    {act.nombre || act.nombre_act || "Actividad sin nombre"}
                  </Text>
                  <Text style={styles.actividadTipo}>
                    {act.tipo || "No especificado"}
                  </Text>
                  <Text style={styles.actividadFechas}>
                    {toDisplayDate(act.fecha_ini)} →{" "}
                    {toDisplayDate(act.fecha_fin)}
                  </Text>
                  <Text style={styles.actividadDesc}>
                    {act.descripcion || "Sin descripción"}
                  </Text>
                </View>
              ))
            )}
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
  actividadesList: { maxHeight: 500 },
  actividadCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  actividadNombre: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  actividadTipo: {
    fontSize: 12,
    color: "#2A5A8D",
    fontWeight: "500",
    marginBottom: 4,
  },
  actividadFechas: { fontSize: 12, color: "#666", marginBottom: 4 },
  actividadDesc: { fontSize: 12, color: "#999" },
  emptyText: { textAlign: "center", color: "#999", padding: 20 },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
