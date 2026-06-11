import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressBar({ label, progress, color = "#2A5A8D" }) {
  const percentage = parseFloat(progress) || 0;
  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.percent}>{percentage.toFixed(1)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    width: 100,
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  barContainer: {
    flex: 1,
    height: 14,
    backgroundColor: "#F1F5F9",
    borderRadius: 7,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 7,
  },
  percent: {
    width: 45,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
});