import React, { useState, useEffect, useCallback } from "react";
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
  TextInput,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";
import ModalHorario from "../../components/Modals/ModalHorario";
import ModalActividadesPasantia from "../../components/Modals/ModalActividadesPasantia";
import ModalInscritos from "../../components/Modals/ModalInscritos";
import ModalAsignarJefe from "../../components/Modals/ModalAsignarJefe";
import ModalConfirmacion from "../../components/Modals/ModalConfirmacion";

// Componente de tarjeta de pasantía
const PasantiaCard = ({ pasantia, onRefresh, isGerente }) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingCupos, setLoadingCupos] = useState(false);

  // Estados para modales
  const [modalHorario, setModalHorario] = useState({ visible: false });
  const [modalActividades, setModalActividades] = useState({ visible: false });
  const [modalInscritos, setModalInscritos] = useState({ visible: false });
  const [modalAsignarJefe, setModalAsignarJefe] = useState({ visible: false });
  const [modalConfirm, setModalConfirm] = useState({
    visible: false,
    accion: "",
    mensaje: "",
  });

  const getEstadoColor = () => {
    if (pasantia.estado === "ABIERTA")
      return { bg: "#dcfce7", text: "#166534" };
    if (pasantia.estado === "INICIADO")
      return { bg: "#dbeafe", text: "#1e40af" };
    return { bg: "#f3f4f6", text: "#374151" };
  };

  const getEstadoTexto = () => {
    if (pasantia.estado === "ABIERTA") return "Inscripción Abierta";
    if (pasantia.estado === "INICIADO") return "Iniciado - Inscripción Cerrada";
    return "Finalizado";
  };

  const formatRangoFechas = () => {
    if (!pasantia.fecha_ini || !pasantia.fecha_fin) return "";
    return `${toDisplayDate(pasantia.fecha_ini)} → ${toDisplayDate(pasantia.fecha_fin)}`;
  };

  const handleCuposChange = async (incremento) => {
    const nuevoCupos = pasantia.cupos + incremento;
    if (nuevoCupos < pasantia.inscritos) {
      Alert.alert(
        "Error",
        `No puedes reducir los cupos por debajo de los inscritos (${pasantia.inscritos})`,
      );
      return;
    }

    setLoadingCupos(true);
    try {
      await api.patch(`/gerente/pasantias/${pasantia.id}/cupos`, {
        cupos: nuevoCupos,
      });
      onRefresh();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al actualizar cupos",
      );
    } finally {
      setLoadingCupos(false);
    }
  };

  const handleAbrirInscripcion = async () => {
    try {
      await api.patch(`/gerente/pasantias/${pasantia.id}/abrir`);
      onRefresh();
      setModalConfirm({ ...modalConfirm, visible: false });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al abrir inscripciones",
      );
    }
  };

  const handleCerrarInscripcion = async () => {
    try {
      await api.patch(`/gerente/pasantias/${pasantia.id}/iniciar`);
      onRefresh();
      setModalConfirm({ ...modalConfirm, visible: false });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al cerrar inscripciones",
      );
    }
  };

  const confirmarAccion = () => {
    if (modalConfirm.accion === "abrir") handleAbrirInscripcion();
    if (modalConfirm.accion === "cerrar") handleCerrarInscripcion();
  };

  const estadoColor = getEstadoColor();

  return (
    <>
      <View style={styles.card}>
        {/* Header de la tarjeta */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle}>{pasantia.nombre}</Text>
            <View
              style={[styles.estadoBadge, { backgroundColor: estadoColor.bg }]}
            >
              <Text style={[styles.estadoText, { color: estadoColor.text }]}>
                {getEstadoTexto()}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.expandIcon}>{expanded ? "▲" : "▼"}</Text>
          </TouchableOpacity>
        </View>

        {/* Información siempre visible */}
        <View style={styles.cardBody}>
          <Text style={styles.mencion}>{pasantia.mencion}</Text>
          <Text style={styles.fechas}>{formatRangoFechas()}</Text>
        </View>

        {/* Sección expandible */}
        {expanded && (
          <View style={styles.expandedSection}>
            {/* Horario y Fechas */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setModalHorario({ visible: true, data: pasantia })}
            >
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Horario y Fechas</Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            {/* Actividades */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                setModalActividades({ visible: true, data: pasantia })
              }
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>Actividades</Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            {/* Jefe de Pasantía */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                setModalAsignarJefe({ visible: true, data: pasantia })
              }
            >
              <Text style={styles.actionIcon}>👔</Text>
              <Text style={styles.actionText}>
                Jefe de Pasantía:{" "}
                {pasantia.jefe_asignado
                  ? `${pasantia.jefe_asignado.ap_paterno}, ${pasantia.jefe_asignado.nombre}`
                  : "No asignado"}
              </Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            {/* Pasantes Inscritos */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                setModalInscritos({ visible: true, data: pasantia })
              }
            >
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>
                Pasantes Inscritos ({pasantia.inscritos || 0})
              </Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            {/* Cupos Disponibles */}
            <View style={styles.cuposRow}>
              <Text style={styles.actionIcon}>🎫</Text>
              <Text style={styles.actionText}>Cupos Disponibles</Text>
              <View style={styles.cuposButtons}>
                <TouchableOpacity
                  style={styles.cuposBtn}
                  onPress={() => handleCuposChange(-1)}
                  disabled={
                    loadingCupos || pasantia.cupos <= pasantia.inscritos
                  }
                >
                  <Text style={styles.cuposBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.cuposValue}>
                  {pasantia.cupos_disponibles}
                </Text>
                <TouchableOpacity
                  style={styles.cuposBtn}
                  onPress={() => handleCuposChange(1)}
                  disabled={loadingCupos}
                >
                  <Text style={styles.cuposBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Estado de Inscripción */}
            <View style={styles.actionRow}>
              <Text style={styles.actionIcon}>🔓</Text>
              <Text style={styles.actionText}>Estado de Inscripción</Text>
              {pasantia.estado === "ABIERTA" ? (
                <TouchableOpacity
                  style={[styles.estadoBtn, styles.cerrarBtn]}
                  onPress={() =>
                    setModalConfirm({
                      visible: true,
                      accion: "cerrar",
                      mensaje:
                        "¿Estás seguro de cerrar las inscripciones? Ya no se podrán inscribir más pasantes.",
                    })
                  }
                >
                  <Text style={styles.estadoBtnText}>Cerrar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.estadoBtn, styles.abrirBtn]}
                  onPress={() =>
                    setModalConfirm({
                      visible: true,
                      accion: "abrir",
                      mensaje:
                        "¿Estás seguro de abrir las inscripciones? Los pasantes podrán inscribirse.",
                    })
                  }
                >
                  <Text style={styles.estadoBtnText}>Abrir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Modales */}
      <ModalHorario
        visible={modalHorario.visible}
        onClose={() => setModalHorario({ visible: false })}
        pasantia={modalHorario.data}
      />

      <ModalActividadesPasantia
        visible={modalActividades.visible}
        onClose={() => setModalActividades({ visible: false })}
        pasantia={modalActividades.data}
        onRefresh={onRefresh}
      />

      <ModalInscritos
        visible={modalInscritos.visible}
        onClose={() => setModalInscritos({ visible: false })}
        pasantia={modalInscritos.data}
        onRefresh={onRefresh}
      />

      <ModalAsignarJefe
        visible={modalAsignarJefe.visible}
        onClose={() => setModalAsignarJefe({ visible: false })}
        pasantia={modalAsignarJefe.data}
        onRefresh={onRefresh}
      />

      <ModalConfirmacion
        visible={modalConfirm.visible}
        onClose={() =>
          setModalConfirm({ visible: false, accion: "", mensaje: "" })
        }
        onConfirm={confirmarAccion}
        title="Confirmar"
        message={modalConfirm.mensaje}
        confirmText="Confirmar"
        type="warning"
      />
    </>
  );
};

export default function PasantiasScreen({ navigation }) {
  const { user } = useAuth();
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("abiertas");
  const [searchTerm, setSearchTerm] = useState("");

  const cargarPasantias = async () => {
    try {
      const response = await api.get("/gerente/pasantias");
      setPasantias(response.data);
    } catch (error) {
      console.error("Error cargando pasantías:", error);
      Alert.alert("Error", "No se pudieron cargar las pasantías");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPasantias();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarPasantias();
  };

  // Filtrar pasantías (excluir FINALIZADO)
  const pasantiasFiltradas = pasantias.filter((p) => p.estado !== "FINALIZADO");

  // Separar por estado (ABIERTA vs INICIADO)

  const pasantiasAbiertas = pasantiasFiltradas
    .filter((p) => p.estado === "ABIERTA")
    .filter((p) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const pasantiasCerradas = pasantiasFiltradas
    .filter((p) => p.estado === "INICIADO")
    .filter((p) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentData =
    activeTab === "abiertas" ? pasantiasAbiertas : pasantiasCerradas;

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestión de Pasantías</Text>
          <Text style={styles.headerSubtitle}>
            Administra tus pasantías publicadas e iniciadas
          </Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar por nombre..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "abiertas" && styles.tabActive]}
            onPress={() => setActiveTab("abiertas")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "abiertas" && styles.tabTextActive,
              ]}
            >
              Pasantías Abiertas ({pasantiasAbiertas.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "cerradas" && styles.tabActive]}
            onPress={() => setActiveTab("cerradas")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "cerradas" && styles.tabTextActive,
              ]}
            >
              Pasantías Cerradas ({pasantiasCerradas.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de pasantías */}
        {currentData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay pasantías en esta categoría
            </Text>
          </View>
        ) : (
          currentData.map((pasantia) => (
            <PasantiaCard
              key={pasantia.id}
              pasantia={pasantia}
              onRefresh={onRefresh}
            />
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  searchContainer: { marginBottom: 16 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tabsContainer: { flexDirection: "row", marginBottom: 16, gap: 12 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  tabActive: { backgroundColor: "#2A5A8D" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#666" },
  tabTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardHeaderLeft: { flex: 1, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1a2a3a" },
  estadoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: { fontSize: 11, fontWeight: "500" },
  expandIcon: { fontSize: 18, color: "#666", padding: 8 },
  cardBody: { padding: 16, gap: 8 },
  mencion: { fontSize: 13, color: "#2A5A8D", fontWeight: "500" },
  fechas: { fontSize: 12, color: "#666" },
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    padding: 16,
    gap: 16,
  },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  actionIcon: { fontSize: 20 },
  actionText: { flex: 1, fontSize: 14, color: "#333" },
  actionArrow: { fontSize: 16, color: "#999" },
  cuposRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  cuposButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  cuposBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  cuposBtnText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cuposValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  estadoBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  abrirBtn: { backgroundColor: "#10b981" },
  cerrarBtn: { backgroundColor: "#ef4444" },
  estadoBtnText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#999", textAlign: "center" },
  bottomSpacing: { height: 40 },
});
