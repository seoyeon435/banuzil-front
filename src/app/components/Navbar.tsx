import { Link } from "react-router";
import BrandMark from "./ui/BrandMark";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF7] border-b border-[#E5E2DC]">
      <div className="max-w-[1440px] mx-auto px-12 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <BrandMark size={18} variant="dual" />
          <span className="text-xl font-semibold tracking-tight text-[#1A1A2E]">바느질</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/mypage/profile"
            className="px-6 py-2.5 text-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
          >
            마이페이지
          </Link>
          <Link
            to="/mediation/start"
            className="px-8 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#0F0F1F] transition-colors font-medium"
          >
            갈등 중재
          </Link>
        </div>
      </div>
    </header>
  );
}
