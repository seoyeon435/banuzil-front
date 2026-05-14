import { Link, useNavigate } from "react-router";
import { Lock, User, Eye, EyeOff, Check, Venus, Mars, Mail } from "lucide-react";
import { useState } from "react";
import { getSignupErrorMessage, login, signup } from "../../api/userApi";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [mbti, setMbti] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const canSubmit =
    nickname.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    passwordsMatch &&
    gender !== "" &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMessage("");
    setSubmitting(true);
    try {
      await signup({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
        gender,
        mbti,
      });
      // 가입 응답에 토큰이 없으므로 즉시 로그인을 시도해 세션을 확보한다.
      await login(email.trim(), password);
      navigate("/signup/attachment-survey");
    } catch (error) {
      setErrorMessage(getSignupErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

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
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
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
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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

            {/* Gender Select */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                성별
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`flex items-center justify-center gap-2 h-12 rounded-xl border-2 transition-all font-medium text-sm ${
                    gender === "female"
                      ? "border-[#FF6347] bg-[#FF6347]/10 text-[#FF6347]"
                      : "border-[#F0DFD0] text-[#7A5C4D] hover:border-[#FF6347]/50 hover:bg-[#FFF8F4]"
                  }`}
                >
                  <Venus className="w-4 h-4" />
                  여성
                </button>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`flex items-center justify-center gap-2 h-12 rounded-xl border-2 transition-all font-medium text-sm ${
                    gender === "male"
                      ? "border-[#5A9F7C] bg-[#5A9F7C]/10 text-[#5A9F7C]"
                      : "border-[#F0DFD0] text-[#7A5C4D] hover:border-[#5A9F7C]/50 hover:bg-[#FFF8F4]"
                  }`}
                >
                  <Mars className="w-4 h-4" />
                  남성
                </button>
              </div>
            </div>

            {/* MBTI Select */}
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">
                나의 MBTI (선택사항)
              </label>
              <select
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all text-[#1F1410]"
              >
                <option value="">선택해주세요</option>
                {mbtiTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="text-xs text-[#7A5C4D] mt-1">나중에 설정해도 괜찮아요</p>
            </div>

            {/* Error message */}
            {errorMessage && (
              <p className="text-sm text-[#DC3545] bg-[#FFE0E0] rounded-lg px-4 py-3">
                {errorMessage}
              </p>
            )}

            {/* Signup Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`block w-full h-[52px] text-center rounded-full font-medium transition-all ${
                canSubmit
                  ? "bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)] hover:shadow-[0_6px_20px_rgba(255,99,71,0.35)]"
                  : "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
              }`}
            >
              {submitting ? "가입 처리 중..." : "다음: 애착 유형 검사"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
