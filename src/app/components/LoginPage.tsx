import { Link, useNavigate, useLocation } from "react-router";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { getLoginErrorMessage, login, loginWithTestAccount } from "../../api/userApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = (location.state as { message?: string })?.message ?? null;

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");

    try {
      await login(loginId.trim(), password);
      navigate("/");
    } catch (error) {
      console.error("[API] Login failed:", error);
      setErrorMsg(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      await loginWithTestAccount();
      navigate("/");
    } catch (error) {
      console.error("[API] Test login failed:", error);
      setErrorMsg(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Decorative */}
      <div className="w-full lg:w-1/2 min-h-[280px] lg:min-h-screen bg-gradient-to-br from-[#FF6347] to-[#E84028] flex flex-col items-center justify-center text-white relative overflow-hidden">
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl">🧵</span>
            <span className="text-4xl font-bold">바느질</span>
          </div>
          <h2 className="text-3xl font-semibold mb-4">다시 오셨군요 🧵</h2>
          <p className="text-lg text-white/90">우리 사이의 이야기를 이어가요</p>
          <div className="mt-16 relative">
            <svg width="200" height="120" viewBox="0 0 200 120" className="mx-auto">
              <path d="M 40 60 Q 40 40 60 40 L 80 40 Q 100 40 100 60" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.4" />
              <path d="M 100 60 Q 100 40 120 40 L 140 40 Q 160 40 160 60" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.4" />
              <circle cx="100" cy="60" r="8" fill="white" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-12 py-10 lg:py-0">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h1 className="text-[28px] font-bold text-[#1F1410] mb-2">로그인</h1>
            <p className="text-[#7A5C4D]">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-[#FF6347] underline hover:text-[#E84028]">
                회원가입
              </Link>
            </p>
          </div>

          {/* 접근 제한 안내 메시지 */}
          {redirectMessage && (
            <div className="mb-6 px-4 py-3 bg-[#FFE9DD] border border-[#D4956A] rounded-xl text-sm text-[#7A5C4D]">
              {redirectMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">아이디</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5C4D]" />
                <input
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="off"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1410] mb-2">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5C4D]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
            </div>

            {/* 에러 메시지 */}
            {errorMsg && (
              <p className="text-sm text-[#DC3545] px-1">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-[52px] rounded-full font-medium transition-all ${
                isLoading
                  ? "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
                  : "bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
              }`}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 테스트 계정 */}
          <div className="mt-8 pt-8 border-t border-[#F0DFD0]">
            <button
              onClick={handleTestLogin}
              className="block w-full py-3 bg-[#FFE0CC] text-[#1F1410] rounded-full hover:bg-[#F0DFD0] transition-all text-center font-medium"
            >
              🧪 테스트 계정으로 바로 입장하기
            </button>
            <p className="text-xs text-[#7A5C4D] text-center mt-2">
              개발 테스트용 • 실제 토큰으로 홈으로 이동
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
