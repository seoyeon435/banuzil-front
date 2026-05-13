import { Link, useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const conflictTypes = ["연락문제", "가치관차이", "약속파기", "데이트비용", "기타"];

const MOCK_PARTNER_INPUT =
  "사실 여행을 가고 싶었던 건 도피가 아니라 재충전이 필요했던 거였어요. 시험 준비하면서 나도 많이 지쳐있었는데, 잠깐 숨을 돌리고 싶었어요. 당신을 응원하는 마음은 진심인데 전달이 잘 안 된 것 같아 미안해요.";

type InputPhase = "writing" | "waiting_partner" | "partner_loaded";

export default function MediationInputPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [submittedInput, setSubmittedInput] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [phase, setPhase] = useState<InputPhase>("writing");

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (input.trim().length === 0) return;
    setSubmittedInput(input.trim());
    setPhase("waiting_partner");
  };

  const handleLoadPartner = () => {
    setPhase("partner_loaded");
  };

  const handleStartAnalysis = () => {
    navigate("/mediation/analyzing");
  };

  // ── 상대방 대기 / 로드 완료 화면 ──────────────────────────────
  if (phase !== "writing") {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#FFF8F4] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-[760px]">
          {/* 진행 단계 */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs text-[#7A5C4D]">
            <span className="text-[#5A9F7C] font-semibold">✓ 나의 입장 저장됨</span>
            <span className="mx-2 text-[#F0DFD0]">→</span>
            <span className={phase === "partner_loaded" ? "text-[#5A9F7C] font-semibold" : "text-[#FF6347] font-semibold"}>
              {phase === "partner_loaded" ? "✓ 상대방 입장 준비됨" : "⏳ 상대방 입장 대기 중"}
            </span>
            <span className="mx-2 text-[#F0DFD0]">→</span>
            <span className="text-[#7A5C4D]">AI 분석</span>
          </div>

          {/* 연결 표시 */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-xl">💑</span>
            <span className="text-sm font-medium text-[#1F1410]">남자친구와 연결된 우리 공간</span>
          </div>

          {/* 두 입장 카드 */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            {/* 내 입장 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-t-4 border-[#FF6347]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="font-semibold text-[#1F1410] text-sm">여자친구의 입장</span>
                <span className="ml-auto px-2 py-0.5 bg-[#E0F4E8] text-[#5A9F7C] text-xs rounded-full">저장 완료</span>
              </div>
              <p className="text-[#7A5C4D] text-sm leading-relaxed line-clamp-6">{submittedInput}</p>
            </div>

            {/* 상대방 입장 */}
            <div className={`bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-t-4 transition-all duration-500 ${
              phase === "partner_loaded" ? "border-[#D4956A]" : "border-[#F0DFD0]"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                {phase === "partner_loaded" ? (
                  <div className="w-7 h-7 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-[#D4956A] flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4956A] animate-pulse" />
                  </div>
                )}
                <span className="font-semibold text-[#1F1410] text-sm">남자친구의 입장</span>
                <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                  phase === "partner_loaded"
                    ? "bg-[#E0F4E8] text-[#5A9F7C]"
                    : "bg-[#FFE9DD] text-[#D4956A]"
                }`}>
                  {phase === "partner_loaded" ? "저장 완료" : "대기 중..."}
                </span>
              </div>

              {phase === "partner_loaded" ? (
                <p className="text-[#7A5C4D] text-sm leading-relaxed line-clamp-6">{MOCK_PARTNER_INPUT}</p>
              ) : (
                <div className="space-y-2">
                  <div className="h-3 bg-[#F0DFD0] rounded animate-pulse w-full" />
                  <div className="h-3 bg-[#F0DFD0] rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-[#F0DFD0] rounded animate-pulse w-4/6" />
                  <p className="text-xs text-[#7A5C4D] mt-3">남자친구가 입장을 입력하고 있어요.</p>
                </div>
              )}
            </div>
          </div>

          {/* 안내 문구 */}
          {phase === "waiting_partner" ? (
            <p className="text-center text-[#7A5C4D] text-sm mb-6">
              남자친구의 입장이 입력되면 AI가 두 사람을 중립적으로 분석해드려요.
            </p>
          ) : (
            <div className="text-center mb-6">
              <p className="text-[#1F1410] font-semibold mb-1">두 사람의 입장이 모두 준비되었어요!</p>
              <p className="text-sm text-[#7A5C4D]">AI가 중립적으로 분석을 시작합니다.</p>
            </div>
          )}

          {/* 버튼 영역 */}
          {phase === "waiting_partner" ? (
            <div className="bg-[#FFE9DD] border border-[#FFD19A] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1F1410] mb-3">
                시연용 — 실제 서비스에서는 남자친구가 직접 입력합니다
              </p>
              <button
                onClick={handleLoadPartner}
                className="w-full py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium"
              >
                상대방 입장 불러오기
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartAnalysis}
              className="w-full py-4 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-semibold text-lg shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
            >
              AI 중재 시작하기 →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── 입력 화면 ──────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-72px)] bg-white flex">
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
