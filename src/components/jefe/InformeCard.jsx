import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InformeCard({ informe, onVerDetalle }) {
  const { pasante, promedio, nota_final, resultado, fecha } = informe;

  // Lógica sutil para adaptar el color del badge según el resultado
  const obtenerEstiloResultado = (res) => {
    const texto = res?.toUpperCase() || "";
    if (texto.includes("APROBADO") || texto.includes("COMPLETADO") || texto.includes("EXITOSO")) {
      return { bg: "#F0FDF4", texto: "#16A34A" }; // Verde Esmeralda Premium
    }
    if (texto.includes("REPROBADO") || texto.includes("NO") || texto.includes("FALLIDO")) {
      return { bg: "#FEF2F2", texto: "#DC2626" }; // Rojo Carmín Premium
    }
    return { bg: "#EFF6FF", texto: "#2563EB" }; // Azul Eléctrico por defecto
  };

  const badgeEstilo = obtenerEstiloResultado(resultado);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.headerMain}>
          <Text style={styles.pasanteLabel}>PASANTE</Text>
          <Text style={styles.pasanteName} numberOfLines={1}>
            {pasante}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeEstilo.bg }]}>
          <Text style={[styles.badgeText, { color: badgeEstilo.texto }]}>
            {resultado?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.metricGroup}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Promedio</Text>
            <Text style={styles.metricValue}>{promedio}%</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Nota Final</Text>
            <Text style={styles.metricValue}>{nota_final}</Text>
          </View>
        </View>

        <Text style={styles.fechaText}>{fecha}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onVerDetalle}>
        <Text style={styles.actionButtonText}>Ver Detalles del Informe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0", // Borde ultra fino Slate-200
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerMain: {
    flex: 1,
  },
  pasanteLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  pasanteName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A", // Slate-900 para máxima legibilidad
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  metricGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC", // Mini contenedor sutil para destacar métricas
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 12,
  },
  metricBlock: {
    justifyContent: "center",
  },
  metricLabel: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 1,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E2E8F0",
  },
  fechaText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: "#0284C7", // Azul corporativo moderno que hace juego con las otras pantallas
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
