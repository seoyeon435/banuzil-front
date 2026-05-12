import { Link, useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const conflictTypes = ["연락문제", "가치관차이", "약속파기", "데이트비용", "기타"];

export default function MediationInputPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (input.trim().length === 0) return;
    setIsSubmitted(true);
  };

  // ── 제출 완료 상태 ──────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center py-12">
        <div className="w-full max-w-[560px] px-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#5A9F7C] flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#1F1410] mb-3">
              내 입장이 저장되었습니다
            </h2>
            <p className="text-[#7A5C4D] leading-relaxed mb-8">
              상대방의 입장을 기다리고 있어요.<br />
              두 사람의 입장이 모두 입력되면 AI가 분석을 시작합니다.
            </p>

            {/* Status Steps */}
            <div className="text-left space-y-4 mb-8 bg-[#FFF8F4] rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-[#1F1410] font-medium">나의 입장 입력 완료</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#D4956A] flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#D4956A] animate-pulse" />
                </div>
                <span className="text-[#1F1410] font-medium">상대방 입장 대기 중...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#F0DFD0] flex-shrink-0" />
                <span className="text-[#7A5C4D]">AI 분석 시작</span>
              </div>
            </div>

            {/* Mock Partner Submit */}
            <div className="bg-[#FFE9DD] border border-[#FFD19A] rounded-xl p-5 mb-6 text-left">
              <p className="text-sm font-semibold text-[#1F1410] mb-3">시연용</p>
              <button
                onClick={() => navigate("/mediation/waiting")}
                className="w-full py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium"
              >
                상대방 답변 불러오기 →
              </button>
              <p className="text-xs text-[#7A5C4D] mt-2 text-center">
                실제 서비스에서는 상대방이 직접 입력합니다
              </p>
            </div>
          </div>

          <Link
            to="/mediation/start"
            className="block text-center text-sm text-[#7A5C4D] hover:text-[#FF6347] underline"
          >
            ← 처음으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // ── 입력 상태 ────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel */}
      <div className="w-[420px] bg-[#FFE9DD] p-8 flex flex-col">
        {/* User + Partner Info */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] font-bold">
            박
          </div>
          <div>
            <p className="text-[#1F1410] font-medium">나 (박서연)</p>
            <span className="text-xs text-[#7A5C4D]">안정형 애착</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-8">
          <div className="ml-2 w-[2px] h-4 bg-[#FF6347]/30" />
          <span className="text-xs text-[#7A5C4D]">상대방: 지현</span>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)] mb-6">
          <h3 className="text-lg font-semibold text-[#1F1410] mb-3 flex items-center gap-2">
            솔직하게 써주세요 <span className="text-xl">🔒</span>
          </h3>
          <div className="space-y-2 text-sm text-[#7A5C4D]">
            <p>상대방은 이 내용을 그대로 볼 수 없어요</p>
            <p>AI가 중립적으로 정리해서 전달해드려요</p>
            <p>상대방의 입장은 따로 입력됩니다</p>
          </div>
        </div>

        {/* Tips Accordion */}
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <span className="font-semibold text-[#1F1410]">이런 내용을 포함하면 좋아요</span>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-[#7A5C4D]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#7A5C4D]" />
            )}
          </button>
          {showTips && (
            <div className="px-6 pb-6 space-y-2 text-sm text-[#7A5C4D]">
              <p>• 구체적인 상황 설명</p>
              <p>• 그때 느낀 감정</p>
              <p>• 내가 원했던 것</p>
              <p>• 반복되는 패턴이 있다면</p>
            </div>
          )}
        </div>

        <div className="flex-1" />
        <div className="text-center text-xs text-[#7A5C4D]">
          <p>Step 2 of 5</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-12 flex flex-col">
        <div className="max-w-[700px] mx-auto w-full flex-1 flex flex-col">
          <h1 className="text-[32px] font-semibold text-[#1F1410] mb-3">
            오늘 우리 사이에 어떤 일이 있었나요?
          </h1>
          <p className="text-[#7A5C4D] mb-8">
            내 입장을 먼저 차분히 적어주세요.<br />
            상대방의 입장은 따로 입력되어 AI가 함께 분석합니다.
          </p>

          {/* Textarea */}
          <div className="flex-1 flex flex-col mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="상대방이 어떤 행동을 했는지,&#10;그때 어떤 감정이 들었는지,&#10;무엇을 원하는지 자유롭게 써주세요."
              className="flex-1 min-h-[280px] p-6 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-2xl focus:outline-none focus:border-[#FF6347] transition-all resize-none text-[#1F1410] leading-relaxed"
              maxLength={1000}
            />
            <div className="text-right text-sm text-[#7A5C4D] mt-2">
              {input.length}/1000
            </div>
          </div>

          {/* Optional Tags */}
          <div className="mb-8">
            <p className="text-sm text-[#7A5C4D] mb-3">갈등 유형 (선택사항):</p>
            <div className="flex flex-wrap gap-2">
              {conflictTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTypes.includes(type)
                      ? "bg-[#FF6347] text-white"
                      : "bg-[#FFE0CC] text-[#7A5C4D] hover:bg-[#F0DFD0]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to="/mediation/start"
              className="px-8 py-3 border-2 border-[#F0DFD0] text-[#7A5C4D] rounded-full hover:bg-[#FFE0CC] transition-all"
            >
              ← 뒤로
            </Link>
            <button
              onClick={handleSubmit}
              disabled={input.trim().length === 0}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${
                input.trim().length > 0
                  ? "bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
                  : "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
              }`}
            >
              내 입장 저장하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
