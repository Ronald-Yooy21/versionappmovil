import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RadioGroup({ options, selected, onChange }) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.optionSelected]}
          onPress={() => onChange(opt.value)}
        >
          <View style={[styles.circle, selected === opt.value && styles.circleSelected]}>
            {selected === opt.value && <View style={styles.innerCircle} />}
          </View>
          <Text style={[styles.label, selected === opt.value && styles.labelSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
    minWidth: "45%",
  },
  optionSelected: {
    borderColor: "#2A5A8D",
    backgroundColor: "#EBF4FF",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  circleSelected: {
    borderColor: "#2A5A8D",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2A5A8D",
  },
  label: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  labelSelected: {
    color: "#2A5A8D",
    fontWeight: "600",
  },
});