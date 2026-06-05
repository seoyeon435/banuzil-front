import { Link, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Home, CheckCircle } from "lucide-react";
import MediationProgressHeader from "./MediationProgressHeader";
import { useDisplayNames } from "../utils/useDisplayNames";
import BrandMark from "./ui/BrandMark";
import { createReport, triggerGenerateReport, isRealSewingSessionId, submitFeedback, type MediationReportItem } from "../../api/sewingApi";
import { getStoredCurrentUser } from "../../api/userApi";

const SECTIONS = [
  { key: "emotionSummary",       label: "나의 생각과 감정 정리", accent: "#1A1A2E",  bg: "#F4F3F8" },
  { key: "partnerUnderstanding", label: "파트너 이해",           accent: "#6F8197",  bg: "#F0F3F6" },
  { key: "mediationPlans",       label: "중재안",                accent: "#5A9F7C",  bg: "#EFF8F3" },
  { key: "recommendedDialogues", label: "추천 대화법",           accent: "#C88579",  bg: "#FBF3F1" },
] as const;

export default function MediationCompletePage() {
  const location = useLocation();
  const { currentName, currentInitial } = useDisplayNames();
  const myEmail = getStoredCurrentUser().email;
  const isEarlyExit = (location.state as { earlyExit?: boolean })?.earlyExit ?? false;
  const [report, setReport] = useState<MediationReportItem[] | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportError, setReportError] = useState("");
  const pollIntervalRef = useRef<number | null>(null);

  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    if (!isRealSewingSessionId(sessionId)) return;

    // 페이지 진입 시 기존 보고서 자동 조회
    void (async () => {
      try {
        const existing = await createReport(Number(sessionId));
        if (existing.length > 0) {
          setReport(existing);
          setReportGenerated(true);
        }
      } catch {
        // 기존 보고서 없으면 무시 — 사용자가 직접 생성
      }
    })();

    return () => {
      if (pollIntervalRef.current !== null) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleCreateReport = async () => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    if (!isRealSewingSessionId(sessionId)) {
      setReportError("중재 방 정보를 찾을 수 없어 보고서를 생성하지 못했어요.");
      return;
    }

    setIsReportLoading(true);
    setReportGenerated(true);
    setReportError("");

    const numericSessionId = Number(sessionId);

    const stopPolling = () => {
      if (pollIntervalRef.current !== null) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    try {
      await triggerGenerateReport(numericSessionId);
    } catch (error) {
      console.warn("[Report] generate-report trigger failed", {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      });
    }

    let resolved = false;

    const fetchReport = async () => {
      try {
        const response = await createReport(numericSessionId);
        if (response.length > 0) {
          resolved = true;
          setReport(response);
          setIsReportLoading(false);
          stopPolling();
        }
      } catch (error) {
        resolved = true;
        console.error("[Report] create report failed", {
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
          data: axios.isAxiosError(error) ? error.response?.data : undefined,
        });
        setReportError("보고서를 생성하지 못했어요. 잠시 뒤 다시 시도해주세요.");
        setReportGenerated(false);
        setIsReportLoading(false);
        stopPolling();
      }
    };

    await fetchReport();

    if (!resolved) {
      pollIntervalRef.current = window.setInterval(fetchReport, 3000);
    }
  };

  const handleSubmitFeedback = async () => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    if (!isRealSewingSessionId(sessionId)) {
      setFeedbackError("세션 정보를 찾을 수 없어요.");
      return;
    }
    setFeedbackSubmitting(true);
    setFeedbackError("");
    try {
      await submitFeedback(Number(sessionId), feedbackRating, feedbackComment);
      setFeedbackSubmitted(true);
    } catch {
      setFeedbackError("피드백 제출에 실패했어요. 잠시 뒤 다시 시도해주세요.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const myReport = report
    ? (report.find((item) => item.user?.email === myEmail) ?? report[0])
    : null;

  const isButtonDisabled = isReportLoading || reportGenerated;

  return (
    <>
      <MediationProgressHeader currentStep="complete" />
      <div className="min-h-screen bg-[#FAFAF7] py-12 px-4 sm:px-6">
        <div className="max-w-[760px] mx-auto">

          {isEarlyExit && (
            <div className="bg-[#FFF3CD] border border-[#6F8197] rounded-xl px-6 py-4 mb-8 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">📝</span>
              <p className="text-sm text-[#6F7787] leading-relaxed">
                현재까지의 상담 내용을 바탕으로 정리한 결과입니다. 나머지 라운드를 완료하면 더 자세한 분석을 받을 수 있어요.
              </p>
            </div>
          )}

          {/* 완료 헤더 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5A9F7C] mb-5">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-[#1A1A2E] mb-2">중재가 완료되었어요</h1>
            <p className="text-[#6F7787]">두 사람의 이야기를 잘 들었어요</p>
          </div>

          {/* 보고서 영역 */}
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(35,40,56,0.10)] mb-8 overflow-hidden">
            {/* 보고서 헤더 */}
            <div className="px-8 pt-8 pb-6 border-b border-[#E5E2DC]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h2 className="text-xl font-semibold text-[#1A1A2E]">최종 중재 보고서</h2>
                <span className="text-xs text-[#6F7787]">방 번호: {sessionStorage.getItem("sewingSessionId")}</span>
              </div>
            </div>

            {/* 생성 버튼 영역 */}
            <div className="px-8 py-5 border-b border-[#E5E2DC] bg-[#FAFAF7] flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1A1A2E]">AI 최종 보고서 생성</p>
                <p className="text-xs text-[#6F7787] mt-0.5">전체 상담 히스토리를 바탕으로 나만의 보고서를 생성합니다.</p>
              </div>
              <button
                onClick={handleCreateReport}
                disabled={isButtonDisabled}
                className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  isButtonDisabled
                    ? "cursor-not-allowed bg-[#E5E2DC] text-[#6F7787]"
                    : "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                }`}
              >
                {isReportLoading ? "작성 중..." : reportGenerated ? "생성 완료" : "보고서 생성하기"}
              </button>
              {reportError && <p className="text-xs text-[#DC3545] sm:col-span-2">{reportError}</p>}
            </div>

            {/* 보고서 콘텐츠 */}
            <div className="px-8 py-8">
              {myReport ? (
                <ReportCard title={`${currentName}님을 위한 보고서`} initial={currentInitial} report={myReport} />
              ) : isReportLoading ? (
                <div className="flex flex-col items-center gap-5 py-12">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-16 h-16 rounded-full bg-[#E8C8C0]/30 animate-ping" />
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(35,40,56,0.10)] flex items-center justify-center">
                      <BrandMark size={22} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#1A1A2E]">보고서를 작성하고 있어요</p>
                    <p className="text-xs text-[#6F7787] mt-1">AI가 상담 내용을 분석하고 있습니다</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 0.18, 0.36].map((delay, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#C88579] animate-bounce" style={{ animationDelay: `${delay}s` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm font-semibold text-[#1A1A2E]">아직 생성된 보고서가 없습니다.</p>
                  <p className="mt-1.5 text-xs text-[#6F7787]">위 버튼을 눌러 AI 보고서를 생성해보세요.</p>
                </div>
              )}
            </div>
          </div>

          {/* 피드백 영역 */}
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(35,40,56,0.10)] mb-8 overflow-hidden">
            <div className="px-8 pt-7 pb-5 border-b border-[#E5E2DC]">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">서비스 피드백</h2>
              <p className="text-sm text-[#6F7787] mt-1">banuzil 이용 경험을 알려주세요.</p>
            </div>
            <div className="px-8 py-8">
              {feedbackSubmitted ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <CheckCircle className="w-10 h-10 text-[#5A9F7C]" />
                  <p className="font-semibold text-[#1A1A2E]">피드백이 제출되었습니다</p>
                  <p className="text-sm text-[#6F7787]">소중한 의견 감사합니다.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1A1A2E] mb-3">만족도</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className={`text-4xl transition-transform hover:scale-110 leading-none ${
                            star <= feedbackRating ? "text-[#C88579]" : "text-[#E5E2DC]"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-[#1A1A2E] mb-2">의견 <span className="font-normal text-[#6F7787]">(선택)</span></p>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="서비스 이용 중 느낀 점을 자유롭게 작성해주세요."
                      rows={4}
                      className="w-full px-4 py-3 bg-[#FAFAF7] border border-[#E5E2DC] rounded-xl text-sm text-[#1A1A2E] placeholder:text-[#6F7787] focus:outline-none focus:border-[#1A1A2E] resize-none"
                    />
                  </div>
                  {feedbackError && <p className="text-xs text-[#DC3545] mb-3">{feedbackError}</p>}
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={feedbackSubmitting || feedbackRating === 0}
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                      feedbackSubmitting || feedbackRating === 0
                        ? "bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed"
                        : "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                    }`}
                  >
                    {feedbackSubmitting ? "제출 중..." : "피드백 제출하기"}
                  </button>
                </>
              )}
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 py-3.5 border-2 border-[#E5E2DC] text-[#1A1A2E] rounded-full hover:bg-[#EFEDE7] transition-all text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </>
  );
}

function ReportCard({
  title,
  initial,
  report,
}: {
  title: string;
  initial: string;
  report: MediationReportItem;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8C8C0] text-sm font-bold text-[#1A1A2E] ring-2 ring-[#1A1A2E]">
          {initial}
        </div>
        <h3 className="text-base font-semibold text-[#1A1A2E]">{title}</h3>
      </div>

      <div className="space-y-4">
        {SECTIONS.map(({ key, label, accent, bg }) => (
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
                {report[key as keyof MediationReportItem] as string}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
