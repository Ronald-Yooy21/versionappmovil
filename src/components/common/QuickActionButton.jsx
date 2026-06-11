import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuickActionButton({ icon, label, onPress, color }) {
  return (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.quickActionIconCircle,
          { 
            backgroundColor: `${color}12`, // Fondo suave translúcido
            borderColor: `${color}25`     // Borde de alta definición a juego
          }
        ]}
      >
        <Text style={[styles.quickActionIcon, { color: color }]}>{icon}</Text>
      </View>
      <Text style={styles.quickActionText} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 20, // Consistencia absoluta con las curvas del KpiCard anterior
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0", // Slate 200 para encajar en el ecosistema limpio de tu app
    
    // Sombras premium de bajo contraste (iOS)
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    
    // Sombra para Android
    elevation: 3,
  },
  quickActionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16, // Forma escircle moderna
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 12,
  },
  quickActionIcon: { 
    fontSize: 22,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "700", // Peso más fuerte para detonar acción inmediata
    color: "#0F172A",  // Slate 900 para máxima elegibilidad en dashboards móviles
    textAlign: "center",
    letterSpacing: -0.2,
    lineHeight: 18,
  },
});
