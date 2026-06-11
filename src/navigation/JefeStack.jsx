import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardJefeScreen from "../screens/jefe/DashboardJefeScreen";
import MisPasantiasScreen from "../screens/jefe/MisPasantiasScreen";
import MisPasantesScreen from "../screens/jefe/MisPasantesScreen";
import InformesScreen from "../screens/jefe/InformesScreen";
import MensajesJefeScreen from "../screens/jefe/MensajesJefeScreen";
import NotificacionesScreen from "../screens/common/NotificacionesScreen";
import SeguimientoScreen from "../screens/jefe/SeguimientoScreen";
import EvaluacionActividadesScreen from "../screens/jefe/EvaluacionActividadesScreen";
import PerfilJefeScreen from "../screens/jefe/PerfilJefeScreen";

const Stack = createStackNavigator();

export default function JefeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2A5A8D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="DashboardJefe"
        component={DashboardJefeScreen}
        options={{ title: "Inicio" }}
      />
      <Stack.Screen
        name="MisPasantias"
        component={MisPasantiasScreen}
        options={{
          headerShown: true,
          title: "Mis Pasantías",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="MisPasantes"
        component={MisPasantesScreen}
        options={{
          headerShown: true,
          title: "Mis Pasantes",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="Informes"
        component={InformesScreen}
        options={{
          headerShown: true,
          title: "Informes Finales",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="MensajesJefe"
        component={MensajesJefeScreen}
        options={{
          headerShown: true,
          title: "Mensajes",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="Notificaciones"
        component={NotificacionesScreen}
        options={{
          headerShown: true,
          title: "Notificaciones",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="Seguimiento"
        component={SeguimientoScreen}
        options={{
          headerShown: true,
          title: "Bitácoras - Seguimiento",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="EvaluacionActividades"
        component={EvaluacionActividadesScreen}
        options={{
          headerShown: true,
          title: "Actividades del Pasante",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="PerfilJefe"
        component={PerfilJefeScreen}
        options={{
          headerShown: true,
          title: "Mi Perfil",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
    </Stack.Navigator>
  );
}