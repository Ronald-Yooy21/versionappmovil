import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardAdminScreen from "../screens/admin/DashboardAdminScreen";
import UsuariosScreen from "../screens/admin/UsuariosScreen";
import SolicitudesScreen from "../screens/admin/SolicitudesScreen";

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen} />
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
    </Stack.Navigator>
  );
}