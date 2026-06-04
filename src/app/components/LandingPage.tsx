import { Link, useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";
import { logout, isLoggedIn } from "../../api/userApi";
import BrandMark from "./ui/BrandMark";
import HeroDivider from "./ui/HeroDivider";
import ThreadDecoration from "./ui/ThreadDecoration";

export default function LandingPage() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A2E]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-12 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BrandMark size={18} />
            <span className="text-xl font-normal tracking-[-0.4px] text-[#1A1A2E]">바느질</span>
          </Link>
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <>
                <Link
                  to="/mypage/profile"
                  className="px-5 py-2.5 text-sm text-[#1A1A2E] hover:text-[#6F8197] transition-colors"
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm text-[#6F7787] hover:text-[#1A1A2E] transition-colors"
                >
                  로그아웃
                </button>
                <Link
                  to="/mediation/start"
                  className="px-6 py-2.5 bg-[#1A1A2E] text-white text-sm rounded-full hover:bg-[#0F0F1F] transition-colors"
                >
                  중재 시작하기
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm text-[#1A1A2E] hover:text-[#6F8197] transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-[#1A1A2E] text-white text-sm rounded-full hover:bg-[#0F0F1F] transition-colors"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
        {/* 배경 라벤더 실 곡선 — 좌하 + 우상 */}
        <ThreadDecoration position="top-right" />
        <ThreadDecoration position="bottom-left" />

        <div className="relative z-10 max-w-[680px] text-center px-6">
          {/* Badge — 화이트 + 라벤더 보더 + 미니 로고 */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white border border-[#D4D0E8] rounded-full mb-10">
            <BrandMark size={11} />
            <span className="text-xs text-[#1A1A2E] tracking-tight">AI 갈등 중재 서비스</span>
          </div>

          {/* Heading — light weight */}
          <h1 className="text-[56px] sm:text-[64px] font-normal text-[#1A1A2E] leading-[1.15] tracking-[-1px] mb-8">
            우리 사이,
            <br />
            다시 이어줄게
          </h1>

          {/* Hero Divider — 시그니처 미니 그래픽 */}
          <div className="flex justify-center mb-8">
            <HeroDivider width={200} />
          </div>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#6F7787] leading-[1.8] mb-12 tracking-tight">
            두 사람의 이야기를 따로 듣고
            <br />
            서로를 더 잘 이해할 수 있게 도와드려요
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <Link
              to="/mediation/start"
              className="px-9 py-4 min-w-[200px] bg-[#1A1A2E] text-white text-sm rounded-full hover:bg-[#0F0F1F] transition-all flex items-center justify-center gap-2 tracking-tight"
            >
              천천히 시작해보기
              <span className="text-base">→</span>
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-[#1A1A2E] text-[#1A1A2E] text-sm rounded-full hover:bg-[#1A1A2E]/5 transition-all tracking-tight"
            >
              서비스 둘러보기
            </a>
          </div>

        </div>

        {/* Scroll Indicator — 더스티블루, 조용하게 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-[#6F8197]" strokeWidth={1.5} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-[120px] px-12 bg-[#FAFAF7]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-[#6F8197] mb-4 uppercase tracking-[2px]">바느질이 특별한 이유</p>
            <h2 className="text-[36px] font-normal text-[#1A1A2E] tracking-[-0.6px]">
              두 사람 모두의 이야기를 들어요
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              {
                title: "애착유형 기반 감정 분석",
                desc: "당신의 애착 성향을 깊이 이해하고,\n감정의 원인을 정확하게 짚어드려요",
              },
              {
                title: "A·B 독립 입력",
                desc: "두 사람이 각자 따로 입력해\n편향 없는 중립 분석을 제공해요",
              },
              {
                title: "갈등 히스토리 누적",
                desc: "반복되는 갈등 패턴을 파악하고\n더 깊은 인사이트를 드려요",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-8 border border-[#E5E2DC] hover:border-[#D4D0E8] transition-all duration-300"
              >
                <div className="mb-6">
                  <BrandMark size={14} />
                </div>
                <h3 className="text-lg font-medium text-[#1A1A2E] mb-3 tracking-[-0.3px]">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6F7787] leading-[1.8] tracking-tight whitespace-pre-line">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-[120px] px-12 bg-[#EFEDE7]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-[#6F8197] mb-4 uppercase tracking-[2px]">진행 흐름</p>
            <h2 className="text-[36px] font-normal text-[#1A1A2E] tracking-[-0.6px]">
              이렇게 사용해요
            </h2>
          </div>

          <div className="relative">
            {/* Thin connecting line */}
            <div className="absolute top-[26px] left-[10%] right-[10%] h-[1px] bg-[#D4D0E8] z-0" />

            <div className="relative grid grid-cols-4 gap-8 z-10">
              {[
                { num: "01", label: "A가 입력", desc: "자신의 입장을\n솔직하게 작성해요" },
                { num: "02", label: "B가 입력", desc: "상대방도 따로\n자신의 입장을 작성해요" },
                { num: "03", label: "AI 분석", desc: "애착유형 기반으로\n두 사람을 분석해요" },
                { num: "04", label: "결과 확인", desc: "각자에게 맞는\n리포트를 받아요" },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-[52px] h-[52px] mx-auto rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center mb-6">
                    <span className="text-xs font-medium text-[#1A1A2E] tracking-wider">{step.num}</span>
                  </div>
                  <div className="text-base font-medium text-[#1A1A2E] mb-3 tracking-[-0.3px]">
                    {step.label}
                  </div>
                  <p className="text-sm text-[#6F7787] leading-[1.7] tracking-tight whitespace-pre-line">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-14 px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <BrandMark size={16} />
                <span className="text-lg font-normal tracking-[-0.3px]">바느질</span>
              </div>
              <p className="text-sm text-white/50 tracking-tight">우리 사이, 다시 이어줄게</p>
            </div>
            <div className="flex gap-7 text-sm text-white/70">
              <a href="#" className="hover:text-white transition-colors">서비스 소개</a>
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            </div>
          </div>
          <div className="text-xs text-white/30 border-t border-white/10 pt-6 tracking-tight">
            © 2026 바느질. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
