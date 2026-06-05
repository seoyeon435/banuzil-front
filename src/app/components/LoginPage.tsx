import { Link, useNavigate, useLocation } from "react-router";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { getLoginErrorMessage, login, loginWithTestAccount } from "../../api/userApi";
import BrandMark from "./ui/BrandMark";
import HeroDivider from "./ui/HeroDivider";

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
      <div className="w-full lg:w-1/2 min-h-[280px] lg:min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* 배경 라벤더 곡선 — 상단 */}
        <svg
          className="absolute top-0 left-0 w-full pointer-events-none"
          width="100%"
          height="220"
          viewBox="0 0 800 220"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M -20 120 C 160 40, 360 200, 540 120 S 820 60, 840 100"
            stroke="#D4D0E8"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path
            d="M -20 180 C 180 110, 380 240, 560 170 S 820 140, 840 170"
            stroke="#D4D0E8"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.18"
          />
        </svg>

        {/* 배경 라벤더 곡선 — 하단 */}
        <svg
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          width="100%"
          height="220"
          viewBox="0 0 800 220"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M -20 100 C 180 180, 380 40, 560 110 S 820 160, 840 130"
            stroke="#D4D0E8"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path
            d="M -20 160 C 160 220, 380 80, 560 150 S 820 200, 840 180"
            stroke="#D4D0E8"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.18"
          />
        </svg>

        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="flex items-center justify-center gap-3 mb-10">
            <BrandMark size={28} variant="dual" />
            <span className="text-[34px] font-semibold tracking-tight">바느질</span>
          </div>

          <h2 className="text-[40px] font-semibold mb-6 leading-tight">다시 오셨군요</h2>

          <p className="text-[17px] text-white/70 leading-[1.9]">
            우리 사이의 이야기를
            <br />
            이어가요
          </p>

          <div className="mt-14 flex flex-col items-center gap-4">
            <HeroDivider width={220} />
            <p className="text-sm text-white/50 tracking-wide">잇다, 부드럽게</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-[#FAFAF7] flex items-center justify-center px-6 sm:px-12 py-10 lg:py-0">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h1 className="text-[28px] font-bold text-[#1A1A2E] mb-2">로그인</h1>
            <p className="text-[#6F7787]">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-[#1A1A2E] underline hover:text-[#0F0F1F]">
                회원가입
              </Link>
            </p>
          </div>

          {/* 접근 제한 안내 메시지 */}
          {redirectMessage && (
            <div className="mb-6 px-4 py-3 bg-[#EBE9F2] border border-[#6F8197] rounded-xl text-sm text-[#6F7787]">
              {redirectMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-2">아이디</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F7787]" />
                <input
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="off"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#E5E2DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-2">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F7787]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full h-12 pl-12 pr-12 bg-white border border-[#E5E2DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F7787] hover:text-[#1A1A2E]"
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
                  ? "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
                  : "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
              }`}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
