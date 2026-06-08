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
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";
import ModalDetallesEmpresa from "../../components/Modals/ModalDetallesEmpresa";
import ModalHorario from "../../components/Modals/ModalHorario";
import ModalActividadesPasante from "../../components/Modals/ModalActividadesPasante";
import ModalScoreEmpresa from "../../components/Modals/ModalScoreEmpresa";
import ModalConfirmacion from "../../components/Modals/ModalConfirmacion";

// Componente de tarjeta de pasantía
const PasantiaCard = ({
  pasantia,
  onInscribirse,
  onVerEmpresa,
  onVerHorario,
  onVerActividades,
  onVerCalificaciones,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getBotonColor = () => {
    if (!pasantia.boton_habilitado) return "#9ca3af";
    return "#10b981";
  };

  const formatRangoFechas = () => {
    if (!pasantia.fecha_ini || !pasantia.fecha_fin) return "";
    return `${toDisplayDate(pasantia.fecha_ini)} → ${toDisplayDate(pasantia.fecha_fin)}`;
  };

  return (
    <View style={styles.card}>
      {/* Header siempre visible */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{pasantia.nombre}</Text>
        <TouchableOpacity onPress={() => onVerEmpresa(pasantia.empresa)}>
          <Text style={styles.empresaLink}>🏢 {pasantia.empresa.nombre}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.badgeContainer}>
          <Text style={styles.mencionBadge}>{pasantia.mencion}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.cuposBadge}>
            {pasantia.cupos_disponibles} Cupos Disponibles
          </Text>
        </View>

        <View style={styles.fechasContainer}>
          <Text style={styles.fechasText}>{formatRangoFechas()}</Text>
        </View>
      </View>

      {/* Botón expandir/colapsar */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? "▲ Ver menos" : "▼ Ver detalles"}
        </Text>
      </TouchableOpacity>

      {/* Sección expandible */}
      {expanded && (
        <View style={styles.expandedSection}>
          {/* <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ Turno:</Text>
            <Text style={styles.detailValue}>
              {pasantia.turno || "No especificado"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏱️ Carga horaria:</Text>
            <Text style={styles.detailValue}>
              {pasantia.carga_horaria || 0} hrs/semana
            </Text>
          </View> */}
          {/* {pasantia.detalles_horario && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📝 Detalles:</Text>
              <Text style={styles.detailValue}>
                {pasantia.detalles_horario}
              </Text>
            </View>
          )} */}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onVerActividades(pasantia)}
            >
              <Text style={styles.actionButtonText}>📋 Actividades</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onVerHorario(pasantia)}
            >
              <Text style={styles.actionButtonText}>⏰ Horario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                onVerCalificaciones(
                  pasantia.empresa.id,
                  pasantia.empresa.nombre,
                )
              }
            >
              <Text style={styles.actionButtonText}>⭐ Calific.</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón de inscripción */}
      <TouchableOpacity
        style={[styles.inscribirButton, { backgroundColor: getBotonColor() }]}
        onPress={() => pasantia.boton_habilitado && onInscribirse(pasantia)}
        disabled={!pasantia.boton_habilitado}
      >
        <Text style={styles.inscribirButtonText}>{pasantia.boton_mensaje}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function InscribirseScreen({ navigation }) {
  const { user } = useAuth();
  const [pasantias, setPasantias] = useState([]);
  const [menciones, setMenciones] = useState([]);
  const [mencionPasante, setMencionPasante] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroMencion, setFiltroMencion] = useState("");

  // Modales
  const [modalEmpresa, setModalEmpresa] = useState({
    visible: false,
    empresa: null,
  });
  const [modalHorario, setModalHorario] = useState({
    visible: false,
    pasantia: null,
  });
  const [modalActividades, setModalActividades] = useState({
    visible: false,
    pasantia: null,
  });
  const [modalCalificaciones, setModalCalificaciones] = useState({
    visible: false,
    empresaId: null,
    empresaNombre: null,
  });
  const [modalConfirm, setModalConfirm] = useState({
    visible: false,
    pasantia: null,
  });
  const [inscribiendoId, setInscribiendoId] = useState(null);

  const cargarPasantias = async () => {
    try {
      const response = await api.get("/pasante/pasantias-disponibles");
      setPasantias(response.data.pasantias);
      setMenciones(["Todos", ...response.data.menciones]);
      setMencionPasante(response.data.mencion_pasante);
      setFiltroMencion(response.data.mencion_pasante);
    } catch (error) {
      console.error("Error cargando pasantías:", error);
      Alert.alert("Error", "No se pudieron cargar las pasantías disponibles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPasantias();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarPasantias();
  };

  const handleInscribirse = (pasantia) => {
    setModalConfirm({ visible: true, pasantia });
  };

  const confirmarInscripcion = async () => {
    const pasantia = modalConfirm.pasantia;
    if (!pasantia) return;

    setInscribiendoId(pasantia.id);
    setModalConfirm({ visible: false, pasantia: null });

    try {
      await api.post(`/pasante/inscribirse/${pasantia.id}`);
      Alert.alert("Éxito", "Inscripción exitosa", [
        {
          text: "OK",
          onPress: () => navigation.navigate("InscripcionesActivas"),
        },
      ]);
      await cargarPasantias();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al inscribirse",
      );
    } finally {
      setInscribiendoId(null);
    }
  };

  // Filtrar pasantías
  const pasantiasFiltradas = pasantias
    .filter((p) => filtroMencion === "Todos" || p.mencion === filtroMencion)
    .filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <Text style={styles.headerTitle}>
            Ofertas de Pasantías por Empresas
          </Text>
          <Text style={styles.headerSubtitle}>
            Encuentra la pasantía ideal para ti (Puedes tener como máximo 2
            pasantías inscritas)
          </Text>
          <Text style={styles.headerInfo}>🎓 Tu mención: {mencionPasante}</Text>
        </View>

        {/* Buscador */}
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por nombre o empresa..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Filtro por mención */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosContainer}
        >
          {menciones.map((mencion) => (
            <TouchableOpacity
              key={mencion}
              style={[
                styles.filtroChip,
                filtroMencion === mencion && styles.filtroChipActive,
              ]}
              onPress={() => setFiltroMencion(mencion)}
            >
              <Text
                style={[
                  styles.filtroChipText,
                  filtroMencion === mencion && styles.filtroChipTextActive,
                ]}
              >
                {mencion}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de pasantías */}
        {pasantiasFiltradas.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay pasantías disponibles con estos filtros
          </Text>
        ) : (
          pasantiasFiltradas.map((pasantia) => (
            <PasantiaCard
              key={pasantia.id}
              pasantia={pasantia}
              onInscribirse={handleInscribirse}
              onVerEmpresa={(empresa) =>
                setModalEmpresa({ visible: true, empresa })
              }
              onVerHorario={(p) =>
                setModalHorario({ visible: true, pasantia: p })
              }
              onVerActividades={(p) =>
                setModalActividades({ visible: true, pasantia: p })
              }
              onVerCalificaciones={(id, nombre) =>
                setModalCalificaciones({
                  visible: true,
                  empresaId: id,
                  empresaNombre: nombre,
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

      <ModalActividadesPasante
        visible={modalActividades.visible}
        onClose={() => setModalActividades({ visible: false, pasantia: null })}
        pasantia={modalActividades.pasantia}
      />

      <ModalScoreEmpresa
        visible={modalCalificaciones.visible}
        onClose={() =>
          setModalCalificaciones({
            visible: false,
            empresaId: null,
            empresaNombre: null,
          })
        }
        empresaId={modalCalificaciones.empresaId}
        empresaNombre={modalCalificaciones.empresaNombre}
      />

      <ModalConfirmacion
        visible={modalConfirm.visible}
        onClose={() => setModalConfirm({ visible: false, pasantia: null })}
        onConfirm={confirmarInscripcion}
        title="Confirmar inscripción"
        message={`¿Estás seguro de inscribirte en "${modalConfirm.pasantia?.nombre}"?`}
        confirmText="Sí, inscribirme"
        type="info"
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
  headerInfo: {
    fontSize: 13,
    color: "#2A5A8D",
    marginTop: 8,
    fontWeight: "500",
  },
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
  filtrosContainer: { flexDirection: "row", marginBottom: 16 },
  filtroChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  filtroChipActive: { backgroundColor: "#2A5A8D" },
  filtroChipText: { fontSize: 13, color: "#666" },
  filtroChipTextActive: { color: "#fff" },
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a2a3a",
    marginBottom: 6,
  },
  empresaLink: { fontSize: 13, color: "#2A5A8D", fontWeight: "500" },
  cardBody: { padding: 16 },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mencionBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "#1e40af",
  },
  cuposBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "#166534",
  },
  fechasContainer: { marginTop: 6 },
  fechasText: { fontSize: 12, color: "#666" },
  expandButton: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  expandButtonText: { fontSize: 13, color: "#2A5A8D", fontWeight: "500" },
  expandedSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
  },
  detailRow: { flexDirection: "row", marginBottom: 8 },
  detailLabel: { width: 110, fontSize: 13, color: "#666" },
  detailValue: { flex: 1, fontSize: 13, color: "#333" },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: { fontSize: 12, color: "#333" },
  inscribirButton: {
    paddingVertical: 14,
    alignItems: "center",
    margin: 16,
    marginTop: 0,
    borderRadius: 10,
  },
  inscribirButtonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#999", padding: 40 },
  bottomSpacing: { height: 40 },
});
