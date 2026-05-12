import { Link, useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const conflictTypes = ["연락문제", "가치관차이", "약속파기", "데이트비용", "기타"];

export default function MediationInputPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (input.trim().length === 0) return;
    // 내 입장 저장 후 바로 상대방 입장 대기 화면으로 이동
    navigate("/mediation/waiting", { state: { myInput: input } });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* 왼쪽 패널 */}
      <div className="w-[380px] bg-[#FFE9DD] p-8 flex flex-col flex-shrink-0">
        {/* 연결 정보 */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] font-bold text-lg">
            여
          </div>
          <div>
            <p className="text-[#1F1410] font-medium">나 (여자친구)</p>
            <span className="text-xs text-[#7A5C4D]">안정형 애착</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-8 ml-2">
          <div className="w-[2px] h-4 bg-[#FF6347]/30" />
          <span className="text-xs text-[#7A5C4D]">상대방: 남자친구</span>
        </div>

        {/* 안내 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)] mb-6">
          <h3 className="text-base font-semibold text-[#1F1410] mb-3 flex items-center gap-2">
            솔직하게 써주세요 <span className="text-xl">🔒</span>
          </h3>
          <div className="space-y-2 text-sm text-[#7A5C4D]">
            <p>상대방은 이 내용을 그대로 볼 수 없어요</p>
            <p>AI가 중립적으로 정리해서 전달해드려요</p>
            <p>상대방의 입장은 따로 입력됩니다</p>
          </div>
        </div>

        {/* 팁 아코디언 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full p-5 flex items-center justify-between text-left"
          >
            <span className="font-semibold text-[#1F1410] text-sm">이런 내용을 포함하면 좋아요</span>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-[#7A5C4D]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#7A5C4D]" />
            )}
          </button>
          {showTips && (
            <div className="px-5 pb-5 space-y-2 text-sm text-[#7A5C4D]">
              <p>• 구체적인 상황 설명</p>
              <p>• 그때 느낀 감정</p>
              <p>• 내가 원했던 것</p>
              <p>• 반복되는 패턴이 있다면</p>
            </div>
          )}
        </div>

        <div className="flex-1" />
        <p className="text-center text-xs text-[#7A5C4D]">2단계 / 5단계</p>
      </div>

      {/* 오른쪽 패널 */}
      <div className="flex-1 p-10 flex flex-col">
        <div className="max-w-[680px] mx-auto w-full flex-1 flex flex-col">
          <h1 className="text-[30px] font-semibold text-[#1F1410] mb-3">
            오늘 우리 사이에 어떤 일이 있었나요?
          </h1>
          <p className="text-[#7A5C4D] mb-8 leading-relaxed">
            내 입장을 먼저 차분히 적어주세요.<br />
            남자친구의 입장은 따로 입력되어 AI가 함께 분석합니다.
          </p>

          {/* 입력창 */}
          <div className="flex-1 flex flex-col mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="상대방이 어떤 행동을 했는지,&#10;그때 어떤 감정이 들었는지,&#10;무엇을 원하는지 자유롭게 써주세요."
              className="flex-1 min-h-[260px] p-6 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-2xl focus:outline-none focus:border-[#FF6347] transition-all resize-none text-[#1F1410] leading-relaxed"
              maxLength={1000}
            />
            <div className="text-right text-sm text-[#7A5C4D] mt-2">
              {input.length}/1000
            </div>
          </div>

          {/* 갈등 유형 */}
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

          {/* 버튼 */}
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
