import { Link, useLocation } from "react-router";
import { useState } from "react";
import axios from "axios";
import { Home, CheckCircle } from "lucide-react";
import MediationProgressHeader from "./MediationProgressHeader";
import { useDisplayNames } from "../utils/useDisplayNames";
import { createReport, isRealSewingSessionId, type ReportContent, type ReportResponse } from "../../api/sewingApi";

export default function MediationCompletePage() {
  const location = useLocation();
  const { currentName, currentInitial, partnerName, partnerInitial } = useDisplayNames();
  const isEarlyExit = (location.state as { earlyExit?: boolean })?.earlyExit ?? false;
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  const handleCreateReport = async () => {
    const sessionId = sessionStorage.getItem("sewingSessionId");
    if (!isRealSewingSessionId(sessionId)) {
      setReportError("중재 방 정보를 찾을 수 없어 보고서를 생성하지 못했어요.");
      return;
    }

    setIsReportLoading(true);
    setReportError("");

    const numericSessionId = Number(sessionId);
    const url = `/api/sewings/${numericSessionId}/report`;
    const body = {
      session_id: numericSessionId,
      sessionId: numericSessionId,
    };

    try {
      const response = await createReport(numericSessionId);
      setReport(response);
    } catch (error) {
      console.error("[Report] create report failed", {
        url,
        body,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        data: axios.isAxiosError(error) ? error.response?.data : undefined,
      });
      setReportError("보고서를 생성하지 못했어요. 잠시 뒤 다시 시도해주세요.");
    } finally {
      setIsReportLoading(false);
    }
  };

  return (
    <>
      <MediationProgressHeader currentStep="complete" />
      <div className="min-h-screen bg-[#FAFAF7] py-12 px-6">
      <div className="max-w-[820px] mx-auto">
        {/* Early Exit Banner */}
        {isEarlyExit && (
          <div className="bg-[#FFF3CD] border border-[#6F8197] rounded-xl px-6 py-4 mb-8 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">📝</span>
            <p className="text-sm text-[#6F7787] leading-relaxed">
              현재까지의 상담 내용을 바탕으로 정리한 결과입니다. 나머지 라운드를 완료하면 더 자세한 분석을 받을 수 있어요.
            </p>
          </div>
        )}

        {/* Success */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#5A9F7C] mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-[36px] font-semibold text-[#1A1A2E] mb-3">
            중재가 완료되었어요 🧵
          </h1>
          <p className="text-lg text-[#6F7787]">
            두 사람의 이야기를 잘 들었어요
          </p>
        </div>

        {/* Final Report Card */}
        <div className="bg-white rounded-2xl p-10 shadow-[0_12px_48px_rgba(35,40,56,0.12)] mb-8">
          {/* Header */}
          <div className="border-b border-[#E5E2DC] pb-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">최종 중재 보고서</h2>
              {report && <span className="text-sm text-[#6F7787]">방 번호: {report.session_id}</span>}
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-[#E5E2DC] bg-[#FAFAF7] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-[#1A1A2E]">AI 최종 보고서 생성</p>
                <p className="mt-1 text-sm text-[#6F7787]">전체 상담 히스토리를 바탕으로 두 사람 각각의 보고서를 생성합니다.</p>
              </div>
              <button
                onClick={handleCreateReport}
                disabled={isReportLoading}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  isReportLoading
                    ? "cursor-not-allowed bg-[#E5E2DC] text-[#6F7787]"
                    : "bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
                }`}
              >
                {isReportLoading ? "보고서를 생성하고 있습니다..." : "보고서 생성하기"}
              </button>
            </div>
            {reportError && <p className="mt-3 text-sm text-[#DC3545]">{reportError}</p>}
          </div>

          {report ? (
            <div className="mb-8 space-y-5">
              <ReportCard
                title={`${currentName}님을 위한 보고서`}
                initial={currentInitial}
                accentClassName="border-[#1A1A2E]"
                report={report.f_report}
              />
              <ReportCard
                title={`${partnerName}님을 위한 보고서`}
                initial={partnerInitial}
                accentClassName="border-[#6F8197]"
                report={report.m_report}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D4D0E8] bg-white p-8 text-center">
              <p className="text-base font-semibold text-[#1A1A2E]">아직 생성된 보고서가 없습니다.</p>
              <p className="mt-2 text-sm text-[#6F7787]">
                보고서 생성하기 버튼을 누르면 AI가 전체 상담 내용을 바탕으로 최종 보고서를 작성합니다.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <Link
            to="/"
            className="py-4 border-2 border-[#E5E2DC] text-[#1A1A2E] rounded-full hover:bg-[#EFEDE7] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

function ReportCard({
  title,
  initial,
  accentClassName,
  report,
}: {
  title: string;
  initial: string;
  accentClassName: string;
  report: ReportContent;
}) {
  const sections = [
    { label: "나의 생각과 감정 정리", value: report.emotion_summary },
    { label: "파트너 이해", value: report.partner_understanding },
    { label: "중재안", value: report.mediation_plans },
    { label: "추천 대화법", value: report.recommended_dialogues },
  ];

  return (
    <section className={`rounded-xl border-l-4 bg-[#FAFAF7] p-5 ${accentClassName}`}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8C8C0] text-sm font-bold text-[#1A1A2E] ring-2 ring-[#1A1A2E]">
          {initial}
        </div>
        <h3 className="text-base font-semibold text-[#1A1A2E]">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <div key={section.label} className="rounded-xl border border-[#E5E2DC] bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-[#1A1A2E]">{section.label}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#6F7787]">{section.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
