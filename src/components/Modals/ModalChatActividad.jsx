import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import api from "../../services/api";

const BurbujaChat = ({ texto, esMio, hora }) => (
  <View style={[styles.burbujaContainer, esMio ? styles.mio : styles.otro]}>
    <View style={[styles.burbuja, esMio ? styles.mioBg : styles.otroBg]}>
      <Text style={[styles.texto, esMio ? styles.mioText : styles.otroText]}>
        {texto}
      </Text>
      <Text style={styles.hora}>{hora}</Text>
    </View>
  </View>
);

export default function ModalChatActividad({
  visible,
  actividad,
  pasanteId,
  onClose,
}) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const flatRef = useRef();

  useEffect(() => {
    if (actividad?.comentarios) {
      // Transformar comentarios a formato chat
      const msgs = actividad.comentarios.map((c) => ({
        id: c.id_comactividad,
        texto: c.texto,
        esMio: c.remitente === "jefe",
        hora: c.hora,
      }));
      setMensajes(msgs);
    }
  }, [actividad]);
  

  const enviarComentario = async () => {
    if (!nuevoTexto.trim() || enviando) return;
    setEnviando(true);
    try {
      const res = await api.post("/jefe/bitacoras/comentario", {
        id_actividad: actividad.id_actividad,
        idU_pasante: pasanteId,
        comentario: nuevoTexto.trim(),
      });
      if (res.data.success) {
        setMensajes((prev) => [
          ...prev,
          {
            id: Date.now(),
            texto: nuevoTexto.trim(),
            esMio: true,
            hora: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setNuevoTexto("");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo enviar el comentario", e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Chat - {actividad?.nombre_act}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cerrar}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            ref={flatRef}
            data={mensajes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <BurbujaChat {...item} />}
            style={styles.lista}
            onContentSizeChange={() =>
              flatRef.current?.scrollToEnd({ animated: true })
            }
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              value={nuevoTexto}
              onChangeText={setNuevoTexto}
              multiline
            />
            <TouchableOpacity
              onPress={enviarComentario}
              disabled={!nuevoTexto.trim() || enviando}
              style={[
                styles.botonEnviar,
                (!nuevoTexto.trim() || enviando) && styles.botonEnviarDisabled,
              ]}
            >
              <Text style={styles.botonEnviarText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    height: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titulo: { fontWeight: "700", fontSize: 16 },
  cerrar: { fontSize: 20, color: "#666" },
  lista: { flex: 1 },
  burbujaContainer: { marginBottom: 10 },
  mio: { alignItems: "flex-end" },
  otro: { alignItems: "flex-start" },
  burbuja: { maxWidth: "75%", padding: 10, borderRadius: 16 },
  mioBg: { backgroundColor: "#2A5A8D", borderBottomRightRadius: 4 },
  otroBg: { backgroundColor: "#E2E8F0", borderBottomLeftRadius: 4 },
  mioText: { color: "#fff" },
  otroText: { color: "#1E293B" },
  hora: { fontSize: 10, marginTop: 4, textAlign: "right", color: "#94A3B8" },
  inputRow: {
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
  },
  botonEnviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  botonEnviarDisabled: { backgroundColor: "#CBD5E1" },
  botonEnviarText: { fontSize: 20 },
});
