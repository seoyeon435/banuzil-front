import { Link, useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrentSewingRound,
  getSewingErrorMessage,
  getSewingSessionList,
  isRealSewingSessionId,
  submitSewingRound,
  type SewingSession,
} from "../../api/sewingApi";
import { useDisplayNames } from "../utils/useDisplayNames";
import { fetchFullUserProfile } from "../../api/userApi";
import { getAttachmentLabel } from "../../api/attachmentApi";

type InputPhase = "writing" | "waiting_partner";

function findCurrentSession(sessions: SewingSession[], sessionId: string | null): SewingSession | undefined {
  return sessions.find((session) => Number(session.sessionId) === Number(sessionId));
}

function readBooleanField(session: SewingSession | undefined, keys: string[]): boolean {
  if (!session) return false;
  return keys.some((key) => session[key] === true || session[key] === "true" || session[key] === "Y");
}

function getRoundSaveState(session: SewingSession | undefined, localSaved: boolean, submittedRound: number) {
  const status = typeof session?.status === "string" ? session.status.toUpperCase() : "";
  const backendRound = typeof session?.currentRound === "number" ? session.currentRound : 0;
  const explicitMine = readBooleanField(session, ["mySubmitted", "myInputDone", "initiatorSubmitted", "creatorSubmitted", "meSubmitted"]);
  const explicitPartner = readBooleanField(session, ["partnerSubmitted", "partnerInputDone", "participantSubmitted", "opponentSubmitted"]);
  const bothByStatus = ["BOTH_SUBMITTED", "READY_FOR_ANALYSIS", "ANALYZING", "COMPLETED"].includes(status);
  const bothByRound = backendRound > submittedRound;

  return {
    mySaved: localSaved || explicitMine || backendRound >= submittedRound || bothByStatus || bothByRound,
    partnerSaved: explicitPartner || bothByStatus || bothByRound,
    bothSaved: (localSaved || explicitMine || backendRound >= submittedRound || bothByStatus || bothByRound) && (explicitPartner || bothByStatus || bothByRound),
  };
}

export default function MediationInputPage() {
  const navigate = useNavigate();
  const { currentName, currentInitial, partnerName } = useDisplayNames();
  const [input, setInput] = useState("");
  const [submittedInput, setSubmittedInput] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [phase, setPhase] = useState<InputPhase>("writing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRoundSaved, setIsRoundSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastCheckedAt, setLastCheckedAt] = useState("");
  const [myAttachmentLabel, setMyAttachmentLabel] = useState("");
  const submitInFlightRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    if (!isRealSewingSessionId(sessionId)) return;
    getCurrentSewingRound(Number(sessionId))
      .then((round) => { if (round > 0) setCurrentRound(round); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    void fetchFullUserProfile().then((profile) => {
      if (profile?.attachmentType) {
        setMyAttachmentLabel(getAttachmentLabel(profile.attachmentType));
      }
    });
  }, []);

  const checkBothInputsSaved = useCallback(async (localSaved = isRoundSaved) => {
    const sessionId = sessionStorage.getItem("sewingSessionId");

    try {
      const sessions = await getSewingSessionList();
      const currentSession = findCurrentSession(sessions, sessionId);
      const listState = getRoundSaveState(currentSession, localSaved, currentRound);
      let detailState = null;

      if (isRealSewingSessionId(sessionId)) {
        try {
          const backendRound = await getCurrentSewingRound(Number(sessionId));
          const bothDone = backendRound > currentRound;
          detailState = {
            mySaved: localSaved || bothDone,
            partnerSaved: bothDone,
            bothSaved: (localSaved || bothDone) && bothDone,
          };
        } catch (roundError) {
          console.warn("[Sewing] current-round polling 실패, session-list 결과만 사용합니다.", roundError);
        }
      }

      const state = {
        mySaved: listState.mySaved || detailState?.mySaved === true,
        partnerSaved: listState.partnerSaved || detailState?.partnerSaved === true,
        bothSaved: listState.bothSaved || detailState?.bothSaved === true,
      };
      setLastCheckedAt(new Date().toLocaleTimeString());

      if (state.bothSaved && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate("/mediation/analyzing");
      }

      return state;
    } catch (error) {
      console.error("[API] 입장 저장 완료 여부 확인 실패:", error);
      return null;
    }
  }, [isRoundSaved, navigate, currentRound]);

  useEffect(() => {
    if (phase !== "waiting_partner" || !isRoundSaved) return;

    void checkBothInputsSaved(true);
    const intervalId = window.setInterval(() => {
      void checkBothInputsSaved(true);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkBothInputsSaved, isRoundSaved, phase]);

  const saveRoundAfterJoin = async (content: string) => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    const isJoined = sessionStorage.getItem("sewingSessionJoined") === "true";

    if (!isRealSewingSessionId(sessionId)) {
      throw new Error("중재 방 정보가 없습니다.");
    }

    if (!isJoined) {
      throw new Error("상대방 참여 후 입장을 저장할 수 있습니다.");
    }

    await submitSewingRound(Number(sessionId), currentRound, content);
    setIsRoundSaved(true);
  };

  const handleSubmit = async () => {
    if (submitInFlightRef.current) return;
    if (input.trim().length === 0) return;
    submitInFlightRef.current = true;
    setIsSubmitting(true);

    const content = input.trim();
    setSubmittedInput(content);
    setErrorMsg("");

    try {
      await saveRoundAfterJoin(content);
      await checkBothInputsSaved(true);
      setPhase("waiting_partner");
    } catch (error) {
      console.error("[API] 라운드 저장 실패:", error);
      const state = await checkBothInputsSaved(false);
      if (state?.mySaved) {
        setIsRoundSaved(true);
        setPhase("waiting_partner");
        return;
      }
      if (
        error instanceof Error &&
        (error.message === "중재 방 정보가 없습니다." || error.message === "상대방 참여 후 입장을 저장할 수 있습니다.")
      ) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(getSewingErrorMessage(error));
      }
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  // ── 상대방 대기 화면 ──────────────────────────────
  if (phase !== "writing") {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-[760px]">
          {/* 진행 단계 */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs text-[#6F7787]">
            <span className="text-[#5A9F7C] font-semibold">✓ 나의 입장 저장됨</span>
            <span className="mx-2 text-[#E5E2DC]">→</span>
            <span className="text-[#1A1A2E] font-semibold">⏳ 상대방 입장 대기 중</span>
            <span className="mx-2 text-[#E5E2DC]">→</span>
            <span className="text-[#6F7787]">AI 분석</span>
          </div>

          {/* 연결 표시 */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-xl">💑</span>
            <span className="text-sm font-medium text-[#1A1A2E]">
              {isRealSewingSessionId(sessionStorage.getItem("sewingSessionId"))
                ? `방 번호: ${sessionStorage.getItem("sewingSessionId")}`
                : `${partnerName}님과 연결된 우리 공간`}
            </span>
          </div>

          {/* 두 입장 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {/* 내 입장 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(35,40,56,0.102)] border-t-4 border-[#1A1A2E]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="font-semibold text-[#1A1A2E] text-sm">{currentName}의 입장</span>
                <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-[#E0F4E8] text-[#5A9F7C]">저장 완료</span>
              </div>
              <p className="text-[#6F7787] text-sm leading-relaxed line-clamp-6">{submittedInput}</p>
            </div>

            {/* 상대방 입장 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(35,40,56,0.102)] border-t-4 border-[#E5E2DC]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full border-2 border-[#6F8197] flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6F8197] animate-pulse" />
                </div>
                <span className="font-semibold text-[#1A1A2E] text-sm">{partnerName}님의 입장</span>
                <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-[#EBE9F2] text-[#6F8197]">대기 중...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#E5E2DC] rounded animate-pulse w-full" />
                <div className="h-3 bg-[#E5E2DC] rounded animate-pulse w-5/6" />
                <div className="h-3 bg-[#E5E2DC] rounded animate-pulse w-4/6" />
                <p className="text-xs text-[#6F7787] mt-3">{partnerName}님이 입장을 입력하고 있어요.</p>
              </div>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="text-center">
            <p className="text-[#1A1A2E] font-semibold mb-1">내 입장이 저장되었어요</p>
            {isRealSewingSessionId(sessionStorage.getItem("sewingSessionId")) && (
              <p className="text-sm text-[#1A1A2E] font-semibold mb-1">방 번호: {sessionStorage.getItem("sewingSessionId")}</p>
            )}
            <p className="text-[#6F7787] text-sm">
              {partnerName}님의 입장이 입력되면 AI가 두 사람을 중립적으로 분석해드려요.
            </p>
            {lastCheckedAt && (
              <p className="text-xs text-[#6F7787] mt-2">마지막 확인: {lastCheckedAt}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 입력 화면 ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row min-w-0 overflow-x-hidden [word-break:keep-all]">
      {/* 왼쪽 패널 */}
      <div className="w-full lg:w-[380px] bg-[#EBE9F2] p-6 lg:p-8 flex flex-col flex-shrink-0">
        {/* 연결 정보 */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-[#E8C8C0] ring-2 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] font-bold text-lg">
            {currentInitial}
          </div>
          <div>
            <p className="text-[#1A1A2E] font-medium">나 ({currentName})</p>
            {myAttachmentLabel && <span className="text-xs text-[#6F7787]">{myAttachmentLabel}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-8 ml-2">
          <div className="w-[2px] h-4 bg-[#1A1A2E]/30" />
          <span className="text-xs text-[#6F7787]">상대방: {partnerName}</span>
        </div>

        {/* 안내 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(35,40,56,0.078)] mb-6">
          <h3 className="text-base font-semibold text-[#1A1A2E] mb-3 flex items-center gap-2">
            솔직하게 써주세요 <span className="text-xl">🔒</span>
          </h3>
          <div className="space-y-2 text-sm text-[#6F7787]">
            <p>상대방은 이 내용을 그대로 볼 수 없어요</p>
            <p>AI가 중립적으로 정리해서 전달해드려요</p>
            <p>상대방의 입장은 따로 입력됩니다</p>
          </div>
        </div>

        {/* 팁 아코디언 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full p-5 flex items-center justify-between text-left"
          >
            <span className="font-semibold text-[#1A1A2E] text-sm">이런 내용을 포함하면 좋아요</span>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-[#6F7787]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6F7787]" />
            )}
          </button>
          {showTips && (
            <div className="px-5 pb-5 space-y-2 text-sm text-[#6F7787]">
              <p>• 구체적인 상황 설명</p>
              <p>• 그때 느낀 감정</p>
              <p>• 내가 원했던 것</p>
              <p>• 반복되는 패턴이 있다면</p>
            </div>
          )}
        </div>

        <div className="flex-1" />
      </div>

      {/* 오른쪽 패널 */}
      <div className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 flex flex-col">
        <div className="max-w-[680px] mx-auto w-full flex-1 flex flex-col">
          <h1 className="text-[30px] font-semibold text-[#1A1A2E] mb-3">
            오늘 우리 사이에 어떤 일이 있었나요?
          </h1>
          <p className="text-[#6F7787] mb-8 leading-relaxed">
            내 입장을 먼저 차분히 적어주세요.<br />
            {partnerName}님의 입장은 따로 입력되어 AI가 함께 분석합니다.
          </p>

          {/* 입력창 */}
          <div className="flex-1 flex flex-col mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="상대방이 어떤 행동을 했는지,&#10;그때 어떤 감정이 들었는지,&#10;무엇을 원하는지 자유롭게 써주세요."
              className="flex-1 min-h-[260px] p-6 bg-[#FAFAF7] border-2 border-[#E5E2DC] rounded-2xl focus:outline-none focus:border-[#1A1A2E] transition-all resize-none text-[#1A1A2E] leading-relaxed"
              maxLength={1000}
            />
            <div className="text-right text-sm text-[#6F7787] mt-2">
              {input.length}/1000
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <Link
              to="/mediation/start"
              className="px-8 py-3 border-2 border-[#E5E2DC] text-[#6F7787] rounded-full hover:bg-[#EFEDE7] transition-all"
            >
              ← 뒤로
            </Link>
            <button
              onClick={handleSubmit}
              disabled={input.trim().length === 0 || isSubmitting}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${
                input.trim().length > 0 && !isSubmitting
                  ? "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                  : "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "저장 중..." : "내 입장 저장하기 →"}
            </button>
          </div>
          {errorMsg && <p className="text-sm text-[#DC3545] mt-3">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
}
