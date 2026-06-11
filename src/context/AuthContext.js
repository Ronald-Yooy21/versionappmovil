import React, { createContext, useState, useContext } from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (loginInput, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login", {
        login: loginInput,
        password: password,
      });

      const { user, token } = response.data;

      console.log("User: ", user, ", Token: ", token);
      

      // Guardar token en AsyncStorage
      await AsyncStorage.setItem("@SGP:token", token);
      await AsyncStorage.setItem("@SGP:user", JSON.stringify(user));

      // Configurar token para futuras peticiones
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Si hay token, intentar cerrar sesión en el backend
      const token = await AsyncStorage.getItem("@SGP:token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Error en logout backend:", error);
    } finally {
      // Siempre limpiar storage local
      await AsyncStorage.removeItem("@SGP:token");
      await AsyncStorage.removeItem("@SGP:user");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };
  const refreshUser = async () => {
    try {
      const response = await api.get("/user");
      const userData = response.data;
      await AsyncStorage.setItem("@SGP:user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error refrescando usuario:", error);
    }
  };
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("@SGP:token");
    const userData = await AsyncStorage.getItem("@SGP:user");

    if (token && userData) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        checkAuth,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
