import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import MediationProgressHeader from "./MediationProgressHeader";
import { getSewingErrorMessage, getSewingSessionList, isRealSewingSessionId, joinSewingSession, type SewingSession } from "../../api/sewingApi";
import AuthDebugBadge from "./AuthDebugBadge";

function isJoinedSession(session: SewingSession | undefined): boolean {
  if (!session) return false;
  return !!session.participantNickname || (!!session.status && session.status !== "WAITING");
}

export default function MediationJoinPage() {
  const navigate = useNavigate();
  const [sessionInput, setSessionInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const joinInFlightRef = useRef(false);

  const handleJoinRoom = async () => {
    if (joinInFlightRef.current) return;

    const sessionId = Number(sessionInput.trim());
    if (!isRealSewingSessionId(sessionId)) {
      setErrorMsg("올바른 방 번호를 입력해주세요.");
      return;
    }

    joinInFlightRef.current = true;
    setIsJoining(true);
    setErrorMsg("");

    try {
      await joinSewingSession(sessionId);
      sessionStorage.setItem("sewingSessionId", String(sessionId));
      sessionStorage.setItem("sewingSessionJoined", "true");
      console.log("[Sewing] join 성공 후 입력 화면 이동", { sessionId });
      navigate("/mediation/input");
    } catch (error) {
      console.error("[API] 방 참여 실패:", error);
      try {
        const sessions = await getSewingSessionList();
        const currentSession = sessions.find((session) => Number(session.sessionId) === sessionId);
        const joined = isJoinedSession(currentSession);
        console.log("[Sewing] join 실패 후 상태 확인 세션", currentSession);
        console.log("[Sewing] join 실패 후 실제 참여 여부", joined);
        if (joined) {
          sessionStorage.setItem("sewingSessionId", String(sessionId));
          sessionStorage.setItem("sewingSessionJoined", "true");
          navigate("/mediation/input");
          return;
        }
      } catch (statusError) {
        console.error("[API] join 실패 후 상태 확인 실패:", statusError);
      }
      setErrorMsg(getSewingErrorMessage(error));
    } finally {
      joinInFlightRef.current = false;
      setIsJoining(false);
    }
  };

  return (
    <>
      <MediationProgressHeader currentStep="input" />
      <AuthDebugBadge />

      <div className="min-h-[calc(100vh-80px)] bg-[#FFF8F4] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-[560px] bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
          <h1 className="text-[30px] font-semibold text-[#1F1410] text-center mb-3">
            방 번호로 참여하기
          </h1>
          <p className="text-center text-[#7A5C4D] mb-8">
            상대방에게 전달받은 중재 방 번호를 입력해주세요.
          </p>

          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={sessionInput}
              onChange={(e) => {
                setSessionInput(e.target.value.replace(/[^0-9]/g, ""));
                setErrorMsg("");
              }}
              placeholder="예: 7"
              className="flex-1 h-12 px-4 bg-[#FFF8F4] border border-[#F0DFD0] rounded-xl focus:outline-none focus:border-[#FF6347] text-[#1F1410]"
            />
            <button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className={`px-6 h-12 rounded-full transition-all font-medium ${
                isJoining
                  ? "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
                  : "bg-[#FF6347] text-white hover:bg-[#E84028]"
              }`}
            >
              {isJoining ? "참여 중..." : "방 참여하기"}
            </button>
          </div>

          {errorMsg && <p className="text-sm text-[#DC3545] mb-4">{errorMsg}</p>}

          <Link
            to="/mediation/start"
            className="block text-center text-sm text-[#7A5C4D] hover:text-[#FF6347] underline mt-6"
          >
            중재 시작 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </>
  );
}
