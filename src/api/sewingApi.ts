import axios from "axios";
import apiClient from "./client";

// ── 응답 타입 ──────────────────────────────────────

export interface SewingSession {
  sessionId: number;
  initiatorNickname: string;
  participantNickname: string;
  status: string;
  currentRound: number;
  updatedAt: string;
  [key: string]: unknown;
}

export interface SewingRoundInfo {
  sessionId?: number;
  roomId?: number;
  currentRound?: number;
  roundNumber?: number;
  title?: string;
  label?: string;
  question?: string;
  guide?: string;
  instruction?: string;
  aiMessage?: string;
  mediatorMessage?: string;
  myAnswer?: string;
  partnerAnswer?: string;
  status?: string;
  isCompleted?: boolean;
  nextRound?: SewingRoundInfo;
  round?: SewingRoundInfo;
  [key: string]: unknown;
}

// POST /api/sewings/{sessionId}/{round} 응답 — 두 번째 제출자만 수신 (첫 번째는 string)
// 실제 응답은 camelCase (백엔드 @JsonNaming 미적용)
export interface AiRoundAnalyzeResponse {
  sessionId: number | null;
  fMessage: string | null;
  mMessage: string | null;
  needsCycleDefinition: boolean;
  riskFlag: boolean;
}

export interface CycleExploreResponse {
  session_id: number;
  fQuestion: string;
  mQuestion: string;
}

export interface CycleDefineResponse {
  session_id: number;
  cycle_definition: string;
}

export interface CycleDefinitionResult {
  cycleDefinition: string;
  fMessage?: string;
  mMessage?: string;
}

// GET /api/sewings/{sessionId}/report 응답 — 사용자별 보고서 배열
// 백엔드가 List<MediationReport> 엔티티를 직접 반환 (camelCase)
export interface MediationReportItem {
  reportId: number;
  emotionSummary: string;
  partnerUnderstanding: string;
  mediationPlans: string;
  recommendedDialogues: string;
  user?: { email?: string; nickname?: string; [key: string]: unknown };
  [key: string]: unknown;
}

// ── sessionId 파싱 헬퍼 ────────────────────────────
// POST /api/sewings 응답이 string | number | { sessionId: number } 등 불확실하므로 유연하게 처리
function parseSessionId(data: unknown): number | null {
  if (data === null || data === undefined) return null;
  if (typeof data === "number") return data;
  if (typeof data === "string") {
    const directParsed = Number(data);
    if (!isNaN(directParsed)) return directParsed;

    const match = data.match(/(?:방 번호|sessionId|id):\s*(\d+)/i);
    if (match) {
      return Number(match[1]);
    }
    return null;
  }
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.sessionId === "number") return obj.sessionId;
    if (typeof obj.sessionId === "string") {
      const parsed = Number(obj.sessionId);
      return isNaN(parsed) ? null : parsed;
    }
    if (typeof obj.id === "number") return obj.id;
  }
  return null;
}

export function isRealSewingSessionId(sessionId: unknown): sessionId is number {
  const parsed = typeof sessionId === "string" ? Number(sessionId) : sessionId;
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0 && parsed !== 9999;
}

export function getSewingErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "요청 처리 중 오류가 발생했습니다.";
  }

  if (error.response?.status === 403) {
    return "로그인/권한 또는 연결 상태 확인이 필요합니다.";
  }

  if (error.response?.status === 500) {
    return "서버 처리 오류가 발생했습니다.";
  }

  return "요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

function logSewingFailure(label: string, error: unknown) {
  console.log(`[Sewing] ${label} 실패 status code`, axios.isAxiosError(error) ? error.response?.status ?? null : null);
}

function logAccessTokenPresence() {
  console.log("[Sewing] accessToken 존재 여부", !!localStorage.getItem("accessToken"));
}

// ── 1. 중재 세션 생성 ──────────────────────────────
// POST /api/sewings
// 응답: sessionId (형태 불확실)
export async function createSewingSession(): Promise<number | null> {
  logAccessTokenPresence();
  console.log("[Sewing] 세션 생성 시작");
  console.log("[Sewing] POST /api/sewings 호출 여부", true);

  try {
    const response = await apiClient.post("/api/sewings");
    console.log("[Sewing] 세션 생성 응답 raw data", response.data);

    const sessionId = parseSessionId(response.data);
    console.log("[Sewing] 추출된 sessionId", sessionId);

    if (!isRealSewingSessionId(sessionId)) {
      console.warn("[Sewing] mock fallback 진행 여부", true);
      return null;
    }

    console.log("[Sewing] mock fallback 진행 여부", false);
    return sessionId;
  } catch (error) {
    logSewingFailure("세션 생성", error);
    throw error;
  }
}

// ── 2. 라운드 답변 저장 ────────────────────────────
// POST /api/sewings/{sessionId}/{round}
// body: { content }
export async function submitSewingRound(
  sessionId: number,
  round: number,
  content: string,
  options?: { demoMode?: boolean }
): Promise<unknown> {
  const shouldCallRealApi = isRealSewingSessionId(sessionId);
  logAccessTokenPresence();
  console.log("[Sewing] round 저장 호출 여부", shouldCallRealApi, { sessionId, round });

  if (!shouldCallRealApi) {
    console.warn("[Sewing] mock fallback 진행 여부", true);
    return null;
  }

  const url = `/api/sewings/${sessionId}/${round}`;
  const body = options?.demoMode ? { content, demoMode: true, isDemo: true } : { content };
  console.log("[Sewing] 라운드 저장 요청 URL", url);
  console.log("[Sewing] 라운드 저장 body", body);

  try {
    const response = await apiClient.post(url, body);
    console.log("[Sewing] POST /api/sewings/{sessionId}/{round} 응답", response.data);
    return response.data;
  } catch (error) {
    logSewingFailure("round 저장", error);
    throw error;
  }
}

export async function getCycleExploreQuestions(sessionId: number): Promise<CycleExploreResponse> {
  const response = await apiClient.post<CycleExploreResponse>(
    `/api/sewings/${sessionId}/cycle/explore`
  );
  return response.data;
}

export async function defineCycle(
  sessionId: number,
  fExploreAnswer: string,
  mExploreAnswer: string
): Promise<CycleDefineResponse> {
  const response = await apiClient.post<CycleDefineResponse>(
    `/api/sewings/${sessionId}/cycle/define`,
    { session_id: sessionId, f_explore_answer: fExploreAnswer, m_explore_answer: mExploreAnswer }
  );
  return response.data;
}

export async function getCycleDefinition(sessionId: number): Promise<CycleDefinitionResult> {
  const response = await apiClient.get<CycleDefinitionResult>(
    `/api/sewings/${sessionId}/cycle/definition`
  );
  return response.data;
}

// GET /api/sewings/{sessionId}/report — 백엔드가 GET 메서드, body 없음
export async function createReport(sessionId: number): Promise<MediationReportItem[]> {
  const response = await apiClient.get<MediationReportItem[]>(
    `/api/sewings/${sessionId}/report`
  );
  return response.data;
}

// ── 현재 라운드 조회 ────────────────────────────────
// 우선 전용 API를 사용하고, 백엔드가 아직 미구현이면 호출부에서 session-list로 fallback합니다.
export async function getCurrentSewingRound(sessionId: number): Promise<number> {
  logAccessTokenPresence();
  const url = `/api/sewings/${sessionId}/current-round`;
  console.log("[Sewing] 현재 라운드 조회 요청 URL", url);

  const response = await apiClient.get(url);
  console.log("[Sewing] 현재 라운드 조회 응답", response.data);
  return (response.data as number) ?? 1;
}

// ── 3. 세션 참여 ────────────────────────────
// POST /api/sewings/{sessionId}/join
export async function joinSewingSession(sessionId: number): Promise<unknown> {
  if (!isRealSewingSessionId(sessionId)) {
    console.log("[Sewing] join API 호출 여부", false, { sessionId });
    return null;
  }

  logAccessTokenPresence();
  const url = `/api/sewings/${sessionId}/join`;
  console.log("[Sewing] join API 호출 여부", true, { url });
  try {
    const response = await apiClient.post(url);
    console.log("[Sewing] join API 응답", response.data);
    return response.data;
  } catch (error) {
    logSewingFailure("join", error);
    throw error;
  }
}

// ── 4. 세션 목록 조회 ──────────────────────────────
// GET /api/sewings/session-list
export async function getSewingSessionList(): Promise<SewingSession[]> {
  console.log("[Sewing] session-list 호출 여부", true);
  const response = await apiClient.get("/api/sewings/session-list");
  console.log("[Sewing] session-list 응답", response.data);
  return response.data as SewingSession[];
}

// ── 5. 세션 라운드 기록 조회 ────────────────────────
// GET /api/sewings/{sessionId}/records
export interface SessionRecord {
  recordId: number;
  sessionId: number;
  email: string;
  nickname: string;
  gender: string;
  roundNumber: number;
  content: string;
  aiResponse: string | null;
  needsCycleDefinition?: boolean;
}

export async function getSessionRecords(sessionId: number): Promise<SessionRecord[]> {
  const url = `/api/sewings/${sessionId}/records`;
  console.log("[Sewing] records 조회 요청 URL", url);
  const response = await apiClient.get(url);
  console.log("[Sewing] records 조회 응답", response.data);
  return response.data as SessionRecord[];
}
