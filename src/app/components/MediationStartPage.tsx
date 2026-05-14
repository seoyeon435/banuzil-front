import { useState } from "react";
import { Link, useNavigate } from "react-router";
import MediationProgressHeader from "./MediationProgressHeader";
import { createSewingSession, getSewingErrorMessage, isRealSewingSessionId } from "../../api/sewingApi";
import AuthDebugBadge from "./AuthDebugBadge";

export default function MediationStartPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setMessage("");

    try {
      const sessionId = await createSewingSession();
      if (!isRealSewingSessionId(sessionId)) {
        setMessage("방 번호를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      sessionStorage.setItem("sewingSessionId", String(sessionId));
      sessionStorage.removeItem("sewingSessionJoined");
      console.log("[Sewing] 방 생성 후 입력 화면 이동 여부", false, { sessionId });
      navigate("/mediation/room");
    } catch (error) {
      console.error("[API] 중재 방 생성 실패:", error);
      setMessage(getSewingErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <MediationProgressHeader currentStep="start" />
      <AuthDebugBadge />

      <div className="bg-[#FFF8F4] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-[640px]">
          {/* Heading */}
          <h1 className="text-[36px] font-semibold text-[#1F1410] text-center mb-4">
            오늘 어떤 갈등을 함께 돌아볼까요?
          </h1>
          <p className="text-center text-[#7A5C4D] mb-10 leading-relaxed">
            두 사람이 각자의 입장을 따로 입력하면,<br />
            AI가 EFT 상담 흐름으로 감정과 욕구를 분석해드려요.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="bg-white rounded-xl p-6 border-l-4 border-[#FF6347] shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
              <div className="flex items-start gap-4">
                <span className="text-3xl">💬</span>
                <div>
                  <p className="font-semibold text-[#1F1410] mb-1">나의 입장을 솔직하게 작성해요</p>
                  <p className="text-sm text-[#7A5C4D]">
                    상대방은 내 입장을 바로 볼 수 없어요. AI가 먼저 읽고 정리해드려요.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-[#D4956A] shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔒</span>
                <div>
                  <p className="font-semibold text-[#1F1410] mb-1">상대방도 따로 입력해요</p>
                  <p className="text-sm text-[#7A5C4D]">
                    두 사람이 각자 입력을 마치면, AI가 편향 없는 분석을 시작해요.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-[#5A9F7C] shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧵</span>
                <div>
                  <p className="font-semibold text-[#1F1410] mb-1">EFT 흐름에 따라 감정을 돌아봐요</p>
                  <p className="text-sm text-[#7A5C4D]">
                    공감 → 감정 확인 → 패턴 파악 → 대화 스크립트 → 합의안 순으로 진행돼요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className={`block w-full h-14 rounded-full text-center font-medium transition-all ${
              isCreating
                ? "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
                : "bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
            }`}
          >
            {isCreating ? "중재 방 생성 중..." : "갈등 중재 시작하기 →"}
          </button>

          {message && <p className="text-sm text-[#DC3545] text-center mt-4">{message}</p>}

          <Link
            to="/mediation/join"
            className="block text-center text-sm text-[#7A5C4D] hover:text-[#FF6347] underline mt-6"
          >
            전달받은 방 번호로 참여하기
          </Link>
        </div>
      </div>
    </>
  );
}
