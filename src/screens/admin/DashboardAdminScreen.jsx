import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import DashboardHeader from "../../components/headers/DashboardHeader";
import KpiCard from "../../components/common/KpiCard";
import QuickActionButton from "../../components/common/QuickActionButton";
import SimpleBarChart from "../../components/charts/SimpleBarChart";
import CommentCard from "../../components/common/CommentCard";

export default function DashboardAdminScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Error cargando dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await cargarDashboard();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </View>
    );
  }

  const { stats, distribucion_roles, ultimos_comentarios } = data || {};

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5A8D" />
      <DashboardHeader
        firstName={user?.nombre}
        lastName={user?.ap_paterno}
        userName={user?.nombre_user}
        avatarUrl={user?.avatar_url}
        roleText="Administrador"
        navigation={navigation}
        menuItems={
          [
            // Menú personalizado sin pantallas de perfil/cuenta por ahora (solo cerrar sesión)
            {
              label: "🚪 Cerrar Sesión",
              isLogout: true,
              onPress: () => {
                // Lógica de logout usando contexto
                const { logout } = require("../../context/AuthContext").useAuth;
                Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Sí, cerrar sesión",
                    onPress: async () => await logout(),
                  },
                ]);
              },
            },
          ]
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* KPI Section */}
        <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
        <View style={styles.kpiContainer}>
          <KpiCard label="Usuarios" value={stats.usuarios} icon="👥" color="#2A5A8D" />
          <KpiCard label="Pasantes" value={stats.pasantes} icon="👨‍🎓" color="#3890BB" />
          <KpiCard label="Empresas" value={stats.empresas} icon="🏢" color="#3C9087" />
          <KpiCard label="Pasantías Activas" value={stats.pasantias_activas} icon="📋" color="#F59E0B" />
          <KpiCard label="Solicitudes Pend." value={stats.solicitudes_pendientes} icon="⏳" color="#8B5CF6" />
        </View>

        {/* Distribución de roles */}
        <Text style={styles.sectionTitle}>Distribución de Roles</Text>
        <SimpleBarChart data={distribucion_roles} />

        {/* Últimos comentarios */}
        <Text style={styles.sectionTitle}>Últimos Comentarios</Text>
        {ultimos_comentarios?.map((comentario) => (
          <CommentCard key={comentario.id} {...comentario} />
        ))}

        {/* Accesos rápidos */}
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="👥"
            label="Usuarios"
            onPress={() => navigation.navigate("Usuarios")}
            color="#2A5A8D"
          />
          <QuickActionButton
            icon="📋"
            label="Solicitudes"
            onPress={() => navigation.navigate("Solicitudes")}
            color="#8B5CF6"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});