import axios from "axios";
import apiClient from "./client";

// POST /api/attachments/survey
// 요청 body: { answers: number[] } — Likert 1~7 점수 배열
// 응답:    { type, typeDescription, anxietyScore, avoidanceScore }

export type AttachmentType =
  | "SECURE"
  | "ANXIOUS"
  | "AVOIDANT"
  | "FEARFUL"
  | string; // BE가 다른 enum을 보낼 가능성도 대비

export interface AttachmentResult {
  type: AttachmentType;
  typeDescription: string;
  anxietyScore: number;
  avoidanceScore: number;
}

export interface AttachmentSurveyRequest {
  answers: number[];
}

export async function submitAttachmentSurvey(
  answers: number[],
): Promise<AttachmentResult> {
  console.log("[Attachment] POST /api/attachments/survey 요청", { count: answers.length });
  try {
    const response = await apiClient.post<AttachmentResult>(
      "/api/attachments/survey",
      { answers } satisfies AttachmentSurveyRequest,
    );
    console.log("[Attachment] POST /api/attachments/survey 응답", response.data);
    return response.data;
  } catch (error) {
    console.log("[Attachment] POST /api/attachments/survey 실패", {
      status: axios.isAxiosError(error) ? error.response?.status ?? null : null,
    });
    throw error;
  }
}

export function getAttachmentSurveyErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "설문 제출 중 오류가 발생했습니다.";
  }
  const status = error.response?.status;
  if (status === 400) return "설문 응답을 다시 확인해주세요.";
  if (status === 401) return "로그인이 만료되었어요. 다시 로그인해주세요.";
  if (status === 500) return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  if (error.message === "Network Error" || !error.response) {
    return "서버에 연결할 수 없습니다.";
  }
  return "설문 제출 중 오류가 발생했습니다.";
}

// 한글 라벨 매핑 — BE가 enum을 짧은 이름 또는 긴 이름(언더스코어 포함)으로 보낼 수 있음
export function getAttachmentLabel(type: AttachmentType): string {
  switch (type) {
    case "SECURE":
      return "안정형";
    case "ANXIOUS":
    case "PREOCCUPIED":
      return "불안형";
    case "AVOIDANT":
    case "DISMISSIVE_AVOIDANT":
    case "DISMISSING_AVOIDANT":
      return "거부회피형";
    case "FEARFUL":
    case "FEARFUL_AVOIDANT":
      return "공포회피형";
    default:
      return String(type);
  }
}

// 애착 유형별 짧은 설명 — 큰 라벨 아래 한 줄짜리 보조 텍스트로 사용
export function getAttachmentMeaning(type: AttachmentType): string {
  switch (type) {
    case "SECURE":
      return "신뢰와 안정을 추구해요";
    case "ANXIOUS":
    case "PREOCCUPIED":
      return "친밀함을 갈망해요";
    case "AVOIDANT":
    case "DISMISSIVE_AVOIDANT":
    case "DISMISSING_AVOIDANT":
      return "독립성을 중요하게 여겨요";
    case "FEARFUL":
    case "FEARFUL_AVOIDANT":
      return "친밀함과 거리 사이에서 갈등해요";
    default:
      return "";
  }
}
