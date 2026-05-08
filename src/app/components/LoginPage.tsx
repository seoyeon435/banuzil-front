import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="w-1/2 bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-stitch" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M10 40 Q 25 25 40 40 T 70 40" stroke="white" strokeWidth="2" fill="none" strokeDasharray="6,6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-stitch)" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-12 max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl">🧵</span>
            <span className="text-4xl font-bold">바느질</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-semibold mb-4">다시 오셨군요 🧵</h2>
          <p className="text-lg text-white/90">우리 사이의 이야기를 이어가요</p>

          {/* Decorative Illustration */}
          <div className="mt-16 relative">
            <svg width="200" height="120" viewBox="0 0 200 120" className="mx-auto">
              <defs>
                <linearGradient id="hand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
              {/* Two hands connecting */}
              <path
                d="M 40 60 Q 40 40 60 40 L 80 40 Q 100 40 100 60"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
              />
              <path
                d="M 100 60 Q 100 40 120 40 L 140 40 Q 160 40 160 60"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
              />
              <circle cx="100" cy="60" r="8" fill="white" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center px-12">
        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-[28px] font-bold text-[#2C1810] mb-2">로그인</h1>
            <p className="text-[#8C6B5A]">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-[#FF8C7A] underline hover:text-[#E56B58]">
                회원가입
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C6B5A]" />
                <input
                  type="email"
                  placeholder="이메일 주소를 입력해주세요"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#EDD9CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C7A] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C6B5A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  className="w-full h-12 pl-12 pr-12 bg-white border border-[#EDD9CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C7A] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C6B5A] hover:text-[#2C1810]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-[#8C6B5A] hover:text-[#FF8C7A]">
                비밀번호를 잊으셨나요?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-[52px] bg-[#FF8C7A] text-white rounded-full hover:bg-[#E56B58] transition-all shadow-[0_4px_16px_rgba(255,140,122,0.2)] hover:shadow-[0_6px_20px_rgba(255,140,122,0.3)]"
            >
              로그인
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-[#EDD9CC]" />
            <span className="text-sm text-[#8C6B5A]">또는</span>
            <div className="flex-1 h-[1px] bg-[#EDD9CC]" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full h-[48px] border-2 border-[#FEE500] bg-[#FEE500] text-[#000000] rounded-xl hover:bg-[#FEE500]/90 transition-all flex items-center justify-center gap-2">
              <span>🟡</span>
              카카오로 계속하기
            </button>
            <button className="w-full h-[48px] border-2 border-[#EDD9CC] bg-white text-[#2C1810] rounded-xl hover:bg-[#F5E6D8] transition-all flex items-center justify-center gap-2">
              <span>⬜</span>
              구글로 계속하기
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-[#8C6B5A] text-center mt-8">
            로그인하면 이용약관 및 개인정보처리방침에
            <br />
            동의하는 것으로 간주됩니다
          </p>

          {/* Test Account Button */}
          <div className="mt-8 pt-8 border-t border-[#EDD9CC]">
            <Link
              to="/mediation/start"
              className="block w-full py-3 bg-[#F5E6D8] text-[#2C1810] rounded-full hover:bg-[#EDD9CC] transition-all text-center font-medium"
            >
              🧪 테스트 계정으로 바로 입장하기
            </Link>
            <p className="text-xs text-[#8C6B5A] text-center mt-2">
              개발 테스트용 • 중재 시작 화면으로 이동
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
