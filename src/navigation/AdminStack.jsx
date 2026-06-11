import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardAdminScreen from "../screens/admin/DashboardAdminScreen";
import UsuariosScreen from "../screens/admin/UsuariosScreen";
import SolicitudesScreen from "../screens/admin/SolicitudesScreen";
import NotificacionesScreen from "../screens/common/NotificacionesScreen";
import PerfilAdminScreen from "../screens/admin/PerfilAdminScreen";

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2A5A8D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="DashboardAdmin"
        component={DashboardAdminScreen}
        options={{ title: "Inicio" }}
      />
      <Stack.Screen
        name="Usuarios"
        component={UsuariosScreen}
        options={{
          headerShown: true,
          title: "Usuarios",
          headerStyle: { backgroundColor: "#2A5A8D" },
          headerTintColor: "#FFF",
        }}
      />
      <Stack.Screen
        name="Solicitudes"
        component={SolicitudesScreen}
        options={{
          headerShown: true,
          title: "Solicitudes Pendientes",
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
        name="PerfilAdmin"
        component={PerfilAdminScreen}
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