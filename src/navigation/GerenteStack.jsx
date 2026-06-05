import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardGerenteScreen from "../screens/gerente/DashboardGerenteScreen";
import EmpresaScreen from "../screens/gerente/EmpresaScreen";
import PasantiasScreen from "../screens/gerente/PasantiasScreen";
import CrearPasantiaScreen from "../screens/gerente/CrearPasantiaScreen";
// import PasantiasFinalizadasScreen from "../screens/gerente/PasantiasFinalizadasScreen";
// import JefesScreen from "../screens/gerente/JefesScreen";
// import SolicitudesJefesScreen from "../screens/gerente/SolicitudesJefesScreen";
import PerfilGerenteScreen from "../screens/gerente/PerfilGerenteScreen";
// import CuentaGerenteScreen from "../screens/gerente/CuentaGerenteScreen";
//import PasantiasActivasScreen from '../screens/gerente/PasantiasActivasScreen';

const Stack = createStackNavigator();

export default function GerenteStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2A5A8D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="DashboardGerente"
        component={DashboardGerenteScreen}
        options={{ title: "Inicio" }}
      />
      <Stack.Screen
        name="Empresa"
        component={EmpresaScreen}
        options={{ title: "Mi Empresa" }}
      />
      <Stack.Screen
        name="Pasantias"
        component={PasantiasScreen}
        options={{ title: "Pasantías" }}
      />
      <Stack.Screen
        name="CrearPasantia"
        component={CrearPasantiaScreen}
        options={{ title: "Publicar Pasantía" }}
      />
      {/* <Stack.Screen
        name="PasantiasFinalizadas"
        component={PasantiasFinalizadasScreen}
        options={{ title: "Pasantías Finalizadas" }}
      /> */}
      {/* <Stack.Screen
        name="Jefes"
        component={JefesScreen}
        options={{ title: "Jefes de Pasantes" }}
      /> */}
      {/* <Stack.Screen
        name="SolicitudesJefes"
        component={SolicitudesJefesScreen}
        options={{ title: "Solicitudes de Registro" }}
      /> */}
      <Stack.Screen
        name="Perfil"
        component={PerfilGerenteScreen}
        options={{ title: "Mi Perfil" }}
      />
      {/* <Stack.Screen
        name="Cuenta"
        component={CuentaGerenteScreen}
        options={{ title: "Mi Cuenta" }}
      /> */}
      {/* <Stack.Screen
        name="PasantiasActivas"
        component={PasantiasActivasScreen}
        options={{ title: "Pasantías Iniciadas" }}
      /> */}
    </Stack.Navigator>
  );
}
