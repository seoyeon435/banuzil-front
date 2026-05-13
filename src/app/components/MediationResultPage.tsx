import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

type RoundPhase = "input" | "waiting_partner" | "both_submitted";

interface CompletedRound {
  roundIdx: number;
  myAnswer: string;
  partnerAnswer: string;
}

const ROUNDS = [
  {
    label: "사건 정리",
    emoji: "📋",
    aiQuestion: "이번 갈등에서 가장 중요하다고 느낀 장면은 무엇인가요?",
    mockPartnerAnswer: "여행이 싫었던 게 아니라 시험 준비로 지쳐서 쉬고 싶었어.",
    mockAnalysis:
      "여자친구는 기대가 무너진 서운함을 느꼈고, 남자친구는 자신의 피로가 거절로 받아들여진 것에 미안함을 느끼고 있어요.",
    nextLabel: "다음 라운드로 이어가기",
  },
  {
    label: "감정 확인",
    emoji: "💛",
    aiQuestion: "그 순간 가장 크게 느낀 감정은 무엇이었나요?",
    mockPartnerAnswer: "내가 힘든 상황을 이해받지 못하는 것 같아서 답답했어.",
    mockAnalysis:
      "여자친구의 핵심 감정은 서운함과 불안, 남자친구의 핵심 감정은 부담감과 답답함에 가까워 보여요.",
    nextLabel: "더 이야기하기",
  },
  {
    label: "관계 패턴 분석",
    emoji: "🔄",
    aiQuestion: "이런 갈등이 이전에도 반복된 적이 있나요?",
    mockPartnerAnswer: "나는 압박을 느끼면 잠깐 피하고 싶어지는 편이야.",
    mockAnalysis:
      "두 사람 사이에는 한쪽은 확인받고 싶어 다가가고, 다른 한쪽은 부담을 느껴 물러나는 패턴이 반복될 수 있어요.",
    nextLabel: "대화 문장 만들기",
  },
  {
    label: "대화 문장 만들기",
    emoji: "✍️",
    aiQuestion: "상대에게 안전하게 전달하고 싶은 말을 적어주세요.",
    mockPartnerAnswer: "내가 쉬고 싶었던 마음을 먼저 설명하지 못해서 미안해.",
    mockAnalysis:
      "두 사람 모두 상대를 탓하기보다 자신의 감정과 필요를 설명하는 방식으로 대화를 이어갈 수 있어요.",
    nextLabel: null,
  },
];

export default function MediationResultPage() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [roundPhase, setRoundPhase] = useState<RoundPhase>("input");
  const [myInput, setMyInput] = useState("");
  const [savedMyInput, setSavedMyInput] = useState("");
  const [completedRounds, setCompletedRounds] = useState<CompletedRound[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const temperature = Math.max(38, 75 - completedRounds.length * 10);
  const isLastRound = currentRound === ROUNDS.length - 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roundPhase, completedRounds.length, currentRound]);

  const handleSubmitMyAnswer = () => {
    if (myInput.trim().length === 0) return;
    setSavedMyInput(myInput.trim());
    setMyInput("");
    setRoundPhase("waiting_partner");
  };

  const handleLoadPartner = () => {
    setRoundPhase("both_submitted");
  };

  const handleNextRound = () => {
    setCompletedRounds((prev) => [
      ...prev,
      {
        roundIdx: currentRound,
        myAnswer: savedMyInput,
        partnerAnswer: ROUNDS[currentRound].mockPartnerAnswer,
      },
    ]);
    setCurrentRound((r) => r + 1);
    setRoundPhase("input");
    setSavedMyInput("");
  };

  const handleComplete = () => {
    navigate("/mediation/complete");
  };

  const handleEarlyExit = () => {
    navigate("/mediation/complete", { state: { earlyExit: true } });
  };

  return (
    <div className="h-[calc(100vh-72px)] bg-[#FFF8F4] flex">
      {/* ── 좌측: 상태 패널 ──────────────────────── */}
      <div className="w-[280px] bg-[#FFE0CC] p-6 flex flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold text-[#1F1410] mb-5">중재 진행 상황</h2>

        {/* Round Progress */}
        <div className="bg-white rounded-xl p-4 mb-5 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="text-sm font-semibold text-[#FF6347] mb-3">
            {currentRound + 1}라운드 / 4라운드
          </div>
          <div className="space-y-2">
            {ROUNDS.map((r, i) => {
              const isDone = i < currentRound;
              const isCurrent = i === currentRound;
              const phaseLabel =
                isCurrent && roundPhase === "input"
                  ? " · 입력 중"
                  : isCurrent && roundPhase === "waiting_partner"
                  ? " · 상대방 대기"
                  : isCurrent && roundPhase === "both_submitted"
                  ? " · 분석 완료"
                  : "";
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDone
                        ? "bg-[#5A9F7C]"
                        : isCurrent
                        ? "bg-[#FF6347]"
                        : "bg-[#F0DFD0]"
                    }`}
                  />
                  <span
                    className={`text-xs leading-tight ${
                      isDone
                        ? "text-[#5A9F7C] line-through"
                        : isCurrent
                        ? "text-[#1F1410] font-semibold"
                        : "text-[#7A5C4D]"
                    }`}
                  >
                    {r.emoji} {r.label}
                    {isCurrent && (
                      <span className="text-[#FF6347]">{phaseLabel}</span>
                    )}
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
        <button
          onClick={handleEarlyExit}
          className="w-full py-3 border-2 border-[#DC3545] text-[#DC3545] rounded-full hover:bg-[#FFE0E0] transition-all text-sm"
        >
          중재 종료하기
        </button>
      </div>

      {/* ── 중앙: 라운드 타임라인 ───────────────────── */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[700px] mx-auto space-y-6">

          {/* 도입 배너 */}
          <div className="bg-[#FF6347]/5 border-l-4 border-[#FF6347] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#1F1410]">바느질 AI</span>
            </div>
            <p className="text-[#1F1410] text-sm leading-relaxed">
              두 분이 연결되었어요. EFT 상담 흐름에 따라 4라운드로 나눠 함께 이야기 나눠볼게요.
              각 라운드마다 두 분의 답변을 받아 AI가 중립적으로 분석해드립니다.
            </p>
          </div>

          {/* ── 완료된 라운드 카드들 ── */}
          {completedRounds.map((cr) => {
            const round = ROUNDS[cr.roundIdx];
            return (
              <div
                key={cr.roundIdx}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(255,99,71,0.1)] overflow-hidden border border-[#5A9F7C]/30"
              >
                {/* 라운드 헤더 */}
                <div className="bg-[#E0F4E8] px-6 py-3 flex items-center gap-3">
                  <span className="text-xl">{round.emoji}</span>
                  <span className="font-semibold text-[#1F1410] text-sm">
                    {cr.roundIdx + 1}라운드 — {round.label}
                  </span>
                  <span className="ml-auto text-[#5A9F7C] text-xs font-semibold">✓ 완료</span>
                </div>

                <div className="p-6 space-y-4">
                  {/* AI 질문 */}
                  <p className="text-sm text-[#7A5C4D]">
                    <span className="font-medium text-[#1F1410]">AI 질문: </span>
                    {round.aiQuestion}
                  </p>

                  {/* 두 사람의 답변 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FFF8F4] rounded-xl p-4 border border-[#FF6347]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFB89A] ring-1 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-xs font-bold flex-shrink-0">
                          여
                        </div>
                        <span className="text-xs font-medium text-[#1F1410]">여자친구의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#7A5C4D] leading-relaxed">{cr.myAnswer}</p>
                    </div>
                    <div className="bg-[#FFF8F4] rounded-xl p-4 border border-[#D4956A]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFB89A] ring-1 ring-[#D4956A] flex items-center justify-center text-[#1F1410] text-xs font-bold flex-shrink-0">
                          남
                        </div>
                        <span className="text-xs font-medium text-[#1F1410]">남자친구의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#7A5C4D] leading-relaxed">{cr.partnerAnswer}</p>
                    </div>
                  </div>

                  {/* AI 분석 */}
                  <div className="bg-[#FFE9DD] border-l-4 border-[#D4956A] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">💡</span>
                      <span className="font-semibold text-[#1F1410] text-xs">AI 분석</span>
                    </div>
                    <p className="text-xs text-[#1F1410] leading-relaxed">{round.mockAnalysis}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── 현재 진행 중인 라운드 ── */}
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(255,99,71,0.17)] overflow-hidden">
            {/* 라운드 헤더 */}
            <div className="bg-[#FF6347]/10 px-6 py-4 flex items-center gap-3 border-b border-[#FF6347]/20">
              <span className="text-2xl">{ROUNDS[currentRound].emoji}</span>
              <div>
                <p className="font-semibold text-[#1F1410]">
                  {currentRound + 1}라운드 — {ROUNDS[currentRound].label}
                </p>
                <p className="text-xs text-[#FF6347]">
                  {roundPhase === "input" && "여자친구 답변 입력 중"}
                  {roundPhase === "waiting_partner" && "남자친구 답변 대기 중"}
                  {roundPhase === "both_submitted" && "두 사람의 답변 완료 · AI 분석 완료"}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* AI 질문 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6347]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🧵</span>
                </div>
                <div className="flex-1 bg-[#FF6347]/5 rounded-xl p-4">
                  <p className="text-xs text-[#7A5C4D] mb-1">AI 질문</p>
                  <p className="text-sm font-medium text-[#1F1410]">
                    {ROUNDS[currentRound].aiQuestion}
                  </p>
                </div>
              </div>

              {/* ── 입력 단계 ── */}
              {roundPhase === "input" && (
                <div>
                  <p className="text-xs text-[#7A5C4D] mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFB89A] ring-1 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-xs font-bold inline-flex flex-shrink-0">여</span>
                    여자친구의 답변을 입력해주세요
                  </p>
                  <textarea
                    value={myInput}
                    onChange={(e) => setMyInput(e.target.value)}
                    placeholder="솔직하게 느낀 점을 적어주세요..."
                    className="w-full h-[100px] p-4 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-xl focus:outline-none focus:border-[#FF6347] resize-none text-[#1F1410] text-sm"
                  />
                  <button
                    onClick={handleSubmitMyAnswer}
                    disabled={myInput.trim().length === 0}
                    className={`w-full mt-3 py-3 rounded-full font-medium transition-all text-sm ${
                      myInput.trim().length > 0
                        ? "bg-[#FF6347] text-white hover:bg-[#E84028] shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
                        : "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
                    }`}
                  >
                    답변 제출하기
                  </button>
                  {completedRounds.length >= 1 && (
                    <button
                      onClick={handleEarlyExit}
                      className="w-full mt-3 py-2.5 border-2 border-[#D4956A] text-[#D4956A] rounded-full hover:bg-[#FFE9DD] transition-all text-sm font-medium"
                    >
                      여기까지 정리하고 결과 보기
                    </button>
                  )}
                </div>
              )}

              {/* ── 상대방 대기 단계 ── */}
              {roundPhase === "waiting_partner" && (
                <div className="space-y-4">
                  {/* 내 답변 카드 */}
                  <div className="bg-[#FFF8F4] border border-[#FF6347]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#FFB89A] ring-1 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-xs font-bold flex-shrink-0">
                        여
                      </div>
                      <span className="text-sm font-medium text-[#1F1410]">여자친구의 답변</span>
                      <span className="ml-auto px-2 py-0.5 bg-[#E0F4E8] text-[#5A9F7C] text-xs rounded-full">
                        ✓ 저장 완료
                      </span>
                    </div>
                    <p className="text-sm text-[#7A5C4D] leading-relaxed">{savedMyInput}</p>
                  </div>

                  {/* 상대방 대기 카드 */}
                  <div className="bg-[#FFF8F4] border border-[#D4956A]/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full border-2 border-[#D4956A] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#D4956A] animate-pulse" />
                      </div>
                      <span className="text-sm font-medium text-[#1F1410]">남자친구의 답변</span>
                      <span className="ml-auto px-2 py-0.5 bg-[#FFE9DD] text-[#D4956A] text-xs rounded-full">
                        대기 중...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-[#F0DFD0] rounded animate-pulse w-full" />
                      <div className="h-2.5 bg-[#F0DFD0] rounded animate-pulse w-5/6" />
                      <div className="h-2.5 bg-[#F0DFD0] rounded animate-pulse w-3/4" />
                    </div>
                    <p className="text-xs text-[#7A5C4D] mt-3">남자친구가 답변을 작성하고 있어요.</p>
                  </div>

                  {/* 시연용 버튼 */}
                  <div className="bg-[#FFE9DD] border border-[#FFD19A] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#1F1410] mb-2">
                      시연용 — 실제 서비스에서는 남자친구가 직접 입력합니다
                    </p>
                    <button
                      onClick={handleLoadPartner}
                      className="w-full py-3 bg-[#D4956A] text-white rounded-full hover:bg-[#C47D52] transition-all font-medium text-sm"
                    >
                      남자친구 답변 불러오기
                    </button>
                  </div>
                </div>
              )}

              {/* ── 두 답변 모두 제출 / AI 분석 단계 ── */}
              {roundPhase === "both_submitted" && (
                <div className="space-y-4">
                  {/* 두 사람 답변 카드 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FFF8F4] border border-[#FF6347]/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFB89A] ring-1 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-xs font-bold flex-shrink-0">
                          여
                        </div>
                        <span className="text-xs font-medium text-[#1F1410]">여자친구의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#7A5C4D] leading-relaxed">{savedMyInput}</p>
                    </div>
                    <div className="bg-[#FFF8F4] border border-[#D4956A]/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFB89A] ring-1 ring-[#D4956A] flex items-center justify-center text-[#1F1410] text-xs font-bold flex-shrink-0">
                          남
                        </div>
                        <span className="text-xs font-medium text-[#1F1410]">남자친구의 답변</span>
                        <span className="ml-auto text-xs text-[#5A9F7C]">✓</span>
                      </div>
                      <p className="text-xs text-[#7A5C4D] leading-relaxed">
                        {ROUNDS[currentRound].mockPartnerAnswer}
                      </p>
                    </div>
                  </div>

                  {/* AI 분석 카드 */}
                  <div className="bg-[#FFE9DD] border-l-4 border-[#D4956A] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💡</span>
                      <span className="font-semibold text-[#1F1410] text-sm">AI 분석</span>
                      <span className="text-xs text-[#7A5C4D] ml-1">두 사람의 답변을 함께 분석했어요</span>
                    </div>
                    <p className="text-sm text-[#1F1410] leading-relaxed">
                      {ROUNDS[currentRound].mockAnalysis}
                    </p>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col gap-3">
                    {!isLastRound ? (
                      <>
                        <button
                          onClick={handleNextRound}
                          className="w-full py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium text-sm shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
                        >
                          {ROUNDS[currentRound].nextLabel} →
                        </button>
                        <button
                          onClick={handleEarlyExit}
                          className="w-full py-2.5 border-2 border-[#D4956A] text-[#D4956A] rounded-full hover:bg-[#FFE9DD] transition-all text-sm font-medium"
                        >
                          여기까지 정리하고 결과 보기
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleComplete}
                        className="w-full py-3 bg-[#5A9F7C] text-white rounded-full hover:bg-[#4d8f6d] transition-all font-medium shadow-[0_4px_16px_rgba(90,159,124,0.3)]"
                      >
                        최종 중재 결과 보기 →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── 우측: AI 인사이트 패널 ────────────────── */}
      <div className="w-[260px] bg-white p-6 border-l border-[#F0DFD0] overflow-y-auto flex-shrink-0">
        <h2 className="text-base font-semibold text-[#1F1410] mb-5">AI 인사이트</h2>

        <div className="bg-[#FFE9DD] rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-[#1F1410] mb-2">💡 공통점 발견</p>
          <p className="text-sm text-[#7A5C4D]">
            결국 둘 다 원하는 건 같아요 — 서로에게 인정받고 싶은 마음
          </p>
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
