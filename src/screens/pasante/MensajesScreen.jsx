import React, { useState, useEffect, useRef } from "react";
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
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

// Componente de burbuja de mensaje (igual)
// Helper global para formatear hora respetando zona horaria local
const formatHoraLocal = (horaStr) => {
  if (!horaStr) return "";
  // Si viene como "HH:MM:SS" sin fecha, parsear como UTC para convertir a local
  const isTimeOnly = /^\d{2}:\d{2}(:\d{2})?$/.test(horaStr);
  const date = isTimeOnly
    ? new Date(`1970-01-01T${horaStr}Z`)
    : new Date(horaStr);
  if (isNaN(date.getTime())) return horaStr.substring(0, 5);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const BurbujaMensaje = ({ mensaje }) => {
  return (
    <View
      style={[
        styles.burbujaContainer,
        mensaje.es_mio ? styles.burbujaMia : styles.burbujaContacto,
      ]}
    >
      <View
        style={[
          styles.burbuja,
          mensaje.es_mio
            ? styles.burbujaMiaContent
            : styles.burbujaContactoContent,
        ]}
      >
        <Text
          style={[
            styles.burbujaTexto,
            mensaje.es_mio
              ? styles.burbujaTextoMia
              : styles.burbujaTextoContacto,
          ]}
        >
          {mensaje.descripcion}
        </Text>
        <Text
          style={[
            styles.burbujaHora,
            mensaje.es_mio ? styles.burbujaHoraMia : styles.burbujaHoraContacto,
          ]}
        >
          {formatHoraLocal(mensaje.hora)}
        </Text>
      </View>
    </View>
  );
};

// Componente de tarjeta de contacto (igual)
const ContactoCard = ({ contacto, isSelected, onPress }) => {
  const getInitials = () => {
    return `${contacto.ap_paterno?.charAt(0) || ""}${contacto.nombre?.charAt(0) || ""}`;
  };

  return (
    <TouchableOpacity
      style={[styles.contactoCard, isSelected && styles.contactoCardSelected]}
      onPress={onPress}
    >
      <View style={styles.contactoAvatar}>
        {contacto.avatar_url ? (
          <Image
            source={{ uri: contacto.avatar_url }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        )}
      </View>
      <View style={styles.contactoInfo}>
        <View style={styles.contactoHeader}>
          <Text style={styles.contactoNombre}>
            {contacto.ap_paterno} {contacto.ap_materno}, {contacto.nombre}
          </Text>
          <Text style={styles.contactoRol}>
            {contacto.tipo === "jefe" ? "JEFE" : "PASANTE"}
          </Text>
        </View>
        <Text style={styles.contactoPasantia}>{contacto.pasantia_nombre}</Text>
        {contacto.ultimo_mensaje && (
          <Text style={styles.contactoUltimoMensaje} numberOfLines={1}>
            {contacto.ultimo_mensaje_enviado_por_mi ? "Tú: " : ""}
            {contacto.ultimo_mensaje}
          </Text>
        )}
        {contacto.ultimo_mensaje_hora && (
          <Text style={styles.contactoHora}>
            {formatHoraLocal(contacto.ultimo_mensaje_hora)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function MensajesScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [contactos, setContactos] = useState([]);
  const [contactoActivo, setContactoActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loadingContactos, setLoadingContactos] = useState(true);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContactoId, setSelectedContactoId] = useState(null);
  const scrollViewRef = useRef();
  const inputRef = useRef();
  const pollingInterval = useRef(null);

  const cargarContactos = async () => {
    try {
      const response = await api.get("/pasante/mensajes/contactos");
      setContactos(response.data);
    } catch (error) {
      console.error("Error cargando contactos:", error);
      Alert.alert("Error", "No se pudieron cargar los contactos");
    } finally {
      setLoadingContactos(false);
      setRefreshing(false);
    }
  };

  const cargarMensajes = async (contacto) => {
    if (!contacto) return;

    setLoadingMensajes(true);
    try {
      const response = await api.get(
        `/pasante/mensajes/${contacto.tipo}/${contacto.id_contacto}`,
      );
      setMensajes(response.data.mensajes);
      setContactoActivo({
        ...contacto,
        info: response.data.contacto,
      });
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      Alert.alert("Error", "No se pudieron cargar los mensajes");
    } finally {
      setLoadingMensajes(false);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  // Polling para nuevos mensajes
  useEffect(() => {
    if (contactoActivo) {
      if (pollingInterval.current) clearInterval(pollingInterval.current);

      pollingInterval.current = setInterval(async () => {
        try {
          const response = await api.get(
            `/pasante/mensajes/${contactoActivo.tipo}/${contactoActivo.id_contacto}`,
          );
          if (response.data.mensajes) {
            setMensajes(response.data.mensajes);
          }
        } catch (error) {
          console.error("Error en polling:", error);
        }
      }, 3000);

      return () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      };
    }
  }, [contactoActivo]);

  // Scroll al último mensaje
  useEffect(() => {
    if (scrollViewRef.current && mensajes.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [mensajes]);

  // Cuando el teclado aparece, hacer scroll al final para ver el input
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    });
    return () => show.remove();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarContactos();
  };

  const seleccionarContacto = (contacto) => {
    setSelectedContactoId(contacto.id_contacto);
    setContactoActivo(null);
    setMensajes([]);
    cargarMensajes(contacto);
  };

  const volverALista = () => {
    setContactoActivo(null);
    setSelectedContactoId(null);
    setMensajes([]);
    cargarContactos();
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || enviando || !contactoActivo) return;

    const texto = nuevoMensaje.trim();
    setNuevoMensaje("");
    setEnviando(true);

    try {
      const response = await api.post("/pasante/mensajes", {
        tipo: contactoActivo.tipo,
        id_contacto: contactoActivo.id_contacto,
        mensaje: texto,
      });

      if (response.data.success) {
        setMensajes((prev) => [...prev, response.data.mensaje]);

        // Actualizar último mensaje en la lista de contactos
        setContactos((prev) =>
          prev.map((c) => {
            if (
              c.tipo === contactoActivo.tipo &&
              c.id_contacto === contactoActivo.id_contacto
            ) {
              return {
                ...c,
                ultimo_mensaje: texto,
                ultimo_mensaje_fecha: new Date().toISOString().split("T")[0],
                ultimo_mensaje_hora: new Date().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                ultimo_mensaje_enviado_por_mi: true,
              };
            }
            return c;
          }),
        );
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      Alert.alert("Error", "No se pudo enviar el mensaje");
      setNuevoMensaje(texto);
    } finally {
      setEnviando(false);
    }
  };

  if (loadingContactos) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {!contactoActivo ? (
        // Lista de contactos
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mensajes</Text>
            <Text style={styles.headerSubtitle}>
              {contactos.length} contacto(s) disponible(s)
            </Text>
          </View>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {contactos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No hay contactos disponibles
                </Text>
                <Text style={styles.emptySubtext}>
                  Los contactos aparecerán cuando tengas pasantías activas
                </Text>
              </View>
            ) : (
              contactos.map((contacto) => (
                <ContactoCard
                  key={`${contacto.tipo}_${contacto.id_contacto}`}
                  contacto={contacto}
                  isSelected={selectedContactoId === contacto.id_contacto}
                  onPress={() => seleccionarContacto(contacto)}
                />
              ))
            )}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      ) : (
        // Pantalla de chat
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
        >
          {/* Header del chat */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={volverALista} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.chatHeaderInfo}>
              <View style={styles.chatHeaderAvatar}>
                {contactoActivo.info?.avatar_url ? (
                  <Image
                    source={{ uri: contactoActivo.info.avatar_url }}
                    style={styles.chatAvatarImage}
                  />
                ) : (
                  <View style={styles.chatAvatarPlaceholder}>
                    <Text style={styles.chatAvatarText}>
                      {contactoActivo.ap_paterno?.charAt(0)}
                      {contactoActivo.nombre?.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.chatHeaderNombre}>
                  {contactoActivo.ap_paterno} {contactoActivo.ap_materno},{" "}
                  {contactoActivo.nombre}
                </Text>
                <Text style={styles.chatHeaderRol}>
                  {contactoActivo.tipo === "jefe"
                    ? "Jefe de pasantía"
                    : "Compañero pasante"}
                </Text>
              </View>
            </View>
          </View>

          {/* Área de mensajes */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.mensajesContainer}
            showsVerticalScrollIndicator={false}
          >
            {loadingMensajes ? (
              <ActivityIndicator
                size="large"
                color="#2A5A8D"
                style={styles.loader}
              />
            ) : mensajes.length === 0 ? (
              <View style={styles.emptyChatContainer}>
                <Text style={styles.emptyChatText}>No hay mensajes</Text>
                <Text style={styles.emptyChatSubtext}>
                  Envía el primer mensaje
                </Text>
              </View>
            ) : (
              mensajes.map((msg, index) => (
                <BurbujaMensaje key={msg.id || index} mensaje={msg} />
              ))
            )}
          </ScrollView>

          {/* Input de mensaje */}
          <View
            style={[
              styles.inputWrapper,
              { paddingBottom: Math.max(insets.bottom, 8) },
            ]}
          >
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={nuevoMensaje}
                onChangeText={setNuevoMensaje}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !nuevoMensaje.trim() && styles.sendButtonDisabled,
                ]}
                onPress={enviarMensaje}
                disabled={!nuevoMensaje.trim() || enviando}
              >
                <Text style={styles.sendButtonText}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#1a2a3a" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  contactoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactoCardSelected: {
    backgroundColor: "#e5e7eb",
    borderWidth: 1,
    borderColor: "#2A5A8D",
  },
  contactoAvatar: { marginRight: 12 },
  avatarImage: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  contactoInfo: { flex: 1 },
  contactoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  contactoNombre: { fontSize: 15, fontWeight: "bold", color: "#333", flex: 1 },
  contactoRol: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2A5A8D",
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  contactoPasantia: { fontSize: 11, color: "#666", marginBottom: 4 },
  contactoUltimoMensaje: { fontSize: 12, color: "#999", marginRight: 60 },
  contactoHora: {
    fontSize: 10,
    color: "#bbb",
    position: "absolute",
    right: 0,
    top: 0,
  },
  emptyContainer: { alignItems: "center", padding: 40 },
  emptyText: { fontSize: 16, color: "#999", marginBottom: 8 },
  emptySubtext: { fontSize: 13, color: "#bbb", textAlign: "center" },
  bottomSpacing: { height: 20 },

  // Chat styles
  chatContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 16 },
  backButtonText: { fontSize: 24, color: "#2A5A8D" },
  chatHeaderInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  chatHeaderAvatar: { marginRight: 12 },
  chatAvatarImage: { width: 40, height: 40, borderRadius: 20 },
  chatAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
  },
  chatAvatarText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  chatHeaderNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  chatHeaderRol: { fontSize: 12, color: "#666" },
  mensajesContainer: { flex: 1, padding: 16, flexGrow: 1 },
  loader: { padding: 20 },
  emptyChatContainer: { alignItems: "center", padding: 40 },
  emptyChatText: { fontSize: 16, color: "#999", marginBottom: 8 },
  emptyChatSubtext: { fontSize: 13, color: "#bbb" },
  burbujaContainer: { marginBottom: 12, flexDirection: "row" },
  burbujaMia: { justifyContent: "flex-end" },
  burbujaContacto: { justifyContent: "flex-start" },
  burbuja: { maxWidth: "75%", padding: 12, borderRadius: 20 },
  burbujaMiaContent: { backgroundColor: "#2A5A8D", borderBottomRightRadius: 4 },
  burbujaContactoContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  burbujaTexto: { fontSize: 14, lineHeight: 20 },
  burbujaTextoMia: { color: "#fff" },
  burbujaTextoContacto: { color: "#333" },
  burbujaHora: { fontSize: 10, marginTop: 4, textAlign: "right" },
  burbujaHoraMia: { color: "#a0c4e8" },
  burbujaHoraContacto: { color: "#999" },
  inputWrapper: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  inputContainer: { flexDirection: "row", padding: 12, alignItems: "flex-end" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A5A8D",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: { backgroundColor: "#ccc" },
  sendButtonText: { fontSize: 20 },
});
