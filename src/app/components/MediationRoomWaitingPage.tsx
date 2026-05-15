import { useNavigate } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import MediationProgressHeader from "./MediationProgressHeader";
import { getSewingSessionList, isRealSewingSessionId, type SewingSession } from "../../api/sewingApi";
import AuthDebugBadge from "./AuthDebugBadge";
import { useDisplayNames } from "../utils/useDisplayNames";

function isPartnerJoined(session: SewingSession | undefined): boolean {
  if (!session) return false;

  const hasParticipant = !!session.participantNickname;
  const statusChanged = !!session.status && session.status !== "WAITING";
  const roundStarted = typeof session.currentRound === "number" && session.currentRound > 0;

  return hasParticipant || statusChanged || roundStarted;
}

export default function MediationRoomWaitingPage() {
  const navigate = useNavigate();
  const { partnerName } = useDisplayNames();
  const sessionId = sessionStorage.getItem("sewingSessionId");
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string>("");
  const hasNavigatedRef = useRef(false);

  const moveToInputIfJoined = useCallback((session: SewingSession | undefined) => {
    const joined = isPartnerJoined(session);
    console.log("[Sewing] 상대방 참여 여부 판단 결과", joined, session);
    console.log("[Sewing] 입장 입력 화면으로 이동 여부", joined);

    if (!joined || hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    sessionStorage.setItem("sewingSessionJoined", "true");
    navigate("/mediation/input");
  }, [navigate]);

  const checkPartnerJoined = useCallback(async () => {
    if (!isRealSewingSessionId(sessionId)) {
      console.log("[Sewing] 현재 대기 중인 sessionId", sessionId);
      return;
    }

    console.log("[Sewing] 현재 대기 중인 sessionId", sessionId);
    console.log("[Sewing] session-list 호출 여부", true);
    setIsChecking(true);

    try {
      const sessions = await getSewingSessionList();
      console.log("[Sewing] session-list 응답", sessions);

      const currentSession = sessions.find((session) => Number(session.sessionId) === Number(sessionId));
      console.log("[Sewing] 현재 sessionId에 해당하는 세션", currentSession);
      moveToInputIfJoined(currentSession);
      setLastCheckedAt(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("[API] 상대방 입장 여부 확인 실패:", error);
    } finally {
      setIsChecking(false);
    }
  }, [moveToInputIfJoined, sessionId]);

  useEffect(() => {
    void checkPartnerJoined();
    const intervalId = window.setInterval(() => {
      void checkPartnerJoined();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkPartnerJoined]);

  const handleMockGoToInput = () => {
    if (!isRealSewingSessionId(sessionId)) {
      navigate("/mediation/start");
      return;
    }

    sessionStorage.setItem("sewingSessionJoined", "mock");
    console.log("[Sewing] mock 흐름: 생성자 대기 화면에서 입력 화면 이동", { sessionId });
    navigate("/mediation/input");
  };

  return (
    <>
      <MediationProgressHeader currentStep="input" />
      <AuthDebugBadge />

      <div className="min-h-[calc(100vh-80px)] bg-[#FAFAF7] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-[640px] bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(35,40,56,0.102)] text-center">
          <div className="w-20 h-20 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center text-4xl mx-auto mb-6">
            💑
          </div>
          <h1 className="text-[30px] font-semibold text-[#1A1A2E] mb-3">
            중재 방이 생성되었어요
          </h1>
          <p className="text-[#1A1A2E] text-xl font-semibold mb-3">
            방 번호: {isRealSewingSessionId(sessionId) ? sessionId : "-"}
          </p>
          <p className="text-[#6F7787] leading-relaxed mb-8">
            {partnerName}님이 이 방 번호로 입장하면 각자 입장을 작성할 수 있어요.
          </p>
          <p className="text-sm text-[#6F7787] mb-6">
            {isChecking ? "상대방 입장 여부를 확인 중입니다..." : "상대방 입장 여부를 확인 중입니다..."}
            {lastCheckedAt && <span className="block text-xs mt-1">마지막 확인: {lastCheckedAt}</span>}
          </p>

          <div className="bg-[#EBE9F2] border border-[#EBE9F2] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-1">진행 순서</p>
            <p className="text-xs text-[#6F7787]">1. 상대방에게 방 번호를 전달해주세요.</p>
            <p className="text-xs text-[#6F7787]">2. 상대방이 방 참여하기를 완료한 뒤 입장 작성 화면으로 이동하세요.</p>
          </div>

          <button
            onClick={checkPartnerJoined}
            disabled={!isRealSewingSessionId(sessionId) || isChecking}
            className={`w-full h-12 rounded-full font-medium transition-all mb-3 ${
              isRealSewingSessionId(sessionId) && !isChecking
                ? "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                : "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
            }`}
          >
            {isChecking ? "확인 중..." : "상대방 입장 확인하기"}
          </button>

          <button
            onClick={handleMockGoToInput}
            disabled={!isRealSewingSessionId(sessionId)}
            className={`w-full h-14 rounded-full font-medium transition-all ${
              isRealSewingSessionId(sessionId)
                ? "bg-[#EFEDE7] text-[#1A1A2E] hover:bg-[#E5E2DC]"
                : "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
            }`}
          >
            시연용: 상대방 참여 완료 처리
          </button>
          <p className="text-xs text-[#6F7787] mt-3">
            실제 API join 성공이 아니라 화면 시연용 mock 흐름입니다.
          </p>
        </div>
      </div>
    </>
  );
}
