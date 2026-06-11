import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import DashboardHeader from "../../components/headers/DashboardHeader";
import KpiCard from "../../components/common/KpiCard";
import QuickActionButton from "../../components/common/QuickActionButton";
import ProgressBar from "../../components/common/ProgressBar";
import BitacoraPendienteCard from "../../components/common/BitacoraPendienteCard";
import ActividadRecienteCard from "../../components/common/ActividadRecienteCard";

export default function DashboardJefeScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDashboard = async () => {
    try {
      const response = await api.get("/jefe/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Error cargando dashboard jefe:", error);
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
  
  const { stats, rendimiento_pasantes, bitacoras_pendientes, actividades_recientes } = data;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5A8D" />
      <DashboardHeader
        firstName={user?.nombre}
        lastName={user?.ap_paterno}
        userName={user?.nombre_user}
        avatarUrl={user?.avatar_url}
        roleText="Jefe de Pasantía"
        navigation={navigation}
        menuItems={
          [
            {
              label: "👤 Mi Perfil",
              onPress: () => {
                navigation.navigate("PerfilJefe");
              },
            },
            {
              label: "🚪 Cerrar Sesión",
              isLogout: true,
              onPress: () => {
                Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Sí, cerrar sesión", onPress: async () => await logout() },
                ]);
              },
            },
          ]
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KPIs */}
        <Text style={styles.sectionTitle}>Resumen General</Text>
        <View style={styles.kpiContainer}>
          <KpiCard label="Pasantes Activos" value={stats.pasantes_activos} icon="👨‍🎓" color="#2A5A8D" />
          <KpiCard label="Pendientes" value={stats.actividades_pendientes} icon="⏳" color="#F59E0B" />
          <KpiCard label="Completadas" value={stats.actividades_completadas} icon="✅" color="#10B981" />
          <KpiCard label="Mensajes sin leer" value={stats.mensajes_no_leidos} icon="📩" color="#8B5CF6" />
        </View>

        {/* Accesos rápidos */}
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="📋"
            label="Mis Pasantías"
            onPress={() => navigation.navigate("MisPasantias")}
            color="#2A5A8D"
          />
          <QuickActionButton
            icon="👥"
            label="Mis Pasantes"
            onPress={() => navigation.navigate("MisPasantes")}
            color="#3890BB"
          />
          <QuickActionButton
            icon="📊"
            label="Bitácoras"
            onPress={() => navigation.navigate("Seguimiento")}
            color="#2A5A8D"
          />
          <QuickActionButton
            icon="📑"
            label="Informes Finales"
            onPress={() => navigation.navigate("Informes")}
            color="#3C9087"
          />
          <QuickActionButton
            icon="💬"
            label="Mensajes"
            onPress={() => navigation.navigate("MensajesJefe")}
            color="#8B5CF6"
          />
        </View>

        {/* Rendimiento de pasantes */}
        <Text style={styles.sectionTitle}>Rendimiento de Pasantes</Text>
        <View style={styles.cardContainer}>
          {rendimiento_pasantes.map((p, i) => (
            <ProgressBar key={i} label={p.nombre} progress={p.progreso} />
          ))}
        </View>

        {/* Bitácoras pendientes */}
        <Text style={styles.sectionTitle}>Bitácoras Pendientes</Text>
        {bitacoras_pendientes.length === 0 ? (
          <Text style={styles.emptyText}>No hay bitácoras pendientes</Text>
        ) : (
          bitacoras_pendientes.map((b) => (
            <BitacoraPendienteCard key={b.id} {...b} />
          ))
        )}

        {/* Actividades recientes */}
        <Text style={styles.sectionTitle}>Actividades Recientes</Text>
        {actividades_recientes.length === 0 ? (
          <Text style={styles.emptyText}>No hay actividades recientes</Text>
        ) : (
          actividades_recientes.map((a, i) => (
            <ActividadRecienteCard key={i} {...a} />
          ))
        )}
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
  cardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyText: { color: "#94A3B8", fontSize: 14, textAlign: "center", marginBottom: 15 },
});