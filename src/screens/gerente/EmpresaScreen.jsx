import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EmpresaScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Mi Empresa (en construcción)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
