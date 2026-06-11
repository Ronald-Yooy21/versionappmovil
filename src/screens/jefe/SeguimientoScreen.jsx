import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import api from "../../services/api";

export default function SeguimientoScreen({ navigation }) {
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jefe/seguimiento")
      .then((res) => {
        // Validación defensiva para asegurar que la estructura siempre sea iterable
        if (res.data && Array.isArray(res.data.pasantias)) {
          setPasantias(res.data.pasantias);
        } else {
          setPasantias([]);
        }
      })
      .catch((err) => {
        console.error("Error en seguimiento:", err);
        Alert.alert("Error", "No se pudieron cargar los datos de seguimiento");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
        <Text style={styles.loadingText}>Sincronizando seguimiento...</Text>
      </View>
    );
  }

  // Transformar datos estructurando las pasantías como secciones limpias
  const sections = pasantias.map((p) => ({
    title: p.nombre_pasantia || "Pasantía General",
    idPasantiaOriginal: p.id_pasantia, // Guardamos el ID en la sección para acceso directo y óptimo
    data: p.listadoPasantes || [],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id_inscripcion?.toString() || index.toString()}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.headerTopLine} />
            <Text style={styles.sectionTitle} numberOfLines={1}>
              📋 {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item, section }) => {
          // Buscamos el ID de la pasantía directamente desde la sección actual o fallback de búsqueda
          const idPasantia = section.idPasantiaOriginal || pasantias.find((p) =>
            p.listadoPasantes?.some((i) => i.id_inscripcion === item.id_inscripcion)
          )?.id_pasantia;

          return (
            <View style={styles.cardShadowContainer}>
              <View style={styles.card}>
                {/* Barra de acento estético izquierdo con el azul institucional */}
                <View style={styles.statusIndicator} />

                {/* Bloque Informativo */}
                <View style={styles.infoContainer}>
                  <Text style={styles.nombre} numberOfLines={1}>
                    {item.nombre_completo}
                  </Text>
                  
                  {/* Fila de Micro-badges encapsulados */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeText}>CI {item.ci}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeText}>RU {item.ru}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeText}>Mat. {item.matricula}</Text>
                    </View>
                  </View>

                  <Text style={styles.subTexto} numberOfLines={1}>
                    🎓 Semestre: {item.semestre}º  ·  💻 {item.mencion || "General"}
                  </Text>
                </View>

                {/* Botón de Acción Lateral */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.botonPrincipal}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (!idPasantia) {
                        Alert.alert("Error", "No se encontró el identificador de la pasantía.");
                        return;
                      }
                      navigation.navigate("EvaluacionActividades", {
                        idPasantia: idPasantia,
                        idPasante: item.idU_pasante,
                      });
                    }}
                  >
                    <Text style={styles.botonTexto}>Seguimiento</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBackground}>
              <Text style={styles.emptyIcon}>📊</Text>
            </View>
            <Text style={styles.emptyTitle}>Sin seguimientos pendientes</Text>
            <Text style={styles.emptySubtitle}>
              Las listas de pasantes asignados a bitácoras de actividades aparecerán organizadas en este panel.
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" // Fondo pizarra ultra limpio
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
  sectionTitle: { 
    fontWeight: "800", 
    fontSize: 18, 
    color: "#0F172A", 
    letterSpacing: -0.5 
  },
  cardShadowContainer: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statusIndicator: {
    width: 6,
    height: "100%",
    backgroundColor: "#2A5A8D", // Tu color azul corporativo liderando el look de la app
    position: "absolute",
    left: 0,
    top: 0,
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 20,
    paddingRight: 10,
  },
  nombre: { 
    fontWeight: "800", 
    fontSize: 16, 
    color: "#0F172A", 
    letterSpacing: -0.4, 
    marginBottom: 8 
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  metaBadge: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
  },
  subTexto: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  actionsContainer: {
    justifyContent: "center",
    paddingRight: 16,
    height: "100%",
  },
  botonPrincipal: {
    backgroundColor: "#2A5A8D", // Botón llamativo corporativo
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#2A5A8D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  botonTexto: { 
    color: "#FFFFFF", 
    fontWeight: "700", 
    fontSize: 12 
  },
  // Estado Vacío Premium
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
