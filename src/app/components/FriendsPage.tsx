import MyPageLayout from "./MyPageLayout";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Copy, Check, Heart, RefreshCw } from "lucide-react";
import { addPartnerByCode, getConnectedPartners, type ConnectedPartner } from "../../api/partnerApi";
import { fetchFullUserProfile, type UserProfile } from "../../api/userApi";
import { getAttachmentLabel } from "../../api/attachmentApi";
import { useDisplayNames } from "../utils/useDisplayNames";

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
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const { currentName, currentInitial, partnerName: fallbackPartnerName, partnerInitial: fallbackPartnerInitial } = useDisplayNames();

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
    // 본인 프로필 (friendCode + attachmentType + mbti) 로드
    void (async () => {
      const profile = await fetchFullUserProfile();
      if (profile) setMyProfile(profile);
    })();
  }, []);

  // 코드 공유 화면일 때만 3초마다 연결 여부를 폴링.
  // 상대가 코드를 입력해 연결되면 자동으로 connected 단계로 전환된다.
  useEffect(() => {
    if (step !== "code_shown") return;

    const intervalId = window.setInterval(() => {
      void refreshConnectedPartner();
    }, 3000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshConnectedPartner();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [step]);

  const handleCopyCode = () => {
    const code = myProfile?.friendCode;
    if (!code) return;
    navigator.clipboard.writeText(code).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
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
    const partnerName = partner?.nickname || fallbackPartnerName;
    const partnerInitial = partnerName.slice(0, 1).toUpperCase() || fallbackPartnerInitial;
    const partnerMbti = partner?.mbti || "MBTI";
    const partnerAttachment = partner?.attachmentTypeDescription || "불안형";

    return (
      <MyPageLayout>
        <div className="max-w-[1100px] mx-auto w-full">
          {/* 연결 완료 배너 */}
          <div className="bg-gradient-to-r from-[#1A1A2E] to-[#0F0F1F] rounded-2xl p-6 mb-8 text-white">
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

          <h1 className="text-[36px] font-semibold text-[#1A1A2E] mb-2">우리 공간</h1>
          <p className="text-[#6F7787] mb-8">함께 쌓아가는 관계 기록</p>

          {/* 커플 요약 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(35,40,56,0.102)] mb-8">
            <h2 className="text-base font-semibold text-[#1A1A2E] mb-5">{currentName}님과 {partnerName}님의 공간</h2>
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#E8C8C0] ring-2 ring-[#1A1A2E] flex items-center justify-center text-[#1A1A2E] text-2xl font-bold">
                  {currentInitial}
                </div>
                <p className="text-sm font-medium text-[#1A1A2E]">{currentName} (나)</p>
                <span className="px-2 py-0.5 bg-[#5A9F7C]/10 text-[#5A9F7C] text-xs rounded-full">
                  {myProfile?.attachmentType ? getAttachmentLabel(myProfile.attachmentType) : "검사 전"}
                </span>
                {myProfile?.mbti && (
                  <span className="px-2 py-0.5 bg-[#1A1A2E]/10 text-[#1A1A2E] text-xs rounded-full">{myProfile.mbti}</span>
                )}
              </div>
              <div className="w-full sm:flex-1 flex flex-col items-center gap-2">
                <span className="text-3xl">💑</span>
                <div className="w-full h-[2px] bg-gradient-to-r from-[#1A1A2E] to-[#6F8197] rounded-full" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#E8C8C0] ring-2 ring-[#6F8197] flex items-center justify-center text-[#1A1A2E] text-2xl font-bold">
                  {partnerInitial}
                </div>
                <p className="text-sm font-medium text-[#1A1A2E]">{partnerName}</p>
                <span className="px-2 py-0.5 bg-[#6F8197]/10 text-[#6F8197] text-xs rounded-full">{partnerAttachment}</span>
                {partner?.mbti && (
                  <span className="px-2 py-0.5 bg-[#1A1A2E]/10 text-[#1A1A2E] text-xs rounded-full">{partnerMbti}</span>
                )}
              </div>
            </div>
          </div>

          {/* 갈등 기록 바로가기 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">갈등 기록</h2>
              <Link to="/mypage/records" className="text-sm text-[#1A1A2E] hover:text-[#0F0F1F] underline">
                전체 보기 →
              </Link>
            </div>
          </div>

          {/* 중재 시작 CTA */}
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1F] rounded-2xl p-8 text-white text-center">
            <p className="text-xl font-semibold mb-2">오늘의 갈등 중재 시작하기</p>
            <p className="text-white/80 mb-6 text-sm">
              오늘 우리 사이에 어떤 일이 있었나요? EFT 흐름으로 함께 정리해드려요.
            </p>
            <Link
              to="/mediation/start"
              className="inline-block px-10 py-3 bg-white text-[#1A1A2E] font-semibold rounded-full hover:bg-[#FAFAF7] transition-all"
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
        <h1 className="text-[36px] font-semibold text-[#1A1A2E] mb-2">우리 공간</h1>
        <p className="text-[#6F7787] mb-10">
          연인과 연결되면 둘만의 갈등 중재 공간이 열려요.
        </p>

        <div className="max-w-[680px] mx-auto w-full">
        {/* 연결 전 안내 */}
        {step === "none" && (
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(35,40,56,0.102)] mb-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center text-4xl mx-auto mb-6">
              💑
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-3">
              아직 연결된 연인이 없습니다
            </h2>
            <p className="text-[#6F7787] leading-relaxed mb-8">
              초대 코드를 생성하거나, 상대방이 보낸 코드를 입력해 연결할 수 있어요.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setStep("code_shown")}
                className="py-4 bg-[#1A1A2E] text-white rounded-full hover:bg-[#0F0F1F] transition-all font-medium shadow-[0_4px_16px_rgba(35,40,56,0.15)]"
              >
                초대 코드 생성하기
              </button>
              <button
                onClick={() => setStep("input_code")}
                className="py-4 border-2 border-[#1A1A2E] text-[#1A1A2E] rounded-full hover:bg-[#1A1A2E]/5 transition-all font-medium"
              >
                상대방 코드 입력하기
              </button>
            </div>
          </div>
        )}

        {/* 코드 생성됨 */}
        {step === "code_shown" && (
          <div className="bg-white rounded-2xl p-10 shadow-[0_8px_32px_rgba(35,40,56,0.102)] mb-6">
            <div className="text-center mb-8">
              <p className="text-sm text-[#6F7787] mb-2">내 초대 코드가 생성되었습니다</p>
              <div className="inline-flex items-center gap-3 bg-[#FAFAF7] border-2 border-[#1A1A2E] rounded-2xl px-8 py-4 mb-3">
                <span className="text-3xl font-bold tracking-widest text-[#1A1A2E]">{myProfile?.friendCode || "(로딩 중...)"}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-all"
                >
                  {codeCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-[#6F7787]">이 코드를 상대방에게 전달해주세요.</p>
              <button
                onClick={() => setStep("code_shown")}
                className="mt-2 flex items-center gap-1 text-xs text-[#6F7787] hover:text-[#1A1A2E] mx-auto"
              >
                <RefreshCw className="w-3 h-3" /> 코드 재생성
              </button>
            </div>

          </div>
        )}

        {/* 상대방 코드 입력 */}
        {step === "input_code" && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(35,40,56,0.102)] mb-6">
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">상대방 코드 입력</h3>
            <p className="text-sm text-[#6F7787] mb-5">상대방이 생성한 초대 코드를 입력해주세요.</p>
            <div className="flex gap-3 mb-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setInputError(""); }}
                placeholder="예: COUPLE-4821"
                className="flex-1 h-12 px-4 bg-[#FAFAF7] border-2 border-[#E5E2DC] rounded-xl focus:outline-none focus:border-[#1A1A2E] text-[#1A1A2E] tracking-wider font-mono text-lg"
              />
              <button
                onClick={handleInputConnect}
                disabled={isConnecting}
                className="px-8 h-12 bg-[#1A1A2E] text-white rounded-full hover:bg-[#0F0F1F] transition-all font-medium"
              >
                {isConnecting ? "연결 중..." : "연결하기"}
              </button>
            </div>
            {inputError && <p className="text-sm text-[#DC3545]">{inputError}</p>}
          </div>
        )}

        {step !== "none" && (
          <button
            onClick={() => { setStep("none"); setCodeInput(""); setInputError(""); }}
            className="text-sm text-[#6F7787] hover:text-[#1A1A2E] underline"
          >
            ← 처음으로
          </button>
        )}
        </div>
      </div>
    </MyPageLayout>
  );
}
