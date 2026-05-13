import MyPageLayout from "./MyPageLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import StitchDivider from "./ui/StitchDivider";

const records = [
  {
    id: 1,
    date: "2025.03.15",
    temperature: 38,
    status: "completed",
    type: "가치관차이",
    partnerInputDone: true,
    aiMediated: true,
    recoverySaved: true,
    preview: "아나운서 준비 중 일본여행 제안으로 인한 갈등...",
  },
  {
    id: 2,
    date: "2025.04.08",
    temperature: 62,
    status: "in_progress",
    type: "연락문제",
    partnerInputDone: false,
    aiMediated: false,
    recoverySaved: false,
    preview: "연락 빈도에 대한 의견 차이...",
  },
  {
    id: 3,
    date: "2025.02.28",
    temperature: 45,
    status: "completed",
    type: "약속파기",
    partnerInputDone: true,
    aiMediated: true,
    recoverySaved: false,
    preview: "저녁 약속 취소에 대한 갈등...",
  },
  {
    id: 4,
    date: "2025.02.14",
    temperature: 72,
    status: "completed",
    type: "데이트비용",
    partnerInputDone: true,
    aiMediated: true,
    recoverySaved: true,
    preview: "발렌타인데이 비용 분담 문제...",
  },
  {
    id: 5,
    date: "2025.01.20",
    temperature: 55,
    status: "completed",
    type: "연락문제",
    partnerInputDone: true,
    aiMediated: true,
    recoverySaved: true,
    preview: "주말 연락 기대치 차이로 인한 갈등...",
  },
];

const conflictTypes = ["전체 유형", "연락문제", "가치관차이", "약속파기", "데이트비용"];
const periods = ["기간 선택", "최근 1개월", "최근 3개월", "최근 6개월"];

export default function RecordsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("전체 유형");
  const [filterPeriod, setFilterPeriod] = useState("기간 선택");
  const [filterTemp, setFilterTemp] = useState("all");

  const getTemperatureColor = (temp: number) => {
    if (temp >= 70) return { bg: "#FFE0E0", text: "#DC3545", emoji: "🔴" };
    if (temp >= 50) return { bg: "#FFE9DD", text: "#D4956A", emoji: "🟡" };
    return { bg: "#E0F4E8", text: "#5A9F7C", emoji: "🟢" };
  };

  const filtered = records.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterType !== "전체 유형" && r.type !== filterType) return false;
    if (filterTemp === "high" && r.temperature < 70) return false;
    if (filterTemp === "mid" && (r.temperature < 50 || r.temperature >= 70)) return false;
    if (filterTemp === "low" && r.temperature >= 50) return false;
    return true;
  });

  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-semibold text-[#1F1410] mb-2">우리의 갈등 기록</h1>
          <p className="text-[#7A5C4D] mb-6">두 사람이 함께 걸어온 갈등 회복의 여정이에요.</p>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <div className="flex gap-2">
              {[
                { key: "all", label: "전체" },
                { key: "in_progress", label: "진행중" },
                { key: "completed", label: "완료됨" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterStatus === key
                      ? "bg-[#FF6347] text-white"
                      : "bg-white border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Conflict Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white border border-[#F0DFD0] rounded-lg text-[#1F1410] focus:outline-none focus:ring-2 focus:ring-[#FF6347]"
            >
              {conflictTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            {/* Period Filter */}
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 bg-white border border-[#F0DFD0] rounded-lg text-[#1F1410] focus:outline-none focus:ring-2 focus:ring-[#FF6347]"
            >
              {periods.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            {/* Temperature Filter */}
            <select
              value={filterTemp}
              onChange={(e) => setFilterTemp(e.target.value)}
              className="px-4 py-2 bg-white border border-[#F0DFD0] rounded-lg text-[#1F1410] focus:outline-none focus:ring-2 focus:ring-[#FF6347]"
            >
              <option value="all">감정 온도 전체</option>
              <option value="high">🔴 높음 (70° 이상)</option>
              <option value="mid">🟡 중간 (50°~69°)</option>
              <option value="low">🟢 낮음 (49° 이하)</option>
            </select>
          </div>
        </div>

        <StitchDivider className="mb-6" />

        {/* Records List */}
        <div className="space-y-4 mb-8">
          {filtered.map((record) => {
            const tempStyle = getTemperatureColor(record.temperature);
            const isCompleted = record.status === "completed";

            return (
              <div
                key={record.id}
                className={`bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)] hover:shadow-[0_12px_40px_rgba(255,99,71,0.23)] transition-all duration-300 border-l border-l-[#FF6347] ${
                  isCompleted ? "hover:border-l-4" : "border-l-4"
                }`}
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[#7A5C4D] font-medium">{record.date}</span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: tempStyle.bg, color: tempStyle.text }}
                    >
                      {record.temperature}° {tempStyle.emoji}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCompleted ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#FFE9DD] text-[#D4956A]"
                      }`}
                    >
                      {isCompleted ? "완료됨 ✓" : "진행중"}
                    </span>
                    <span className="px-3 py-1 bg-[#FFE0CC] text-[#1F1410] rounded-full text-sm">
                      {record.type}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.partnerInputDone ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#F0DFD0] text-[#7A5C4D]"}`}>
                    {record.partnerInputDone ? "✓ 상대방 입장 입력 완료" : "⏳ 상대방 입장 대기중"}
                  </span>
                  {record.aiMediated && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FF6347]/10 text-[#FF6347]">
                      ✓ AI 중재 완료
                    </span>
                  )}
                  {record.recoverySaved && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFE9DD] text-[#D4956A]">
                      ✓ 회복 문장 저장됨
                    </span>
                  )}
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

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#7A5C4D]">
              <p className="text-4xl mb-4">📭</p>
              <p>조건에 맞는 갈등 기록이 없어요.</p>
            </div>
          )}
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
