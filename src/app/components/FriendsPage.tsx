import MyPageLayout from "./MyPageLayout";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Copy, Check, Heart, RefreshCw } from "lucide-react";
import { addPartnerByCode, getConnectedPartners, type ConnectedPartner } from "../../api/partnerApi";

const MOCK_CODE = "COUPLE-4821";

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

// 연결 상태 단계
// none → code_shown → partner_connecting → connected
// 또는 none → input_code → connected
type Step = "none" | "code_shown" | "connected" | "input_code";

export default function FriendsPage() {
  const [step, setStep] = useState<Step>("none");
  const [isConnecting, setIsConnecting] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [partner, setPartner] = useState<ConnectedPartner | null>(null);

  const refreshConnectedPartner = async () => {
    try {
      const partners = await getConnectedPartners();
      if (partners.length > 0) {
        setPartner(partners[0]);
        setStep("connected");
      } else {
        setPartner(null);
      }
    } catch (error) {
      console.error("[API] Failed to load connected partner:", error);
    }
  };

  useEffect(() => {
    void refreshConnectedPartner();
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MOCK_CODE).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handlePartnerConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep("connected");
    }, 1200);
  };

  const handleInputConnect = async () => {
    if (codeInput.trim().length === 0) {
      setInputError("코드를 입력해주세요.");
      return;
    }

    setIsConnecting(true);
    setInputError("");

    try {
      await addPartnerByCode(codeInput.trim());
      await refreshConnectedPartner();
    } catch (error) {
      console.error("[API] Failed to connect partner by code:", error);
      setStep("connected");
    } finally {
      setIsConnecting(false);
    }
  };

  // ── 연결 완료 ──────────────────────────────────────────
  if (step === "connected") {
    const partnerName = partner?.nickname || "남자친구";
    const partnerMbti = partner?.mbti || "MBTI";
    const partnerAttachment = partner?.attachmentTypeDescription || "불안형";

    return (
      <MyPageLayout>
        <div className="max-w-[1100px] mx-auto w-full">
          {/* 연결 완료 배너 */}
          <div className="bg-gradient-to-r from-[#FF6347] to-[#E84028] rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <Heart className="w-8 h-8 fill-white flex-shrink-0" />
              <div>
                <p className="text-xl font-semibold">연인 연결 완료</p>
                <p className="text-white/80 text-sm mt-0.5">
                  이제 둘만의 공간이 생성되었습니다.
                </p>
              </div>
            </div>
            <p className="text-white/80 text-sm ml-12">
              두 사람의 갈등 기록과 중재 결과가 이 공간에 함께 저장됩니다.
            </p>
          </div>

          <h1 className="text-[36px] font-semibold text-[#1F1410] mb-2">우리 공간</h1>
          <p className="text-[#7A5C4D] mb-8">함께 쌓아가는 관계 기록</p>

          {/* 커플 요약 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-8">
            <h2 className="text-base font-semibold text-[#1F1410] mb-5">여자친구와 남자친구의 공간</h2>
            <div className="flex items-center gap-8 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-2xl font-bold">
                  여
                </div>
                <p className="text-sm font-medium text-[#1F1410]">여자친구 (나)</p>
                <span className="px-2 py-0.5 bg-[#5A9F7C]/10 text-[#5A9F7C] text-xs rounded-full">안정형</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-3xl">💑</span>
                <div className="w-full h-[2px] bg-gradient-to-r from-[#FF6347] to-[#D4956A] rounded-full" />
                <p className="text-xs text-[#7A5C4D]">함께한 지 243일 · EFT 중재 {recentConflicts.length}회</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#FFB89A] ring-2 ring-[#D4956A] flex items-center justify-center text-[#1F1410] text-2xl font-bold">
                  남
                </div>
                <p className="text-sm font-medium text-[#1F1410]">{partnerName}</p>
                <span className="px-2 py-0.5 bg-[#D4956A]/10 text-[#D4956A] text-xs rounded-full">{partnerAttachment}</span>
                {partner?.mbti && (
                  <span className="px-2 py-0.5 bg-[#FF6347]/10 text-[#FF6347] text-xs rounded-full">{partnerMbti}</span>
                )}
              </div>
            </div>
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

          {/* 패턴 & 약속 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
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

          {/* 최근 갈등 기록 */}
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
                        {isCompleted ? "AI 중재 완료" : "남자친구 입장 대기"}
                      </span>
                      <span className="text-sm text-[#7A5C4D]">{record.temp}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 중재 시작 CTA */}
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

  // ── 미연결 상태 ─────────────────────────────────────────
  return (
    <MyPageLayout>
      <div className="w-full">
        <h1 className="text-[36px] font-semibold text-[#1F1410] mb-2">우리 공간</h1>
        <p className="text-[#7A5C4D] mb-10">
          연인과 연결되면 둘만의 갈등 중재 공간이 열려요.
        </p>

        <div className="max-w-[680px] mx-auto w-full">
        {/* 연결 전 안내 */}
        {step === "none" && (
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FF6347]/10 flex items-center justify-center text-4xl mx-auto mb-6">
              💑
            </div>
            <h2 className="text-xl font-semibold text-[#1F1410] mb-3">
              아직 연결된 연인이 없습니다
            </h2>
            <p className="text-[#7A5C4D] leading-relaxed mb-8">
              초대 코드를 생성하거나, 상대방이 보낸 코드를 입력해 연결할 수 있어요.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStep("code_shown")}
                className="py-4 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium shadow-[0_4px_16px_rgba(255,99,71,0.25)]"
              >
                초대 코드 생성하기
              </button>
              <button
                onClick={() => setStep("input_code")}
                className="py-4 border-2 border-[#FF6347] text-[#FF6347] rounded-full hover:bg-[#FF6347]/5 transition-all font-medium"
              >
                상대방 코드 입력하기
              </button>
            </div>
          </div>
        )}

        {/* 코드 생성됨 */}
        {step === "code_shown" && (
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
            <div className="text-center mb-8">
              <p className="text-sm text-[#7A5C4D] mb-2">내 초대 코드가 생성되었습니다</p>
              <div className="inline-flex items-center gap-3 bg-[#FFF8F4] border-2 border-[#FF6347] rounded-2xl px-8 py-4 mb-3">
                <span className="text-3xl font-bold tracking-widest text-[#FF6347]">{MOCK_CODE}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg border border-[#FF6347] text-[#FF6347] hover:bg-[#FF6347]/5 transition-all"
                >
                  {codeCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-[#7A5C4D]">이 코드를 상대방에게 전달해주세요.</p>
              <button
                onClick={() => setStep("code_shown")}
                className="mt-2 flex items-center gap-1 text-xs text-[#7A5C4D] hover:text-[#FF6347] mx-auto"
              >
                <RefreshCw className="w-3 h-3" /> 코드 재생성
              </button>
            </div>

            <div className="border-t border-[#F0DFD0] pt-6">
              <p className="text-sm font-semibold text-[#1F1410] mb-1 text-center">시연용</p>
              <p className="text-xs text-[#7A5C4D] mb-4 text-center">
                실제 서비스에서는 상대방이 직접 코드를 입력합니다.
              </p>
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2 py-3">
                  <div className="w-4 h-4 rounded-full bg-[#FF6347] animate-ping" />
                  <span className="text-sm text-[#7A5C4D]">남자친구 연결 중...</span>
                </div>
              ) : (
                <button
                  onClick={handlePartnerConnect}
                  className="w-full py-3 bg-[#FFE0CC] text-[#1F1410] rounded-full hover:bg-[#F0DFD0] transition-all font-medium border border-[#F0DFD0]"
                >
                  상대방 연결 시연하기
                </button>
              )}
            </div>
          </div>
        )}

        {/* 상대방 코드 입력 */}
        {step === "input_code" && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-2">상대방 코드 입력</h3>
            <p className="text-sm text-[#7A5C4D] mb-5">상대방이 생성한 초대 코드를 입력해주세요.</p>
            <div className="flex gap-3 mb-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setInputError(""); }}
                placeholder="예: COUPLE-4821"
                className="flex-1 h-12 px-4 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-xl focus:outline-none focus:border-[#FF6347] text-[#1F1410] tracking-wider font-mono text-lg"
              />
              <button
                onClick={handleInputConnect}
                disabled={isConnecting}
                className="px-8 h-12 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all font-medium"
              >
                {isConnecting ? "연결 중..." : "연결하기"}
              </button>
            </div>
            {inputError && <p className="text-sm text-[#DC3545]">{inputError}</p>}
            <p className="text-xs text-[#7A5C4D] mt-2">시연용: 아무 코드나 입력하면 연결됩니다.</p>
          </div>
        )}

        {step !== "none" && (
          <button
            onClick={() => { setStep("none"); setCodeInput(""); setInputError(""); }}
            className="text-sm text-[#7A5C4D] hover:text-[#FF6347] underline"
          >
            ← 처음으로
          </button>
        )}
        </div>
      </div>
    </MyPageLayout>
  );
}
