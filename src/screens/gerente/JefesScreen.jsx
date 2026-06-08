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
  TextInput,
  Switch,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";
import ModalPasantesAsignados from "../../components/Modals/ModalPasantesAsignados";
import ModalConfirmacion from "../../components/Modals/ModalConfirmacion";

// Componente de tarjeta para Jefe Pasante
const JefeCard = ({ jefe, onToggleEstado, onVerPasantes }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {jefe.ap_paterno} {jefe.ap_materno}, {jefe.nombre}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.detailText}>📄 CI: {jefe.ci}</Text>
        <Text style={styles.detailText}>📞 {jefe.numero_cel}</Text>
        <Text style={styles.detailText}>📧 {jefe.correo}</Text>
        <Text style={styles.detailText}>💼 Cargo: {jefe.cargo}</Text>
        {jefe.area && (
          <Text style={styles.detailText}>🏢 Área: {jefe.area}</Text>
        )}
        <Text style={styles.detailText}>
          📅 Registro: {toDisplayDate(jefe.fecha_registro)}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        {/* Estado con Switch */}
        <View style={styles.estadoContainer}>
          <Text
            style={[
              styles.estadoText,
              jefe.estado_cuenta ? styles.activo : styles.inactivo,
            ]}
          >
            {jefe.estado_cuenta ? "Activo" : "Inactivo"}
          </Text>
          <Switch
            value={jefe.estado_cuenta}
            onValueChange={() => onToggleEstado(jefe)}
            trackColor={{ false: "#e5e7eb", true: "#10b981" }}
            thumbColor="#fff"
          />
        </View>

        {/* Botón Ver Pasantes */}
        <TouchableOpacity
          style={styles.pasantesButton}
          onPress={() => onVerPasantes(jefe)}
        >
          <Text style={styles.pasantesButtonText}>
            👥 Ver Pasantes ({jefe.pasantes_asignados})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente de tarjeta para Solicitud
const SolicitudCard = ({ solicitud, onAprobar, onRechazar }) => {
  const esPendiente = solicitud.estado_aprobacion === "pendiente";

  return (
    <View style={[styles.card, !esPendiente && styles.cardRechazada]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {solicitud.ap_paterno} {solicitud.ap_materno}, {solicitud.nombre}
        </Text>
        <View
          style={[
            styles.estadoBadge,
            esPendiente ? styles.pendienteBadge : styles.rechazadoBadge,
          ]}
        >
          <Text style={styles.estadoBadgeText}>
            {esPendiente ? "Pendiente" : "Rechazado"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.detailText}>📄 CI: {solicitud.ci}</Text>
        <Text style={styles.detailText}>📞 {solicitud.numero_cel}</Text>
        <Text style={styles.detailText}>📧 {solicitud.correo}</Text>
        <Text style={styles.detailText}>💼 Cargo: {solicitud.cargo}</Text>
        {solicitud.area && (
          <Text style={styles.detailText}>🏢 Área: {solicitud.area}</Text>
        )}
        <Text style={styles.detailText}>
          📅 Registro: {toDisplayDate(solicitud.fecha_registro)}
        </Text>
      </View>

      {esPendiente && (
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.actionButton, styles.aprobarButton]}
            onPress={() => onAprobar(solicitud)}
          >
            <Text style={styles.actionButtonText}>✅ Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rechazarButton]}
            onPress={() => onRechazar(solicitud)}
          >
            <Text style={styles.actionButtonText}>❌ Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function JefesScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("jefes");
  const [jefes, setJefes] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterEstadoJefes, setFilterEstadoJefes] = useState("activos");
  const [filterEstadoSolicitudes, setFilterEstadoSolicitudes] =
    useState("pendientes");
  const [searchTerm, setSearchTerm] = useState("");

  // Modales
  const [modalPasantes, setModalPasantes] = useState({
    visible: false,
    jefe: null,
  });
  const [modalConfirm, setModalConfirm] = useState({
    visible: false,
    accion: "",
    data: null,
    mensaje: "",
  });

  const cargarJefes = async () => {
    try {
      const response = await api.get("/gerente/jefes");
      setJefes(response.data);
    } catch (error) {
      console.error("Error cargando jefes:", error);
      Alert.alert("Error", "No se pudieron cargar los jefes");
    }
  };

  const cargarSolicitudes = async () => {
    try {
      const response = await api.get("/gerente/jefes/solicitudes");
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      Alert.alert("Error", "No se pudieron cargar las solicitudes");
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    await Promise.all([cargarJefes(), cargarSolicitudes()]);
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const handleToggleEstado = async (jefe) => {
    setModalConfirm({
      visible: true,
      accion: "toggle",
      data: jefe,
      mensaje: jefe.estado_cuenta
        ? `¿Estás seguro de desactivar a ${jefe.ap_paterno} ${jefe.nombre}?`
        : `¿Estás seguro de activar a ${jefe.ap_paterno} ${jefe.nombre}?`,
    });
  };

  const confirmToggleEstado = async () => {
    try {
      await api.patch(`/gerente/jefes/${modalConfirm.data.id}/toggle-estado`);
      await cargarJefes();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al cambiar estado",
      );
    } finally {
      setModalConfirm({ visible: false, accion: "", data: null, mensaje: "" });
    }
  };

  const handleAprobar = async (solicitud) => {
    setModalConfirm({
      visible: true,
      accion: "aprobar",
      data: solicitud,
      mensaje: `¿Estás seguro de aprobar la solicitud de ${solicitud.ap_paterno} ${solicitud.nombre}?`,
    });
  };

  const confirmAprobar = async () => {
    try {
      await api.patch(
        `/gerente/jefes/solicitudes/${modalConfirm.data.id}/aprobar`,
      );
      await cargarSolicitudes();
      await cargarJefes();
      Alert.alert("Éxito", "Solicitud aprobada correctamente");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Error al aprobar");
    } finally {
      setModalConfirm({ visible: false, accion: "", data: null, mensaje: "" });
    }
  };

  const handleRechazar = async (solicitud) => {
    setModalConfirm({
      visible: true,
      accion: "rechazar",
      data: solicitud,
      mensaje: `¿Estás seguro de rechazar la solicitud de ${solicitud.ap_paterno} ${solicitud.nombre}?`,
    });
  };

  const confirmRechazar = async () => {
    try {
      await api.patch(
        `/gerente/jefes/solicitudes/${modalConfirm.data.id}/rechazar`,
      );
      await cargarSolicitudes();
      Alert.alert("Éxito", "Solicitud rechazada");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al rechazar",
      );
    } finally {
      setModalConfirm({ visible: false, accion: "", data: null, mensaje: "" });
    }
  };

  // Filtros
  const jefesFiltrados = jefes
    .filter((j) =>
      filterEstadoJefes === "activos" ? j.estado_cuenta : !j.estado_cuenta,
    )
    .filter((j) =>
      `${j.ap_paterno} ${j.ap_materno} ${j.nombre}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

  const solicitudesFiltradas = solicitudes
    .filter((s) =>
      filterEstadoSolicitudes === "pendientes"
        ? s.estado_aprobacion === "pendiente"
        : s.estado_aprobacion === "rechazado",
    )
    .filter((s) =>
      `${s.ap_paterno} ${s.ap_materno} ${s.nombre}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

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
          <Text style={styles.headerTitle}>Jefes de Pasantes</Text>
          <Text style={styles.headerSubtitle}>
            Gestiona los jefes de tu empresa
          </Text>
        </View>

        {/* Buscador */}
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por nombre..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Tabs principales */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "jefes" && styles.tabActive]}
            onPress={() => setActiveTab("jefes")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "jefes" && styles.tabTextActive,
              ]}
            >
              Jefes Pasantes ({jefes.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "solicitudes" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("solicitudes")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "solicitudes" && styles.tabTextActive,
              ]}
            >
              Solicitudes ({solicitudes.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido según tab activa */}
        {activeTab === "jefes" ? (
          <>
            {/* Sub-tabs para estado */}
            <View style={styles.subTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  filterEstadoJefes === "activos" && styles.subTabActive,
                ]}
                onPress={() => setFilterEstadoJefes("activos")}
              >
                <Text
                  style={[
                    styles.subTabText,
                    filterEstadoJefes === "activos" && styles.subTabTextActive,
                  ]}
                >
                  Activos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  filterEstadoJefes === "inactivos" && styles.subTabActive,
                ]}
                onPress={() => setFilterEstadoJefes("inactivos")}
              >
                <Text
                  style={[
                    styles.subTabText,
                    filterEstadoJefes === "inactivos" &&
                      styles.subTabTextActive,
                  ]}
                >
                  Inactivos
                </Text>
              </TouchableOpacity>
            </View>

            {jefesFiltrados.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay jefes en esta categoría
              </Text>
            ) : (
              jefesFiltrados.map((jefe) => (
                <JefeCard
                  key={jefe.id}
                  jefe={jefe}
                  onToggleEstado={handleToggleEstado}
                  onVerPasantes={(j) =>
                    setModalPasantes({ visible: true, jefe: j })
                  }
                />
              ))
            )}
          </>
        ) : (
          <>
            {/* Sub-tabs para estado */}
            <View style={styles.subTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  filterEstadoSolicitudes === "pendientes" &&
                    styles.subTabActive,
                ]}
                onPress={() => setFilterEstadoSolicitudes("pendientes")}
              >
                <Text
                  style={[
                    styles.subTabText,
                    filterEstadoSolicitudes === "pendientes" &&
                      styles.subTabTextActive,
                  ]}
                >
                  Pendientes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  filterEstadoSolicitudes === "rechazados" &&
                    styles.subTabActive,
                ]}
                onPress={() => setFilterEstadoSolicitudes("rechazados")}
              >
                <Text
                  style={[
                    styles.subTabText,
                    filterEstadoSolicitudes === "rechazados" &&
                      styles.subTabTextActive,
                  ]}
                >
                  Rechazados
                </Text>
              </TouchableOpacity>
            </View>

            {solicitudesFiltradas.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay solicitudes en esta categoría
              </Text>
            ) : (
              solicitudesFiltradas.map((solicitud) => (
                <SolicitudCard
                  key={solicitud.id}
                  solicitud={solicitud}
                  onAprobar={handleAprobar}
                  onRechazar={handleRechazar}
                />
              ))
            )}
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal de pasantes asignados */}
      <ModalPasantesAsignados
        visible={modalPasantes.visible}
        onClose={() => setModalPasantes({ visible: false, jefe: null })}
        jefe={modalPasantes.jefe}
      />

      {/* Modal de confirmación */}
      <ModalConfirmacion
        visible={modalConfirm.visible}
        onClose={() =>
          setModalConfirm({
            visible: false,
            accion: "",
            data: null,
            mensaje: "",
          })
        }
        onConfirm={() => {
          if (modalConfirm.accion === "toggle") confirmToggleEstado();
          if (modalConfirm.accion === "aprobar") confirmAprobar();
          if (modalConfirm.accion === "rechazar") confirmRechazar();
        }}
        title="Confirmar"
        message={modalConfirm.mensaje}
        confirmText={
          modalConfirm.accion === "toggle"
            ? modalConfirm.data?.estado_cuenta
              ? "Desactivar"
              : "Activar"
            : modalConfirm.accion === "aprobar"
              ? "Aprobar"
              : "Rechazar"
        }
        type={modalConfirm.accion === "rechazar" ? "danger" : "warning"}
      />
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
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
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
  subTabsContainer: { flexDirection: "row", marginBottom: 16, gap: 12 },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  subTabActive: { backgroundColor: "#e5e7eb" },
  subTabText: { fontSize: 13, fontWeight: "500", color: "#666" },
  subTabTextActive: { color: "#2A5A8D" },
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
  cardRechazada: { opacity: 0.7 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1a2a3a", flex: 1 },
  cardBody: { padding: 16, gap: 6 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  detailText: { fontSize: 13, color: "#555" },
  estadoContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  estadoText: { fontSize: 13, fontWeight: "500" },
  activo: { color: "#10b981" },
  inactivo: { color: "#ef4444" },
  pasantesButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pasantesButtonText: { fontSize: 12, fontWeight: "500", color: "#333" },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pendienteBadge: { backgroundColor: "#fef3c7" },
  rechazadoBadge: { backgroundColor: "#fee2e2" },
  estadoBadgeText: { fontSize: 11, fontWeight: "500", color: "#92400e" },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  aprobarButton: { backgroundColor: "#10b981" },
  rechazarButton: { backgroundColor: "#ef4444" },
  actionButtonText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  emptyText: { textAlign: "center", color: "#999", padding: 40 },
  bottomSpacing: { height: 40 },
});
