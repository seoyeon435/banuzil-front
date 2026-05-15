import { useNavigate } from "react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import {
  getSewingErrorMessage,
  getSewingSessionList,
  isRealSewingSessionId,
  submitSewingRound,
  type SewingSession,
} from "../../api/sewingApi";
import { useDisplayNames } from "../utils/useDisplayNames";

type RoundPhase = "input" | "waiting_partner" | "both_submitted";
type SidePanel = "progress" | "insights" | null;

interface CompletedRound {
  roundIdx: number;
  myAnswer: string;
  partnerAnswer: string;
}

function findCurrentSession(sessions: SewingSession[], sessionId: string | null): SewingSession | undefined {
  return sessions.find((session) => Number(session.sessionId) === Number(sessionId));
}

function readBooleanField(session: SewingSession | undefined, keys: string[]): boolean {
  if (!session) return false;
  return keys.some((key) => session[key] === true || session[key] === "true" || session[key] === "Y");
}

function getRoundCompletionState(session: SewingSession | undefined, apiRound: number, localSaved: boolean) {
  const status = typeof session?.status === "string" ? session.status.toUpperCase() : "";
  const currentRound = typeof session?.currentRound === "number" ? session.currentRound : 0;
  const explicitMine = readBooleanField(session, ["mySubmitted", "myInputDone", "initiatorSubmitted", "creatorSubmitted", "meSubmitted"]);
  const explicitPartner = readBooleanField(session, ["partnerSubmitted", "partnerInputDone", "participantSubmitted", "opponentSubmitted"]);
  const bothByStatus = ["BOTH_SUBMITTED", "READY_FOR_ANALYSIS", "ANALYZING", "COMPLETED", "DONE"].includes(status);
  const bothByRound = currentRound > apiRound;

  // TODO: 백엔드 session-list에 라운드별 제출 여부 필드가 확정되면 이 조건을 해당 필드 기준으로 좁히기.
  const mySaved = localSaved || explicitMine || currentRound >= apiRound || bothByStatus || bothByRound;
  const partnerSaved = explicitPartner || bothByStatus || bothByRound;

  return {
    mySaved,
    partnerSaved,
    bothSaved: mySaved && partnerSaved,
  };
}

// [MOCK 비활성화] 라운드별 라벨·이모지·AI 질문은 UI 고정 텍스트라 유지.
// 상대방 답변(mockPartnerAnswer)과 AI 분석(mockAnalysis)은 실제 BE endpoint가 없으므로 placeholder로 대체.
const PARTNER_ANSWER_PLACEHOLDER = "(상대방 답변은 실제 BE에서 받아와야 합니다 — 현재 endpoint 미정)";
const ANALYSIS_PLACEHOLDER = "(AI 분석 결과는 실제 BE에서 받아와야 합니다 — 현재 endpoint 미정)";

const ROUNDS = [
  {
    label: "사건 정리",
    emoji: "📋",
    aiQuestion: "이번 갈등에서 가장 중요하다고 느낀 장면은 무엇인가요?",
    mockPartnerAnswer: PARTNER_ANSWER_PLACEHOLDER,
    mockAnalysis: ANALYSIS_PLACEHOLDER,
    nextLabel: "다음 라운드로 이어가기",
  },
  {
    label: "감정 확인",
    emoji: "💛",
    aiQuestion: "그 순간 가장 크게 느낀 감정은 무엇이었나요?",
    mockPartnerAnswer: PARTNER_ANSWER_PLACEHOLDER,
    mockAnalysis: ANALYSIS_PLACEHOLDER,
    nextLabel: "더 이야기하기",
  },
  {
    label: "관계 패턴 분석",
    emoji: "🔄",
    aiQuestion: "이런 갈등이 이전에도 반복된 적이 있나요?",
    mockPartnerAnswer: PARTNER_ANSWER_PLACEHOLDER,
    mockAnalysis: ANALYSIS_PLACEHOLDER,
    nextLabel: "대화 문장 만들기",
  },
  {
    label: "대화 문장 만들기",
    emoji: "✍️",
    aiQuestion: "상대에게 안전하게 전달하고 싶은 말을 적어주세요.",
    mockPartnerAnswer: PARTNER_ANSWER_PLACEHOLDER,
    mockAnalysis: ANALYSIS_PLACEHOLDER,
    nextLabel: null,
  },
];

export default function MediationResultPage() {
  const navigate = useNavigate();
  const { currentName, currentInitial, partnerName, partnerInitial } = useDisplayNames();
  const [currentRound, setCurrentRound] = useState(0);
  const [roundPhase, setRoundPhase] = useState<RoundPhase>("input");
  const [myInput, setMyInput] = useState("");
  const [savedMyInput, setSavedMyInput] = useState("");
  const [completedRounds, setCompletedRounds] = useState<CompletedRound[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastCheckedAt, setLastCheckedAt] = useState("");
  const [activePanel, setActivePanel] = useState<SidePanel>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const submitInFlightRef = useRef(false);

  const temperature = Math.max(38, 75 - completedRounds.length * 10);
  const isLastRound = currentRound === ROUNDS.length - 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roundPhase, completedRounds.length, currentRound]);

  const getApiRound = useCallback(() => currentRound + 2, [currentRound]);

  const checkRoundCompletion = useCallback(async (localSaved = savedMyInput.trim().length > 0) => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    const apiRound = getApiRound();

    console.log("[Sewing] 현재 sessionId", sessionId);
    console.log("[Sewing] 현재 화면 라운드", currentRound + 1);
    console.log("[Sewing] 실제 API에 보낼 round 번호", apiRound);
    console.log("[Sewing] 상대방 답변 완료 polling 호출 여부", true);

    try {
      const sessions = await getSewingSessionList();
      console.log("[Sewing] 상대방 답변 완료 여부 polling 응답", sessions);
      const currentSession = findCurrentSession(sessions, sessionId);
      console.log("[Sewing] 현재 세션 상태", currentSession);
      const state = getRoundCompletionState(currentSession, apiRound, localSaved);
      console.log("[Sewing] 내 라운드 답변 저장 여부", state.mySaved);
      console.log("[Sewing] 상대방 답변 완료 여부 polling 결과", state.partnerSaved);
      console.log("[Sewing] 다음 라운드 이동 조건 충족 여부", state.bothSaved);
      setLastCheckedAt(new Date().toLocaleTimeString());

      if (state.bothSaved) {
        setRoundPhase("both_submitted");
      }

      return state;
    } catch (error) {
      console.error("[API] 라운드 완료 여부 확인 실패:", error);
      return null;
    }
  }, [currentRound, getApiRound, savedMyInput]);

  useEffect(() => {
    if (roundPhase !== "waiting_partner") return;

    void checkRoundCompletion(true);
    const intervalId = window.setInterval(() => {
      void checkRoundCompletion(true);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkRoundCompletion, roundPhase]);

  // round 매핑: 입장저장=1, 사건정리=2, 감정확인=3, 관계패턴=4, 대화문장=5
  const handleSubmitMyAnswer = async () => {
    if (submitInFlightRef.current) return;
    if (myInput.trim().length === 0) return;
    submitInFlightRef.current = true;
    setIsSubmitting(true);
    setErrorMsg("");

    const content = myInput.trim();

    const sessionId = sessionStorage.getItem("sewingSessionId");
    const isJoined = sessionStorage.getItem("sewingSessionJoined") === "true";
    if (isRealSewingSessionId(sessionId) && isJoined) {
      try {
        const apiRound = getApiRound();
        console.log("[Sewing] 현재 sessionId", sessionId);
        console.log("[Sewing] 현재 화면 라운드", currentRound + 1);
        console.log("[Sewing] 실제 API에 보낼 round 번호", apiRound);
        await submitSewingRound(Number(sessionId), apiRound, content);
        console.log("[Sewing] 라운드 답변 저장 성공", { sessionId, apiRound });
        setSavedMyInput(content);
        setMyInput("");
        setRoundPhase("waiting_partner");
        await checkRoundCompletion(true);
      } catch (error) {
        console.error("[API] 라운드 답변 저장 실패:", error);
        const state = await checkRoundCompletion(false);
        if (state?.mySaved) {
          setSavedMyInput(content);
          setMyInput("");
          setRoundPhase("waiting_partner");
        } else {
          setErrorMsg(getSewingErrorMessage(error));
        }
      } finally {
        submitInFlightRef.current = false;
        setIsSubmitting(false);
      }
    } else {
      console.log("[Sewing] 실제 API 호출 여부", false, { sessionId, isJoined, round: getApiRound() });
      setErrorMsg("중재 방 참여가 확인된 후 답변을 저장할 수 있습니다.");
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleLoadPartner = () => {
    setRoundPhase("both_submitted");
  };

  const handleNextRound = () => {
    setCompletedRounds((prev) => [
      ...prev,
      {
        roundIdx: currentRound,
        myAnswer: savedMyInput,
        partnerAnswer: ROUNDS[currentRound].mockPartnerAnswer,
      },
    ]);
    setCurrentRound((r) => r + 1);
    setRoundPhase("input");
    setSavedMyInput("");
    setErrorMsg("");
    setLastCheckedAt("");
  };

  const handleComplete = () => {
    navigate("/mediation/complete");
  };

  const handleEarlyExit = () => {
    navigate("/mediation/complete", { state: { earlyExit: true } });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex min-w-0">
      {/* ── 좌측: 상태 패널 ──────────────────────── */}
      <div className="hidden xl:flex w-[280px] bg-[#EFEDE7] p-6 flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-5">중재 진행 상황</h2>

        {/* Round Progress */}
        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
            {currentRound + 1}라운드 / 4라운드
          </div>
          <div className="space-y-2">
            {ROUNDS.map((r, i) => {
              const isDone = i < currentRound;
              const isCurrent = i === currentRound;
              const phaseLabel =
                isCurrent && roundPhase === "input"
                  ? " · 입력 중"
                  : isCurrent && roundPhase === "waiting_partner"
                  ? " · 상대방 대기"
                  : isCurrent && roundPhase === "both_submitted"
                  ? " · 분석 완료"
                  : "";
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDone
                        ? "bg-[#5A9F7C]"
                        : isCurrent
                        ? "bg-[#1A1A2E]"
                        : "bg-[#E5E2DC]"
                    }`}
                  />
                  <span
                    className={`text-xs leading-tight ${
                      isDone
                        ? "text-[#5A9F7C] line-through"
                        : isCurrent
                        ? "text-[#1A1A2E] font-semibold"
                        : "text-[#6F7787]"
                    }`}
                  >
                    {r.emoji} {r.label}
                    {isCurrent && (
                      <span className="text-[#1A1A2E]">{phaseLabel}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <div className="flex items-center gap-2 mb-2">
            <span>🌡️</span>
            <span className="text-sm font-semibold text-[#1A1A2E]">갈등 온도</span>
          </div>
          <div className="text-2xl font-bold text-[#6F8197] mb-2">{temperature}°</div>
          <div className="h-2 bg-gradient-to-r from-[#5A9F7C] via-[#6F8197] to-[#DC3545] rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1A1A2E] rounded-full"
              style={{ left: `${temperature}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#6F7787] mt-1">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>

        {/* Gottman Warning */}
        <div className="bg-[#FFE0E0] border border-[#DC3545] rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#DC3545] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#DC3545] mb-1">Gottman 위험신호</p>
              <p className="text-xs text-[#6F7787]">비난 감지 (A측)</p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl p-4 shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <div className="space-y-3">
            {[
              { initial: currentInitial, name: `나 (${currentName})`, type: "안정형" },
              { initial: partnerInitial, name: partnerName, type: "불안형" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#E8C8C0] ring-2 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] font-bold text-sm flex-shrink-0">
                  {p.initial}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1A1A2E]">{p.name}</p>
                  <span className="text-xs text-[#1A1A2E]">{p.type} 애착</span>
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
      </div>

      {/* ── 중앙: 라운드 타임라인 ───────────────────── */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 xl:p-8 overflow-y-auto">
        <div className="xl:hidden flex gap-3 mb-4">
          <button
            onClick={() => setActivePanel("progress")}
            className="flex-1 h-11 rounded-full bg-white border border-[#E5E2DC] text-[#1A1A2E] text-sm font-medium shadow-[0_4px_16px_rgba(35,40,56,0.048)]"
          >
            진행 상황 보기
          </button>
          <button
            onClick={() => setActivePanel("insights")}
            className="flex-1 h-11 rounded-full bg-white border border-[#E5E2DC] text-[#1A1A2E] text-sm font-medium shadow-[0_4px_16px_rgba(35,40,56,0.048)]"
          >
            AI 인사이트 보기
          </button>
        </div>

        <div className="max-w-[760px] mx-auto space-y-6 min-w-0">

          {/* 도입 배너 */}
          <div className="bg-[#1A1A2E]/5 border-l-4 border-[#1A1A2E] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#1A1A2E]">바느질 AI</span>
            </div>
            <p className="text-[#1A1A2E] text-sm leading-relaxed">
              두 분이 연결되었어요. EFT 상담 흐름에 따라 4라운드로 나눠 함께 이야기 나눠볼게요.
              각 라운드마다 두 분의 답변을 받아 AI가 중립적으로 분석해드립니다.
            </p>
          </div>

          {/* ── 완료된 라운드 카드들 ── */}
          {completedRounds.map((cr) => {
            const round = ROUNDS[cr.roundIdx];
            return (
              <div
                key={cr.roundIdx}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(35,40,56,0.06)] overflow-hidden border border-[#5A9F7C]/30"
              >
                {/* 라운드 헤더 */}
                <div className="bg-[#E0F4E8] px-4 sm:px-6 py-3 flex items-center gap-3 min-w-0">
                  <span className="text-xl">{round.emoji}</span>
                  <span className="font-semibold text-[#1A1A2E] text-sm min-w-0 break-words">
                    {cr.roundIdx + 1}라운드 — {round.label}
                  </span>
                  <span className="ml-auto text-[#5A9F7C] text-xs font-semibold">✓ 완료</span>
                </div>

                <div className="p-6 space-y-4">
                  {/* AI 질문 */}
                  <p className="text-sm text-[#6F7787]">
                    <span className="font-medium text-[#1A1A2E]">AI 질문: </span>
                    {round.aiQuestion}
                  </p>

                  {/* 두 사람의 답변 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#FAFAF7] rounded-xl p-4 border border-[#1A1A2E]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold flex-shrink-0">
                          {currentInitial}
                        </div>
                        <span className="text-xs font-medium text-[#1A1A2E]">{currentName}의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#6F7787] leading-relaxed">{cr.myAnswer}</p>
                    </div>
                    <div className="bg-[#FAFAF7] rounded-xl p-4 border border-[#6F8197]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8C8C0] ring-1 ring-[#6F8197] flex items-center justify-center text-[#1A1A2E] text-xs font-bold flex-shrink-0">
                          {partnerInitial}
                        </div>
                        <span className="text-xs font-medium text-[#1A1A2E]">{partnerName}님의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#6F7787] leading-relaxed">{cr.partnerAnswer}</p>
                    </div>
                  </div>

                  {/* AI 분석 */}
                  <div className="bg-[#EBE9F2] border-l-4 border-[#6F8197] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">💡</span>
                      <span className="font-semibold text-[#1A1A2E] text-xs">AI 분석</span>
                    </div>
                    <p className="text-xs text-[#1A1A2E] leading-relaxed">{round.mockAnalysis}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── 현재 진행 중인 라운드 ── */}
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(35,40,56,0.102)] overflow-hidden">
            {/* 라운드 헤더 */}
            <div className="bg-[#1A1A2E]/10 px-4 sm:px-6 py-4 flex items-center gap-3 border-b border-[#1A1A2E]/20 min-w-0">
              <span className="text-2xl">{ROUNDS[currentRound].emoji}</span>
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A2E] break-words">
                  {currentRound + 1}라운드 — {ROUNDS[currentRound].label}
                </p>
                <p className="text-xs text-[#1A1A2E]">
                  {roundPhase === "input" && `${currentName} 답변 입력 중`}
                  {roundPhase === "waiting_partner" && `${partnerName}님 답변 대기 중`}
                  {roundPhase === "both_submitted" && "두 사람의 답변 완료 · AI 분석 완료"}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* AI 질문 */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">🧵</span>
                  </div>
                <div className="flex-1 min-w-0 bg-[#1A1A2E]/5 rounded-xl p-4">
                  <p className="text-xs text-[#6F7787] mb-1">AI 질문</p>
                  <p className="text-sm font-medium text-[#1A1A2E]">
                    {ROUNDS[currentRound].aiQuestion}
                  </p>
                </div>
              </div>

              {/* ── 입력 단계 ── */}
              {roundPhase === "input" && (
                <div>
                  <p className="text-xs text-[#6F7787] mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold inline-flex flex-shrink-0">{currentInitial}</span>
                    {currentName}의 답변을 입력해주세요
                  </p>
                  <textarea
                    value={myInput}
                    onChange={(e) => setMyInput(e.target.value)}
                    placeholder="솔직하게 느낀 점을 적어주세요..."
                    className="w-full h-[100px] p-4 bg-[#FAFAF7] border-2 border-[#E5E2DC] rounded-xl focus:outline-none focus:border-[#1A1A2E] resize-none text-[#1A1A2E] text-sm"
                  />
                  <button
                    onClick={handleSubmitMyAnswer}
                    disabled={myInput.trim().length === 0 || isSubmitting}
                    className={`w-full mt-3 py-3 rounded-full font-medium transition-all text-sm ${
                      myInput.trim().length > 0 && !isSubmitting
                        ? "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                        : "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "저장 중..." : "답변 제출하기"}
                  </button>
                  {errorMsg && <p className="text-sm text-[#DC3545] mt-3">{errorMsg}</p>}
                  {completedRounds.length >= 1 && (
                    <button
                      onClick={handleEarlyExit}
                      className="w-full mt-3 py-2.5 border-2 border-[#6F8197] text-[#6F8197] rounded-full hover:bg-[#EBE9F2] transition-all text-sm font-medium"
                    >
                      여기까지 정리하고 결과 보기
                    </button>
                  )}
                </div>
              )}

              {/* ── 상대방 대기 단계 ── */}
              {roundPhase === "waiting_partner" && (
                <div className="space-y-4">
                  {/* 내 답변 카드 */}
                  <div className="bg-[#FAFAF7] border border-[#1A1A2E]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold flex-shrink-0">
                        {currentInitial}
                      </div>
                      <span className="text-sm font-medium text-[#1A1A2E]">{currentName}의 답변</span>
                      <span className="ml-auto px-2 py-0.5 bg-[#E0F4E8] text-[#5A9F7C] text-xs rounded-full">
                        ✓ 저장 완료
                      </span>
                    </div>
                    <p className="text-sm text-[#6F7787] leading-relaxed">{savedMyInput}</p>
                  </div>

                  {/* 상대방 대기 카드 */}
                  <div className="bg-[#FAFAF7] border border-[#6F8197]/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full border-2 border-[#6F8197] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#6F8197] animate-pulse" />
                      </div>
                      <span className="text-sm font-medium text-[#1A1A2E]">{partnerName}님의 답변</span>
                      <span className="ml-auto px-2 py-0.5 bg-[#EBE9F2] text-[#6F8197] text-xs rounded-full">
                        대기 중...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-[#E5E2DC] rounded animate-pulse w-full" />
                      <div className="h-2.5 bg-[#E5E2DC] rounded animate-pulse w-5/6" />
                      <div className="h-2.5 bg-[#E5E2DC] rounded animate-pulse w-3/4" />
                    </div>
                    <p className="text-xs text-[#6F7787] mt-3">{partnerName}님이 답변을 작성하고 있어요.</p>
                    {lastCheckedAt && (
                      <p className="text-xs text-[#6F7787] mt-1">마지막 확인: {lastCheckedAt}</p>
                    )}
                  </div>

                  {/* 시연용 버튼 */}
                  <details className="bg-[#EBE9F2] border border-[#EBE9F2] rounded-xl p-4">
                    <summary className="cursor-pointer text-xs font-semibold text-[#1A1A2E]">
                      개발용 mock 제어 열기
                    </summary>
                    <p className="text-xs text-[#6F7787] my-3">
                      실제 API 테스트 중에는 사용하지 마세요. 서버 상태와 무관하게 화면만 진행합니다.
                    </p>
                    <button
                      onClick={handleLoadPartner}
                      className="w-full py-3 bg-[#EFEDE7] text-[#1A1A2E] rounded-full hover:bg-[#E5E2DC] transition-all font-medium text-sm"
                    >
                      개발용: {partnerName}님 답변 불러오기
                    </button>
                  </details>
                </div>
              )}

              {/* ── 두 답변 모두 제출 / AI 분석 단계 ── */}
              {roundPhase === "both_submitted" && (
                <div className="space-y-4">
                  {/* 두 사람 답변 카드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#FAFAF7] border border-[#1A1A2E]/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8C8C0] ring-1 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-xs font-bold flex-shrink-0">
                          {currentInitial}
                        </div>
                        <span className="text-xs font-medium text-[#1A1A2E]">{currentName}의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#6F7787] leading-relaxed">{savedMyInput}</p>
                    </div>
                    <div className="bg-[#FAFAF7] border border-[#6F8197]/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8C8C0] ring-1 ring-[#6F8197] flex items-center justify-center text-[#1A1A2E] text-xs font-bold flex-shrink-0">
                          {partnerInitial}
                        </div>
                        <span className="text-xs font-medium text-[#1A1A2E]">{partnerName}님의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#6F7787] leading-relaxed">
                        {ROUNDS[currentRound].mockPartnerAnswer}
                      </p>
                    </div>
                  </div>

                  {/* AI 분석 카드 */}
                  <div className="bg-[#EBE9F2] border-l-4 border-[#6F8197] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💡</span>
                      <span className="font-semibold text-[#1A1A2E] text-sm">AI 분석</span>
                      <span className="text-xs text-[#6F7787] ml-1">두 사람의 답변을 함께 분석했어요</span>
                    </div>
                    <p className="text-sm text-[#1A1A2E] leading-relaxed">
                      {ROUNDS[currentRound].mockAnalysis}
                    </p>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col gap-3">
                    {!isLastRound ? (
                      <>
                        <button
                          onClick={handleNextRound}
                          className="w-full py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#0F0F1F] transition-all font-medium text-sm shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                        >
                          {ROUNDS[currentRound].nextLabel} →
                        </button>
                        <button
                          onClick={handleEarlyExit}
                          className="w-full py-2.5 border-2 border-[#6F8197] text-[#6F8197] rounded-full hover:bg-[#EBE9F2] transition-all text-sm font-medium"
                        >
                          여기까지 정리하고 결과 보기
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleComplete}
                        className="w-full py-3 bg-[#5A9F7C] text-white rounded-full hover:bg-[#4d8f6d] transition-all font-medium shadow-[0_4px_16px_rgba(90,159,124,0.3)]"
                      >
                        최종 중재 결과 보기 →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── 우측: AI 인사이트 패널 ────────────────── */}
      <div className="hidden xl:block w-[260px] bg-white p-6 border-l border-[#E5E2DC] overflow-y-auto flex-shrink-0">
        <h2 className="text-base font-semibold text-[#1A1A2E] mb-5">AI 인사이트</h2>

        <div className="bg-[#EBE9F2] rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-2">💡 공통점 발견</p>
          <p className="text-sm text-[#6F7787]">
            결국 둘 다 원하는 건 같아요 — 서로에게 인정받고 싶은 마음
          </p>
        </div>

        <div className="bg-[#1A1A2E]/5 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-2">🔄 반복 패턴</p>
          <p className="text-sm text-[#6F7787]">
            한쪽은 다가가고 다른 한쪽은 물러나는 추격-회피 패턴이 보여요.
          </p>
        </div>

        <div className="bg-[#E0F4E8] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-2">🤝 합의안 제안</p>
          <div className="space-y-2">
            <p className="text-xs text-[#1A1A2E] bg-white rounded-lg p-2 border border-[#5A9F7C]/30">
              시험 끝나고 짧은 여행 가기
            </p>
            <p className="text-xs text-[#1A1A2E] bg-white rounded-lg p-2 border border-[#5A9F7C]/30">
              힘들 때 바로 말하기
            </p>
          </div>
        </div>
      </div>

      {activePanel && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setActivePanel(null)}>
          <div
            className="absolute right-0 top-0 h-full w-[min(360px,92vw)] overflow-y-auto bg-white p-6 shadow-[-8px_0_24px_rgba(31,20,16,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1A1A2E]">
                {activePanel === "progress" ? "중재 진행 상황" : "AI 인사이트"}
              </h2>
              <button
                onClick={() => setActivePanel(null)}
                className="px-3 py-1.5 rounded-full border border-[#E5E2DC] text-sm text-[#6F7787] hover:bg-[#FAFAF7]"
              >
                닫기
              </button>
            </div>

            {activePanel === "progress" ? (
              <div>
                <div className="bg-[#FAFAF7] rounded-xl p-4 mb-5">
                  <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
                    {currentRound + 1}라운드 / 4라운드
                  </div>
                  <div className="space-y-2">
                    {ROUNDS.map((r, i) => {
                      const isDone = i < currentRound;
                      const isCurrent = i === currentRound;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? "bg-[#5A9F7C]" : isCurrent ? "bg-[#1A1A2E]" : "bg-[#E5E2DC]"}`} />
                          <span className={`text-xs leading-tight ${isDone ? "text-[#5A9F7C] line-through" : isCurrent ? "text-[#1A1A2E] font-semibold" : "text-[#6F7787]"}`}>
                            {r.emoji} {r.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[#FAFAF7] rounded-xl p-4 mb-5">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-2">갈등 온도</p>
                  <p className="text-2xl font-bold text-[#6F8197]">{temperature}°</p>
                </div>
                <button
                  onClick={handleEarlyExit}
                  className="w-full py-3 border-2 border-[#DC3545] text-[#DC3545] rounded-full hover:bg-[#FFE0E0] transition-all text-sm"
                >
                  중재 종료하기
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-[#EBE9F2] rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-2">💡 공통점 발견</p>
                  <p className="text-sm text-[#6F7787]">결국 둘 다 원하는 건 같아요 — 서로에게 인정받고 싶은 마음</p>
                </div>
                <div className="bg-[#1A1A2E]/5 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-2">🔄 반복 패턴</p>
                  <p className="text-sm text-[#6F7787]">한쪽은 다가가고 다른 한쪽은 물러나는 추격-회피 패턴이 보여요.</p>
                </div>
                <div className="bg-[#E0F4E8] rounded-xl p-4">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-2">🤝 합의안 제안</p>
                  <div className="space-y-2">
                    <p className="text-xs text-[#1A1A2E] bg-white rounded-lg p-2 border border-[#5A9F7C]/30">시험 끝나고 짧은 여행 가기</p>
                    <p className="text-xs text-[#1A1A2E] bg-white rounded-lg p-2 border border-[#5A9F7C]/30">힘들 때 바로 말하기</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
