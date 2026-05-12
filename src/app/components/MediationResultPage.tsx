import { Link, useNavigate } from "react-router";
import { AlertTriangle, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ── 라운드 정의 ──────────────────────────────────────────
const rounds = [
  {
    label: "사건 정리",
    emoji: "📋",
    questions: ["이 갈등에서 가장 중요하다고 느낀 사건은 무엇인가요?"],
    aiAnalysis: (answer: string) =>
      `"${answer.slice(0, 30)}${answer.length > 30 ? "..." : ""}" — 이번 갈등은 표면적으로는 연락 문제처럼 보이지만, 실제로는 서로의 기대가 어긋난 상황으로 보여요. 두 분 모두 관계에 진심이기에 생긴 갈등이에요.`,
  },
  {
    label: "감정 확인",
    emoji: "💛",
    questions: [
      "그 순간 가장 크게 느낀 감정은 무엇이었나요?",
      "상대에게 가장 바랐던 반응은 무엇인가요?",
    ],
    aiAnalysis: (answer: string) =>
      `"${answer.slice(0, 30)}${answer.length > 30 ? "..." : ""}" — 답변을 보면 핵심 감정은 단순한 화가 아니라, 서운함과 불안에 가까워 보여요. 상대방에게 인정받고 싶은 욕구가 채워지지 않았을 때 나오는 반응이에요.`,
  },
  {
    label: "관계 패턴 분석",
    emoji: "🔄",
    questions: [
      "이런 갈등이 이전에도 반복된 적이 있나요?",
      "갈등 상황에서 나는 다가가는 편인가요, 피하는 편인가요?",
    ],
    aiAnalysis: (answer: string) =>
      `"${answer.slice(0, 30)}${answer.length > 30 ? "..." : ""}" — 두 사람 사이에는 한쪽은 확인받고 싶어 다가가고, 다른 한쪽은 부담을 느껴 물러나는 패턴이 생길 수 있어요. 이건 두 분의 애착유형 차이에서 비롯된 자연스러운 반응이에요.`,
  },
  {
    label: "대화 문장 만들기",
    emoji: "✍️",
    questions: ["상대에게 안전하게 전달하고 싶은 말을 적어주세요."],
    aiAnalysis: (answer: string) =>
      `"${answer.slice(0, 30)}${answer.length > 30 ? "..." : ""}" — 이 표현을 비난이 아니라 감정 중심 문장으로 바꿔볼게요.\n\n💬 "${answer.includes("화") || answer.includes("답장") ? "답이 없을 때 내가 혼자 남겨진 것 같아서 불안했어." : "네 입장을 더 알고 싶었는데 전달이 잘 안 됐던 것 같아. 미안해."}"`,
  },
];

type MessageItem =
  | { role: "ai-question"; roundIdx: number; text: string }
  | { role: "user"; roundIdx: number; text: string }
  | { role: "ai-analysis"; roundIdx: number; text: string };

export default function MediationResultPage() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([
    { role: "ai-question", roundIdx: 0, text: rounds[0].questions.join("\n") },
  ]);
  const [isComplete, setIsComplete] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 한 라운드 이상 완료했는지 (중간 종료 버튼 표시 조건)
  const canEarlyExit = currentRound >= 1 && !isComplete;

  const handleEarlyExit = () => {
    navigate("/mediation/complete", { state: { earlyExit: true } });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim().length === 0) return;

    const userMsg: MessageItem = { role: "user", roundIdx: currentRound, text: input.trim() };
    const aiMsg: MessageItem = {
      role: "ai-analysis",
      roundIdx: currentRound,
      text: rounds[currentRound].aiAnalysis(input.trim()),
    };

    const nextRound = currentRound + 1;
    const newMessages: MessageItem[] = [...messages, userMsg, aiMsg];

    if (nextRound < rounds.length) {
      newMessages.push({
        role: "ai-question",
        roundIdx: nextRound,
        text: rounds[nextRound].questions.join("\n"),
      });
      setCurrentRound(nextRound);
    } else {
      setIsComplete(true);
    }

    setMessages(newMessages);
    setInput("");
  };

  const temperature = 62;

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex">
      {/* ── 좌측: 상태 패널 ──────────────────────── */}
      <div className="w-[280px] bg-[#FFE0CC] p-6 flex flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold text-[#1F1410] mb-5">중재 진행 상황</h2>

        {/* Round Progress */}
        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="text-sm font-semibold text-[#FF6347] mb-3">
            {isComplete ? "모든 라운드 완료 ✓" : `${currentRound + 1}라운드 진행중`}
          </div>
          <div className="space-y-2">
            {rounds.map((r, i) => {
              const isDone = i < currentRound || (isComplete && i === currentRound);
              const isCurrent = i === currentRound && !isComplete;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? "bg-[#5A9F7C]" : isCurrent ? "bg-[#FF6347]" : "bg-[#F0DFD0]"}`} />
                  <span className={`text-xs ${isDone ? "text-[#5A9F7C] line-through" : isCurrent ? "text-[#1F1410] font-semibold" : "text-[#7A5C4D]"}`}>
                    {r.emoji} {r.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="flex items-center gap-2 mb-2">
            <span>🌡️</span>
            <span className="text-sm font-semibold text-[#1F1410]">갈등 온도</span>
          </div>
          <div className="text-2xl font-bold text-[#D4956A] mb-2">{temperature}°</div>
          <div className="h-2 bg-gradient-to-r from-[#5A9F7C] via-[#D4956A] to-[#DC3545] rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1F1410] rounded-full"
              style={{ left: `${temperature}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#7A5C4D] mt-1">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>

        {/* Gottman Warning */}
        <div className="bg-[#FFE0E0] border border-[#DC3545] rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#DC3545] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#DC3545] mb-1">Gottman 위험신호</p>
              <p className="text-xs text-[#7A5C4D]">비난 감지 (A측)</p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl p-4 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="space-y-3">
            {[
              { initial: "여", name: "나 (여자친구)", type: "안정형" },
              { initial: "남", name: "남자친구", type: "불안형" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] font-bold text-sm flex-shrink-0">
                  {p.initial}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1F1410]">{p.name}</p>
                  <span className="text-xs text-[#FF6347]">{p.type} 애착</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />
        <button className="w-full py-3 border-2 border-[#DC3545] text-[#DC3545] rounded-full hover:bg-[#FFE0E0] transition-all text-sm">
          중재 종료하기
        </button>
      </div>

      {/* ── 중앙: 대화 타임라인 ───────────────────── */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[680px] mx-auto space-y-5">
          {/* Header */}
          <div className="bg-[#FF6347]/5 border-l-4 border-[#FF6347] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#1F1410]">바느질 AI</span>
            </div>
            <p className="text-[#1F1410]">
              두 분의 이야기를 들었어요. EFT 상담 흐름에 따라 단계별로 함께 정리해 드릴게요.
            </p>
          </div>

          {/* Partner view (blurred) */}
          <div className="bg-white rounded-xl p-5 relative overflow-hidden shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
            <div className="text-sm font-semibold text-[#7A5C4D] mb-2">[남자친구 입장 — AI 정리본]</div>
            <div className="blur-sm select-none text-[#7A5C4D] text-sm">
              남자친구는 사실 여행을 가고 싶었던 게 도피가 아니라 재충전이 필요했던 거였어요...
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <div className="flex items-center gap-2 text-[#7A5C4D]">
                <span className="text-xl">🔒</span>
                <span className="text-sm font-medium">남자친구에게만 표시됩니다</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg, i) => {
            if (msg.role === "ai-question") {
              return (
                <div key={i} className="bg-[#FF6347]/5 border-l-4 border-[#FF6347] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🧵</span>
                    <span className="font-semibold text-[#1F1410]">
                      {rounds[msg.roundIdx].emoji} {msg.roundIdx + 1}라운드 — {rounds[msg.roundIdx].label}
                    </span>
                  </div>
                  {msg.text.split("\n").map((q, qi) => (
                    <p key={qi} className="text-[#1F1410] mb-1">
                      {msg.text.split("\n").length > 1 ? `Q${qi + 1}. ` : ""}{q}
                    </p>
                  ))}
                </div>
              );
            }
            if (msg.role === "user") {
              return (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] bg-white border-2 border-[#FF6347]/20 rounded-xl px-5 py-4 shadow-[0_2px_8px_rgba(255,99,71,0.1)]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#FFB89A] flex items-center justify-center text-xs font-bold text-[#1F1410]">
                        박
                      </div>
                      <span className="text-xs text-[#7A5C4D]">나의 답변</span>
                    </div>
                    <p className="text-[#1F1410] text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            }
            if (msg.role === "ai-analysis") {
              return (
                <div key={i} className="bg-[#FFE9DD] border-l-4 border-[#D4956A] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💡</span>
                    <span className="font-semibold text-[#1F1410] text-sm">AI 재분석</span>
                  </div>
                  <p className="text-[#1F1410] text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              );
            }
            return null;
          })}

          {/* Input */}
          {!isComplete && (
            <div className="bg-white rounded-xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-[#1F1410]">
                  {rounds[currentRound].emoji} {currentRound + 1}라운드 답변 입력
                </span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="여기에 솔직하게 적어주세요..."
                className="w-full h-[100px] p-4 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-xl focus:outline-none focus:border-[#FF6347] resize-none text-[#1F1410] text-sm"
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={input.trim().length === 0}
                  className={`flex-1 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                    input.trim().length > 0
                      ? "bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
                      : "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  답변 제출하기
                </button>
              </div>

              {/* 중간 종료 버튼 — 1라운드 이상 완료 시 표시 */}
              {canEarlyExit && (
                <button
                  onClick={handleEarlyExit}
                  className="w-full mt-3 py-2.5 border-2 border-[#D4956A] text-[#D4956A] rounded-full hover:bg-[#FFE9DD] transition-all text-sm font-medium"
                >
                  여기까지 정리하고 결과 보기
                </button>
              )}
            </div>
          )}

          {/* Complete CTA */}
          {isComplete && (
            <div className="bg-[#E0F4E8] border-2 border-[#5A9F7C] rounded-xl p-6 text-center">
              <p className="text-xl mb-2">🎉</p>
              <p className="font-semibold text-[#1F1410] mb-1">모든 라운드가 완료되었어요!</p>
              <p className="text-sm text-[#7A5C4D] mb-5">최종 중재 결과를 확인해보세요.</p>
              <Link
                to="/mediation/complete"
                className="inline-block px-10 py-3 bg-[#5A9F7C] text-white rounded-full hover:bg-[#4d8f6d] transition-all font-medium"
              >
                최종 중재 결과 보기 →
              </Link>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── 우측: AI 인사이트 패널 ────────────────── */}
      <div className="w-[260px] bg-white p-6 border-l border-[#F0DFD0] overflow-y-auto flex-shrink-0">
        <h2 className="text-base font-semibold text-[#1F1410] mb-5">AI 인사이트</h2>

        <div className="bg-[#FFE9DD] rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-[#1F1410] mb-2">💡 공통점 발견</p>
          <p className="text-sm text-[#7A5C4D]">결국 둘 다 원하는 건 같아요 — 서로에게 인정받고 싶은 마음</p>
        </div>

        <div className="bg-[#FF6347]/5 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-[#1F1410] mb-2">🔄 반복 패턴</p>
          <p className="text-sm text-[#7A5C4D]">
            한쪽은 다가가고 다른 한쪽은 물러나는 추격-회피 패턴이 보여요.
          </p>
        </div>

        <div className="bg-[#E0F4E8] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#1F1410] mb-2">🤝 합의안 제안</p>
          <div className="space-y-2">
            <p className="text-xs text-[#1F1410] bg-white rounded-lg p-2 border border-[#5A9F7C]/30">
              시험 끝나고 짧은 여행 가기
            </p>
            <p className="text-xs text-[#1F1410] bg-white rounded-lg p-2 border border-[#5A9F7C]/30">
              힘들 때 바로 말하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
