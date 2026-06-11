import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import api from "../../services/api";
import ModalChatActividad from "../../components/Modals/ModalChatActividad";
import ModalProgresoHistorico from "../../components/Modals/ModalProgresoHistorico";
import ModalAutoevaluacionPasante from "../../components/Modals/ModalAutoevaluacionPasante";
import ModalEvaluarBitacora from "../../components/Modals/ModalEvaluarBitacora";

export default function EvaluacionActividadesScreen({ route, navigation }) {
  const { idPasantia, idPasante } = route.params;
  const [loading, setLoading] = useState(true);
  const [pasanteData, setPasanteData] = useState(null);
  const [pasantia, setPasantia] = useState(null);

  // Estados de modales (Manteniendo lógica intacta)
  const [modalChat, setModalChat] = useState({ visible: false, actividad: null });
  const [modalProgreso, setModalProgreso] = useState({ visible: false, actividad: null });
  const [modalAutoEva, setModalAutoEva] = useState({ visible: false, actividad: null });
  const [modalEvaluar, setModalEvaluar] = useState({ visible: false, actividad: null });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/jefe/evaluaciones/bitacoras/${idPasantia}/${idPasante}`);
      setPasantia(res.data.pasantia);
      if (res.data.pasanteData?.length > 0) {
        setPasanteData(res.data.pasanteData[0]);
      }
    } catch (e) {
      Alert.alert("Error", "No se pudieron cargar las actividades.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [idPasantia, idPasante]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
        <Text style={styles.loadingText}>Cargando bitácora...</Text>
      </View>
    );
  }

  const actividades = pasanteData?.actividades || [];

  const renderActividad = ({ item }) => {
    const progreso = item.porcentaje_progreso || 0;
    return (
      <View style={styles.cardShadowContainer}>
        <View style={styles.card}>
          <Text style={styles.nombreAct}>{item.nombre_act}</Text>
          
          <View style={styles.row}>
            <Text style={styles.fecha}>📅 Inicio: {item.fecha_ini}</Text>
            <Text style={styles.fecha}>🏁 Fin: {item.fecha_fin}</Text>
          </View>
          
          {/* Progreso Visual Premium */}
          <View style={styles.progresoRow}>
            <View style={styles.barraFondo}>
              <View style={[styles.barraLlena, { width: `${progreso}%` }]} />
            </View>
            <Text style={styles.porcentaje}>{progreso}%</Text>
          </View>
          
          {/* Botones de acción con estilos premium refinados */}
          <View style={styles.acciones}>
            <TouchableOpacity
              style={styles.accionBtn}
              activeOpacity={0.7}
              onPress={() => setModalChat({ visible: true, actividad: item })}
            >
              <Text style={styles.accionIcon}>💬</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.accionBtn}
              activeOpacity={0.7}
              onPress={() => setModalProgreso({ visible: true, actividad: item })}
            >
              <Text style={styles.accionIcon}>📈</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.accionBtn,
                !item.tiene_autoevaluacion && styles.accionBtnDisabled,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                if (item.tiene_autoevaluacion) setModalAutoEva({ visible: true, actividad: item });
              }}
              disabled={!item.tiene_autoevaluacion}
            >
              <Text style={styles.accionIcon}>👤</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.accionBtn,
                !item.puede_evaluar && styles.accionBtnDisabled,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                if (item.puede_evaluar) setModalEvaluar({ visible: true, actividad: item });
              }}
              disabled={!item.puede_evaluar}
            >
              <Text style={styles.accionIcon}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Cabecera Estilizada de Alta Gama */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {pasanteData?.nombre_completo}
        </Text>
        <Text style={styles.headerSubtitle} numberOfLines={1}>
          📌 {pasantia?.nombre}
        </Text>
      </View>

      <FlatList
        data={actividades}
        keyExtractor={(item) => item.id_actividad.toString()}
        renderItem={renderActividad}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modales (Manteniendo props idénticos) */}
      {modalChat.visible && (
        <ModalChatActividad
          visible={modalChat.visible}
          actividad={modalChat.actividad}
          pasanteId={idPasante}
          onClose={() => setModalChat({ visible: false, actividad: null })}
        />
      )}
      {modalProgreso.visible && (
        <ModalProgresoHistorico
          visible={modalProgreso.visible}
          historial={modalProgreso.actividad?.historial_progresos || []}
          nombreActividad={modalProgreso.actividad?.nombre_act}
          onClose={() => setModalProgreso({ visible: false, actividad: null })}
        />
      )}
      {modalAutoEva.visible && (
        <ModalAutoevaluacionPasante
          visible={modalAutoEva.visible}
          autoevaluacion={modalAutoEva.actividad?.autoevaluacion}
          nombreActividad={modalAutoEva.actividad?.nombre_act}
          onClose={() => setModalAutoEva({ visible: false, actividad: null })}
        />
      )}
      {modalEvaluar.visible && (
        <ModalEvaluarBitacora
          visible={modalEvaluar.visible}
          actividad={modalEvaluar.actividad}
          pasanteId={idPasante}
          onClose={() => setModalEvaluar({ visible: false, actividad: null })}
          onSuccess={fetchData}
        />
      )}
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
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    // Sombra sutil inferior para separar del contenido
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  listContent: { 
    padding: 16,
    paddingBottom: 32
  },
  cardShadowContainer: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  nombreAct: { 
    fontWeight: "800", 
    fontSize: 16, 
    color: "#0F172A", 
    letterSpacing: -0.3,
    marginBottom: 10 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 12 
  },
  fecha: { 
    fontSize: 12, 
    color: "#475569",
    fontWeight: "500" 
  },
  progresoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16 
  },
  barraFondo: { 
    flex: 1, 
    height: 10, 
    backgroundColor: "#F1F5F9", 
    borderRadius: 99,
    overflow: "hidden" // Asegura el recorte perfecto del relleno interno
  },
  barraLlena: { 
    height: "100%", 
    backgroundColor: "#2A5A8D", 
    borderRadius: 99 
  },
  porcentaje: { 
    width: 44, 
    textAlign: "right", 
    fontSize: 13, 
    fontWeight: "800", 
    color: "#0F172A", 
    marginLeft: 8 
  },
  acciones: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    gap: 10 
  },
  accionBtn: {
    width: 40,
    height: 40,
    borderRadius: 10, // Forma semi-cuadrada moderna que encaja con las tarjetas
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  accionBtnDisabled: { 
    opacity: 0.25,
    backgroundColor: "#F8FAFC",
    borderColor: "transparent"
  },
  accionIcon: { 
    fontSize: 18 
  },
});
