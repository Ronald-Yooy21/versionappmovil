import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function KpiCard({ label, value, icon, color }) {
  return (
    <View style={styles.kpiCard}>
      {/* Contenedor del Icono con efecto premium de doble tono */}
      <View 
        style={[
          styles.iconContainer, 
          { 
            backgroundColor: `${color}13`, // Opacidad sutil del 7% para fondo
            borderColor: `${color}33`     // Opacidad del 20% para un borde elegante
          }
        ]}
      >
        <Text style={[styles.iconText, { color: color }]}>{icon}</Text>
      </View>
      
      {/* Contenido de la métrica */}
      <View style={styles.kpiContent}>
        <Text style={styles.kpiLabel} numberOfLines={1}>
          {label?.toUpperCase()}
        </Text>
        <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kpiCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    padding: 16,
    borderRadius: 22, // Bordes milimétricamente más curvos para un look moderno
    marginBottom: 16,
    flexDirection: "column", // Cambio a vertical para dar mayor jerarquía visual en cuadrículas
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0", // Slate 200 para consistencia con el resto de la suite
    
    // Sombra premium difuminada de alta fidelidad (iOS)
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    
    // Sombra sutil y limpia (Android)
    elevation: 2,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14, // Forma ligeramente escircle
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    marginBottom: 14, // Separación limpia hacia las métricas
  },
  iconText: {
    fontSize: 20,
    includeFontPadding: false, // Remueve paddings fantasma en Android
    textAlignVertical: "center",
  },
  kpiContent: {
    width: "100%",
  },
  kpiLabel: {
    fontSize: 10,
    color: "#64748B", // Slate 500
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.8, // Estilo micro-cap de alta gama
  },
  kpiValue: {
    fontSize: 24, // Mayor protagonismo al dato numérico
    fontWeight: "800", // Peso extra-bold para destacar
    color: "#0F172A", // Slate 900
    letterSpacing: -0.8, // Ajuste tipográfico premium
    lineHeight: 28,
  },
});
