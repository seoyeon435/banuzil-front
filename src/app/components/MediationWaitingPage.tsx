import { useNavigate, useLocation, Link } from "react-router";
import { useState } from "react";
import { useDisplayNames } from "../utils/useDisplayNames";

const MOCK_PARTNER_INPUT =
  "사실 여행을 가고 싶었던 건 도피가 아니라 재충전이 필요했던 거였어요. 시험 준비하면서 나도 많이 지쳐있었는데, 잠깐 숨을 돌리고 싶었어요. 당신을 응원하는 마음은 진심인데 전달이 잘 안 된 것 같아 미안해요.";

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
    <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-[760px]">
        {/* 상단 연결 표시 */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-xl">💑</span>
          <span className="text-sm font-medium text-[#1F1410]">{partnerName}님과 연결된 우리 공간</span>
        </div>

        {/* 두 입장 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* 내 입장 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-t-4 border-[#FF6347]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="font-semibold text-[#1F1410] text-sm">{currentName}의 입장</span>
              <span className="ml-auto px-2 py-0.5 bg-[#E0F4E8] text-[#5A9F7C] text-xs rounded-full">저장 완료</span>
            </div>
            <p className="text-[#7A5C4D] text-sm leading-relaxed line-clamp-6">
              {myInput}
            </p>
          </div>

          {/* 상대방 입장 */}
          <div className={`bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-t-4 transition-all duration-500 ${
            partnerLoaded ? "border-[#D4956A]" : "border-[#F0DFD0]"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              {partnerLoaded ? (
                <div className="w-7 h-7 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-[#D4956A] flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4956A] animate-pulse" />
                </div>
              )}
              <span className="font-semibold text-[#1F1410] text-sm">{partnerName}님의 입장</span>
              <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                partnerLoaded ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#FFE9DD] text-[#D4956A]"
              }`}>
                {partnerLoaded ? "저장 완료" : "대기 중..."}
              </span>
            </div>

            {partnerLoaded ? (
              <p className="text-[#7A5C4D] text-sm leading-relaxed line-clamp-6">
                {MOCK_PARTNER_INPUT}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="h-3 bg-[#F0DFD0] rounded animate-pulse w-full" />
                <div className="h-3 bg-[#F0DFD0] rounded animate-pulse w-5/6" />
                <div className="h-3 bg-[#F0DFD0] rounded animate-pulse w-4/6" />
              </div>
            )}
          </div>
        </div>

        {/* 안내 문구 */}
        {!partnerLoaded ? (
          <p className="text-center text-[#7A5C4D] text-sm mb-6">
            {partnerName}님의 입장이 입력되면 AI가 두 사람을 중립적으로 분석해드려요.
          </p>
        ) : (
          <div className="text-center mb-6">
            <p className="text-[#1F1410] font-semibold mb-1">두 사람의 입장이 모두 준비되었어요!</p>
            <p className="text-sm text-[#7A5C4D]">AI가 중립적으로 분석을 시작합니다.</p>
          </div>
        )}

        {/* 버튼 영역 */}
        {!partnerLoaded ? (
          <div className="space-y-3">
            {/* 시연용 버튼 */}
            <div className="bg-[#FFE9DD] border border-[#FFD19A] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1F1410] mb-3">
                시연용 — 실제 서비스에서는 {partnerName}님이 직접 입력합니다
              </p>
              <button
                onClick={handleLoadPartner}
                className="w-full py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium"
              >
                상대방 입장 불러오기
              </button>
            </div>

            <Link
              to="/mediation/analyzing"
              className="block text-center text-sm text-[#7A5C4D] hover:text-[#FF6347] underline"
            >
              (테스트) 바로 분석 화면으로 이동
            </Link>
          </div>
        ) : (
          <button
            onClick={handleStartAnalysis}
            className="w-full py-4 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-semibold text-lg shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
          >
            AI 중재 시작하기 →
          </button>
        )}
      </div>
    </div>
  );
}
