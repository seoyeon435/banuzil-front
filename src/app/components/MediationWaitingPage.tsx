import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function MediationWaitingPage() {
  const navigate = useNavigate();
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [partnerDone, setPartnerDone] = useState(false);

  const handlePartnerSubmit = () => {
    setPartnerDone(true);
    setTimeout(() => navigate("/mediation/analyzing"), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center py-12">
      <div className="w-full max-w-[560px] px-6">
        {/* Animated Illustration */}
        <div className="relative h-48 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FF6347]/20 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF6347]/40 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <div className="relative z-10 text-4xl">🧵</div>
        </div>

        {/* Partner Connected Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xl">💑</span>
          <span className="text-sm font-medium text-[#1F1410]">지현님과 연결된 우리 공간</span>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          {!partnerDone ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-[#1F1410] font-medium">나의 입장 입력 완료</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#D4956A] flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#D4956A] animate-pulse" />
                </div>
                <span className="text-[#1F1410] font-medium">지현님 입장 대기 중...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#F0DFD0] flex-shrink-0" />
                <span className="text-[#7A5C4D]">AI 분석</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#F0DFD0] flex-shrink-0" />
                <span className="text-[#7A5C4D]">중재 결과</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {["나의 입장 입력 완료", "지현님 입장 입력 완료", "AI 분석 시작 중..."].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i < 2 ? "bg-[#5A9F7C]" : "bg-[#FF6347] animate-pulse"}`}>
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className={`font-medium ${i < 2 ? "text-[#1F1410]" : "text-[#FF6347]"}`}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!partnerDone && (
          <p className="text-center text-[#7A5C4D] mb-6">
            두 사람의 입장이 모두 입력되면 AI가 중립적으로 분석을 시작합니다.
          </p>
        )}

        {partnerDone && (
          <div className="bg-[#E0F4E8] border border-[#5A9F7C] rounded-2xl p-6 mb-6 text-center">
            <p className="text-[#1F1410] font-semibold mb-1">두 사람의 입장이 모두 입력되었습니다!</p>
            <p className="text-sm text-[#5A9F7C]">AI가 중립적으로 분석을 시작합니다...</p>
          </div>
        )}

        {/* Mock Partner Submit */}
        {!partnerDone && (
          <div className="bg-[#FFE9DD] border border-[#FFD19A] rounded-2xl p-6 mb-6">
            <p className="text-sm font-semibold text-[#1F1410] mb-1">시연용</p>
            <p className="text-xs text-[#7A5C4D] mb-4">실제 서비스에서는 지현님이 직접 입력합니다.</p>
            <button
              onClick={handlePartnerSubmit}
              className="w-full py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium"
            >
              상대방 답변 불러오기 →
            </button>
          </div>
        )}

        {/* Notification Toggle */}
        {!partnerDone && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)] mb-6">
            <span className="text-[#1F1410] font-medium">입력 완료 시 알림 받기</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifyEnabled}
                onChange={(e) => setNotifyEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-[#F0DFD0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6347]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6347]" />
            </label>
          </div>
        )}

        {/* Skip Link */}
        {!partnerDone && (
          <div className="text-center">
            <Link
              to="/mediation/analyzing"
              className="inline-block px-6 py-2 text-sm text-[#7A5C4D] hover:text-[#FF6347] underline"
            >
              (테스트) 분석 화면으로 건너뛰기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
