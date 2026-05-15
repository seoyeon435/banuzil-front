import axios from "axios";

const BASE_URL = "https://two026-1-csc4004-2-2-sewing-1.onrender.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 — Authorization 자동 주입 + 요청 로깅
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  const method = (config.method ?? "GET").toUpperCase();
  const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
  console.log(`[API ➡️] ${method} ${fullUrl}`, {
    auth: token ? "Bearer ***" : "(none)",
    body: config.data,
    params: config.params,
  });

  return config;
});

// 응답 인터셉터 — 성공/실패 모두 로깅
apiClient.interceptors.response.use(
  (response) => {
    const method = (response.config.method ?? "GET").toUpperCase();
    const url = response.config.url ?? "";
    console.log(`[API ✅] ${response.status} ${method} ${url}`, response.data);
    return response;
  },
  (error) => {
    const method = (error.config?.method ?? "GET").toUpperCase();
    const url = error.config?.url ?? "";
    const status = error.response?.status ?? "NETWORK";
    console.log(`[API ❌] ${status} ${method} ${url}`, error.response?.data ?? error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
