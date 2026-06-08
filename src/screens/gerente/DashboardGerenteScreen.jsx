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
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const KpiCard = ({ label, value, icon, color }) => (
  <View style={[styles.kpiCard, { borderLeftColor: color }]}>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
    <Text style={styles.kpiIcon}>{icon}</Text>
  </View>
);

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
    await refreshUser(); // ← Actualizar datos del usuario
    await cargarEstadisticas(); // ← Recargar estadísticas
    setRefreshing(false);
  };

  useEffect(() => {
    cargarEstadisticas();
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
            <Text style={styles.userRole}>Gerente de Empresa</Text>
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

      {/* Tarjetas KPI */}
      <View style={styles.kpiContainer}>
        <KpiCard
          label="Total Pasantías"
          value={stats.total_pasantias}
          icon="📋"
          color="#2A5A8D"
        />
        <KpiCard
          label="Total Pasantes"
          value={stats.total_pasantes}
          icon="👨‍🎓"
          color="#3890BB"
        />
        <KpiCard
          label="Total Jefes"
          value={stats.total_jefes}
          icon="👔"
          color="#3C9087"
        />
        <KpiCard
          label="Calificación Promedio"
          value={`${stats.calificacion_promedio} ⭐`}
          icon="⭐"
          color="#F59E0B"
        />
      </View>

      {/* Accesos Rápidos */}
      <View style={styles.quickActionsContainer}>
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
            label="Publicar Pasantía"
            onPress={() => navigation.navigate("CrearPasantia")}
            color="#3C9087"
          />
          <QuickActionButton
            icon="📋"
            label="Pasantías Publicadas"
            onPress={() => navigation.navigate("Pasantias")}
            color="#3890BB"
          />
          <QuickActionButton
            icon="👥"
            label="Lista de Jefes"
            onPress={() => navigation.navigate("Jefes")}
            color="#8B5CF6"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... todos los estilos se mantienen igual que antes
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
  kpiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -20,
  },
  kpiCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a2a3a",
  },
  kpiLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  kpiIcon: {
    fontSize: 24,
    position: "absolute",
    right: 12,
    bottom: 12,
    opacity: 0.3,
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
});
