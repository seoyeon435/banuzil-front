import axios from "axios";
import apiClient from "./client";

interface LoginRequest {
  email: string;
  password: string;
}

type LoginResponse = {
  accessToken?: string;
  token?: string;
  email?: string;
  nickname?: string;
  userId?: number | string;
  id?: number | string;
  [key: string]: unknown;
} | string;

export interface CurrentUser {
  email?: string;
  nickname?: string;
  userId?: string;
}

const CURRENT_USER_KEY = "currentUser";

function readStringField(data: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function saveCurrentUser(user: CurrentUser): void {
  const previous = getStoredCurrentUser();
  const next = { ...previous, ...user };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
}

function saveCurrentUserFromResponse(data: LoginResponse, fallbackEmail: string): void {
  if (typeof data === "string") {
    saveCurrentUser({ email: fallbackEmail, nickname: fallbackEmail.split("@")[0] });
    return;
  }

  saveCurrentUser({
    email: data.email ?? fallbackEmail,
    nickname: typeof data.nickname === "string" ? data.nickname : fallbackEmail.split("@")[0],
    userId: data.userId !== undefined ? String(data.userId) : data.id !== undefined ? String(data.id) : undefined,
  });
}

export function getStoredCurrentUser(): CurrentUser {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return {};
  }
}

export async function fetchCurrentUserProfile(): Promise<CurrentUser | null> {
  try {
    const response = await apiClient.get<Record<string, unknown>>("/api/users/profile");
    const data = response.data;
    const user = {
      email: readStringField(data, ["email", "loginId"]),
      nickname: readStringField(data, ["nickname", "name"]),
      userId: readStringField(data, ["userId", "id"]),
    };
    saveCurrentUser(user);
    return getStoredCurrentUser();
  } catch (error) {
    console.error("[API] GET /api/users/profile failed:", error);
    return null;
  }
}

export function getLoginErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "로그인 처리 중 알 수 없는 오류가 발생했습니다.";
  }

  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.";
  }

  const status = error.response?.status;

  if (status === 400 || status === 401) {
    return "아이디 또는 비밀번호를 확인해주세요.";
  }

  if (status === 500) {
    return "서버 오류가 발생했습니다. 백엔드 확인이 필요합니다.";
  }

  if (error.message === "Network Error" || !error.response) {
    return "서버에 연결할 수 없습니다.";
  }

  return "로그인 처리 중 오류가 발생했습니다.";
}

function getLoginErrorType(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "unknown";
  }

  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return "timeout";
  }

  if (error.response?.status) {
    return `http_${error.response.status}`;
  }

  if (error.message === "Network Error" || !error.response) {
    return "network_error";
  }

  return error.code ?? "axios_error";
}

// POST /api/users/login
// Saves the access token returned by the backend for authenticated API calls.
export async function login(email: string, password: string): Promise<void> {
  const body: LoginRequest = { email, password };
  console.log("[API] POST /api/users/login request started", { email });

  try {
    const response = await apiClient.post<LoginResponse>("/api/users/login", body);
    console.log("[API] POST /api/users/login response success", {
      status: response.status,
      tokenPresent: !!response.data,
    });

    const data = response.data;
    const token = typeof data === "string" ? data : data.accessToken ?? data.token ?? null;

    if (token && typeof token === "string") {
      localStorage.setItem("accessToken", token);
      saveCurrentUserFromResponse(data, email);
      void fetchCurrentUserProfile();
      return;
    }

    throw new Error("Token was not found in the login response.");
  } catch (error) {
    console.log("[API] POST /api/users/login error", {
      type: getLoginErrorType(error),
      status: axios.isAxiosError(error) ? error.response?.status ?? null : null,
      code: axios.isAxiosError(error) ? error.code ?? null : null,
    });
    throw error;
  }
}

export async function loginWithTestAccount(): Promise<void> {
  await login("tester@test.com", "pw1234");
}

export function logout(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("accessToken");
}
