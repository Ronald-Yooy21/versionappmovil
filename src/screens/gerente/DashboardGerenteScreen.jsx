import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import NotificationBell from "../../components/NotificationBell";

// --- Componentes ---

const KpiCard = ({ label, value, icon, color }) => (
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

export default function DashboardGerenteScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    total_pasantias: 0,
    total_pasantes: 0,
    total_jefes: 0,
    calificacion_promedio: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const cargarEstadisticas = async () => {
    try {
      const response = await api.get("/gerente/estadisticas");
      setStats(response.data.kpis);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await cargarEstadisticas();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarEstadisticas();
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

      {/* Header Ajustado con SafeAreaView */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userName}>{user?.nombre || "Usuario"}</Text>
              <Text style={styles.userRole}>Gerente de Empresa</Text>
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
        </SafeAreaView>

        {/* Dropdown Menu recalculado */}
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
        {/* KPI Section */}
        <Text style={styles.sectionTitle}>Estadísticas:</Text>
        <View style={styles.kpiContainer}>
          <KpiCard
            label="Pasantías"
            value={stats.total_pasantias}
            icon="📋"
            color="#2A5A8D"
          />
          <KpiCard
            label="Pasantes"
            value={stats.total_pasantes}
            icon="👨‍🎓"
            color="#3890BB"
          />
          <KpiCard
            label="Jefes"
            value={stats.total_jefes}
            icon="👔"
            color="#3C9087"
          />
          <KpiCard
            label="Calificación"
            value={`${stats.calificacion_promedio} ⭐`}
            icon="⭐"
            color="#F59E0B"
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="🏢"
            label="Mi Empresa"
            onPress={() => navigation.navigate("Empresa")}
            color="#2A5A8D"
          />
          <QuickActionButton
            icon="📝"
            label="Publicar"
            onPress={() => navigation.navigate("CrearPasantia")}
            color="#3C9087"
          />
          <QuickActionButton
            icon="📋"
            label="Pasantías"
            onPress={() => navigation.navigate("Pasantias")}
            color="#3890BB"
          />
          <QuickActionButton
            icon="👥"
            label="Lista Jefes"
            onPress={() => navigation.navigate("Jefes")}
            color="#8B5CF6"
          />
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

  // Header optimizado
  header: {
    backgroundColor: "#2A5A8D",
    paddingTop: 15, // Reducido drásticamente gracias al uso de SafeAreaView
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

  // Dropdown ajustado para una posición óptima
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

  // KPI
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 15,
    marginTop: 10,
  },
  kpiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
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

  // Quick Actions
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
});
