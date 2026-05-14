import { Link, useLocation, useNavigate } from "react-router";
import { User, BarChart3, FileText, Heart, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCurrentUserProfile, getStoredCurrentUser, logout, type CurrentUser } from "../../api/userApi";
import { fallbackNameFromEmail } from "../utils/displayUser";

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => getStoredCurrentUser());

  useEffect(() => {
    let mounted = true;

    setCurrentUser(getStoredCurrentUser());
    fetchCurrentUserProfile().then((profile) => {
      if (!mounted || !profile) return;
      setCurrentUser(profile);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = currentUser.nickname || fallbackNameFromEmail(currentUser.email);
  const initial = displayName.slice(0, 1).toUpperCase();

  const navItems = [
    { path: "/mypage/profile", icon: User, label: "프로필", emoji: "👤" },
    { path: "/mypage/statistics", icon: BarChart3, label: "갈등 통계", emoji: "📊" },
    { path: "/mypage/records", icon: FileText, label: "갈등 기록", emoji: "📄" },
    { path: "/mypage/our-space", icon: Heart, label: "우리 공간", emoji: "💕" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex flex-col lg:flex-row min-w-0 [word-break:keep-all] overflow-x-hidden">
      <aside className="w-full lg:w-[280px] bg-white border-b lg:border-b-0 lg:border-r border-[#F0DFD0] lg:fixed lg:h-screen flex flex-col z-10">
        <Link to="/" className="p-5 lg:p-6 border-b border-[#F0DFD0] hover:bg-[#FFF8F4] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧵</span>
            <span className="text-xl font-bold text-[#1F1410]">바느질</span>
          </div>
        </Link>

        <div className="p-5 lg:p-6 border-b border-[#F0DFD0]">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-xl font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-[#1F1410] truncate">{displayName}</h3>
              <span className="inline-block px-3 py-1 bg-[#FF6347]/10 text-[#FF6347] text-xs rounded-full mt-1">
                ENFP
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-[#FFF8F4] border border-[#F0DFD0] p-3 text-xs text-[#7A5C4D] space-y-1 min-w-0">
            <p className="font-semibold text-[#1F1410]">현재 로그인</p>
            <p className="break-all">{currentUser.email ?? "이메일 정보 없음"}</p>
            <p className="break-words">닉네임: {displayName}</p>
            {currentUser.userId && <p>userId: {currentUser.userId}</p>}
          </div>
        </div>

        <nav className="flex lg:flex-1 overflow-x-auto lg:overflow-x-visible lg:block py-3 lg:py-6 px-3 lg:px-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 mb-0 lg:mb-1 rounded-xl lg:rounded-none transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#FF6347]/5 lg:border-l-4 border-[#FF6347] text-[#FF6347]"
                    : "text-[#7A5C4D] hover:bg-[#FFE0CC] hover:text-[#1F1410]"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block p-6 border-t border-[#F0DFD0]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#7A5C4D] hover:text-[#DC3545] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">로그아웃</span>
          </button>
        </div>
      </aside>

      <main className="w-full lg:ml-[280px] flex-1 min-w-0 p-4 sm:p-8 lg:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
