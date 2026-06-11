import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import api from "../../services/api";
import InscritoCard from "../../components/jefe/InscritoCard";
import ModalPerfilPasante from "../../components/Modals/ModalPerfilPasante";

export default function MisPasantesScreen() {
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pasanteSeleccionado, setPasanteSeleccionado] = useState(null);

  const cargarPasantes = async () => {
    try {
      const response = await api.get("/jefe/pasantes");
      setPasantias(response.data.pasantias);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los pasantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPasantes();
  }, []);

  const verPerfil = (inscrito) => {
    setPasanteSeleccionado(inscrito);
    setModalVisible(true);
  };

  const sections = pasantias.map((p) => ({
    nombre: p.nombre,
    estado: p.estado,
    mencion: p.mencion,
    data: p.inscritos || [], 
  }));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
        <Text style={styles.loadingText}>Sincronizando pasantes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id_inscripcion?.toString() || index.toString()}
        renderItem={({ item }) => (
          <InscritoCard
            inscrito={item}
            onVerPerfil={() => verPerfil(item)}
          />
        )}
        renderSectionHeader={({ section }) => {
          const normalize = section.estado?.toLowerCase();
          const isIniciado = normalize === "iniciado" || normalize === "activa";
          
          return (
            <View style={styles.sectionHeaderContainer}>
              {/* Línea divisoria decorativa superior si no es el primer elemento */}
              <View style={styles.headerTopLine} />
              
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle} numberOfLines={1}>
                  {section.nombre}
                </Text>
                
                <View style={[styles.badge, isIniciado ? styles.badgeActive : styles.badgeInactive]}>
                  <View style={[styles.badgeDot, { backgroundColor: isIniciado ? "#10B981" : "#64748B" }]} />
                  <Text style={[styles.badgeText, isIniciado ? styles.badgeTextActive : styles.badgeTextInactive]}>
                    {section.estado}
                  </Text>
                </View>
              </View>

              {section.mencion && (
                <Text style={styles.sectionSubtitle} numberOfLines={1}>
                  💼 {section.mencion}
                </Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBackground}>
              <Text style={styles.emptyIcon}>💼</Text>
            </View>
            <Text style={styles.emptyTitle}>Sin pasantes asignados</Text>
            <Text style={styles.emptySubtitle}>
              Las ofertas académicas y los pasantes que tengas bajo tu supervisión aparecerán organizados en esta sección.
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <ModalPerfilPasante
        visible={modalVisible}
        pasante={pasanteSeleccionado}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F8FAFC"
  },
  loadingText: {
    marginTop: 14,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 0.2
  },
  listContent: { 
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40
  },
  sectionHeaderContainer: {
    marginTop: 18,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  headerTopLine: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 14,
    width: "100%",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: { 
    fontSize: 19, 
    fontWeight: "800", // Peso tipográfico fuerte para contrastar con las tarjetas
    color: "#0F172A", // Slate 900 premium
    flex: 1,
    letterSpacing: -0.5
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B", // Slate 500
    fontWeight: "500",
    marginTop: 5,
    letterSpacing: 0.1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 99, // Estilo píldora cápsula perfecta
    borderWidth: 1,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeActive: {
    backgroundColor: "#E6F4EA",
    borderColor: "#A7F3D0",
  },
  badgeInactive: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  badgeTextActive: { color: "#137333" },
  badgeTextInactive: { color: "#475569" },
  
  // Contenedor de Estado Vacío Premium
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 24,
  },
  emptyIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2A5A8D08",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2A5A8D15"
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
