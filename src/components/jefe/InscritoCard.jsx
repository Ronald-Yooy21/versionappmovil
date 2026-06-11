import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InscritoCard({ inscrito, onVerPerfil }) {
  const { nombre_completo, estado, ru, matricula, email, semestre } = inscrito;

  // Sistema de diseño semántico: Color de acento e indicador según estado
  const getStatusTheme = (status) => {
    const normalize = status?.toLowerCase();
    if (normalize === "iniciado") {
      return { accent: "#10B981", bg: "#F0FDF4", text: "#15803D" }; // Esmeralda Eléctrico
    }
    if (normalize === "finalizado") {
      return { accent: "#64748B", bg: "#F8FAFC", text: "#475569" }; // Slate Ejecutivo
    }
    return { accent: "#F59E0B", bg: "#FFFBEB", text: "#B45309" }; // Ámbar Vibrante
  };

  const theme = getStatusTheme(estado);

  return (
    <View style={styles.cardShadowContainer}>
      <View style={styles.card}>
        {/* Barra lateral indicadora de estado asimétrica */}
        <View style={[styles.statusIndicator, { backgroundColor: theme.accent }]} />

        {/* Contenido de Datos */}
        <View style={styles.infoContainer}>
          <Text style={styles.nombre} numberOfLines={1}>
            {nombre_completo}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>RU {ru}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>Mat. {matricula}</Text>
            </View>
          </View>

          <Text style={styles.subTexto} numberOfLines={1}>
            🎯 {semestre}º Semestre  ·  ✉️ {email}
          </Text>
        </View>

        {/* Columna de Acciones Lateral */}
        <View style={styles.actionsContainer}>
          <View style={[styles.badge, { backgroundColor: theme.bg, borderColor: theme.accent + "20" }]}>
            <Text style={[styles.badgeText, { color: theme.text }]}>
              {estado?.toUpperCase()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.botonPrincipal} 
            onPress={onVerPerfil} 
            activeOpacity={0.85}
          >
            <Text style={styles.botonTexto}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadowContainer: {
    // Genera una atmósfera de profundidad flotante muy llamativa
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20, // Bordes curvos altamente modernos
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden", // Crucial para recortar la barra lateral izquierda
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statusIndicator: {
    width: 6, // Línea vertical asimétrica premium
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 20, // Espacio extra para que no choque con el indicador
    paddingRight: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "800", // Peso extra para un impacto visual fuerte
    color: "#0F172A",
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  metaBadge: {
    backgroundColor: "#F1F5F9", // Píldoras de micro-datos encapsuladas
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
  },
  subTexto: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  actionsContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingRight: 16,
    height: "100%",
    minHeight: 80,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  botonPrincipal: {
    backgroundColor: "#2A5A8D", // Tu color azul corporativo nativo e imponente
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#2A5A8D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  botonTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
