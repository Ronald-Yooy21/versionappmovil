import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../services/api";
import { toDisplayDate } from "../../utils/dateUtils";

export default function ModalScoreEmpresa({
  visible,
  onClose,
  empresaId,
  empresaNombre,
}) {
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCalificaciones = async () => {
    if (!empresaId) return;
    setLoading(true);
    try {
      const response = await api.get(
        `/pasante/empresa/${empresaId}/calificaciones`,
      );
      setPasantias(response.data.pasantias);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las calificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      cargarCalificaciones();
    }
  }, [visible, empresaId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={[styles.star, i <= Math.floor(rating) && styles.starFilled]}
        >
          ★
        </Text>,
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Calificaciones de la Empresa</Text>
          <Text style={styles.subtitle}>{empresaNombre}</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2A5A8D"
              style={styles.loader}
            />
          ) : pasantias.length === 0 ? (
            <Text style={styles.emptyText}>
              Esta empresa aún no tiene calificaciones
            </Text>
          ) : (
            <ScrollView style={styles.pasantiasList}>
              {pasantias.map((pasantia) => (
                <View key={pasantia.id} style={styles.pasantiaCard}>
                  <Text style={styles.pasantiaNombre}>{pasantia.nombre}</Text>
                  <Text style={styles.pasantiaFechas}>
                    {toDisplayDate(pasantia.fecha_ini)} →{" "}
                    {toDisplayDate(pasantia.fecha_fin)}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {renderStars(pasantia.promedio)}
                    <Text style={styles.promedioText}>
                      ({pasantia.promedio})
                    </Text>
                  </View>
                  <Text style={styles.totalComentarios}>
                    {pasantia.total_comentarios} opiniones
                  </Text>

                  {pasantia.comentarios.length > 0 && (
                    <View style={styles.comentariosContainer}>
                      <Text style={styles.comentariosTitle}>Opiniones:</Text>
                      {pasantia.comentarios.map((com) => (
                        <View key={com.id} style={styles.comentarioCard}>
                          <Text style={styles.comentarioAutor}>
                            {com.nombre_pasante}
                          </Text>
                          <View style={styles.comentarioStars}>
                            {renderStars(com.calificacion)}
                          </View>
                          <Text style={styles.comentarioText}>
                            "{com.comentario}"
                          </Text>
                          <Text style={styles.comentarioFecha}>
                            {toDisplayDate(com.fecha)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A5A8D",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  loader: { padding: 20 },
  emptyText: { textAlign: "center", color: "#999", padding: 40 },
  pasantiasList: { maxHeight: 500 },
  pasantiaCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  pasantiaNombre: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  pasantiaFechas: { fontSize: 11, color: "#666", marginBottom: 8 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  starsContainer: { flexDirection: "row" },
  star: { fontSize: 16, color: "#d1d5db" },
  starFilled: { color: "#fbbf24" },
  promedioText: { fontSize: 12, color: "#666", marginLeft: 4 },
  totalComentarios: { fontSize: 11, color: "#999", marginBottom: 8 },
  comentariosContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  comentariosTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  comentarioCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  comentarioAutor: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2A5A8D",
    marginBottom: 4,
  },
  comentarioStars: { marginBottom: 4 },
  comentarioText: {
    fontSize: 12,
    color: "#555",
    fontStyle: "italic",
    marginBottom: 4,
  },
  comentarioFecha: { fontSize: 10, color: "#999" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
