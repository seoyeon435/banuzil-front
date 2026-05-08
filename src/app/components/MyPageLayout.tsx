import { Link, useLocation } from "react-router";
import { User, BarChart3, FileText, Users, Settings, LogOut } from "lucide-react";

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/mypage/profile", icon: User, label: "내 프로필", emoji: "👤" },
    { path: "/mypage/statistics", icon: BarChart3, label: "갈등 통계", emoji: "📊" },
    { path: "/mypage/records", icon: FileText, label: "갈등 기록", emoji: "📋" },
    { path: "/mypage/friends", icon: Users, label: "친구 관리", emoji: "👥" },
    { path: "/mypage/settings", icon: Settings, label: "설정", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-white border-r border-[#EDD9CC] fixed h-screen flex flex-col">
        {/* Logo/Home Link */}
        <Link to="/" className="p-6 border-b border-[#EDD9CC] hover:bg-[#FFF8F4] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧵</span>
            <span className="text-xl font-bold text-[#2C1810]">바느질</span>
          </div>
        </Link>

        {/* User Profile Section */}
        <div className="p-6 border-b border-[#EDD9CC]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white text-xl font-bold">
              박
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2C1810]">박서연</h3>
              <span className="inline-block px-3 py-1 bg-[#FF8C7A]/10 text-[#FF8C7A] text-xs rounded-full mt-1">
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
                    ? 'bg-[#FF8C7A]/5 border-l-4 border-[#FF8C7A] text-[#FF8C7A]'
                    : 'text-[#8C6B5A] hover:bg-[#F5E6D8] hover:text-[#2C1810]'
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
        <div className="p-6 border-t border-[#EDD9CC]">
          <button className="flex items-center gap-2 text-[#8C6B5A] hover:text-[#E57373] transition-colors">
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
