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
  gender?: string;
  mbti?: string;
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
  window.dispatchEvent(new CustomEvent("currentUserChanged", { detail: next }));
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
      gender: readStringField(data, ["gender", "sex"]),
      mbti: readStringField(data, ["mbti", "MBTI", "userMbti", "personalityType"]),
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

// ── 회원가입 ────────────────────────────────────────
// POST /api/users/signup
// 응답에 토큰이 포함되지 않으므로, 가입 성공 후 login()을 호출해서 세션을 확보한다.
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  gender: string;
  mbti: string;
}

export async function signup(payload: SignupRequest): Promise<void> {
  console.log("[API] POST /api/users/signup 요청", { email: payload.email });
  try {
    const response = await apiClient.post("/api/users/signup", payload);
    console.log("[API] POST /api/users/signup 응답", { status: response.status, data: response.data });
  } catch (error) {
    console.log("[API] POST /api/users/signup 실패", {
      status: axios.isAxiosError(error) ? error.response?.status ?? null : null,
    });
    throw error;
  }
}

export function getSignupErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "회원가입 처리 중 오류가 발생했습니다.";
  }
  const status = error.response?.status;
  if (status === 409) return "이미 가입된 이메일입니다.";
  if (status === 400) return "입력 내용을 다시 확인해주세요.";
  if (status === 500) return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  if (error.message === "Network Error" || !error.response) {
    return "서버에 연결할 수 없습니다.";
  }
  return "회원가입 처리 중 오류가 발생했습니다.";
}

// ── 프로필 수정 ─────────────────────────────────────
// PATCH /api/users/profile-edit
export interface ProfileEditRequest {
  nickname: string;
  gender: string;
  mbti: string;
}

export interface UserProfile {
  email: string;
  nickname: string;
  gender: string;
  mbti: string;
  friendCode: string;
  attachmentType: string;
  attachmentTypeDescription: string;
  joinDate: string;
}

function normalizeUserProfile(data: Record<string, unknown>): UserProfile {
  return {
    email: readStringField(data, ["email", "loginId"]) ?? "",
    nickname: readStringField(data, ["nickname", "name"]) ?? "",
    gender: readStringField(data, ["gender", "sex"]) ?? "",
    mbti: readStringField(data, ["mbti", "MBTI", "userMbti", "personalityType"]) ?? "",
    friendCode: readStringField(data, ["friendCode", "code"]) ?? "",
    attachmentType: readStringField(data, ["attachmentType"]) ?? "",
    attachmentTypeDescription: readStringField(data, ["attachmentTypeDescription", "attachmentDescription"]) ?? "",
    joinDate: readStringField(data, ["joinDate", "createdAt"]) ?? "",
  };
}

export function getGenderLabel(gender?: string): string {
  const normalized = gender?.trim().toLowerCase();
  if (!normalized) return "설정 필요";
  if (["male", "m", "man", "남성", "남"].includes(normalized)) return "남성";
  if (["female", "f", "woman", "여성", "여"].includes(normalized)) return "여성";
  return gender ?? "설정 필요";
}

export async function updateProfile(payload: ProfileEditRequest): Promise<UserProfile> {
  console.log("[API] PATCH /api/users/profile-edit 요청", payload);
  const response = await apiClient.patch<Record<string, unknown>>("/api/users/profile-edit", payload);
  console.log("[API] PATCH /api/users/profile-edit 응답", response.data);
  const updated = normalizeUserProfile(response.data);

  // 캐시된 currentUser도 함께 갱신해 마이페이지가 즉시 새 닉네임을 보이게 한다.
  saveCurrentUser({
    email: updated.email,
    nickname: updated.nickname,
    gender: updated.gender,
    mbti: updated.mbti,
  });

  return updated;
}

export function getProfileEditErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "프로필 수정 중 오류가 발생했습니다.";
  }
  const status = error.response?.status;
  if (status === 400) return "입력 내용을 다시 확인해주세요.";
  if (status === 401) return "로그인이 만료되었어요. 다시 로그인해주세요.";
  if (status === 500) return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  if (error.message === "Network Error" || !error.response) {
    return "서버에 연결할 수 없습니다.";
  }
  return "프로필 수정 중 오류가 발생했습니다.";
}

// 전체 프로필 조회 (UserProfile 형태로 반환) — ProfilePage 표시용.
export async function fetchFullUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await apiClient.get<Record<string, unknown>>("/api/users/profile");
    console.log("[API] GET /api/users/profile (full) 응답", response.data);
    const profile = normalizeUserProfile(response.data);

    // 캐시된 currentUser도 함께 동기화.
    saveCurrentUser({
      email: profile.email,
      nickname: profile.nickname,
      gender: profile.gender,
      mbti: profile.mbti,
    });

    return profile;
  } catch (error) {
    console.error("[API] GET /api/users/profile (full) failed:", error);
    return null;
  }
}

// ── 마이페이지 통계 ─────────────────────────────────
// GET /api/users/my-stats
export interface MonthlyConflictCount {
  month: string; // "2026-05" 형식
  count: number;
}

export interface MyPageStats {
  totalConflictCount: number;
  agreementRate: number; // 0~100 (소수점 첫째 자리)
  monthlyConflictCounts: MonthlyConflictCount[];
}

export async function fetchMyPageStats(): Promise<MyPageStats> {
  const response = await apiClient.get<MyPageStats>("/api/users/my-stats");
  return response.data;
}

// ── 회원탈퇴 ────────────────────────────────────────
// DELETE /api/users/withdraw — soft delete (서버단). 성공 시 로컬 토큰도 삭제한다.
export async function withdrawAccount(): Promise<void> {
  console.log("[API] DELETE /api/users/withdraw 요청");
  try {
    await apiClient.delete("/api/users/withdraw");
    console.log("[API] DELETE /api/users/withdraw 성공 — 로컬 토큰 제거");
    logout();
  } catch (error) {
    console.log("[API] DELETE /api/users/withdraw 실패", {
      status: axios.isAxiosError(error) ? error.response?.status ?? null : null,
    });
    throw error;
  }
}
