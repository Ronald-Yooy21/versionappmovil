import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardPasanteScreen from "../screens/pasante/DashboardPasanteScreen";
import InscribirseScreen from "../screens/pasante/InscribirseScreen";
import InscripcionesActivasScreen from "../screens/pasante/InscripcionesActivasScreen";
//import InscripcionesFinalizadasScreen from "../screens/pasante/InscripcionesFinalizadasScreen";
import ActividadesScreen from "../screens/pasante/ActividadesScreen";
import PerfilPasanteScreen from "../screens/pasante/PerfilPasanteScreen";
import CuentaPasanteScreen from "../screens/pasante/CuentaPasanteScreen";
import CalendarioActividadesScreen from "../screens/pasante/CalendarioActividadesScreen";
import MensajesScreen from "../screens/pasante/MensajesScreen";
import NotificacionesScreen from "../screens/common/NotificacionesScreen";

const Stack = createStackNavigator();

export default function PasanteStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2A5A8D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="DashboardPasante"
        component={DashboardPasanteScreen}
        options={{ title: "Inicio" }}
      />
      <Stack.Screen
        name="Inscribirse"
        component={InscribirseScreen}
        options={{ title: "Inscribirse a Pasantía" }}
      />
      <Stack.Screen
        name="InscripcionesActivas"
        component={InscripcionesActivasScreen}
        options={{ title: "Pasantías Inscritas" }}
      />
      {/* <Stack.Screen
        name="InscripcionesFinalizadas"
        component={InscripcionesFinalizadasScreen}
        options={{ title: "Inscripciones Finalizadas" }}
      /> */}
      <Stack.Screen
        name="Actividades"
        component={ActividadesScreen}
        options={{ title: "Gestion de Actividades" }}
      />
      <Stack.Screen
        name="CalendarioActividades"
        component={CalendarioActividadesScreen}
        options={{ title: "Actividades" }}
      />
      <Stack.Screen
        name="Notificaciones"
        component={NotificacionesScreen}
        options={{ title: "Notificaciones" }}
      />
      <Stack.Screen
        name="Mensajes"
        component={MensajesScreen}
        options={{ title: "Mensajes" }}
      />
      <Stack.Screen
        name="Perfil"
        component={PerfilPasanteScreen}
        options={{ title: "Mi Perfil" }}
      />
      <Stack.Screen
        name="Cuenta"
        component={CuentaPasanteScreen}
        options={{ title: "Mi Cuenta" }}
      />
    </Stack.Navigator>
  );
}
