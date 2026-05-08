import MyPageLayout from "./MyPageLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const records = [
  {
    id: 1,
    date: "2025.03.15",
    temperature: 88,
    status: "completed",
    partner: "지현",
    username: "@jihyun_bak",
    type: "가치관차이",
    preview: "아나운서 준비 중 일본여행 제안으로 인한 갈등...",
  },
  {
    id: 2,
    date: "2025.04.08",
    temperature: 62,
    status: "in_progress",
    partner: "원규",
    username: "@wongyu_j",
    type: "연락문제",
    preview: "연락 빈도에 대한 의견 차이...",
  },
  {
    id: 3,
    date: "2025.02.28",
    temperature: 45,
    status: "completed",
    partner: "민지",
    username: "@minji_k",
    type: "약속파기",
    preview: "저녁 약속 취소에 대한 갈등...",
  },
  {
    id: 4,
    date: "2025.02.14",
    temperature: 72,
    status: "completed",
    partner: "서준",
    username: "@seojun_p",
    type: "데이트비용",
    preview: "발렌타인데이 비용 분담 문제...",
  },
  {
    id: 5,
    date: "2025.01.20",
    temperature: 55,
    status: "completed",
    partner: "하은",
    username: "@haeun_l",
    type: "연락문제",
    preview: "주말 연락 기대치 차이로 인한 갈등...",
  },
];

export default function RecordsPage() {
  const [filterStatus, setFilterStatus] = useState("all");

  const getTemperatureColor = (temp: number) => {
    if (temp >= 80) return { bg: "#FFE0E0", text: "#DC3545", emoji: "🔴" };
    if (temp >= 60) return { bg: "#FFE9DD", text: "#D4956A", emoji: "🟡" };
    return { bg: "#E0F4E8", text: "#5A9F7C", emoji: "🟢" };
  };

  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-semibold text-[#1F1410] mb-6">갈등 기록</h1>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterStatus === "all"
                    ? "bg-[#FF6347] text-white"
                    : "bg-white border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC]"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterStatus("in_progress")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterStatus === "in_progress"
                    ? "bg-[#FF6347] text-white"
                    : "bg-white border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC]"
                }`}
              >
                진행중
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterStatus === "completed"
                    ? "bg-[#FF6347] text-white"
                    : "bg-white border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC]"
                }`}
              >
                완료됨
              </button>
            </div>

            <select className="px-4 py-2 bg-white border border-[#F0DFD0] rounded-lg text-[#1F1410] focus:outline-none focus:ring-2 focus:ring-[#FF6347]">
              <option>친구 선택</option>
              <option>지현</option>
              <option>원규</option>
              <option>민지</option>
            </select>

            <select className="px-4 py-2 bg-white border border-[#F0DFD0] rounded-lg text-[#1F1410] focus:outline-none focus:ring-2 focus:ring-[#FF6347]">
              <option>기간 선택</option>
              <option>최근 1개월</option>
              <option>최근 3개월</option>
              <option>최근 6개월</option>
            </select>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4 mb-8">
          {records.map((record) => {
            const tempStyle = getTemperatureColor(record.temperature);
            const isCompleted = record.status === "completed";

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)] hover:shadow-[0_12px_40px_rgba(255,99,71,0.23)] transition-all"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[#7A5C4D] font-medium">{record.date}</span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: tempStyle.bg, color: tempStyle.text }}
                    >
                      {record.temperature}° {tempStyle.emoji}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCompleted
                          ? "bg-[#E0F4E8] text-[#5A9F7C]"
                          : "bg-[#FFE9DD] text-[#D4956A]"
                      }`}
                    >
                      {isCompleted ? "완료됨 ✓" : "진행중"}
                    </span>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6347] to-[#E84028] flex items-center justify-center text-white text-sm font-bold">
                      {record.partner[0]}
                    </div>
                    <span className="text-[#1F1410] font-medium">
                      {record.partner} ({record.username})
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-[#FFE0CC] text-[#1F1410] rounded-full text-sm">
                    {record.type}
                  </span>
                </div>

                {/* Preview Text */}
                <p className="text-[#7A5C4D] mb-4">{record.preview}</p>

                {/* Bottom Action */}
                {isCompleted ? (
                  <button className="text-[#FF6347] hover:text-[#E84028] font-medium flex items-center gap-1 transition-colors">
                    최종 보고서 보기 →
                  </button>
                ) : (
                  <button className="px-6 py-2.5 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all flex items-center gap-2">
                    이어서 중재하기 →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC] transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF6347] text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC] transition-all">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC] transition-all">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC] transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MyPageLayout>
  );
}
