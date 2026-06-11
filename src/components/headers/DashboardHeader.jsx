import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../NotificationBell";

export default function DashboardHeader({
  userName,
  avatarUrl,
  firstName,
  lastName,
  roleText,
  navigation,
  menuItems: customMenuItems,
}) {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const initial = firstName?.charAt(0) || "";
  const lastInitial = lastName?.charAt(0) || "";
  const displayName =
    userName || (firstName ? `${firstName} ${lastName || ""}` : "Usuario");

  const defaultMenuItems = [
    {
      label: "👤 Mi Perfil",
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate("PerfilAdmin");
      },
    },
    {
      label: "⚙️ Mi Cuenta",
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate("CuentaAdmin");
      },
    },
    {
      label: "🚪 Cerrar Sesión",
      isLogout: true,
      onPress: () => {
        setMenuVisible(false);
        Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí, cerrar sesión",
            onPress: async () => await logout(),
          },
        ]);
      },
    },
  ];

  const items = customMenuItems || defaultMenuItems;

  return (
    <View style={styles.header}>
      <SafeAreaView>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userRole}>{roleText}</Text>
          </View>
          <View style={styles.headerRight}>
            <NotificationBell />
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {initial}
                    {lastInitial}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                // setMenuVisible(false);
                item.onPress();
              }}
            >
              <Text
                style={[
                  styles.menuItemText,
                  item.isLogout && { color: "#dc2626" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2A5A8D",
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: { color: "#E0E7FF", fontSize: 14, fontWeight: "500" },
  userName: { color: "#FFF", fontSize: 22, fontWeight: "bold", marginTop: 2 },
  userRole: { color: "#A5B4FC", fontSize: 13, marginTop: 4 },
  avatarButton: { marginLeft: 10 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontWeight: "bold", color: "#2A5A8D" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  dropdownMenu: {
    position: "absolute",
    top: 75,
    right: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: 150,
    zIndex: 10,
  },
  menuItem: { padding: 12 },
  menuItemText: { fontSize: 14, color: "#333" },
});