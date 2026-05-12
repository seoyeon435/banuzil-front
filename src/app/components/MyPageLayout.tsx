import { Link, useLocation } from "react-router";
import { User, BarChart3, FileText, Heart, Settings, LogOut } from "lucide-react";

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/mypage/profile", icon: User, label: "내 프로필", emoji: "👤" },
    { path: "/mypage/statistics", icon: BarChart3, label: "갈등 통계", emoji: "📊" },
    { path: "/mypage/records", icon: FileText, label: "갈등 기록", emoji: "📋" },
    { path: "/mypage/our-space", icon: Heart, label: "둘만의 공간", emoji: "💑" },
    { path: "/mypage/settings", icon: Settings, label: "설정", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-white border-r border-[#F0DFD0] fixed h-screen flex flex-col">
        {/* Logo/Home Link */}
        <Link to="/" className="p-6 border-b border-[#F0DFD0] hover:bg-[#FFF8F4] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧵</span>
            <span className="text-xl font-bold text-[#1F1410]">바느질</span>
          </div>
        </Link>

        {/* User Profile Section */}
        <div className="p-6 border-b border-[#F0DFD0]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-xl font-bold">
              박
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1F1410]">박서연</h3>
              <span className="inline-block px-3 py-1 bg-[#FF6347]/10 text-[#FF6347] text-xs rounded-full mt-1">
                ENFP
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-6 py-3 mb-1 transition-all
                  ${isActive
                    ? 'bg-[#FF6347]/5 border-l-4 border-[#FF6347] text-[#FF6347]'
                    : 'text-[#7A5C4D] hover:bg-[#FFE0CC] hover:text-[#1F1410]'
                  }
                `}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-[#F0DFD0]">
          <button className="flex items-center gap-2 text-[#7A5C4D] hover:text-[#DC3545] transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="ml-[280px] flex-1 p-12">
        {children}
      </main>
    </div>
  );
}
