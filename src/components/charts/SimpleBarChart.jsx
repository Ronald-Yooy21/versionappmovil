import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SimpleBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.name} style={styles.row}>
          <Text style={styles.label}>{item.name}</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                { width: `${(item.value / max) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 80,
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
    backgroundColor: "#2A5A8D",
    borderRadius: 7,
  },
  value: {
    width: 30,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
});