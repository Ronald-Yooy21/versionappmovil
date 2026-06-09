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
import ModalDetallesEmpresa from "../../components/Modals/ModalDetallesEmpresa";
import ModalHorario from "../../components/Modals/ModalHorario";
import ModalCompaneros from "../../components/Modals/ModalCompaneros";

// Componente de tarjeta de pasantía inscrita
const PasantiaInscritaCard = ({
  inscripcion,
  onVerActividades,
  onVerHorario,
  onVerEmpresa,
  onVerCompaneros,
}) => {
  const p = inscripcion.pasantia;
  const empresa = inscripcion.empresa;
  const jefe = inscripcion.jefe;

  const getEstadoColor = () => {
    if (inscripcion.estado_inscripcion === "iniciado") return "#10b981";
    return "#f59e0b";
  };

  const getEstadoTexto = () => {
    if (inscripcion.estado_inscripcion === "iniciado") return "EN CURSO";
    return "INSCRITO";
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{p.nombre}</Text>
      </View>

      <TouchableOpacity onPress={() => onVerEmpresa(empresa)}>
        <Text style={styles.empresaLink}>🏢 {empresa.nombre}</Text>
      </TouchableOpacity>

      <View style={styles.estadoContainer}>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: getEstadoColor() + "20" },
          ]}
        >
          <Text style={[styles.estadoText, { color: getEstadoColor() }]}>
            {getEstadoTexto()}
          </Text>
        </View>
      </View>

      <View style={styles.fechasContainer}>
        <Text style={styles.fechasText}>
          📅 {toDisplayDate(p.fecha_ini)} → {toDisplayDate(p.fecha_fin)}
        </Text>
      </View>

      <View style={styles.jefeContainer}>
        <Text style={styles.jefeLabel}>👔 Jefe:</Text>
        <Text style={styles.jefeValue}>
          {jefe
            ? `${jefe.ap_paterno} ${jefe.ap_materno}, ${jefe.nombre}`
            : "No asignado"}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onVerActividades(p.id)}
        >
          <Text style={styles.actionButtonText}>📋 Actividades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onVerHorario(p)}
        >
          <Text style={styles.actionButtonText}>⏰ Horario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onVerCompaneros(p.id, p.nombre)}
        >
          <Text style={styles.actionButtonText}>👥 Compañeros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function InscripcionesActivasScreen({ navigation }) {
  const { user } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modales
  const [modalEmpresa, setModalEmpresa] = useState({
    visible: false,
    empresa: null,
  });
  const [modalHorario, setModalHorario] = useState({
    visible: false,
    pasantia: null,
  });
  const [modalCompaneros, setModalCompaneros] = useState({
    visible: false,
    pasantiaId: null,
    pasantiaNombre: null,
  });

  const cargarInscripciones = async () => {
    try {
      const response = await api.get("/pasante/inscripciones/activas");
      setInscripciones(response.data);
    } catch (error) {
      console.error("Error cargando inscripciones:", error);
      Alert.alert("Error", "No se pudieron cargar las pasantías inscritas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarInscripciones();
  };

  const handleVerActividades = (pasantiaId) => {
    navigation.navigate("Actividades", { pasantiaId });
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
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pasantías Inscritas</Text>
          <Text style={styles.headerSubtitle}>
            {inscripciones.length === 0
              ? "Aún no te has inscrito a ninguna pasantía"
              : `Tienes ${inscripciones.length} pasantía(s) activa(s)`}
          </Text>
        </View>

        {inscripciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay pasantías inscritas</Text>
            <TouchableOpacity
              style={styles.inscribirButton}
              onPress={() => navigation.navigate("Inscribirse")}
            >
              <Text style={styles.inscribirButtonText}>
                Ver pasantías disponibles
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          inscripciones.map((inscripcion) => (
            <PasantiaInscritaCard
              key={inscripcion.id_inscripcion}
              inscripcion={inscripcion}
              onVerActividades={handleVerActividades}
              onVerHorario={(p) =>
                setModalHorario({ visible: true, pasantia: p })
              }
              onVerEmpresa={(e) =>
                setModalEmpresa({ visible: true, empresa: e })
              }
              onVerCompaneros={(id, nombre) =>
                setModalCompaneros({
                  visible: true,
                  pasantiaId: id,
                  pasantiaNombre: nombre,
                })
              }
            />
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modales */}
      <ModalDetallesEmpresa
        visible={modalEmpresa.visible}
        onClose={() => setModalEmpresa({ visible: false, empresa: null })}
        empresa={modalEmpresa.empresa}
      />

      <ModalHorario
        visible={modalHorario.visible}
        onClose={() => setModalHorario({ visible: false, pasantia: null })}
        pasantia={modalHorario.pasantia}
      />

      <ModalCompaneros
        visible={modalCompaneros.visible}
        onClose={() =>
          setModalCompaneros({
            visible: false,
            pasantiaId: null,
            pasantiaNombre: null,
          })
        }
        pasantiaId={modalCompaneros.pasantiaId}
        pasantiaNombre={modalCompaneros.pasantiaNombre}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#1a2a3a" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  emptyContainer: { alignItems: "center", padding: 40 },
  emptyText: { fontSize: 16, color: "#999", marginBottom: 20 },
  inscribirButton: {
    backgroundColor: "#2A5A8D",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  inscribirButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { marginBottom: 8 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#1a2a3a" },
  empresaLink: {
    fontSize: 14,
    color: "#2A5A8D",
    fontWeight: "500",
    marginBottom: 12,
  },
  estadoContainer: { marginBottom: 12 },
  estadoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: { fontSize: 12, fontWeight: "bold" },
  fechasContainer: { marginBottom: 8 },
  fechasText: { fontSize: 13, color: "#666" },
  jefeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  jefeLabel: { fontSize: 13, color: "#666", width: 55 },
  jefeValue: { flex: 1, fontSize: 13, color: "#333", fontWeight: "500" },

  // ─── AQUÍ ESTÁN LOS CAMBIOS ──────────────────────────────────
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, // Bajé un poco el gap para que no sature pantallas pequeñas
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 4, // Evita que el texto toque los bordes en pantallas chicas
    borderRadius: 12,
    alignItems: "center", // Centra horizontalmente (X)
    justifyContent: "center", // ¡FALTABA ESTE! Centra verticalmente (Y)
  },
  actionButtonText: {
    fontSize: 13, // Bajado a 13 para asegurar que "📋 Actividades" entre sin romperse
    fontWeight: "600",
    color: "#333",
    textAlign: "center", // Asegura el centrado si el texto llega a dar un salto de línea
  },
  // ─────────────────────────────────────────────────────────────

  bottomSpacing: { height: 40 },
});
