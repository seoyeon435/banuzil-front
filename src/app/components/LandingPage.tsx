import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFF8F4] border-b border-[#F0DFD0]">
        <div className="max-w-[1440px] mx-auto px-12 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧵</span>
            <span className="text-xl font-bold text-[#1F1410]">바느질</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/mypage/profile"
              className="px-6 py-2.5 text-[#1F1410] hover:text-[#FF6347] transition-colors"
            >
              마이페이지
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 text-[#1F1410] hover:text-[#FF6347] transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-b from-[#FFF8F4] to-[#FFE9DD] overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stitch" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M10 30 Q 20 20 30 30 T 50 30" stroke="#FF6347" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stitch)" />
          </svg>
        </div>

        <div className="relative max-w-[680px] text-center px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF6347]/10 rounded-full mb-8">
            <span className="text-lg">🧵</span>
            <span className="text-sm text-[#1F1410]">AI 갈등 중재 서비스</span>
          </div>

          {/* Heading */}
          <h1 className="text-[56px] font-bold text-[#1F1410] leading-[1.2] mb-6">
            우리 사이,
            <br />
            다시 이어줄게
          </h1>

          {/* Subheading */}
          <p className="text-xl text-[#7A5C4D] leading-[1.7] mb-10">
            두 사람의 이야기를 따로 듣고
            <br />
            서로를 더 잘 이해할 수 있게 도와드려요
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Link
              to="/mediation/start"
              className="px-10 py-4 h-[56px] min-w-[220px] bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all shadow-[0_8px_32px_rgba(255,99,71,0.17)] hover:shadow-[0_12px_40px_rgba(255,99,71,0.25)] flex items-center justify-center gap-2"
            >
              갈등 중재 시작하기 <span>→</span>
            </Link>
            <a
              href="#features"
              className="px-8 py-4 h-[56px] border-2 border-[#FF6347] text-[#FF6347] rounded-full hover:bg-[#FF6347]/5 transition-all flex items-center justify-center"
            >
              서비스 둘러보기
            </a>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-[#7A5C4D]">
            이미 3,200명이 관계를 회복했어요 💛
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#7A5C4D]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[120px] px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-[#FF6347] mb-3 uppercase tracking-wider">바느질이 특별한 이유</p>
            <h2 className="text-[36px] font-semibold text-[#1F1410]">
              두 사람 모두의 이야기를 들어요
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] hover:shadow-[0_12px_40px_rgba(255,99,71,0.23)] transition-all">
              <div className="w-16 h-16 rounded-full bg-[#FF6347]/10 flex items-center justify-center text-3xl mb-6">
                🫂
              </div>
              <h3 className="text-2xl font-semibold text-[#1F1410] mb-3">
                MBTI 기반 공감
              </h3>
              <p className="text-[#7A5C4D] leading-[1.7]">
                당신의 MBTI 성향을 깊이 이해하고,
                <br />
                감정의 원인을 정확하게 짚어드려요
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] hover:shadow-[0_12px_40px_rgba(255,99,71,0.23)] transition-all">
              <div className="w-16 h-16 rounded-full bg-[#FF6347]/10 flex items-center justify-center text-3xl mb-6">
                🔍
              </div>
              <h3 className="text-2xl font-semibold text-[#1F1410] mb-3">
                A·B 독립 입력
              </h3>
              <p className="text-[#7A5C4D] leading-[1.7]">
                두 사람이 각자 따로 입력해
                <br />
                편향 없는 중립 분석을 제공해요
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] hover:shadow-[0_12px_40px_rgba(255,99,71,0.23)] transition-all">
              <div className="w-16 h-16 rounded-full bg-[#FF6347]/10 flex items-center justify-center text-3xl mb-6">
                📋
              </div>
              <h3 className="text-2xl font-semibold text-[#1F1410] mb-3">
                갈등 히스토리 누적
              </h3>
              <p className="text-[#7A5C4D] leading-[1.7]">
                반복되는 갈등 패턴을 파악하고
                <br />
                더 깊은 인사이트를 드려요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-[120px] px-12 bg-[#FFE0CC]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold text-[#1F1410] text-center mb-20">
            이렇게 사용해요
          </h2>

          <div className="relative">
            {/* Dotted Line */}
            <div className="absolute top-12 left-0 right-0 h-[2px] border-t-2 border-dashed border-[#F0DFD0] z-0" />

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-8 z-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#FF6347] text-white flex items-center justify-center text-4xl font-bold mb-6 shadow-lg">
                  🅐
                </div>
                <div className="text-4xl mb-4">A가 입력</div>
                <p className="text-[#7A5C4D] leading-[1.7]">
                  A가 자신의 입장을
                  <br />
                  솔직하게 작성해요
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#FF6347] text-white flex items-center justify-center text-4xl font-bold mb-6 shadow-lg">
                  🅑
                </div>
                <div className="text-4xl mb-4">B가 입력</div>
                <p className="text-[#7A5C4D] leading-[1.7]">
                  B도 따로 자신의
                  <br />
                  입장을 작성해요
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#FF6347] text-white flex items-center justify-center text-4xl font-bold mb-6 shadow-lg">
                  🤖
                </div>
                <div className="text-4xl mb-4">AI 분석</div>
                <p className="text-[#7A5C4D] leading-[1.7]">
                  MBTI 기반으로
                  <br />
                  두 사람을 분석해요
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#FF6347] text-white flex items-center justify-center text-4xl font-bold mb-6 shadow-lg">
                  📄
                </div>
                <div className="text-4xl mb-4">결과 확인</div>
                <p className="text-[#7A5C4D] leading-[1.7]">
                  각자에게 맞는
                  <br />
                  리포트를 받아요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1410] text-white py-12 px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧵</span>
                <span className="text-xl font-bold">바느질</span>
              </div>
              <p className="text-sm text-white/60">우리 사이, 다시 이어줄게</p>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-[#FF6347] transition-colors">서비스 소개</a>
              <a href="#" className="hover:text-[#FF6347] transition-colors">이용약관</a>
              <a href="#" className="hover:text-[#FF6347] transition-colors">개인정보처리방침</a>
            </div>
          </div>
          <div className="text-sm text-white/40 border-t border-white/10 pt-6">
            © 2025 바느질. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
