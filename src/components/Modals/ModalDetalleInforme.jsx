import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function ModalDetalleInforme({ visible, informe, onClose }) {
  if (!informe) return null;

  // Consistencia de color según el resultado (igual que en la tarjeta)
  const obtenerEstiloResultado = (res) => {
    const texto = res?.toUpperCase() || "";
    if (texto.includes("APROBADO") || texto.includes("COMPLETADO") || texto.includes("EXITOSO")) {
      return { bg: "#F0FDF4", texto: "#16A34A" }; 
    }
    if (texto.includes("REPROBADO") || texto.includes("NO") || texto.includes("FALLIDO")) {
      return { bg: "#FEF2F2", texto: "#DC2626" }; 
    }
    return { bg: "#EFF6FF", texto: "#2563EB" }; 
  };

  const badgeEstilo = obtenerEstiloResultado(informe.resultado);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Detalle del Informe</Text>
            
            {/* Fila del Pasante */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>PASANTE</Text>
              <Text style={styles.value}>{informe.pasante}</Text>
            </View>

            <View style={styles.divider} />

            {/* Fila de la Pasantía */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>PASANTÍA / PROYECTO</Text>
              <Text style={styles.value}>{informe.pasantia}</Text>
            </View>

            <View style={styles.divider} />

            {/* Bloque de Calificaciones (Dashboard Style) */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Promedio</Text>
                <Text style={styles.metricValue}>{informe.promedio}%</Text>
              </View>
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Nota Final</Text>
                <Text style={styles.metricValue}>{informe.nota_final}</Text>
              </View>
            </View>

            {/* Fila de Estado y Fecha juntas para optimizar espacio */}
            <View style={styles.footerDataRow}>
              <View style={styles.footerDataColumn}>
                <Text style={styles.label}>ESTADO</Text>
                <View style={[styles.badge, { backgroundColor: badgeEstilo.bg }]}>
                  <Text style={[styles.badgeText, { color: badgeEstilo.texto }]}>
                    {informe.resultado?.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={[styles.footerDataColumn, { alignItems: "flex-end" }]}>
                <Text style={styles.label}>FECHA DE EMISIÓN</Text>
                <Text style={styles.fechaValue}>{informe.fecha}</Text>
              </View>
            </View>

            {/* Botón de Cierre */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Entendido</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Fondo oscuro Slate Premium
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalWrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    overflow: "hidden",
  },
  container: {
    padding: 24,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#0F172A", 
    letterSpacing: -0.5,
    marginBottom: 20 
  },
  infoRow: {
    marginVertical: 4,
  },
  label: { 
    fontSize: 10, 
    fontWeight: "700",
    color: "#94A3B8", 
    letterSpacing: 0.8,
    marginBottom: 4 
  },
  value: { 
    fontSize: 15, 
    color: "#334155", 
    fontWeight: "600",
    lineHeight: 22
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  metricBlock: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
  },
  metricLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  footerDataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  footerDataColumn: {
    flex: 1,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  fechaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  closeText: { 
    color: "#475569", 
    fontWeight: "600",
    fontSize: 14,
  },
});
