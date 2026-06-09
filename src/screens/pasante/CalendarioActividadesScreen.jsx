import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";

// Componente de tarjeta de actividad
const ActividadCard = ({ actividad, onVerActividad }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onVerActividad(actividad.pasantia_id)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.actividadNombre}>{actividad.nombre}</Text>
        <Text style={styles.actividadFechas}>
          📅 {toDisplayDate(actividad.fecha_ini)} →{" "}
          {toDisplayDate(actividad.fecha_fin)}
        </Text>
        <View style={styles.pasantiaTag}>
          <Text style={styles.pasantiaTagText}>
            🏷️Pasantía: {actividad.pasantia_nombre}
          </Text>
        </View>
        <View style={styles.verContainer}>
          <Text style={styles.verText}>Gestionar Actividad→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CalendarioActividadesScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("por_iniciar");
  const [data, setData] = useState({
    por_iniciar: [],
    en_curso: [],
    finalizadas: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarActividades = async () => {
    try {
      const response = await api.get("/pasante/calendario/actividades");
      setData(response.data);
    } catch (error) {
      console.error("Error cargando calendario:", error);
      Alert.alert("Error", "No se pudieron cargar las actividades");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarActividades();
  };

  const handleVerActividad = (pasantiaId) => {
    navigation.navigate("Actividades", { pasantiaId });
  };

  // Configuración de tabs con contadores
  const tabs = [
    {
      key: "por_iniciar",
      label: "Por iniciar",
      icon: "📅",
      count: data.por_iniciar.length,
      color: "#f59e0b",
    },
    {
      key: "en_curso",
      label: "En curso",
      icon: "⚡",
      count: data.en_curso.length,
      color: "#10b981",
    },
    {
      key: "finalizadas",
      label: "Finalizadas",
      icon: "✅",
      count: data.finalizadas.length,
      color: "#6b7280",
    },
  ];

  const currentData = () => {
    if (activeTab === "por_iniciar") return data.por_iniciar;
    if (activeTab === "en_curso") return data.en_curso;
    return data.finalizadas;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendario de Actividades</Text>
          <Text style={styles.headerSubtitle}>
            Todas tus actividades organizadas por fecha
          </Text>
        </View>

        {/* Tabs con contadores */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.icon} {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de actividades */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {currentData().length === 0 ? (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>
                No hay actividades en esta categoría
              </Text>
            </View>
          ) : (
            currentData().map((actividad, index) => (
              <ActividadCard
                key={`${actividad.id}_${actividad.pasantia_id}_${index}`}
                actividad={actividad}
                onVerActividad={handleVerActividad}
              />
            ))
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1a2a3a" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  tabsContainer: { flexDirection: "row", marginBottom: 16, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  tabActive: { backgroundColor: "#2A5A8D" },
  tabText: { fontSize: 12, fontWeight: "500", color: "#666" },
  tabTextActive: { color: "#fff" },
  scrollView: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: { gap: 8 },
  actividadNombre: { fontSize: 16, fontWeight: "bold", color: "#1a2a3a" },
  actividadFechas: { fontSize: 12, color: "#666" },
  pasantiaTag: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pasantiaTagText: { fontSize: 11, color: "#555" },
  verContainer: { alignItems: "flex-end", marginTop: 8 },
  verText: { fontSize: 13, color: "#2A5A8D", fontWeight: "500" },
  emptyListContainer: { alignItems: "center", padding: 40 },
  emptyListText: { fontSize: 14, color: "#999", textAlign: "center" },
  bottomSpacing: { height: 20 },
});
