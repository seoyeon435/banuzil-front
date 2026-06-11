import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  getCurrentSewingRound,
  getCycleExploreQuestions,
  getCycleDefinition,
  defineCycle,
  getSessionRecords,
  getSewingErrorMessage,
  getSewingSessionList,
  isRealSewingSessionId,
  submitSewingRound,
  type AiRoundAnalyzeResponse,
  type CycleExploreResponse,
  type SessionRecord,
  type SewingRoundInfo,
  type SewingSession,
} from "../../api/sewingApi";
import { getStoredCurrentUser } from "../../api/userApi";
import { useDisplayNames } from "../utils/useDisplayNames";

type RoundPhase = "input" | "waiting_partner" | "cycle" | "cycle_result";

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
  isCycle?: boolean;
}

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

function findAiResponseForRound(records: SessionRecord[], roundNumber: number, email?: string): string | null {
  const sameRoundRecords = records.filter((record) => record.roundNumber === roundNumber && record.aiResponse);
  const myRecord = sameRoundRecords.find((record) => email && record.email === email);
  return myRecord?.aiResponse ?? sameRoundRecords[0]?.aiResponse ?? null;
}

// 위기 신호 감지 — AI가 risk 감지 시 응답에 자살예방상담 관련 표현을 포함함
function containsRiskSignal(text: string): boolean {
  return ["1393", "자살예방상담", "위기상담", "스스로를 해치"].some((s) => text.includes(s));
}

function findLatestPreviousAiResponse(records: SessionRecord[], currentRound: number, email?: string): string | null {
  const previousRecords = records
    .filter((record) => record.roundNumber < currentRound && record.aiResponse)
    .sort((a, b) => b.roundNumber - a.roundNumber);
  const myRecord = previousRecords.find((record) => email && record.email === email);
  return myRecord?.aiResponse ?? previousRecords[0]?.aiResponse ?? null;
}

export default function MediationResultPage() {
  const navigate = useNavigate();
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
  const [myGender, setMyGender] = useState("");
  const [cycleQuestions, setCycleQuestions] = useState<CycleExploreResponse | null>(null);
  const [cycleAnswer, setCycleAnswer] = useState("");
  const [isCycleSubmitting, setIsCycleSubmitting] = useState(false);
  const [cycleDefinitionText, setCycleDefinitionText] = useState<string | null>(null);
  const [cycleFMessage, setCycleFMessage] = useState<string | null>(null);
  const [cycleMMessage, setCycleMMessage] = useState<string | null>(null);
  const [savedCycleExploreQuestion, setSavedCycleExploreQuestion] = useState("");
  const [savedCycleAnswer, setSavedCycleAnswer] = useState("");
  const [showRiskModal, setShowRiskModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const myInputRef = useRef<HTMLTextAreaElement>(null);
  const cycleAnswerRef = useRef<HTMLTextAreaElement>(null);
  const submitInFlightRef = useRef(false);
  const cycleSubmittedRoundRef = useRef<number | null>(null);
  const cycleDefinitionPollingRef = useRef(false);

  const sessionId = sessionStorage.getItem("sewingSessionId");
  const canUseRealApi = isRealSewingSessionId(sessionId);
  const myEmail = getStoredCurrentUser().email;
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
        const myRecord = records.find((r) => r.email === myEmail);
        if (myRecord?.gender) setMyGender(myRecord.gender);
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
        const myRecord = records.find((r) => r.email === myEmail);
        if (myRecord?.gender) setMyGender(myRecord.gender);
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

  const applyNextRound = useCallback((
    next: RoundViewModel,
    myAnswer: string,
    partnerAnswer?: string,
    aiMessageOverride?: string | null,
    cycleData?: { question: string; answer: string; definition: string },
  ) => {
    setCompletedRounds((prev) => {
      const roundEntry: CompletedRound = {
        roundNumber: roundInfo.roundNumber,
        title: roundInfo.title,
        question: roundInfo.question,
        myAnswer,
        partnerAnswer: partnerAnswer || roundInfo.partnerAnswer || "상대방 답변을 기다리는 중입니다.",
        aiMessage: aiMessageOverride || roundInfo.aiMessage || DEFAULT_AI_MESSAGE,
      };
      if (!cycleData) return [...prev, roundEntry];
      return [
        ...prev,
        roundEntry,
        {
          roundNumber: -1,
          title: "사이클 탐색",
          question: cycleData.question,
          myAnswer: cycleData.answer,
          partnerAnswer: "",
          aiMessage: cycleData.definition,
          isCycle: true,
        },
      ];
    });
    setRoundInfo(next);
    setPhase("input");
    setSavedMyInput("");
    setMyInput("");
    setErrorMsg("");
    setMyAiMessage(aiMessageOverride ?? null);
    setLastCheckedAt(new Date().toLocaleTimeString());
  }, [roundInfo]);

  useEffect(() => {
    if (phase !== "waiting_partner" || !canUseRealApi) return;

    const poll = async () => {
      try {
        const [records, backendRound] = await Promise.all([
          getSessionRecords(Number(sessionId)),
          getCurrentSewingRound(Number(sessionId)),
        ]);

        const currentRoundAiResponse = findAiResponseForRound(records, roundInfo.roundNumber, myEmail);

        if (currentRoundAiResponse) {
          setMyAiMessage(currentRoundAiResponse);
          // 첫 번째 제출자는 risk_flag를 응답으로 못 받으므로 AI 메시지 내용으로 위기 신호 감지
          if (containsRiskSignal(currentRoundAiResponse)) {
            setShowRiskModal(true);
          }
          // 12라운드: AI 응답 도착 = 상대방도 제출 완료 → 보고서 페이지로 이동
          if (roundInfo.roundNumber >= 12) {
            navigate("/mediation/complete");
            return;
          }
        }

        setLastCheckedAt(new Date().toLocaleTimeString());

        // records에서 현재 라운드의 needsCycleDefinition 감지 → 사이클 UI 전환
        // 이미 이 라운드에서 사이클을 제출했으면 다시 트리거하지 않음
        const hasCycleSignal =
          cycleSubmittedRoundRef.current !== roundInfo.roundNumber &&
          records.some(
            (r) => r.roundNumber === roundInfo.roundNumber && r.needsCycleDefinition === true
          );
        if (hasCycleSignal) {
          try {
            console.log("[Cycle] needsCycleDefinition=true 감지, cycle/explore 호출 시작");
            const questions = await getCycleExploreQuestions(Number(sessionId));
            console.log("[Cycle] cycle/explore 응답", questions);
            setCycleQuestions(questions);
            setPhase("cycle");
            return;
          } catch (cycleError) {
            console.error("[Cycle] cycle/explore 실패 — 다음 라운드로 fallback", cycleError);
          }
        }

        // 사이클 제출 후 파트너 제출 대기 중이면 cycle definition 폴링
        // 대기 중에는 라운드 전진 조건을 절대 평가하지 않음
        if (cycleDefinitionPollingRef.current) {
          try {
            const def = await getCycleDefinition(Number(sessionId));
            if (def.cycleDefinition) {
              setCycleDefinitionText(def.cycleDefinition);
              if (def.fMessage) setCycleFMessage(def.fMessage);
              if (def.mMessage) setCycleMMessage(def.mMessage);
              cycleDefinitionPollingRef.current = false;
              setPhase("cycle_result");
            }
          } catch {
            // 아직 생성 중이면 무시하고 다음 폴링 때 재시도
          }
          return;
        }

        if (backendRound > roundInfo.roundNumber) {
          if (roundInfo.roundNumber >= 12) {
            navigate("/mediation/complete");
            return;
          }
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
  }, [phase, canUseRealApi, myEmail, roundInfo.roundNumber, savedMyInput, sessionId, applyNextRound]);

  const handleSubmitMyAnswer = async () => {
    // DOM 값을 직접 읽어 한국어 IME 조합 중 마지막 글자 유실 방지
    const currentValue = myInputRef.current?.value ?? myInput;
    if (submitInFlightRef.current || currentValue.trim().length === 0) return;
    submitInFlightRef.current = true;
    setIsSubmitting(true);
    setErrorMsg("");

    const content = currentValue.trim();

    try {
      if (!canUseRealApi) {
        throw new Error("중재 방 정보를 확인할 수 없어 답변을 저장할 수 없습니다.");
      }

      const response = await submitSewingRound(Number(sessionId), roundInfo.roundNumber, content);

      // 두 번째 제출자는 AiRoundAnalyzeResponse를 받음 — needsCycleDefinition / riskFlag 확인
      const aiResp = (typeof response === "object" && response !== null)
        ? (response as AiRoundAnalyzeResponse)
        : null;

      // 백엔드 @JsonNaming(SnakeCaseStrategy) 적용으로 risk_flag로 내려옴 — 두 케이스 모두 체크
      const rawResp = response as Record<string, unknown>;
      if (rawResp?.risk_flag === true || rawResp?.riskFlag === true) {
        setShowRiskModal(true);
      }

      if (aiResp?.needsCycleDefinition) {
        try {
          const questions = await getCycleExploreQuestions(Number(sessionId));
          setCycleQuestions(questions);
          setSavedMyInput(content);
          setMyInput("");
          setPhase("cycle");
          return;
        } catch {
          // cycle/explore 실패 시 waiting_partner로 fallback
        }
      }

      // 12라운드 완료: 두 번째 제출자는 바로 보고서 페이지로 이동
      if (roundInfo.roundNumber >= 12) {
        navigate("/mediation/complete");
        return;
      }

      setSavedMyInput(content);
      setMyInput("");
      setPhase("waiting_partner");
    } catch (error) {
      console.error("[API] 라운드 답변 저장 실패:", error);
      if (error instanceof Error && error.message.includes("중재 방")) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(getSewingErrorMessage(error));
      }
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const isFemale = /female|여성|여/i.test(myGender);

  const handleCycleSubmit = async () => {
    const currentCycleValue = cycleAnswerRef.current?.value ?? cycleAnswer;
    if (currentCycleValue.trim().length === 0 || isCycleSubmitting) return;
    setIsCycleSubmitting(true);
    setErrorMsg("");

    const answerText = currentCycleValue.trim();
    const questionText = isFemale ? (cycleQuestions?.fQuestion ?? "") : (cycleQuestions?.mQuestion ?? "");

    try {
      const result = await defineCycle(Number(sessionId), answerText);
      // 두번째 제출자는 응답에 f_message/m_message가 즉시 포함됨
      const defResp = (result && typeof result === "object") ? result as { f_message?: string; m_message?: string } : null;
      if (defResp?.f_message) setCycleFMessage(defResp.f_message);
      if (defResp?.m_message) setCycleMMessage(defResp.m_message);

      cycleSubmittedRoundRef.current = roundInfo.roundNumber;
      cycleDefinitionPollingRef.current = true;
      setSavedCycleExploreQuestion(questionText);
      setSavedCycleAnswer(answerText);
      setCycleAnswer("");
      setCycleQuestions(null);
      setPhase("waiting_partner");
    } catch (error) {
      setErrorMsg(getSewingErrorMessage(error));
    } finally {
      setIsCycleSubmitting(false);
    }
  };

  const handleCycleDefinitionNext = useCallback(async () => {
    const definition = cycleDefinitionText ?? "";
    let personalMsg: string | null = isFemale ? cycleFMessage : cycleMMessage;

    // GET /cycle/definition이 fMessage/mMessage를 null로 반환하는 경우
    // records에서 content=""인 브릿지 레코드를 찾아 fallback
    if (!personalMsg && canUseRealApi) {
      try {
        const records = await getSessionRecords(Number(sessionId));
        const bridgeRecord = records.find((r) => r.content === "" && r.email === myEmail);
        if (bridgeRecord?.aiResponse) personalMsg = bridgeRecord.aiResponse;
      } catch {}
    }

    setCycleDefinitionText(null);
    setCycleFMessage(null);
    setCycleMMessage(null);

    const cycleData = (savedCycleExploreQuestion || savedCycleAnswer)
      ? { question: savedCycleExploreQuestion, answer: savedCycleAnswer, definition }
      : undefined;

    setSavedCycleExploreQuestion("");
    setSavedCycleAnswer("");

    if (roundInfo.roundNumber >= 12) {
      navigate("/mediation/complete");
      return;
    }

    try {
      const current = await getCurrentSewingRound(Number(sessionId));
      applyNextRound(normalizeRoundInfo(current), savedMyInput, undefined, personalMsg, cycleData);
    } catch {
      applyNextRound(normalizeRoundInfo(roundInfo.roundNumber + 1), savedMyInput, undefined, personalMsg, cycleData);
    }
  }, [isFemale, cycleFMessage, cycleMMessage, cycleDefinitionText, sessionId, savedMyInput, applyNextRound, roundInfo.roundNumber, savedCycleExploreQuestion, savedCycleAnswer, canUseRealApi, myEmail]);

  const handleComplete = () => {
    navigate("/mediation/complete");
  };

  const handleEarlyExit = () => {
    navigate("/mediation/complete", { state: { earlyExit: true } });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex min-w-0">
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-[480px] bg-white rounded-2xl p-8 shadow-[0_16px_64px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#DC3545]/10 mx-auto mb-5">
              <span className="text-3xl">🚨</span>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A2E] text-center mb-2">
              지금 괜찮으신가요?
            </h2>
            <p className="text-sm text-[#6F7787] text-center leading-relaxed mb-6">
              이번 상담 중 걱정되는 표현이 감지되었어요.
              <br />
              힘든 마음이 있다면 혼자 견디지 않아도 돼요.
              <br />
              전문가의 도움을 받아보세요.
            </p>
            <div className="bg-[#FFF3F3] border border-[#DC3545]/20 rounded-xl p-4 space-y-2 mb-6">
              <p className="text-sm font-semibold text-[#1A1A2E]">위기 상담 전화</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6F7787]">자살예방상담전화</span>
                <a href="tel:1393" className="text-sm font-bold text-[#DC3545]">1393</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6F7787]">정신건강위기상담전화</span>
                <a href="tel:15770199" className="text-sm font-bold text-[#DC3545]">1577-0199</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6F7787]">긴급전화</span>
                <a href="tel:119" className="text-sm font-bold text-[#DC3545]">119</a>
              </div>
            </div>
            <button
              onClick={() => setShowRiskModal(false)}
              className="w-full py-3 bg-[#1A1A2E] text-white rounded-full font-medium hover:bg-[#0F0F1F] transition-all"
            >
              계속 상담하기
            </button>
          </div>
        </div>
      )}
      <aside className="hidden xl:flex w-[280px] bg-[#EFEDE7] p-6 flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-5">중재 진행 상황</h2>

        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
            현재 {roundInfo.roundNumber}라운드
          </div>
          <div className="space-y-2">
            {completedRounds.map((round, i) => (
              <div key={round.isCycle ? `cycle-${i}` : round.roundNumber} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5A9F7C]" />
                <span className="text-xs text-[#5A9F7C] line-through">
                  {round.isCycle ? "사이클 탐색 완료" : `${round.roundNumber}라운드 완료`}
                </span>
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

          {completedRounds.map((round, i) =>
            round.isCycle ? (
              <section
                key={`cycle-${i}`}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(35,40,56,0.06)] overflow-hidden border border-[#5A9F7C]/30"
              >
                <div className="bg-[#E0F4E8] px-4 sm:px-6 py-3 flex items-center gap-3">
                  <span className="font-semibold text-[#1A1A2E] text-sm">사이클 탐색 · 관계 패턴 파악</span>
                  <span className="ml-auto text-[#5A9F7C] text-xs font-semibold">완료</span>
                </div>
                <div className="p-6 space-y-4">
                  {round.question && (
                    <p className="text-sm text-[#6F7787]">
                      <span className="font-medium text-[#1A1A2E]">탐색 질문: </span>
                      {round.question}
                    </p>
                  )}
                  {round.myAnswer && (
                    <AnswerCard initial={currentInitial} title={`${currentName}의 답변`} answer={round.myAnswer} />
                  )}
                  {round.aiMessage && (
                    <div className="bg-[#E0F4E8] border border-[#5A9F7C]/40 rounded-xl p-4">
                      <p className="text-xs font-semibold text-[#5A9F7C] mb-2">우리의 관계 사이클</p>
                      <p className="text-sm text-[#1A1A2E] leading-relaxed whitespace-pre-wrap">{round.aiMessage}</p>
                    </div>
                  )}
                </div>
              </section>
            ) : (
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
            )
          )}

          <section className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(35,40,56,0.102)] overflow-hidden">
            <div className="bg-[#1A1A2E]/10 px-4 sm:px-6 py-4 flex items-center gap-3 border-b border-[#1A1A2E]/20">
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A2E] break-words">
                  {roundInfo.roundNumber}라운드 · {roundInfo.title}
                </p>
                <p className="text-xs text-[#1A1A2E]">
                  {isLoading
                    ? "현재 라운드 정보를 불러오는 중"
                    : phase === "waiting_partner"
                    ? `${partnerName}의 답변을 기다리는 중`
                    : phase === "cycle_result"
                    ? "사이클 정의 확인"
                    : phase === "cycle"
                    ? "사이클 탐색 질문"
                    : `${currentName} 답변 입력 중`}
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

              {phase === "cycle" && cycleQuestions ? (
                <div className="space-y-4">
                  <div className="bg-[#E0F4E8] border-l-4 border-[#5A9F7C] rounded-xl p-4">
                    <p className="text-xs text-[#5A9F7C] font-semibold mb-1">사이클 탐색 질문</p>
                    <p className="text-sm text-[#1A1A2E] leading-relaxed">
                      {isFemale ? cycleQuestions.fQuestion : cycleQuestions.mQuestion}
                    </p>
                  </div>
                  <p className="text-xs text-[#6F7787]">
                    두 분의 관계 패턴을 더 잘 이해하기 위한 질문이에요. 솔직하게 답변해 주세요.
                  </p>
                  <textarea
                    ref={cycleAnswerRef}
                    value={cycleAnswer}
                    onChange={(e) => setCycleAnswer(e.target.value)}
                    placeholder="질문에 대한 답변을 입력해주세요."
                    className="w-full h-[120px] p-4 bg-[#FAFAF7] border-2 border-[#E5E2DC] rounded-xl focus:outline-none focus:border-[#1A1A2E] resize-none text-[#1A1A2E] text-sm"
                  />
                  <button
                    onClick={handleCycleSubmit}
                    disabled={cycleAnswer.trim().length === 0 || isCycleSubmitting}
                    className={`w-full py-3 rounded-full font-medium text-sm transition-all ${
                      cycleAnswer.trim().length > 0 && !isCycleSubmitting
                        ? "bg-[#5A9F7C] text-white hover:bg-[#4A8F6C] shadow-[0_4px_16px_rgba(90,159,124,0.25)]"
                        : "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
                    }`}
                  >
                    {isCycleSubmitting ? "제출 중..." : "사이클 답변 제출"}
                  </button>
                  {errorMsg && <p className="text-sm text-[#DC3545] mt-1">{errorMsg}</p>}
                </div>
              ) : phase === "cycle_result" ? (
                <div className="space-y-4">
                  <div className="bg-[#E0F4E8] border border-[#5A9F7C]/40 rounded-xl p-5">
                    <p className="text-sm font-semibold text-[#5A9F7C] mb-3">우리의 관계 사이클</p>
                    <p className="text-sm text-[#1A1A2E] leading-relaxed whitespace-pre-wrap">{cycleDefinitionText}</p>
                  </div>
                  <button
                    onClick={handleCycleDefinitionNext}
                    className="w-full py-3 rounded-full font-medium text-sm bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)] transition-all"
                  >
                    다음
                  </button>
                </div>
              ) : phase === "input" ? (
                <div>
                  <p className="text-xs text-[#6F7787] mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold">
                      {currentInitial}
                    </span>
                    {currentName}의 답변을 입력해주세요
                  </p>
                  <textarea
                    ref={myInputRef}
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

                  {cycleDefinitionPollingRef.current && (
                    <div className="bg-[#EBE9F2] border border-[#D4D0E8] rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#6F8197] animate-pulse" />
                        <p className="text-xs text-[#6F7787]">상대방의 사이클 답변을 기다리는 중...</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FAFAF7] border border-[#6F8197]/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full border-2 border-[#6F8197] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#6F8197] animate-pulse" />
                      </div>
                      <span className="text-sm font-medium text-[#1A1A2E]">{partnerName}의 답변</span>
                      <span className="ml-auto px-2 py-0.5 bg-[#EBE9F2] text-[#6F8197] text-xs rounded-full">대기 중</span>
                    </div>
                    {lastCheckedAt && <p className="text-xs text-[#6F7787]">마지막 확인: {lastCheckedAt}</p>}
                  </div>
                </div>
              )}

              <button
                onClick={handleComplete}
                className="w-full py-2.5 border-2 border-[#6F8197] text-[#6F8197] rounded-full hover:bg-[#EBE9F2] transition-all text-sm font-medium"
              >
                {roundInfo.roundNumber >= 12 ? "완료" : "여기까지 정리하고 결과 보기"}
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
