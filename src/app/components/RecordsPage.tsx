import MyPageLayout from "./MyPageLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import StitchDivider from "./ui/StitchDivider";
import { getSewingSessionList, SewingSession } from "../../api/sewingApi";

const ITEMS_PER_PAGE = 3;

function displayName(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return fallback;
  return trimmed;
}

const MOCK_RECORDS = [
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

// API 세션 → 화면 카드 형태로 변환
function sessionToRecord(s: SewingSession, idx: number) {
  const isCompleted = s.status === "COMPLETED" || s.status === "completed";
  const initiatorName = displayName(s.initiatorNickname, "나");
  const participantName = displayName(s.participantNickname, "상대방");
  const date = new Date(s.updatedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, ".").replace(".", "");
  return {
    id: s.sessionId ?? idx,
    date,
    temperature: Math.max(38, 75 - s.currentRound * 10),
    status: isCompleted ? "completed" : "in_progress",
    type: "갈등 중재",
    partnerInputDone: s.currentRound > 1,
    aiMediated: isCompleted,
    recoverySaved: false,
    preview: `${initiatorName}과(와) ${participantName}의 갈등 중재 · 현재 ${s.currentRound}라운드`,
  };
}

const conflictTypes = ["전체 유형", "연락문제", "가치관차이", "약속파기", "데이트비용"];
const periods = ["기간 선택", "최근 1개월", "최근 3개월", "최근 6개월"];

export default function RecordsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("전체 유형");
  const [filterPeriod, setFilterPeriod] = useState("기간 선택");
  const [filterTemp, setFilterTemp] = useState("all");
  const [records, setRecords] = useState(MOCK_RECORDS);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const sessions = await getSewingSessionList();
        if (sessions && sessions.length > 0) {
          setRecords(sessions.map(sessionToRecord));
        }
        // 빈 배열이면 mock 유지
      } catch (error) {
        console.error("[API] 세션 목록 조회 실패 → mock fallback 유지:", error);
      }
    })();
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterType, filterPeriod, filterTemp]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    console.log("[Records] 전체 sessions 개수", filtered.length);
    console.log("[Records] currentPage", safeCurrentPage);
    console.log("[Records] itemsPerPage", ITEMS_PER_PAGE);
    console.log("[Records] totalPages", totalPages);
    console.log("[Records] 현재 페이지에 표시되는 currentItems", currentItems);
  }, [currentItems, filtered.length, safeCurrentPage, totalPages]);

  const moveToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          {currentItems.map((record) => {
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
          <button
            onClick={() => moveToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#F0DFD0] transition-all ${
              safeCurrentPage === 1
                ? "text-[#C9B8A8] cursor-not-allowed"
                : "text-[#7A5C4D] hover:bg-[#FFE0CC]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => moveToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-all ${
                safeCurrentPage === page
                  ? "bg-[#FF6347] text-white"
                  : "border border-[#F0DFD0] text-[#7A5C4D] hover:bg-[#FFE0CC]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => moveToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#F0DFD0] transition-all ${
              safeCurrentPage === totalPages
                ? "text-[#C9B8A8] cursor-not-allowed"
                : "text-[#7A5C4D] hover:bg-[#FFE0CC]"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MyPageLayout>
  );
}
