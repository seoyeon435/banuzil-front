import { Link } from "react-router";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function MediationWaitingPage() {
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center py-12">
      <div className="w-full max-w-[560px] px-6">
        {/* Animated Illustration */}
        <div className="relative h-48 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FF8C7A]/20 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF8C7A]/40 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="relative z-10 text-4xl">🧵</div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,140,122,0.12)] mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6BAF8C] flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-[#2C1810] font-medium">나의 입력 완료</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#D4956A] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#D4956A] animate-pulse" />
              </div>
              <span className="text-[#2C1810] font-medium">지현의 입력 대기 중</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#EDD9CC]" />
              <span className="text-[#8C6B5A]">AI 분석</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#EDD9CC]" />
              <span className="text-[#8C6B5A]">중재 결과</span>
            </div>
          </div>
        </div>

        {/* Notification Sent */}
        <p className="text-center text-[#8C6B5A] mb-6">
          지현님에게 알림이 발송되었어요
        </p>

        {/* Invite Reminder */}
        <div className="bg-[#FFF4E6] border border-[#FFD19A] rounded-2xl p-6 mb-8">
          <p className="text-[#2C1810] font-medium mb-4">아직 입력 전이에요</p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-[#FEE500] text-[#000000] rounded-full hover:bg-[#FEE500]/90 transition-all font-medium">
              카카오톡으로 다시 알리기
            </button>
            <button className="px-6 py-3 border-2 border-[#EDD9CC] text-[#8C6B5A] rounded-full hover:bg-[#F5E6D8] transition-all flex items-center gap-2">
              <Copy className="w-4 h-4" />
              링크 복사
            </button>
          </div>
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,140,122,0.08)]">
          <span className="text-[#2C1810] font-medium">입력 완료 시 알림 받기</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifyEnabled}
              onChange={(e) => setNotifyEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-[#EDD9CC] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C7A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C7A]"></div>
          </label>
        </div>

        {/* Test Button - Skip to Analysis */}
        <div className="mt-8 text-center">
          <Link
            to="/mediation/analyzing"
            className="inline-block px-6 py-2 text-sm text-[#8C6B5A] hover:text-[#FF8C7A] underline"
          >
            (테스트) 분석 화면으로 건너뛰기
          </Link>
        </div>
      </div>
    </div>
  );
}
