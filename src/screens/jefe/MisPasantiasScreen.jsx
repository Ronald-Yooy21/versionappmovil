import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../services/api";
import PasantiaCard from "../../components/jefe/PasantiaCard";
import ModalVerActividades from "../../components/Modals/ModalVerActividades";

export default function MisPasantiasScreen() {
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [selectedPasantia, setSelectedPasantia] = useState(null);

  const cargarPasantias = async () => {
    try {
      const response = await api.get("/jefe/pasantias");
      setPasantias(response.data.pasantias);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las pasantías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPasantias();
  }, []);

  const verActividades = (pasantia) => {
    setSelectedPasantia(pasantia);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pasantias}
        keyExtractor={(item) => item.id_pasantia.toString()}
        renderItem={({ item }) => (
          <PasantiaCard
            pasantia={item}
            onVerActividades={() => verActividades(item)}
          />
        )}
        contentContainerStyle={{ padding: 20 }}
      />
      <ModalVerActividades
        visible={modalVisible}
        actividades={selectedPasantia?.actividades || []}
        nombrePasantia={selectedPasantia?.nombre}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});