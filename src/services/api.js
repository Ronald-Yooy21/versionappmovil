import axios from "axios";

// Reemplaza con tu IP local (la misma que usaste en Laravel)
const API_BASE_URL = "http://192.168.0.5:8000/api/mobile";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export default api;
