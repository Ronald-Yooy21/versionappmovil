import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function ModalPerfilPasante({ visible, pasante, onClose }) {
  if (!pasante) return null;

  // Helper para renderizar los bloques de información de forma limpia
  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value || "No registrado"}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cabecera del Perfil */}
          <View style={styles.header}>
            <Text style={styles.title}>Perfil del Pasante</Text>
            {/* <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {pasante.nombre_completo?.charAt(0) || "P"}
              </Text>
            </View> */}
            <Text style={styles.nombre} numberOfLines={2}>
              {pasante.nombre_completo}
            </Text>
            <View style={[styles.badge, pasante.estado === 'Activo' ? styles.badgeActivo : styles.badgeInactivo]}>
              <Text style={styles.badgeText}>{pasante.estado?.toUpperCase()}</Text>
            </View>
          </View>

          {/* Cuerpo con Scroll para los Datos */}
          <ScrollView 
            style={styles.scrollBody} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Datos Académicos</Text>
            <View style={styles.grid}>
              <InfoRow label="RU (Registro)" value={pasante.ru} />
              <InfoRow label="Matrícula" value={pasante.matricula} />
              <InfoRow label="Mención" value={pasante.mencion} />
              <InfoRow label="Semestre" value={pasante.semestre} />
            </View>

            <Text style={styles.sectionTitle}>Identificación y Contacto</Text>
            <View style={styles.grid}>
              <InfoRow label="Cédula de Identidad (CI)" value={pasante.ci} />
              <InfoRow label="Teléfono / Celular" value={pasante.telefono} />
              <View style={styles.infoRowFull}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{pasante.email}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Acción de Cierre */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeText}>Cerrar Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Fondo oscuro Slate translúcido, más premium
    justifyContent: "center",
    padding: 24,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 16,
    marginBottom: 12,
  },
  title: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#64748B", 
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2A5A8D15", // Tu color azul con opacidad
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A5A8D30"
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2A5A8D",
  },
  nombre: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#1E293B", 
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 10
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#E2E8F0"
  },
  badgeActivo: { backgroundColor: "#DCFCE7" },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#166534" },
  scrollBody: {
    maxHeight: 320,
  },
  scrollContent: {
    paddingBottom: 16
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2A5A8D", // Tu color azul como acento de sección
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "between",
    gap: 10,
  },
  infoRow: {
    backgroundColor: "#F8FAFC", // Fondo sutil gris/azul para agrupar
    width: "48%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoRowFull: {
    backgroundColor: "#F8FAFC",
    width: "100%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoLabel: { 
    fontSize: 11, 
    color: "#64748B", 
    fontWeight: "500",
    marginBottom: 2 
  },
  infoValue: { 
    fontSize: 14, 
    color: "#1E293B", 
    fontWeight: "600" 
  },
  closeButton: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#2A5A8D", // Tu color azul principal
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2A5A8D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  closeText: { 
    color: "#FFFFFF", 
    fontWeight: "700",
    fontSize: 15
  },
});
