import { Link } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const conflictTypes = ["연락문제", "가치관차이", "약속파기", "데이트비용", "기타"];

export default function MediationInputPage() {
  const [input, setInput] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel */}
      <div className="w-[420px] bg-[#FFE9DD] p-8 flex flex-col">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6347] to-[#E84028] flex items-center justify-center text-white font-bold">
            박
          </div>
          <div>
            <p className="text-[#1F1410] font-medium">나 (박서연)</p>
            <span className="text-xs text-[#7A5C4D]">ENFP</span>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)] mb-6">
          <h3 className="text-lg font-semibold text-[#1F1410] mb-3 flex items-center gap-2">
            솔직하게 써주세요 <span className="text-xl">🔒</span>
          </h3>
          <div className="space-y-2 text-sm text-[#7A5C4D]">
            <p>상대방은 이 내용을 그대로 볼 수 없어요</p>
            <p>AI가 중립적으로 전달해드려요</p>
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
              <p>• 느낀 감정</p>
              <p>• 원하는 것</p>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Progress Reminder */}
        <div className="text-center text-xs text-[#7A5C4D]">
          <p>Step 2 of 4</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-12 flex flex-col">
        <div className="max-w-[700px] mx-auto w-full flex-1 flex flex-col">
          {/* Heading */}
          <h1 className="text-[32px] font-semibold text-[#1F1410] mb-8">
            지현에게 어떤 일이 있었나요?
          </h1>

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
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedTypes.includes(type)
                      ? 'bg-[#FF6347] text-white'
                      : 'bg-[#FFE0CC] text-[#7A5C4D] hover:bg-[#F0DFD0]'
                    }
                  `}
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
            <Link
              to="/mediation/waiting"
              className={`
                flex-1 py-3 text-center rounded-full font-medium transition-all
                ${input.trim().length > 0
                  ? 'bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]'
                  : 'bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed'
                }
              `}
              onClick={(e) => input.trim().length === 0 && e.preventDefault()}
            >
              AI에게 전달하기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
