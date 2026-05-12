import MyPageLayout from "./MyPageLayout";
import { Link } from "react-router";
import { useState } from "react";
import { Copy, Check, Heart, RefreshCw } from "lucide-react";

const MOCK_GENERATED_CODE = "LOVE-7K29";

const recentConflicts = [
  { id: 1, date: "2025.03.15", type: "가치관 차이", status: "completed", temp: 38 },
  { id: 2, date: "2025.04.08", type: "연락 문제", status: "in_progress", temp: 62 },
  { id: 3, date: "2025.02.28", type: "약속 파기", status: "completed", temp: 45 },
];

const repeatingPatterns = [
  "힘들 때 말 못 하고 쌓아두다가 폭발하는 패턴",
  "연락 속도 차이에서 오는 불안과 방어 반응",
];

const sharedPromises = [
  "힘들 때 바로 말하기로 약속",
  "시험 끝나고 짧은 여행 가기 합의",
];

type ConnectionState = "none" | "code_shown" | "input_code" | "connected";

export default function FriendsPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("none");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [inputError, setInputError] = useState("");

  const handleGenerateCode = () => {
    setGeneratedCode(MOCK_GENERATED_CODE);
    setConnectionState("code_shown");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleConnect = () => {
    if (codeInput.trim().length === 0) {
      setInputError("코드를 입력해주세요.");
      return;
    }
    // mock: any non-empty code connects
    setConnectionState("connected");
    setInputError("");
  };

  // ── 미연결 상태 ──────────────────────────────────────────
  if (connectionState !== "connected") {
    return (
      <MyPageLayout>
        <div className="max-w-[680px]">
          <h1 className="text-[36px] font-semibold text-[#1F1410] mb-2">우리 공간</h1>
          <p className="text-[#7A5C4D] mb-10">
            연인과 연결되면 둘만의 갈등 중재 공간이 열려요.
          </p>

          {/* Not Connected Card */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FF6347]/10 flex items-center justify-center text-4xl mx-auto mb-6">
              💑
            </div>
            <h2 className="text-xl font-semibold text-[#1F1410] mb-3">
              아직 연결된 연인이 없습니다
            </h2>
            <p className="text-[#7A5C4D] leading-relaxed mb-8">
              상대방과 연결하면 둘만의 갈등 중재 공간이 열려요.<br />
              초대 코드를 생성하거나, 상대방이 보낸 코드를 입력해 연결할 수 있어요.
            </p>

            {/* Code Shown State */}
            {connectionState === "code_shown" && (
              <div className="bg-[#FFF8F4] border-2 border-[#FF6347] rounded-2xl p-6 mb-6">
                <p className="text-sm text-[#7A5C4D] mb-3">내 초대 코드</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl font-bold tracking-widest text-[#FF6347]">
                    {generatedCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg border border-[#FF6347] text-[#FF6347] hover:bg-[#FF6347]/5 transition-all"
                  >
                    {codeCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-[#7A5C4D]">
                  이 코드를 상대방에게 공유하세요. 상대방이 코드를 입력하면 연결됩니다.
                </p>
                <button
                  onClick={handleGenerateCode}
                  className="mt-3 flex items-center gap-1 text-xs text-[#7A5C4D] hover:text-[#FF6347] mx-auto"
                >
                  <RefreshCw className="w-3 h-3" /> 코드 재생성
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGenerateCode}
                className="py-4 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
              >
                초대 코드 생성하기
              </button>
              <button
                onClick={() => setConnectionState("input_code")}
                className="py-4 border-2 border-[#FF6347] text-[#FF6347] rounded-full hover:bg-[#FF6347]/5 transition-all font-medium"
              >
                상대방 코드 입력하기
              </button>
            </div>
          </div>

          {/* Input Code Panel */}
          {connectionState === "input_code" && (
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
              <h3 className="text-lg font-semibold text-[#1F1410] mb-2">상대방 코드 입력</h3>
              <p className="text-sm text-[#7A5C4D] mb-5">
                상대방이 생성한 초대 코드를 입력해주세요.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setInputError(""); }}
                  placeholder="예: LOVE-7K29"
                  className="flex-1 h-12 px-4 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-xl focus:outline-none focus:border-[#FF6347] text-[#1F1410] tracking-wider font-mono text-lg"
                />
                <button
                  onClick={handleConnect}
                  className="px-8 h-12 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium"
                >
                  연결하기
                </button>
              </div>
              {inputError && (
                <p className="text-sm text-[#DC3545] mt-2">{inputError}</p>
              )}
              <p className="text-xs text-[#7A5C4D] mt-3">
                시연용: 아무 코드나 입력하면 연결 완료 상태로 바뀝니다.
              </p>
            </div>
          )}
        </div>
      </MyPageLayout>
    );
  }

  // ── 연결 완료 상태 ─────────────────────────────────────
  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        {/* Connection Complete Banner */}
        <div className="bg-gradient-to-r from-[#FF6347] to-[#E84028] rounded-2xl p-6 mb-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 fill-white" />
            <div>
              <p className="text-xl font-semibold">연인 연결 완료</p>
              <p className="text-white/80 text-sm mt-0.5">
                이제 두 사람의 갈등 기록과 중재 결과가 함께 저장됩니다.
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-white/70">
            <p>코드 {generatedCode || codeInput || "LOVE-7K29"} 로 연결됨</p>
          </div>
        </div>

        <h1 className="text-[36px] font-semibold text-[#1F1410] mb-2">우리 공간</h1>
        <p className="text-[#7A5C4D] mb-8">함께 쌓아가는 관계 기록</p>

        {/* Couple Summary Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-8">
          <h2 className="text-lg font-semibold text-[#1F1410] mb-6">연결된 연인</h2>
          <div className="flex items-center gap-8 mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-2xl font-bold">
                박
              </div>
              <p className="text-sm font-medium text-[#1F1410]">박서연 (나)</p>
              <span className="px-2 py-0.5 bg-[#5A9F7C]/10 text-[#5A9F7C] text-xs rounded-full">안정형</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-3xl">💑</span>
              <div className="w-full h-[2px] bg-gradient-to-r from-[#FF6347] to-[#D4956A] rounded-full" />
              <p className="text-xs text-[#7A5C4D]">함께한 지 243일 · EFT 중재 {recentConflicts.length}회</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#D4956A] flex items-center justify-center text-[#1F1410] text-2xl font-bold">
                지
              </div>
              <p className="text-sm font-medium text-[#1F1410]">지현</p>
              <span className="px-2 py-0.5 bg-[#D4956A]/10 text-[#D4956A] text-xs rounded-full">불안형</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FFE0CC] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#1F1410]">3</p>
              <p className="text-sm text-[#7A5C4D] mt-1">갈등 해결 완료</p>
            </div>
            <div className="bg-[#E0F4E8] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#5A9F7C]">38°</p>
              <p className="text-sm text-[#7A5C4D] mt-1">최근 갈등 온도</p>
            </div>
            <div className="bg-[#FF6347]/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#FF6347]">5</p>
              <p className="text-sm text-[#7A5C4D] mt-1">회복 문장 저장됨</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Repeating Patterns */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
            <h3 className="font-semibold text-[#1F1410] mb-2">자주 반복되는 갈등 패턴</h3>
            <p className="text-xs text-[#7A5C4D] mb-4">최근 우리 사이에서 반복된 감정 패턴을 확인해보세요.</p>
            <div className="space-y-2">
              {repeatingPatterns.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#1F1410]">
                  <span className="text-[#FF6347] font-bold flex-shrink-0">↩</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Promises */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
            <h3 className="font-semibold text-[#1F1410] mb-2">둘만의 작은 약속</h3>
            <p className="text-xs text-[#7A5C4D] mb-4">함께 정한 우리만의 규칙이에요.</p>
            <div className="space-y-2">
              {sharedPromises.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#1F1410]">
                  <span className="text-[#5A9F7C] font-bold flex-shrink-0">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Conflict Records */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1F1410]">최근 갈등 기록</h2>
            <Link to="/mypage/records" className="text-sm text-[#FF6347] hover:text-[#E84028] underline">
              전체 보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {recentConflicts.map((record) => {
              const isCompleted = record.status === "completed";
              return (
                <div key={record.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(255,99,71,0.13)] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{isCompleted ? "✅" : "🔄"}</span>
                    <div>
                      <p className="font-medium text-[#1F1410]">{record.type}</p>
                      <p className="text-sm text-[#7A5C4D]">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCompleted ? "bg-[#E0F4E8] text-[#5A9F7C]" : "bg-[#FFE9DD] text-[#D4956A]"}`}>
                      {isCompleted ? "AI 중재 완료" : "상대방 입장 대기"}
                    </span>
                    <span className="text-sm text-[#7A5C4D]">{record.temp}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Mediation CTA */}
        <div className="bg-gradient-to-br from-[#FF6347] to-[#E84028] rounded-2xl p-8 text-white text-center">
          <p className="text-xl font-semibold mb-2">오늘의 갈등 중재 시작하기</p>
          <p className="text-white/80 mb-6 text-sm">
            오늘 우리 사이에 어떤 일이 있었나요? EFT 흐름으로 함께 정리해드려요.
          </p>
          <Link
            to="/mediation/start"
            className="inline-block px-10 py-3 bg-white text-[#FF6347] font-semibold rounded-full hover:bg-[#FFF8F4] transition-all"
          >
            갈등 중재 시작하기 →
          </Link>
        </div>
      </div>
    </MyPageLayout>
  );
}
