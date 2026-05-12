import MyPageLayout from "./MyPageLayout";
import { Link } from "react-router";

const recentConflicts = [
  { id: 1, date: "2025.03.15", type: "가치관 차이", status: "completed", temp: 38 },
  { id: 2, date: "2025.04.08", type: "연락 문제", status: "in_progress", temp: 62 },
  { id: 3, date: "2025.02.28", type: "약속 파기", status: "completed", temp: 45 },
];

export default function FriendsPage() {
  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        <h1 className="text-[36px] font-semibold text-[#1F1410] mb-2">둘만의 공간</h1>
        <p className="text-[#7A5C4D] mb-8">우리 둘의 갈등 기록과 회복 여정을 함께 돌아봐요.</p>

        {/* Couple Summary Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1F1410]">우리의 관계 요약</h2>
            <span className="px-3 py-1 bg-[#FF6347]/10 text-[#FF6347] text-sm rounded-full">함께한 지 243일</span>
          </div>

          <div className="flex items-center gap-8 mb-6">
            {/* Person A */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-2xl font-bold">
                박
              </div>
              <p className="text-sm font-medium text-[#1F1410]">박서연</p>
              <span className="px-2 py-0.5 bg-[#FF6347]/10 text-[#FF6347] text-xs rounded-full">안정형</span>
            </div>

            {/* Connection */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-3xl">💑</span>
              <div className="w-full h-[2px] bg-gradient-to-r from-[#FF6347] to-[#D4956A] rounded-full" />
              <p className="text-xs text-[#7A5C4D]">EFT 중재 {recentConflicts.length}회</p>
            </div>

            {/* Person B */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#D4956A] flex items-center justify-center text-[#1F1410] text-2xl font-bold">
                지
              </div>
              <p className="text-sm font-medium text-[#1F1410]">지현</p>
              <span className="px-2 py-0.5 bg-[#D4956A]/10 text-[#D4956A] text-xs rounded-full">불안형</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FFE0CC] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#1F1410]">3</p>
              <p className="text-sm text-[#7A5C4D] mt-1">갈등 해결 완료</p>
            </div>
            <div className="bg-[#E0F4E8] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#5A9F7C]">38°</p>
              <p className="text-sm text-[#7A5C4D] mt-1">최근 갈등 온도</p>
            </div>
            <div className="bg-[#FF6347]/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#FF6347]">5</p>
              <p className="text-sm text-[#7A5C4D] mt-1">회복 문장 저장됨</p>
            </div>
          </div>
        </div>

        {/* Recent Conflict Records */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1F1410]">우리의 갈등 기록</h2>
            <Link to="/mypage/records" className="text-sm text-[#FF6347] hover:text-[#E84028] underline">
              전체 보기 →
            </Link>
          </div>

          <div className="space-y-3">
            {recentConflicts.map((record) => {
              const isCompleted = record.status === "completed";
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(255,99,71,0.13)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{isCompleted ? "✅" : "🔄"}</span>
                    <div>
                      <p className="font-medium text-[#1F1410]">{record.type}</p>
                      <p className="text-sm text-[#7A5C4D]">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCompleted ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#FFE9DD] text-[#D4956A]"
                      }`}
                    >
                      {isCompleted ? "AI 중재 완료" : "상대방 입장 입력 대기"}
                    </span>
                    <span className="text-sm text-[#7A5C4D]">{record.temp}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Mediation CTA */}
        <div className="bg-gradient-to-br from-[#FF6347] to-[#E84028] rounded-2xl p-8 text-white text-center">
          <p className="text-xl font-semibold mb-2">새로운 갈등을 함께 돌아볼 준비가 됐나요?</p>
          <p className="text-white/80 mb-6 text-sm">
            EFT 상담 흐름에 따라 감정과 욕구를 함께 분석해드려요.
          </p>
          <Link
            to="/mediation/start"
            className="inline-block px-10 py-3 bg-white text-[#FF6347] font-semibold rounded-full hover:bg-[#FFF8F4] transition-all"
          >
            갈등 중재 시작하기 →
          </Link>
        </div>
      </div>
    </MyPageLayout>
  );
}
