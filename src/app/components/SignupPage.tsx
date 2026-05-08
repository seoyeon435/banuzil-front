import { Link } from "react-router";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    if (pwd.length < 8) return 1;
    if (pwd.length < 12) return 2;
    return 3;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="w-1/2 bg-gradient-to-br from-[#FF6347] to-[#E84028] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signup-stitch" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M10 40 Q 25 25 40 40 T 70 40" stroke="white" strokeWidth="2" fill="none" strokeDasharray="6,6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#signup-stitch)" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-12 max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl">🧵</span>
            <span className="text-4xl font-bold">바느질</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-semibold mb-4">처음 오셨군요 🌱</h2>
          <p className="text-lg text-white/90">관계를 이어가는 첫 걸음을 시작해요</p>

          {/* Decorative Illustration */}
          <div className="mt-16 relative">
            <svg width="200" height="120" viewBox="0 0 200 120" className="mx-auto">
              {/* Growing plant/sprout */}
              <path
                d="M 100 100 Q 100 70 80 50 Q 70 40 65 45"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
              />
              <path
                d="M 100 100 Q 100 60 120 40 Q 130 30 135 35"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
              />
              <circle cx="65" cy="45" r="12" fill="white" opacity="0.3" />
              <circle cx="135" cy="35" r="15" fill="white" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center px-12 py-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#1F1410] mb-2">회원가입</h1>
            <p className="text-[#7A5C4D]">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-[#FF6347] underline hover:text-[#E84028]">
                로그인
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                이름 또는 닉네임
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5C4D]" />
                <input
                  type="text"
                  placeholder="표시될 이름을 입력해주세요"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5C4D]" />
                <input
                  type="email"
                  placeholder="이메일 주소를 입력해주세요"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5C4D]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="8자 이상 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A5C4D] hover:text-[#1F1410]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  <div className={`h-1 flex-1 rounded ${passwordStrength >= 1 ? 'bg-[#DC3545]' : 'bg-[#F0DFD0]'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordStrength >= 2 ? 'bg-[#D4956A]' : 'bg-[#F0DFD0]'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordStrength >= 3 ? 'bg-[#5A9F7C]' : 'bg-[#F0DFD0]'}`} />
                </div>
              )}
            </div>

            {/* Password Confirm Input */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5C4D]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A5C4D] hover:text-[#1F1410]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {passwordsMatch && (
                  <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A9F7C]" />
                )}
              </div>
            </div>

            {/* MBTI Select */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                나의 MBTI (선택사항)
              </label>
              <select className="w-full h-12 px-4 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all text-[#1F1410]">
                <option value="">선택해주세요</option>
                {mbtiTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="text-xs text-[#7A5C4D] mt-1">나중에 설정해도 괜찮아요</p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="appearance-none w-5 h-5 border-2 border-[#F0DFD0] rounded bg-white checked:bg-[#FF6347] checked:border-[#FF6347] transition-all cursor-pointer"
                  />
                  {termsAccepted && (
                    <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none" />
                  )}
                </div>
                <span className="text-sm text-[#1F1410]">
                  이용약관 및 개인정보처리방침에 동의합니다 (필수)
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={marketingAccepted}
                    onChange={(e) => setMarketingAccepted(e.target.checked)}
                    className="appearance-none w-5 h-5 border-2 border-[#F0DFD0] rounded bg-white checked:bg-[#FF6347] checked:border-[#FF6347] transition-all cursor-pointer"
                  />
                  {marketingAccepted && (
                    <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none" />
                  )}
                </div>
                <span className="text-sm text-[#1F1410]">
                  마케팅 수신에 동의합니다 (선택)
                </span>
              </label>
            </div>

            {/* Signup Button */}
            <Link
              to={termsAccepted ? "/signup/attachment-survey" : "#"}
              onClick={(e) => !termsAccepted && e.preventDefault()}
              className={`
                block w-full h-[52px] text-center leading-[52px] rounded-full font-medium transition-all
                ${termsAccepted
                  ? 'bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)] hover:shadow-[0_6px_20px_rgba(255,99,71,0.35)] cursor-pointer'
                  : 'bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed opacity-50'
                }
              `}
            >
              다음: 애착 유형 검사
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-[#F0DFD0]" />
            <span className="text-sm text-[#7A5C4D]">또는</span>
            <div className="flex-1 h-[1px] bg-[#F0DFD0]" />
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <Link
              to="/signup/attachment-survey"
              className="w-full h-[48px] border-2 border-[#FEE500] bg-[#FEE500] text-[#000000] rounded-xl hover:bg-[#FEE500]/90 transition-all flex items-center justify-center gap-2"
            >
              <span>🟡</span>
              카카오로 시작하기
            </Link>
            <Link
              to="/signup/attachment-survey"
              className="w-full h-[48px] border-2 border-[#F0DFD0] bg-white text-[#1F1410] rounded-xl hover:bg-[#FFE0CC] transition-all flex items-center justify-center gap-2"
            >
              <span>⬜</span>
              구글로 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
