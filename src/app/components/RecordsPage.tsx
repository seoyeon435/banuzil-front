import MyPageLayout from "./MyPageLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import StitchDivider from "./ui/StitchDivider";
import { getSewingSessionList, SewingSession } from "../../api/sewingApi";

const ITEMS_PER_PAGE = 5;

function displayName(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return fallback;
  return trimmed;
}

// API 세션 → 화면 카드 형태로 변환
function sessionToRecord(s: SewingSession, idx: number) {
  const isCompleted = s.status === "COMPLETED";
  const initiatorName = displayName(s.initiatorNickname, "나");
  const participantName = displayName(s.participantNickname, "상대방");
  const date = new Date(s.updatedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
  return {
    id: s.sessionId ?? idx,
    sessionId: s.sessionId,
    date,
    status: isCompleted ? "completed" : "in_progress",
    currentRound: s.currentRound,
    preview: `${initiatorName}과(와) ${participantName}의 갈등 중재 · ${s.currentRound}라운드`,
  };
}

export default function RecordsPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [records, setRecords] = useState<ReturnType<typeof sessionToRecord>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const sessions = await getSewingSessionList();
        setRecords((sessions ?? []).map(sessionToRecord));
      } catch (error) {
        console.error("[Records] 세션 목록 조회 실패 — 빈 화면 유지:", error);
        setRecords([]);
      }
    })();
  }, []);

  const handleViewReport = (sessionId: number) => {
    sessionStorage.setItem("sewingSessionId", String(sessionId));
    void navigate("/mediation/complete");
  };

  const filtered = records.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
          <h1 className="text-[36px] font-semibold text-[#1A1A2E] mb-2">우리의 갈등 기록</h1>
          <p className="text-[#6F7787] mb-6">두 사람이 함께 걸어온 갈등 회복의 여정이에요.</p>

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
                    ? "bg-[#1A1A2E] text-white"
                    : "bg-white border border-[#E5E2DC] text-[#6F7787] hover:bg-[#EFEDE7]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <StitchDivider className="mb-6" />

        {/* Records List */}
        <div className="space-y-4 mb-8">
          {currentItems.map((record) => {
            const isCompleted = record.status === "completed";
            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(35,40,56,0.102)] hover:shadow-[0_12px_40px_rgba(35,40,56,0.138)] transition-all duration-300 border-l-4 border-l-[#1A1A2E]"
              >
                {/* Top Row */}
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <span className="text-[#6F7787] font-medium">{record.date}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCompleted ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#EBE9F2] text-[#6F8197]"
                    }`}
                  >
                    {isCompleted ? "완료됨 ✓" : "진행중"}
                  </span>
                  <span className="px-3 py-1 bg-[#EFEDE7] text-[#1A1A2E] rounded-full text-sm">
                    갈등 중재
                  </span>
                </div>

                {/* Preview Text */}
                <p className="text-[#6F7787] mb-4">{record.preview}</p>

                {/* Bottom Action */}
                {isCompleted && (
                  <button
                    onClick={() => handleViewReport(record.sessionId)}
                    className="text-[#1A1A2E] hover:text-[#0F0F1F] font-medium flex items-center gap-1 transition-colors"
                  >
                    최종 보고서 보기 →
                  </button>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#6F7787]">
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
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E2DC] transition-all ${
              safeCurrentPage === 1
                ? "text-[#C9B8A8] cursor-not-allowed"
                : "text-[#6F7787] hover:bg-[#EFEDE7]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => moveToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-all ${
                safeCurrentPage === page
                  ? "bg-[#1A1A2E] text-white"
                  : "border border-[#E5E2DC] text-[#6F7787] hover:bg-[#EFEDE7]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => moveToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E2DC] transition-all ${
              safeCurrentPage === totalPages
                ? "text-[#C9B8A8] cursor-not-allowed"
                : "text-[#6F7787] hover:bg-[#EFEDE7]"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MyPageLayout>
  );
}
