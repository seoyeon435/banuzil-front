import { useEffect, useState } from "react";
import { fetchCurrentUserProfile, getStoredCurrentUser, type CurrentUser } from "../../api/userApi";

export default function AuthDebugBadge() {
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

  return (
    <div className="fixed left-4 bottom-4 z-50 max-w-[260px] rounded-xl border border-[#E5E2DC] bg-white/95 p-3 text-xs text-[#6F7787] shadow-[0_4px_16px_rgba(35,40,56,0.078)]">
      <p className="font-semibold text-[#1A1A2E]">현재 로그인</p>
      <p className="break-all">{currentUser.email ?? "이메일 정보 없음"}</p>
      <p>닉네임: {currentUser.nickname ?? "-"}</p>
      {currentUser.userId && <p>userId: {currentUser.userId}</p>}
    </div>
  );
}
