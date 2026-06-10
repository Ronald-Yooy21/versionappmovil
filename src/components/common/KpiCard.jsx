import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function KpiCard({ label, value, icon, color }) {
  return (
    <View style={styles.kpiCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={styles.kpiContent}>
        <Text style={styles.kpiValue}>{value}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kpiCard: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  kpiValue: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  kpiLabel: {
    fontSize: 11,
    color: "#64748B",
    textTransform: "uppercase",
    fontWeight: "600",
  },
});