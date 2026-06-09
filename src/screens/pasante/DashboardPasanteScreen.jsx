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
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import NotificationBell from "../../components/NotificationBell";

// --- Componentes ---

const QuickActionButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity
    style={styles.quickActionCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[styles.quickActionIconCircle, { backgroundColor: `${color}15` }]}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
    </View>
    <Text style={styles.quickActionText}>{label}</Text>
  </TouchableOpacity>
);

// --- Pantalla Principal ---

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
    await refreshUser();
    await cargarDatosPasante();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarDatosPasante();
  }, []);

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí, cerrar sesión", onPress: async () => await logout() },
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
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5A8D" />

      {/* Header Compacto Moderno */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.userName}>
              {user?.nombre} {user?.ap_paterno}
            </Text>
            <Text style={styles.userRole}>Pasante</Text>
          </View>

          <View style={styles.headerRight}>
            <NotificationBell />
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatar}
                />
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
        </View>

        {/* Dropdown Menu */}
        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <MenuItem
              label="👤 Mi Perfil"
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Perfil");
              }}
            />
            <MenuItem
              label="⚙️ Mi Cuenta"
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Cuenta");
              }}
            />
            <MenuItem
              label="🚪 Cerrar Sesión"
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
              isLogout
            />
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Accesos Rápidos */}
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="📝"
            label="Inscribirse a Pasantía"
            onPress={() => navigation.navigate("Inscribirse")}
            color="#2A5A8D"
          />
          <QuickActionButton
            icon="✅"
            label="Pasantías Inscritas"
            onPress={() => navigation.navigate("InscripcionesActivas")}
            color="#3890BB"
          />
          <QuickActionButton
            icon="📅"
            label="Calendario Actividades"
            onPress={() => navigation.navigate("CalendarioActividades")}
            color="#8B5CF6"
          />
          <QuickActionButton
            icon="💬"
            label="Mensajes"
            onPress={() => navigation.navigate("Mensajes")}
            color="#8B5CF6"
          />
        </View>

        {/* Información académica estilizada */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎓 Información Académica</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semestre</Text>
            <Text style={[styles.infoValue, styles.textFlexible]}>
              {pasanteInfo.semestre || "No registrado"}
            </Text>
          </View>

          <View style={styles.infoRowContainer}>
            <Text style={styles.infoLabel}>Mención</Text>
            <Text style={[styles.infoValue, styles.textFlexible]}>
              {pasanteInfo.mencion || "No registrada"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Sub-componente para menú
const MenuItem = ({ label, onPress, isLogout }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={[styles.menuItemText, isLogout && { color: "#dc2626" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// --- Estilos ---

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header Optimizado (Compacto)
  header: {
    backgroundColor: "#2A5A8D",
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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

  // Dropdown
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

  // Secciones
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 15,
    marginTop: 5,
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickActionIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionIcon: { fontSize: 24 },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },

  // Info Card Académica (Mejorada)
  infoCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2A5A8D",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBy: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    paddingBottom: 12,
    marginBottom: 12,
  },
  infoRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "right",
  },
  textFlexible: { flex: 1, marginLeft: 20 },
});
