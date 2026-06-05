import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const QuickActionButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
    <View
      style={[styles.quickActionIconCircle, { backgroundColor: color + "15" }]}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
    </View>
    <Text style={styles.quickActionText}>{label}</Text>
  </TouchableOpacity>
);

export default function DashboardPasanteScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [pasanteInfo, setPasanteInfo] = useState({
    ru: "",
    matricula: "",
    semestre: "",
    mencion: "",
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatosPasante = async () => {
    try {
      const response = await api.get("/pasante/info");
      setPasanteInfo(response.data);
    } catch (error) {
      console.error("Error cargando datos del pasante:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser(); // Actualiza el contexto
    await cargarDatosPasante(); // Recarga datos del pasante
    setRefreshing(false);
  };

  useEffect(() => {
    cargarDatosPasante();
  }, []);

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, cerrar sesión",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header con bienvenida y foto de perfil */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.userName}>
              {user?.nombre} {user?.ap_paterno}
            </Text>
            <Text style={styles.userRole}>Pasante</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.nombre?.charAt(0)}
                  {user?.ap_paterno?.charAt(0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Perfil");
              }}
            >
              <Text style={styles.menuItemText}>👤 Mi Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Cuenta");
              }}
            >
              <Text style={styles.menuItemText}>⚙️ Mi Cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLogout]}
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
            >
              <Text style={styles.menuItemLogoutText}>🚪 Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Accesos Rápidos */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="📝"
            label="Inscribirse a Pasantía"
            onPress={() => navigation.navigate("Inscribirse")}
            color="#2A5A8D"
          />
          <QuickActionButton
            icon="📋"
            label="Pasantías Inscritas"
            onPress={() => navigation.navigate("InscripcionesActivas")}
            color="#3890BB"
          />
          <QuickActionButton
            icon="✅"
            label="Inscripciones Finalizadas"
            onPress={() => navigation.navigate("InscripcionesFinalizadas")}
            color="#3C9087"
          />
          <QuickActionButton
            icon="📅"
            label="Mis Actividades"
            onPress={() => navigation.navigate("Actividades")}
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Información académica */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🎓 Información Académica</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Semestre:</Text>
          <Text style={[styles.infoValue, styles.textFlexible]}>
            {" "}
            {pasanteInfo.semestre || "No registrado"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mención:</Text>
          {/* Añadimos un contenedor flexible o aplicamos flex: 1 directamente al Text */}
          <Text style={[styles.infoValue, styles.textFlexible]}>
            {"  "}
            {pasanteInfo.mencion || "No registrada"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ... estilos (se mantienen igual que antes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  userRole: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A5A8D",
  },
  dropdownMenu: {
    position: "absolute",
    top: 70,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 160,
    zIndex: 1000,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: "#333",
  },
  menuItemLogout: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  menuItemLogoutText: {
    fontSize: 14,
    color: "#dc2626",
  },
  quickActionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a2a3a",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    backgroundColor: "#fff",
    width: "48%",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionIcon: {
    fontSize: 28,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  textFlexible: {
    flex: 1, // 👈 ¡ESTA ES LA MAGIA! Fuerza al texto a quedarse dentro de los límites y saltar de línea
    flexWrap: "wrap", // Opcional: refuerza el comportamiento de salto de línea
  },
});
