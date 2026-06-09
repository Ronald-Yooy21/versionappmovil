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
import ModalApuntes from "../../components/Modals/ModalApuntes";
import ModalAutoEva from "../../components/Modals/ModalAutoEva";
import ModalVerEvaluacion from "../../components/Modals/ModalVerEvaluacion";

// Componente de tarjeta de actividad
const ActividadCard = ({
  actividad,
  onVerApuntes,
  onVerAutoEva,
  onVerEvaluacion,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getEstadoColor = () => {
    if (actividad.estado_actividad === "no_iniciada") return "#9ca3af";
    if (actividad.estado_actividad === "en_curso") return "#10b981";
    return "#ef4444";
  };

  const getEstadoTexto = () => {
    if (actividad.estado_actividad === "no_iniciada") return "No iniciada";
    if (actividad.estado_actividad === "en_curso") return "En curso";
    return "Finalizada";
  };

  const getEvaluacionEstado = () => {
    if (!actividad.evaluacion) return { texto: "Pendiente", color: "#f59e0b" };
    if (actividad.evaluacion.estado === "COMPLETADA")
      return { texto: "Completada", color: "#10b981" };
    if (actividad.evaluacion.estado === "COMPLETADA PARCIALMENTE")
      return { texto: "Realizado", color: "#f59e0b" };
    if (actividad.evaluacion.estado === "NO REALIZADA")
      return { texto: "No realizado", color: "#ef4444" };
    return { texto: "Sin calificar", color: "#6b7280" };
  };

  const puedeEditar = actividad.puede_editar;
  const evaluacionEstado = getEvaluacionEstado();

  return (
    <View style={styles.actividadCard}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles.actividadHeader}>
          <View style={styles.actividadHeaderLeft}>
            <Text style={styles.actividadNombre}>{actividad.nombre}</Text>
            <View
              style={[
                styles.estadoBadge,
                { backgroundColor: getEstadoColor() + "20" },
              ]}
            >
              <Text
                style={[styles.estadoBadgeText, { color: getEstadoColor() }]}
              >
                {getEstadoTexto()}
              </Text>
            </View>
          </View>
          <Text style={styles.expandIcon}>{expanded ? "▲" : "▼"}</Text>
        </View>

        <View style={styles.actividadFechas}>
          <Text style={styles.fechasText}>
            {toDisplayDate(actividad.fecha_ini)} →{" "}
            {toDisplayDate(actividad.fecha_fin)}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.actividadBody}>
          <Text style={styles.descripcion}>
            {actividad.descripcion || "Sin descripción"}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.apunteButton,
                !puedeEditar && styles.buttonDisabled,
              ]}
              onPress={() => onVerApuntes(actividad)}
            >
              <Text style={styles.apunteButtonText}>📝 Mis apuntes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.autoEvaButton,
                !puedeEditar && styles.buttonDisabled,
              ]}
              onPress={() => onVerAutoEva(actividad)}
            >
              <Text style={styles.autoEvaButtonText}>✍️ Autoevaluación</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.evaluacionContainer}>
            <View style={styles.evaluacionHeader}>
              <Text style={styles.evaluacionLabel}>Evaluación del jefe:</Text>
              <View
                style={[
                  styles.evaluacionBadge,
                  { backgroundColor: evaluacionEstado.color + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.evaluacionBadgeText,
                    { color: evaluacionEstado.color },
                  ]}
                >
                  {evaluacionEstado.texto}
                </Text>
              </View>
            </View>

            {actividad.evaluacion && actividad.evaluacion.nota !== null && (
              <>
                <Text style={styles.evaluacionNota}>
                  Nota: {actividad.evaluacion.nota}/100
                </Text>
                <TouchableOpacity
                  style={styles.verEvaluacionButton}
                  onPress={() => onVerEvaluacion(actividad)}
                >
                  <Text style={styles.verEvaluacionButtonText}>
                    Ver evaluación completa
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default function ActividadesScreen({ route, navigation }) {
  const { pasantiaId } = route.params;
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modales
  const [modalApuntes, setModalApuntes] = useState({
    visible: false,
    actividad: null,
  });
  const [modalAutoEva, setModalAutoEva] = useState({
    visible: false,
    actividad: null,
  });
  const [modalEvaluacion, setModalEvaluacion] = useState({
    visible: false,
    evaluacion: null,
  });

  const cargarActividades = async () => {
    try {
      const response = await api.get(`/pasante/actividades/${pasantiaId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error cargando actividades:", error);
      Alert.alert("Error", "No se pudieron cargar las actividades");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarActividades();
  }, [pasantiaId]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarActividades();
  };

  const handleVerApuntes = (actividad) => {
    setModalApuntes({ visible: true, actividad });
  };

  const handleVerAutoEva = (actividad) => {
    setModalAutoEva({ visible: true, actividad });
  };

  const handleVerEvaluacion = async (actividad) => {
    try {
      const response = await api.get(
        `/pasante/evaluacion-detalle/${actividad.id}`,
      );
      if (response.data.success) {
        setModalEvaluacion({
          visible: true,
          evaluacion: response.data.evaluacion,
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la evaluación");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Error al cargar los datos</Text>
      </SafeAreaView>
    );
  }

  const { pasantia, empresa, jefe, actividades } = data;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header de la pasantía */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{pasantia.nombre}</Text>
          <Text style={styles.empresaName}>{empresa.nombre}</Text>

          <View style={styles.headerInfo}>
            <Text style={styles.headerInfoText}>
              📅 {toDisplayDate(pasantia.fecha_ini)} →{" "}
              {toDisplayDate(pasantia.fecha_fin)}
            </Text>
            {jefe && (
              <Text style={styles.headerInfoText}>
                👔 Jefe: {jefe.ap_paterno} {jefe.ap_materno}, {jefe.nombre}
              </Text>
            )}
          </View>
        </View>

        {/* Lista de actividades */}
        <Text style={styles.actividadesTitle}>Actividades</Text>

        {actividades.length === 0 ? (
          <Text style={styles.emptyText}>No hay actividades registradas</Text>
        ) : (
          actividades.map((actividad) => (
            <ActividadCard
              key={actividad.id}
              actividad={actividad}
              onVerApuntes={handleVerApuntes}
              onVerAutoEva={handleVerAutoEva}
              onVerEvaluacion={handleVerEvaluacion}
            />
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modales */}
      <ModalApuntes
        visible={modalApuntes.visible}
        onClose={() => setModalApuntes({ visible: false, actividad: null })}
        actividad={modalApuntes.actividad}
        readOnly={!modalApuntes.actividad?.puede_editar}
        onRefresh={cargarActividades}
      />

      <ModalAutoEva
        visible={modalAutoEva.visible}
        onClose={() => setModalAutoEva({ visible: false, actividad: null })}
        actividad={modalAutoEva.actividad}
        readOnly={!modalAutoEva.actividad?.puede_editar}
        onRefresh={cargarActividades}
      />

      <ModalVerEvaluacion
        visible={modalEvaluacion.visible}
        onClose={() => setModalEvaluacion({ visible: false, evaluacion: null })}
        evaluacion={modalEvaluacion.evaluacion}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#2A5A8D",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  empresaName: { fontSize: 14, color: "#fff", opacity: 0.8, marginBottom: 12 },
  headerInfo: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 12,
    marginTop: 4,
  },
  headerInfoText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 4,
  },
  actividadesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a2a3a",
    marginBottom: 16,
  },
  actividadCard: {
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
  actividadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actividadHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actividadNombre: { fontSize: 16, fontWeight: "600", color: "#333", flex: 1 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  estadoBadgeText: { fontSize: 11, fontWeight: "500" },
  expandIcon: { fontSize: 16, color: "#666", padding: 4 },
  actividadFechas: { marginBottom: 4 },
  fechasText: { fontSize: 12, color: "#666" },
  actividadBody: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  descripcion: {
    fontSize: 13,
    color: "#555",
    marginBottom: 16,
    lineHeight: 18,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  apunteButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  apunteButtonText: { fontSize: 13, fontWeight: "500", color: "#333" },
  autoEvaButton: {
    flex: 1,
    backgroundColor: "#dbeafe",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  autoEvaButtonText: { fontSize: 13, fontWeight: "500", color: "#1e40af" },
  buttonDisabled: { opacity: 0.5 },
  evaluacionContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  evaluacionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  evaluacionLabel: { fontSize: 12, fontWeight: "500", color: "#666" },
  evaluacionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  evaluacionBadgeText: { fontSize: 11, fontWeight: "500" },
  evaluacionNota: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2A5A8D",
    marginBottom: 8,
  },
  verEvaluacionButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  verEvaluacionButtonText: { fontSize: 12, color: "#333" },
  emptyText: { textAlign: "center", color: "#999", padding: 40 },
  bottomSpacing: { height: 40 },
});
