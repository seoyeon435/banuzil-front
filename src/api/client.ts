import axios from "axios";

const BASE_URL = "https://two026-1-csc4004-2-2-sewing-1.onrender.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("[API] Authorization header attached (token present)");
  }
  return config;
});

export default apiClient;
