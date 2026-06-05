import MyPageLayout from "./MyPageLayout";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import StitchDivider from "./ui/StitchDivider";
import { getSewingSessionList, createReport, SewingSession, type MediationReportItem } from "../../api/sewingApi";
import { getStoredCurrentUser } from "../../api/userApi";

const ITEMS_PER_PAGE = 5;

const REPORT_SECTIONS = [
  { key: "emotionSummary",       label: "나의 생각과 감정 정리", accent: "#1A1A2E", bg: "#F4F3F8" },
  { key: "partnerUnderstanding", label: "파트너 이해",           accent: "#6F8197", bg: "#F0F3F6" },
  { key: "mediationPlans",       label: "중재안",                accent: "#5A9F7C", bg: "#EFF8F3" },
  { key: "recommendedDialogues", label: "추천 대화법",           accent: "#C88579", bg: "#FBF3F1" },
] as const;

function displayName(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return fallback;
  return trimmed;
}

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
  const myEmail = getStoredCurrentUser().email;
  const [filterStatus, setFilterStatus] = useState("all");
  const [records, setRecords] = useState<ReturnType<typeof sessionToRecord>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 보고서 모달
  const [modalReport, setModalReport] = useState<MediationReportItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

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

  const handleViewReport = async (sessionId: number) => {
    setModalLoading(true);
    setModalError("");
    setModalReport(null);
    try {
      const data = await createReport(sessionId);
      if (data.length > 0) {
        const mine = data.find((item) => item.user?.email === myEmail) ?? data[0];
        setModalReport(mine);
      } else {
        setModalError("아직 생성된 보고서가 없어요.");
      }
    } catch {
      setModalError("보고서를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalReport(null);
    setModalError("");
  };

  const filtered = records.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [filterStatus]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const moveToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isModalOpen = modalLoading || !!modalReport || !!modalError;

  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-semibold text-[#1A1A2E] mb-2">우리의 갈등 기록</h1>
          <p className="text-[#6F7787] mb-6">두 사람이 함께 걸어온 갈등 회복의 여정이에요.</p>

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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <span className="text-[#6F7787] font-medium">{record.date}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCompleted ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#EBE9F2] text-[#6F8197]"}`}>
                        {isCompleted ? "완료됨 ✓" : "진행중"}
                      </span>
                      <span className="px-3 py-1 bg-[#EFEDE7] text-[#1A1A2E] rounded-full text-sm">
                        갈등 중재
                      </span>
                    </div>
                    <p className="text-[#6F7787]">{record.preview}</p>
                  </div>

                  {/* 보고서 버튼 — 우측 정렬 */}
                  <button
                    onClick={() => handleViewReport(record.sessionId)}
                    className="shrink-0 px-4 py-2 border-2 border-[#1A1A2E] text-[#1A1A2E] rounded-full text-sm font-medium hover:bg-[#1A1A2E] hover:text-white transition-all"
                  >
                    {isCompleted ? "최종 보고서" : "보고서 보기"}
                  </button>
                </div>
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
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E2DC] transition-all ${safeCurrentPage === 1 ? "text-[#C9B8A8] cursor-not-allowed" : "text-[#6F7787] hover:bg-[#EFEDE7]"}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => moveToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-all ${safeCurrentPage === page ? "bg-[#1A1A2E] text-white" : "border border-[#E5E2DC] text-[#6F7787] hover:bg-[#EFEDE7]"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => moveToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E2DC] transition-all ${safeCurrentPage === totalPages ? "text-[#C9B8A8] cursor-not-allowed" : "text-[#6F7787] hover:bg-[#EFEDE7]"}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 보고서 모달 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[640px] max-h-[80vh] bg-white rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DC] flex-shrink-0">
              <h2 className="text-lg font-semibold text-[#1A1A2E]">중재 보고서</h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#EFEDE7] transition-all text-[#6F7787]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 바디 */}
            <div className="overflow-y-auto px-6 py-6">
              {modalLoading ? (
                <div className="flex flex-col items-center gap-4 py-12 text-[#6F7787]">
                  <div className="w-8 h-8 rounded-full border-2 border-[#1A1A2E] border-t-transparent animate-spin" />
                  <p className="text-sm">보고서를 불러오는 중입니다...</p>
                </div>
              ) : modalError ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[#6F7787]">{modalError}</p>
                </div>
              ) : modalReport ? (
                <div className="space-y-4">
                  {REPORT_SECTIONS.map(({ key, label, accent, bg }) => (
                    <div
                      key={key}
                      className="rounded-xl overflow-hidden border border-[#E5E2DC]"
                      style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
                    >
                      <div className="px-5 py-3" style={{ backgroundColor: bg }}>
                        <p className="text-xs font-semibold" style={{ color: accent }}>{label}</p>
                      </div>
                      <div className="px-5 py-4 bg-white">
                        <p className="text-sm leading-7 text-[#3A3A4E] whitespace-pre-wrap">
                          {modalReport[key as keyof MediationReportItem] as string}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </MyPageLayout>
  );
}
