import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  getCurrentSewingRound,
  getSessionRecords,
  getSewingErrorMessage,
  getSewingSessionList,
  isRealSewingSessionId,
  submitSewingRound,
  type SessionRecord,
  type SewingRoundInfo,
  type SewingSession,
} from "../../api/sewingApi";
import { getStoredCurrentUser } from "../../api/userApi";
import { useDisplayNames } from "../utils/useDisplayNames";

type RoundPhase = "input" | "waiting_partner";

interface RoundViewModel {
  roundNumber: number;
  title: string;
  question: string;
  guide: string;
  aiMessage: string;
  myAnswer: string;
  partnerAnswer: string;
  status: string;
}

interface CompletedRound {
  roundNumber: number;
  title: string;
  question: string;
  myAnswer: string;
  partnerAnswer: string;
  aiMessage: string;
}

const DEMO_PARTNER_ANSWER = "시연 모드에서는 상대방 답변이 없어도 다음 라운드로 진행합니다.";
const DEFAULT_AI_MESSAGE = "두 사람의 답변을 바탕으로 다음 질문을 준비하고 있어요.";

const ROUND_FALLBACKS: Record<number, Pick<RoundViewModel, "title" | "question" | "guide" | "aiMessage">> = {
  1: {
    title: "사건 정리",
    question: "이번 갈등에서 가장 중요하다고 느낀 장면은 무엇인가요?",
    guide: "상황을 판단하지 않고, 있었던 일을 차분히 적어주세요.",
    aiMessage: "먼저 같은 장면을 각자의 언어로 정리해볼게요.",
  },
  2: {
    title: "감정 확인",
    question: "그 순간 가장 크게 느낀 감정은 무엇이었나요?",
    guide: "분노, 서운함, 두려움처럼 내 안에서 일어난 감정을 중심으로 적어주세요.",
    aiMessage: "감정의 이름을 찾으면 서로를 방어하지 않고 이해하기 쉬워져요.",
  },
  3: {
    title: "관계 패턴 분석",
    question: "이런 갈등이 이전에도 반복된 적이 있나요?",
    guide: "반복되는 말투, 회피, 추궁, 침묵 같은 흐름이 있었는지 돌아봐주세요.",
    aiMessage: "반복 패턴을 찾으면 다음 대화에서 멈출 지점을 만들 수 있어요.",
  },
  4: {
    title: "대화 문장 만들기",
    question: "상대에게 안전하게 전달하고 싶은 말을 적어주세요.",
    guide: "비난보다 요청에 가깝게, 내가 원하는 변화를 구체적으로 적어주세요.",
    aiMessage: "마지막에는 서로가 따라 할 수 있는 대화 문장으로 정리해볼게요.",
  },
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readString(data: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return fallback;
}

function unwrapRoundPayload(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  const root = data as Record<string, unknown>;
  const nested = root.nextRound ?? root.currentRoundInfo ?? root.round;
  if (nested && typeof nested === "object") return nested as Record<string, unknown>;
  return root;
}

function normalizeRoundInfo(data: unknown, fallbackRoundNumber = 1): RoundViewModel {
  // GET /current-round 응답은 bare integer (백엔드가 Integer 그대로 반환)
  if (typeof data === "number" && Number.isFinite(data) && data > 0) {
    const roundNumber = data;
    const fallback = ROUND_FALLBACKS[roundNumber] ?? {
      title: `${roundNumber}라운드`,
      question: "이번 라운드에서 더 나누고 싶은 이야기를 적어주세요.",
      guide: "백엔드에서 내려준 라운드 번호를 기준으로 계속 이어집니다.",
      aiMessage: DEFAULT_AI_MESSAGE,
    };
    return {
      roundNumber,
      title: fallback.title,
      question: fallback.question,
      guide: fallback.guide,
      aiMessage: fallback.aiMessage,
      myAnswer: "",
      partnerAnswer: "",
      status: "",
    };
  }

  const payload = unwrapRoundPayload(data);
  const roundNumber =
    toNumber(payload.currentRound) ??
    toNumber(payload.roundNumber) ??
    toNumber(payload.round) ??
    fallbackRoundNumber;
  const fallback = ROUND_FALLBACKS[roundNumber] ?? {
    title: `${roundNumber}라운드`,
    question: "이번 라운드에서 더 나누고 싶은 이야기를 적어주세요.",
    guide: "백엔드에서 내려준 라운드 번호를 기준으로 계속 이어집니다.",
    aiMessage: DEFAULT_AI_MESSAGE,
  };

  return {
    roundNumber,
    title: readString(payload, ["title", "label", "roundTitle", "name"], fallback.title),
    question: readString(payload, ["question", "aiQuestion", "prompt"], fallback.question),
    guide: readString(payload, ["guide", "instruction", "description", "notice"], fallback.guide),
    aiMessage: readString(payload, ["aiMessage", "mediatorMessage", "analysis", "message"], fallback.aiMessage),
    myAnswer: readString(payload, ["myAnswer", "answer", "content"]),
    partnerAnswer: readString(payload, ["partnerAnswer", "opponentAnswer", "participantAnswer"]),
    status: readString(payload, ["status"], ""),
  };
}

function sessionToRoundInfo(session: SewingSession | undefined): SewingRoundInfo {
  const currentRound = typeof session?.currentRound === "number" && session.currentRound > 0 ? session.currentRound : 1;
  return {
    ...session,
    currentRound,
    roundNumber: currentRound,
  };
}

function isRoundAdvanced(response: unknown): boolean {
  if (!response || typeof response !== "object") return false;
  const payload = response as Record<string, unknown>;
  return Boolean(payload.nextRound || payload.currentRoundInfo || payload.round || payload.currentRound || payload.roundNumber);
}

function findAiResponseForRound(records: SessionRecord[], roundNumber: number, email?: string): string | null {
  const sameRoundRecords = records.filter((record) => record.roundNumber === roundNumber && record.aiResponse);
  const myRecord = sameRoundRecords.find((record) => email && record.email === email);
  return myRecord?.aiResponse ?? sameRoundRecords[0]?.aiResponse ?? null;
}

function findLatestPreviousAiResponse(records: SessionRecord[], currentRound: number, email?: string): string | null {
  const previousRecords = records
    .filter((record) => record.roundNumber < currentRound && record.aiResponse)
    .sort((a, b) => b.roundNumber - a.roundNumber);
  const myRecord = previousRecords.find((record) => email && record.email === email);
  return myRecord?.aiResponse ?? previousRecords[0]?.aiResponse ?? null;
}

function useDemoMode(): boolean {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const paramEnabled = ["true", "1", "yes"].includes(
      (searchParams.get("demoMode") ?? searchParams.get("isDemo") ?? "").toLowerCase(),
    );
    const storedEnabled = sessionStorage.getItem("sewingDemoMode") === "true";
    const mockJoined = sessionStorage.getItem("sewingSessionJoined") === "mock";
    return paramEnabled || storedEnabled || mockJoined;
  }, [searchParams]);
}

export default function MediationResultPage() {
  const navigate = useNavigate();
  const demoMode = useDemoMode();
  const { currentName, currentInitial, partnerName, partnerInitial } = useDisplayNames();
  const [roundInfo, setRoundInfo] = useState<RoundViewModel>(() => normalizeRoundInfo(null));
  const [phase, setPhase] = useState<RoundPhase>("input");
  const [myInput, setMyInput] = useState("");
  const [savedMyInput, setSavedMyInput] = useState("");
  const [completedRounds, setCompletedRounds] = useState<CompletedRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myAiMessage, setMyAiMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastCheckedAt, setLastCheckedAt] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const submitInFlightRef = useRef(false);

  const sessionId = sessionStorage.getItem("sewingSessionId");
  const canUseRealApi = isRealSewingSessionId(sessionId);
  const myEmail = getStoredCurrentUser().email;
  const temperature = Math.max(35, 78 - Math.max(0, roundInfo.roundNumber - 2) * 8);
  const currentAiMessage = myAiMessage ?? (isLoading ? "AI 중재 메시지를 불러오는 중입니다." : "아직 표시할 AI 중재 메시지가 없습니다.");

  const loadCurrentRound = useCallback(async () => {
    if (!canUseRealApi) {
      setRoundInfo(normalizeRoundInfo(null));
      setIsLoading(false);
      return normalizeRoundInfo(null);
    }

    setIsLoading(true);
    try {
      const current = await getCurrentSewingRound(Number(sessionId));
      const normalized = normalizeRoundInfo(current);
      setRoundInfo(normalized);
      try {
        const records = await getSessionRecords(Number(sessionId));
        setMyAiMessage(findLatestPreviousAiResponse(records, normalized.roundNumber, myEmail));
      } catch (recordsError) {
        console.warn("[Sewing] records 조회 실패, AI 중재 메시지를 비워둡니다.", recordsError);
        setMyAiMessage(null);
      }
      return normalized;
    } catch (error) {
      console.warn("[Sewing] current-round 조회 실패, session-list로 fallback합니다.", error);
      const sessions = await getSewingSessionList();
      const session = sessions.find((item) => Number(item.sessionId) === Number(sessionId));
      const normalized = normalizeRoundInfo(sessionToRoundInfo(session));
      setRoundInfo(normalized);
      try {
        const records = await getSessionRecords(Number(sessionId));
        setMyAiMessage(findLatestPreviousAiResponse(records, normalized.roundNumber, myEmail));
      } catch {
        setMyAiMessage(null);
      }
      return normalized;
    } finally {
      setIsLoading(false);
      setLastCheckedAt(new Date().toLocaleTimeString());
    }
  }, [canUseRealApi, myEmail, sessionId]);

  useEffect(() => {
    void loadCurrentRound();
  }, [loadCurrentRound]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [phase, completedRounds.length, roundInfo.roundNumber]);

  const applyNextRound = useCallback((next: RoundViewModel, myAnswer: string, partnerAnswer?: string, aiMessageOverride?: string | null) => {
    setCompletedRounds((prev) => [
      ...prev,
      {
        roundNumber: roundInfo.roundNumber,
        title: roundInfo.title,
        question: roundInfo.question,
        myAnswer,
        partnerAnswer: partnerAnswer || roundInfo.partnerAnswer || (demoMode ? DEMO_PARTNER_ANSWER : "상대방 답변을 기다리는 중입니다."),
        aiMessage: aiMessageOverride || roundInfo.aiMessage || DEFAULT_AI_MESSAGE,
      },
    ]);
    setRoundInfo(next);
    setPhase("input");
    setSavedMyInput("");
    setMyInput("");
    setErrorMsg("");
    setMyAiMessage(aiMessageOverride ?? null);
    setLastCheckedAt(new Date().toLocaleTimeString());
  }, [demoMode, roundInfo]);

  useEffect(() => {
    if (phase !== "waiting_partner" || demoMode || !canUseRealApi) return;

    const poll = async () => {
      try {
        const [records, backendRound] = await Promise.all([
          getSessionRecords(Number(sessionId)),
          getCurrentSewingRound(Number(sessionId)),
        ]);

        const currentRoundAiResponse = findAiResponseForRound(records, roundInfo.roundNumber, myEmail);

        if (currentRoundAiResponse) {
          setMyAiMessage(currentRoundAiResponse);
        }

        setLastCheckedAt(new Date().toLocaleTimeString());

        if (backendRound > roundInfo.roundNumber) {
          const next = normalizeRoundInfo(backendRound);
          applyNextRound(next, savedMyInput, undefined, currentRoundAiResponse);
        }
      } catch {
        // 폴링 실패는 무시
      }
    };

    void poll();
    const intervalId = window.setInterval(poll, 3000);
    return () => window.clearInterval(intervalId);
  }, [phase, demoMode, canUseRealApi, myEmail, roundInfo.roundNumber, savedMyInput, sessionId, applyNextRound]);

  const advanceInDemoMode = useCallback((content: string, response?: unknown) => {
    const responseRound = isRoundAdvanced(response)
      ? normalizeRoundInfo(response, roundInfo.roundNumber + 1)
      : null;
    const next =
      responseRound && responseRound.roundNumber > roundInfo.roundNumber
        ? responseRound
        : normalizeRoundInfo({ roundNumber: roundInfo.roundNumber + 1 }, roundInfo.roundNumber + 1);
    applyNextRound(next, content, DEMO_PARTNER_ANSWER);
  }, [applyNextRound, roundInfo.roundNumber]);

  const handleSubmitMyAnswer = async () => {
    if (submitInFlightRef.current || myInput.trim().length === 0) return;
    submitInFlightRef.current = true;
    setIsSubmitting(true);
    setErrorMsg("");

    const content = myInput.trim();

    try {
      if (!canUseRealApi) {
        if (demoMode) {
          advanceInDemoMode(content);
          return;
        }
        throw new Error("중재 방 정보를 확인할 수 없어 답변을 저장할 수 없습니다.");
      }

      const response = await submitSewingRound(Number(sessionId), roundInfo.roundNumber, content, { demoMode });

      if (demoMode) {
        advanceInDemoMode(content, response);
        return;
      }

      setSavedMyInput(content);
      setMyInput("");
      setPhase("waiting_partner");
    } catch (error) {
      console.error("[API] 라운드 답변 저장 실패:", error);
      if (demoMode) {
        advanceInDemoMode(content);
      } else if (error instanceof Error && error.message.includes("중재 방")) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(getSewingErrorMessage(error));
      }
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    navigate("/mediation/complete");
  };

  const handleEarlyExit = () => {
    navigate("/mediation/complete", { state: { earlyExit: true } });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex min-w-0">
      <aside className="hidden xl:flex w-[280px] bg-[#EFEDE7] p-6 flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-5">중재 진행 상황</h2>

        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
            현재 {roundInfo.roundNumber}라운드
          </div>
          <div className="space-y-2">
            {completedRounds.map((round) => (
              <div key={round.roundNumber} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5A9F7C]" />
                <span className="text-xs text-[#5A9F7C] line-through">{round.roundNumber}라운드 완료</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1A1A2E]" />
              <span className="text-xs text-[#1A1A2E] font-semibold">
                {roundInfo.roundNumber}라운드 {phase === "waiting_partner" ? "상대방 대기" : "입력 중"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-2">갈등 온도</p>
          <p className="text-2xl font-bold text-[#6F8197] mb-2">{temperature}°</p>
          <div className="h-2 bg-gradient-to-r from-[#5A9F7C] via-[#6F8197] to-[#DC3545] rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1A1A2E] rounded-full"
              style={{ left: `${Math.min(95, temperature)}%` }}
            />
          </div>
        </div>

        {demoMode && (
          <div className="bg-[#EBE9F2] border border-[#D4D0E8] rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-[#1A1A2E] mb-1">Demo mode</p>
            <p className="text-xs text-[#6F7787]">한 명의 답변만으로 다음 라운드 응답을 반영합니다.</p>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <div className="space-y-3">
            {[
              { initial: currentInitial, name: currentName, label: "나" },
              { initial: partnerInitial, name: partnerName, label: "상대방" },
            ].map((person) => (
              <div key={person.label} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#E8C8C0] ring-2 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] font-bold text-sm">
                  {person.initial}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1A1A2E]">{person.name}</p>
                  <span className="text-xs text-[#6F7787]">{person.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />
        <button
          onClick={handleEarlyExit}
          className="w-full py-3 border-2 border-[#DC3545] text-[#DC3545] rounded-full hover:bg-[#FFE0E0] transition-all text-sm"
        >
          중재 종료하기
        </button>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 xl:p-8 overflow-y-auto">
        <div className="max-w-[760px] mx-auto space-y-6 min-w-0">
          <div className="bg-[#1A1A2E]/5 border-l-4 border-[#1A1A2E] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#1A1A2E]">바느질 AI</span>
            </div>
            <p className="text-[#1A1A2E] text-sm leading-relaxed">
              라운드 개수는 고정하지 않고, 백엔드가 내려주는 현재 라운드 데이터를 기준으로 질문과 안내를 갱신합니다.
            </p>
          </div>

          {completedRounds.map((round) => (
            <section
              key={round.roundNumber}
              className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(35,40,56,0.06)] overflow-hidden border border-[#5A9F7C]/30"
            >
              <div className="bg-[#E0F4E8] px-4 sm:px-6 py-3 flex items-center gap-3">
                <span className="font-semibold text-[#1A1A2E] text-sm">
                  {round.roundNumber}라운드 · {round.title}
                </span>
                <span className="ml-auto text-[#5A9F7C] text-xs font-semibold">완료</span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#6F7787]">
                  <span className="font-medium text-[#1A1A2E]">질문: </span>
                  {round.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnswerCard initial={currentInitial} title={`${currentName}의 답변`} answer={round.myAnswer} />
                  <AnswerCard initial={partnerInitial} title={`${partnerName}의 답변`} answer={round.partnerAnswer} muted />
                </div>
                <AiMessage message={round.aiMessage} />
              </div>
            </section>
          ))}

          <section className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(35,40,56,0.102)] overflow-hidden">
            <div className="bg-[#1A1A2E]/10 px-4 sm:px-6 py-4 flex items-center gap-3 border-b border-[#1A1A2E]/20">
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A2E] break-words">
                  {roundInfo.roundNumber}라운드 · {roundInfo.title}
                </p>
                <p className="text-xs text-[#1A1A2E]">
                  {isLoading ? "현재 라운드 정보를 불러오는 중" : phase === "waiting_partner" ? `${partnerName}의 답변을 기다리는 중` : `${currentName} 답변 입력 중`}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base">AI</span>
                </div>
                <div className="flex-1 min-w-0 bg-[#EBE9F2] border-l-4 border-[#6F8197] rounded-xl p-4">
                  <p className="text-xs text-[#6F7787] mb-1">AI 중재 메시지</p>
                  <p className="text-sm text-[#1A1A2E] leading-relaxed whitespace-pre-wrap">{currentAiMessage}</p>
                </div>
              </div>

              {phase === "input" ? (
                <div>
                  <p className="text-xs text-[#6F7787] mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold">
                      {currentInitial}
                    </span>
                    {currentName}의 답변을 입력해주세요
                  </p>
                  <textarea
                    value={myInput}
                    onChange={(event) => setMyInput(event.target.value)}
                    placeholder="AI 중재 메시지를 읽고 지금 드는 생각을 적어주세요."
                    className="w-full h-[120px] p-4 bg-[#FAFAF7] border-2 border-[#E5E2DC] rounded-xl focus:outline-none focus:border-[#1A1A2E] resize-none text-[#1A1A2E] text-sm"
                  />
                  <button
                    onClick={handleSubmitMyAnswer}
                    disabled={myInput.trim().length === 0 || isSubmitting || isLoading}
                    className={`w-full mt-3 py-3 rounded-full font-medium transition-all text-sm ${
                      myInput.trim().length > 0 && !isSubmitting && !isLoading
                        ? "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                        : "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "저장 중..." : "내 답변 저장"}
                  </button>
                  {errorMsg && <p className="text-sm text-[#DC3545] mt-3">{errorMsg}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <AnswerCard initial={currentInitial} title={`${currentName}의 답변`} answer={savedMyInput} />
                  <div className="bg-[#FAFAF7] border border-[#6F8197]/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full border-2 border-[#6F8197] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#6F8197] animate-pulse" />
                      </div>
                      <span className="text-sm font-medium text-[#1A1A2E]">{partnerName}의 답변</span>
                      <span className="ml-auto px-2 py-0.5 bg-[#EBE9F2] text-[#6F8197] text-xs rounded-full">대기 중</span>
                    </div>
                    <p className="text-xs text-[#6F7787]">
                      일반 모드에서는 상대방 답변이 제출되면 백엔드 current round 값이 갱신되고, 이 화면이 자동으로 다음 라운드를 표시합니다.
                    </p>
                    {lastCheckedAt && <p className="text-xs text-[#6F7787] mt-2">마지막 확인: {lastCheckedAt}</p>}
                  </div>
                </div>
              )}

              <button
                onClick={handleComplete}
                className="w-full py-2.5 border-2 border-[#6F8197] text-[#6F8197] rounded-full hover:bg-[#EBE9F2] transition-all text-sm font-medium"
              >
                여기까지 정리하고 결과 보기
              </button>
            </div>
          </section>

          <div ref={bottomRef} />
        </div>
      </main>
    </div>
  );
}

function AnswerCard({
  initial,
  title,
  answer,
  muted = false,
}: {
  initial: string;
  title: string;
  answer: string;
  muted?: boolean;
}) {
  return (
    <div className={`bg-[#FAFAF7] rounded-xl p-4 border ${muted ? "border-[#6F8197]/20" : "border-[#1A1A2E]/20"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold">
          {initial}
        </div>
        <span className="text-xs font-medium text-[#1A1A2E]">{title}</span>
      </div>
      <p className="text-xs text-[#6F7787] leading-relaxed whitespace-pre-wrap">
        {answer.trim().length > 0 ? answer : "아직 답변이 없습니다."}
      </p>
    </div>
  );
}

function AiMessage({ message }: { message: string }) {
  return (
    <div className="bg-[#EBE9F2] border-l-4 border-[#6F8197] rounded-xl p-4">
      <p className="text-xs text-[#6F7787] mb-1">AI 중재 메시지</p>
      <p className="text-sm text-[#1A1A2E] leading-relaxed">{message || DEFAULT_AI_MESSAGE}</p>
    </div>
  );
}
