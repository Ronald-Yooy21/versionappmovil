import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/auth/LoginScreen";
import GerenteStack from "./src/navigation/GerenteStack";
import PasanteStack from "./src/navigation/PasanteStack";
import AdminStack from "./src/navigation/AdminStack";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    loadAuth();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2A5A8D" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : // Según el rol, mostramos un stack diferente
      user.rol === "gerente" ? (
        <Stack.Screen name="Gerente" component={GerenteStack} />
      ) : user.rol === "pasante" ? (
        <Stack.Screen name="Pasante" component={PasanteStack} />
      ) : user.rol === "jefe" ? (
        <Stack.Screen name="Jefe" component={JefeStack} />
      ) : user.rol === "admin" ? (
        <Stack.Screen name="admin" component={AdminStack} />
      ) : (
        <Stack.Screen name="Main" component={MainScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
