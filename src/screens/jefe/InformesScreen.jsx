import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../services/api";
import InformeCard from "../../components/jefe/InformeCard";
import ModalDetalleInforme from "../../components/Modals/ModalDetalleInforme";

export default function InformesScreen() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState(null);

  const cargarInformes = async () => {
    try {
      const response = await api.get("/jefe/informes/historial");
      setHistorial(response.data.historial_pasantias);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el historial de informes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInformes();
  }, []);

  const verDetalle = (informe) => {
    setInformeSeleccionado(informe);
    setModalVisible(true);
  };

  const sections = historial
    .filter((p) => p.informes && p.informes.length > 0)
    .map((p) => ({
      title: p.nombre_pasantia,
      data: p.informes,
    }));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Historial de Informes</Text>
          <Text style={styles.emptyText}>No hay informes finales registrados aún.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <InformeCard
                informe={item}
                onVerDetalle={() => verDetalle(item)}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={styles.sectionHeaderText} numberOfLines={1}>
                {title}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
      <ModalDetalleInforme
        visible={modalVisible}
        informe={informeSeleccionado}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" // Color slate-50 ultra limpio, sustituye al gris genérico
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F8FAFC"
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptyText: { 
    color: "#64748B", 
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20
  },
  listContent: { 
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40 // Espacio extra abajo para que la última tarjeta respire
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9", // Gris slate muy claro y premium
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    marginTop: 18,
  },
  sectionIndicator: {
    width: 4,
    height: 16,
    backgroundColor: "#0284C7", // El mismo azul corporativo moderno del modal
    borderRadius: 2,
    marginRight: 10,
  },
  sectionHeaderText: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#334155",
    letterSpacing: 0.3,
    flex: 1,
  },
  itemWrapper: {
    marginBottom: 12, // Asegura consistencia de separación entre las tarjetas hijas
  }
});
