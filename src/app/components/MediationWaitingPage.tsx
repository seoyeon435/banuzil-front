import { useNavigate, useLocation, Link } from "react-router";
import { useState } from "react";
import { useDisplayNames } from "../utils/useDisplayNames";

// [MOCK 비활성화] 상대방 입장 본문은 BE endpoint 없으면 표시 불가 — placeholder만 표시.
const PARTNER_INPUT_PLACEHOLDER = "(상대방 입장은 실제 BE에서 받아와야 합니다 — 현재 endpoint 미정)";

export default function MediationWaitingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentName, partnerName } = useDisplayNames();
  const myInput: string = (location.state as { myInput?: string })?.myInput ?? "내 입장이 저장되었습니다.";

  const [partnerLoaded, setPartnerLoaded] = useState(false);

  const handleLoadPartner = () => {
    setPartnerLoaded(true);
  };

  const handleStartAnalysis = () => {
    navigate("/mediation/analyzing");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-[760px]">
        {/* 상단 연결 표시 */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-xl">💑</span>
          <span className="text-sm font-medium text-[#1A1A2E]">{partnerName}님과 연결된 우리 공간</span>
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
              <span className="ml-auto px-2 py-0.5 bg-[#E0F4E8] text-[#5A9F7C] text-xs rounded-full">저장 완료</span>
            </div>
            <p className="text-[#6F7787] text-sm leading-relaxed line-clamp-6">
              {myInput}
            </p>
          </div>

          {/* 상대방 입장 */}
          <div className={`bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(35,40,56,0.102)] border-t-4 transition-all duration-500 ${
            partnerLoaded ? "border-[#6F8197]" : "border-[#E5E2DC]"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              {partnerLoaded ? (
                <div className="w-7 h-7 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-[#6F8197] flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6F8197] animate-pulse" />
                </div>
              )}
              <span className="font-semibold text-[#1A1A2E] text-sm">{partnerName}님의 입장</span>
              <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                partnerLoaded ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#EBE9F2] text-[#6F8197]"
              }`}>
                {partnerLoaded ? "저장 완료" : "대기 중..."}
              </span>
            </div>

            {partnerLoaded ? (
              <p className="text-[#6F7787] text-sm leading-relaxed line-clamp-6 italic">
                {PARTNER_INPUT_PLACEHOLDER}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="h-3 bg-[#E5E2DC] rounded animate-pulse w-full" />
                <div className="h-3 bg-[#E5E2DC] rounded animate-pulse w-5/6" />
                <div className="h-3 bg-[#E5E2DC] rounded animate-pulse w-4/6" />
              </div>
            )}
          </div>
        </div>

        {/* 안내 문구 */}
        {!partnerLoaded ? (
          <p className="text-center text-[#6F7787] text-sm mb-6">
            {partnerName}님의 입장이 입력되면 AI가 두 사람을 중립적으로 분석해드려요.
          </p>
        ) : (
          <div className="text-center mb-6">
            <p className="text-[#1A1A2E] font-semibold mb-1">두 사람의 입장이 모두 준비되었어요!</p>
            <p className="text-sm text-[#6F7787]">AI가 중립적으로 분석을 시작합니다.</p>
          </div>
        )}

        {/* 버튼 영역 */}
        {!partnerLoaded ? (
          <div className="space-y-3">
            {/* 시연용 버튼 */}
            <div className="bg-[#EBE9F2] border border-[#EBE9F2] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1A1A2E] mb-3">
                시연용 — 실제 서비스에서는 {partnerName}님이 직접 입력합니다
              </p>
              <button
                onClick={handleLoadPartner}
                className="w-full py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#0F0F1F] transition-all font-medium"
              >
                상대방 입장 불러오기
              </button>
            </div>

            <Link
              to="/mediation/analyzing"
              className="block text-center text-sm text-[#6F7787] hover:text-[#1A1A2E] underline"
            >
              (테스트) 바로 분석 화면으로 이동
            </Link>
          </div>
        ) : (
          <button
            onClick={handleStartAnalysis}
            className="w-full py-4 bg-[#1A1A2E] text-white rounded-full hover:bg-[#0F0F1F] transition-all font-semibold text-lg shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
          >
            AI 중재 시작하기 →
          </button>
        )}
      </div>
    </div>
  );
}
