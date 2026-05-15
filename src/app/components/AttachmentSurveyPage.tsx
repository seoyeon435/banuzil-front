import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import {
  AttachmentResult,
  getAttachmentLabel,
  getAttachmentSurveyErrorMessage,
  submitAttachmentSurvey,
} from "../../api/attachmentApi";

// ECR-R 전체 36문항 — AN(불안) 18 + AV(회피) 18, 원본 번호 순(1~36)으로 정렬.
// reverse=true 인 항목은 역문항(*) — 채점 시 8 - score 로 뒤집어 계산됨.
const attachmentQuestions = [
  { id: "AV01", text: "다른 사람들과 지나치게 가까워지는 것을 원치 않는 편이다.", reverse: false },
  { id: "AN02", text: "때로 다른 사람들은 분명한 이유 없이 나에 대한 그들의 감정을 바꾸곤 한다.", reverse: false },
  { id: "AV03", text: "다른 사람들과 가까워지는 것은 비교적 쉽다.", reverse: true },
  { id: "AV04", text: "다른 사람들이 내게 가까워지려고 하면 불편하다.", reverse: false },
  { id: "AV05", text: "다른 사람들에게 모든 것을 다 이야기한다.", reverse: true },
  { id: "AN06", text: "다른 사람들은 내가 화나 있을 때만 나에게 주목하는 것 같다.", reverse: false },
  { id: "AV07", text: "다른 사람들은 나와 내 욕구를 잘 이해한다.", reverse: true },
  { id: "AN08", text: "버림받을까봐 걱정하는 일은 별로 없다.", reverse: true },
  { id: "AV09", text: "다른 사람들과 여러 가지에 대해 의논한다.", reverse: true },
  { id: "AN10", text: "내가 다른 사람들에게 관심을 갖는 것만큼, 그들도 내게 관심을 가져주지 않을까봐 걱정한다.", reverse: false },
  { id: "AV11", text: "다른 사람들에게 내 마음 속 깊은 감정을 드러내는 것을 원치 않는 편이다.", reverse: false },
  { id: "AN12", text: "다른 사람들의 기대에 못 미칠까봐 걱정된다.", reverse: false },
  { id: "AN13", text: "다른 사람들이 내가 얻고자 하는 애정과 지지를 보내 주지 않을 때는 화가 난다.", reverse: false },
  { id: "AN14", text: "내가 다른 사람들에게 호감을 표현했을 때, 그들이 나에 대해 같은 감정이 아닐까봐 걱정된다.", reverse: false },
  { id: "AN15", text: "다른 사람들이 나를 진심으로 사랑하지 않을까봐 자주 걱정한다.", reverse: false },
  { id: "AV16", text: "다른 사람들에게 속내를 털어놓는 것이 편하지 않다.", reverse: false },
  { id: "AN17", text: "다른 사람들은 내가 내 자신에 대해서 회의를 하게 만든다.", reverse: false },
  { id: "AV18", text: "필요할 때 다른 사람들에게 의지하는 것은 도움이 된다.", reverse: true },
  { id: "AV19", text: "다른 사람들을 의지하는 것이 어렵다.", reverse: false },
  { id: "AN20", text: "내가 다른 사람들에게 갖는 호감만큼 그들도 내게 강한 호감을 가지기를 자주 원한다.", reverse: false },
  { id: "AN21", text: "다른 사람들과의 대인관계에 대해 걱정이 많다.", reverse: false },
  { id: "AN22", text: "매우 가까워지고 싶은 나의 욕구 때문에 사람들이 내게서 멀어지기도 한다.", reverse: false },
  { id: "AN23", text: "다른 사람들이 나를 떠날까봐 걱정하는 일은 거의 없다.", reverse: true },
  { id: "AN24", text: "다른 사람들은 내가 바라는 만큼 나와 가까워지려고 하지 않는다.", reverse: false },
  { id: "AN25", text: "다른 사람들이 잠시 떠나 있으면 그들이 나 아닌 누군가에게 관심을 갖게 될까봐 걱정한다.", reverse: false },
  { id: "AN26", text: "다른 사람들의 사랑을 잃을까봐 두렵다.", reverse: false },
  { id: "AV27", text: "다른 사람들과 가깝게 지내는 것이 매우 편하다.", reverse: true },
  { id: "AV28", text: "다른 사람들에게 다정하게 대하는 것은 쉬운 일이다.", reverse: true },
  { id: "AV29", text: "다른 사람들에게 의지하는 것이 편하게 느껴진다.", reverse: true },
  { id: "AV30", text: "다른 사람들에게 의지하는 것은 쉬운 일이다.", reverse: true },
  { id: "AN31", text: "다른 사람들이 나와 함께 있기를 원하지 않을까봐 자주 걱정한다.", reverse: false },
  { id: "AV32", text: "다른 사람들과 가까워지는 것은 어렵지 않다.", reverse: true },
  { id: "AV33", text: "내 문제나 걱정거리를 보통 다른 사람들과 의논한다.", reverse: true },
  { id: "AV34", text: "사적인 생각과 감정을 다른 사람들과 나누는 것에 대해 편안하게 느낀다.", reverse: true },
  { id: "AV35", text: "다른 사람들이 내게 너무 가까워지려고 하면 불안하다.", reverse: false },
  { id: "AN36", text: "일단 다른 사람들이 나에 대해 알게 되면, 그들이 있는 그대로의 내 모습을 좋아하지 않을까봐 두렵다.", reverse: false },
];

const scaleLabels = [
  "전혀 그렇지 않다",
  "그렇지 않다",
  "약간 그렇지 않다",
  "보통이다",
  "약간 그렇다",
  "그렇다",
  "아주 그렇다"
];

export default function AttachmentSurveyPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<AttachmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const questionsPerPage = 6;
  const totalPages = Math.ceil(attachmentQuestions.length / questionsPerPage);
  const currentQuestions = attachmentQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // TODO: 실제 배포 시 모든 문항 선택 검증 로직 복구 필요
  const isPageComplete = () => true;

  // 응답 배열 — 질문 순서(원본 번호 1~36)대로 점수 추출. 미응답은 기본값 4(보통).
  const buildAnswersArray = (): number[] =>
    attachmentQuestions.map((q) => answers[q.id] ?? 4);

  const handleNext = async () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // 마지막 페이지: 서버에 제출
    setErrorMessage("");
    setSubmitting(true);
    try {
      const data = await submitAttachmentSurvey(buildAnswersArray());
      setResult(data);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(getAttachmentSurveyErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / attachmentQuestions.length) * 100;

  if (showSuccess) {
    const typeLabel = result ? getAttachmentLabel(result.type) : "분석 중";
    const typeDescription = result?.typeDescription;
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-12 shadow-[0_12px_48px_rgba(35,40,56,0.12)] max-w-[480px] w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5A9F7C] mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1A1A2E] mb-3">애착 검사 완료!</h1>
          <p className="text-[#6F7787] mb-2 leading-relaxed">
            애착 유형 검사가 끝났어요.
          </p>
          <p className="text-[#6F7787] mb-8 leading-relaxed">
            이제 바느질을 시작해보세요 🧵
          </p>
          <div className="bg-[#E0F4E8] rounded-xl p-4 mb-8">
            <p className="text-sm text-[#5A9F7C] font-medium">
              내 애착 유형: <span className="font-bold">{typeLabel}</span>
            </p>
            {typeDescription && (
              <p className="text-xs text-[#6F7787] mt-1">{typeDescription}</p>
            )}
            {result && (
              <p className="text-xs text-[#6F7787] mt-2">
                불안 {result.anxietyScore.toFixed(1)} · 회피 {result.avoidanceScore.toFixed(1)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate("/mypage/profile")}
            className="block w-full h-[52px] text-center rounded-full font-medium bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)] transition-all"
          >
            마이페이지로 가기 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      {/* Left Panel */}
      <div className="w-[420px] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1F] p-8 flex flex-col text-white">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">🧵</span>
            <span className="text-2xl font-bold">바느질</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">애착 유형 검사</h2>
        <p className="text-white/90 mb-8 leading-relaxed">
          관계에서의 나의 성향을 파악하여<br />
          더 나은 갈등 해결을 도와드려요
        </p>

        {/* Progress */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">진행률</span>
            <span className="text-sm font-semibold">{answeredCount} / {attachmentQuestions.length}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Attachment Types Info */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="font-semibold mb-4">4가지 애착 유형</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">💚</span>
              <div>
                <p className="font-medium">안정형</p>
                <p className="text-white/80 text-xs">관계에서 편안함을 느껴요</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">💛</span>
              <div>
                <p className="font-medium">불안형</p>
                <p className="text-white/80 text-xs">친밀함을 갈망해요</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">💙</span>
              <div>
                <p className="font-medium">거부회피형</p>
                <p className="text-white/80 text-xs">독립성을 중요하게 여겨요</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">💜</span>
              <div>
                <p className="font-medium">공포회피형</p>
                <p className="text-white/80 text-xs">친밀함과 거리 사이에서 갈등해요</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <p className="text-sm text-white/70">
          검사는 약 3-5분 정도 소요됩니다
        </p>
      </div>

      {/* Right Panel - Questions */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-[32px] font-semibold text-[#1A1A2E]">
                애착 유형 검사
              </h1>
              <span className="text-sm text-[#6F7787]">
                {currentPage + 1} / {totalPages} 페이지
              </span>
            </div>
            <p className="text-[#6F7787] leading-relaxed">
              각 문항을 읽고 평소 대인관계에서 자신이 느끼는 정도를 솔직하게 선택해주세요.
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-8 mb-12">
            {currentQuestions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(35,40,56,0.102)]"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-[#1A1A2E]">
                      {currentPage * questionsPerPage + index + 1}
                    </span>
                  </div>
                  <p className="text-[#1A1A2E] leading-relaxed flex-1">
                    {question.text}
                    {question.reverse && <span className="text-[#6F7787] text-sm ml-2">(역문항)</span>}
                  </p>
                </div>

                {/* Scale — 가로 배치, 모바일 반응형 */}
                <div>
                  <div className="flex justify-between text-xs text-[#6F7787] mb-2 px-1">
                    <span>{scaleLabels[0]}</span>
                    <span>{scaleLabels[6]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-between">
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(question.id, value)}
                        className={`
                          flex flex-col items-center gap-1 w-12 py-3 rounded-xl transition-all flex-shrink-0
                          ${answers[question.id] === value
                            ? 'bg-[#1A1A2E]/10'
                            : 'hover:bg-[#FAFAF7]'
                          }
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${answers[question.id] === value
                            ? 'border-[#1A1A2E] bg-[#1A1A2E]'
                            : 'border-[#E5E2DC]'
                          }
                        `}>
                          {answers[question.id] === value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="mb-4 text-sm text-[#DC3545] bg-[#FFE0E0] rounded-lg px-4 py-3 text-center">
              {errorMessage}
            </p>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            {currentPage > 0 ? (
              <button
                onClick={handlePrevious}
                disabled={submitting}
                className="px-8 py-3 border-2 border-[#E5E2DC] text-[#6F7787] rounded-full hover:bg-[#EFEDE7] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
                이전
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-3 border-2 border-[#E5E2DC] text-[#6F7787] rounded-full hover:bg-[#EFEDE7] transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                기본정보로
              </Link>
            )}
            <button
              onClick={handleNext}
              disabled={!isPageComplete() || submitting}
              className={`
                flex-1 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2
                ${isPageComplete() && !submitting
                  ? 'bg-[#1A1A2E] text-white hover:bg-[#0F0F1F] shadow-[0_4px_16px_rgba(35,40,56,0.15)]'
                  : 'bg-[#E5E2DC] text-[#6F7787] cursor-not-allowed'
                }
              `}
            >
              {submitting
                ? '제출 중...'
                : currentPage < totalPages - 1
                  ? '다음'
                  : '검사 완료'}
              {!submitting && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-[#6F7787] mt-6">
            답변하지 않은 문항이 있어도 다음으로 넘어갈 수 있어요 (미응답은 보통 4로 제출)
          </p>
        </div>
      </div>
    </div>
  );
}
