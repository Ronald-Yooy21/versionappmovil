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

export default function ModalCompaneros({
  visible,
  onClose,
  pasantiaId,
  pasantiaNombre,
}) {
  const [companeros, setCompaneros] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCompaneros = async () => {
    if (!pasantiaId) return;
    setLoading(true);
    try {
      const response = await api.get(`/pasante/companeros/${pasantiaId}`);
      setCompaneros(response.data.companeros);
    } catch (error) {
      console.error("Error cargando compañeros:", error);
      Alert.alert("Error", "No se pudieron cargar los compañeros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      cargarCompaneros();
    }
  }, [visible, pasantiaId]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Compañeros de Pasantía</Text>
          <Text style={styles.subtitle}>{pasantiaNombre}</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2A5A8D"
              style={styles.loader}
            />
          ) : companeros.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay otros pasantes inscritos
            </Text>
          ) : (
            <ScrollView style={styles.companerosList}>
              {companeros.map((companero, index) => (
                <View key={companero.id} style={styles.companeroCard}>
                  <View style={styles.companeroHeader}>
                    <Text style={styles.companeroNombre}>
                      {index + 1}. {companero.ap_paterno} {companero.ap_materno}
                      , {companero.nombre}
                    </Text>
                    {companero.es_yo && (
                      <View style={styles.yoBadge}>
                        <Text style={styles.yoBadgeText}>Tú</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.companeroJefe}>
                    👔 Jefe: {companero.jefe_nombre}
                  </Text>
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
    marginBottom: 16,
  },
  loader: { padding: 20 },
  emptyText: { textAlign: "center", color: "#999", padding: 40 },
  companerosList: { maxHeight: 500 },
  companeroCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  companeroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  companeroNombre: { fontSize: 14, fontWeight: "bold", color: "#333", flex: 1 },
  yoBadge: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  yoBadgeText: { fontSize: 10, fontWeight: "bold", color: "#666" },
  companeroJefe: { fontSize: 12, color: "#666" },
  closeButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: { color: "#666", fontSize: 15, fontWeight: "500" },
});
