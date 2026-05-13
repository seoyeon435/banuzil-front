import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F4] border-b border-[#F0DFD0]">
      <div className="max-w-[1440px] mx-auto px-12 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🧵</span>
          <span className="text-xl font-bold text-[#1F1410]">바느질</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/mypage/profile"
            className="px-6 py-2.5 text-[#1F1410] hover:text-[#FF6347] transition-colors"
          >
            마이페이지
          </Link>
          <Link
            to="/mediation/start"
            className="px-8 py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-colors font-medium"
          >
            갈등 중재
          </Link>
        </div>
      </div>
    </header>
  );
}
