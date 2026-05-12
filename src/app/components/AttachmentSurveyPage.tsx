import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const anxietyQuestions = [
  { id: "AN02", text: "때로 다른 사람들은 분명한 이유 없이 나에 대한 그들의 감정을 바꾸곤 한다.", reverse: false },
  { id: "AN06", text: "다른 사람들은 내가 화나 있을 때만 나에게 주목하는 것 같다.", reverse: false },
  { id: "AN08", text: "버림받을까봐 걱정하는 일은 별로 없다.", reverse: true },
  { id: "AN10", text: "내가 다른 사람들에게 관심을 갖는 것만큼, 그들도 내게 관심을 가져주지 않을까봐 걱정한다.", reverse: false },
  { id: "AN12", text: "다른 사람들의 기대에 못 미칠까봐 걱정된다.", reverse: false },
  { id: "AN13", text: "다른 사람들이 내가 얻고자 하는 애정과 지지를 보내 주지 않을 때는 화가 난다.", reverse: false },
  { id: "AN14", text: "내가 다른 사람들에게 호감을 표현했을 때, 그들이 나에 대해 같은 감정이 아닐까봐 걱정된다.", reverse: false },
  { id: "AN15", text: "다른 사람들이 나를 진심으로 사랑하지 않을까봐 자주 걱정한다.", reverse: false },
  { id: "AN17", text: "다른 사람들은 내가 내 자신에 대해서 회의를 하게 만든다.", reverse: false },
  { id: "AN20", text: "내가 다른 사람들에게 갖는 호감만큼 그들도 내게 강한 호감을 가지기를 자주 원한다.", reverse: false },
  { id: "AN21", text: "다른 사람들과의 대인관계에 대해 걱정이 많다.", reverse: false },
  { id: "AN22", text: "매우 가까워지고 싶은 나의 욕구 때문에 사람들이 내게서 멀어지기도 한다.", reverse: false },
  { id: "AN23", text: "다른 사람들이 나를 떠날까봐 걱정하는 일은 거의 없다.", reverse: true },
  { id: "AN24", text: "다른 사람들은 내가 바라는 만큼 나와 가까워지려고 하지 않는다.", reverse: false },
  { id: "AN25", text: "다른 사람들이 잠시 떠나 있으면 그들이 나 아닌 누군가에게 관심을 갖게 될까봐 걱정한다.", reverse: false },
  { id: "AN26", text: "다른 사람들의 사랑을 잃을까봐 두렵다.", reverse: false },
  { id: "AN31", text: "다른 사람들이 나와 함께 있기를 원하지 않을까봐 자주 걱정한다.", reverse: false },
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

  const questionsPerPage = 6;
  const totalPages = Math.ceil(anxietyQuestions.length / questionsPerPage);
  const currentQuestions = anxietyQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // TODO: 실제 배포 시 모든 문항 선택 검증 로직 복구 필요
  const isPageComplete = () => true;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate("/login");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / anxietyQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex">
      {/* Left Panel */}
      <div className="w-[420px] bg-gradient-to-br from-[#FF6347] to-[#E84028] p-8 flex flex-col text-white">
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
            <span className="text-sm font-semibold">{answeredCount} / {anxietyQuestions.length}</span>
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
              <h1 className="text-[32px] font-semibold text-[#1F1410]">
                불안 척도 검사
              </h1>
              <span className="text-sm text-[#7A5C4D]">
                {currentPage + 1} / {totalPages} 페이지
              </span>
            </div>
            <p className="text-[#7A5C4D] leading-relaxed">
              각 문항을 읽고 평소 대인관계에서 자신이 느끼는 정도를 솔직하게 선택해주세요.
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-8 mb-12">
            {currentQuestions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)]"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#FF6347]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-[#FF6347]">
                      {currentPage * questionsPerPage + index + 1}
                    </span>
                  </div>
                  <p className="text-[#1F1410] leading-relaxed flex-1">
                    {question.text}
                    {question.reverse && <span className="text-[#7A5C4D] text-sm ml-2">(역문항)</span>}
                  </p>
                </div>

                {/* Scale — 가로 배치, 모바일 반응형 */}
                <div>
                  <div className="flex justify-between text-xs text-[#7A5C4D] mb-2 px-1">
                    <span>{scaleLabels[0]}</span>
                    <span>{scaleLabels[6]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-between">
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(question.id, value)}
                        className={`
                          flex flex-col items-center gap-1 w-12 py-3 rounded-xl border-2 transition-all flex-shrink-0
                          ${answers[question.id] === value
                            ? 'border-[#FF6347] bg-[#FF6347]/10'
                            : 'border-[#F0DFD0] hover:border-[#FF6347]/50 hover:bg-[#FFF8F4]'
                          }
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${answers[question.id] === value
                            ? 'border-[#FF6347] bg-[#FF6347]'
                            : 'border-[#F0DFD0]'
                          }
                        `}>
                          {answers[question.id] === value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${answers[question.id] === value ? 'text-[#FF6347]' : 'text-[#7A5C4D]'}`}>
                          {value}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentPage > 0 ? (
              <button
                onClick={handlePrevious}
                className="px-8 py-3 border-2 border-[#F0DFD0] text-[#7A5C4D] rounded-full hover:bg-[#FFE0CC] transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                이전
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-3 border-2 border-[#F0DFD0] text-[#7A5C4D] rounded-full hover:bg-[#FFE0CC] transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                기본정보로
              </Link>
            )}
            <button
              onClick={handleNext}
              disabled={!isPageComplete()}
              className={`
                flex-1 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2
                ${isPageComplete()
                  ? 'bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]'
                  : 'bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed'
                }
              `}
            >
              {currentPage < totalPages - 1 ? '다음' : '검사 완료'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-[#7A5C4D] mt-6">
            답변하지 않은 문항이 있어도 다음으로 넘어갈 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
