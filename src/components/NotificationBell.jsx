import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

export default function NotificationBell() {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);
  const pollingInterval = useRef(null);

  const cargarNoLeidas = async () => {
    try {
      const response = await api.get("/notificaciones");
      setUnreadCount(response.data.no_leidas);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  };

  useEffect(() => {
    cargarNoLeidas();

    // Polling cada 30 segundos
    pollingInterval.current = setInterval(() => {
      cargarNoLeidas();
    }, 30000);

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      cargarNoLeidas();
    }, []),
  );

  const handlePress = () => {
    navigation.navigate("Notificaciones");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.bellIcon}>🔔</Text>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginRight: 12,
  },
  bellIcon: {
    fontSize: 22,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
