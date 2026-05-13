import { Link, useLocation } from "react-router";
import { Download, Home, CheckCircle, MessageCircle, Heart } from "lucide-react";
import MediationProgressHeader from "./MediationProgressHeader";

export default function MediationCompletePage() {
  const location = useLocation();
  const isEarlyExit = (location.state as { earlyExit?: boolean })?.earlyExit ?? false;

  return (
    <>
      <MediationProgressHeader currentStep="complete" />
      <div className="min-h-[calc(100vh-72px-78px)] bg-[#FFF8F4] py-12 px-6">
      <div className="max-w-[820px] mx-auto">
        {/* Early Exit Banner */}
        {isEarlyExit && (
          <div className="bg-[#FFF3CD] border border-[#D4956A] rounded-xl px-6 py-4 mb-8 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">📝</span>
            <p className="text-sm text-[#7A5C4D] leading-relaxed">
              현재까지의 상담 내용을 바탕으로 정리한 결과입니다. 나머지 라운드를 완료하면 더 자세한 분석을 받을 수 있어요.
            </p>
          </div>
        )}

        {/* Success */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#5A9F7C] mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-[36px] font-semibold text-[#1F1410] mb-3">
            중재가 완료되었어요 🧵
          </h1>
          <p className="text-lg text-[#7A5C4D]">
            두 사람의 이야기를 잘 들었어요
          </p>
        </div>

        {/* Final Report Card */}
        <div className="bg-white rounded-2xl p-10 shadow-[0_12px_48px_rgba(255,99,71,0.2)] mb-8">
          {/* Header */}
          <div className="border-b border-[#F0DFD0] pb-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#1F1410]">최종 중재 보고서</h2>
              <span className="text-sm text-[#7A5C4D]">2025년 4월 10일</span>
            </div>
          </div>

          {/* 1. 갈등 핵심 요약 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">이번 갈등의 핵심 요약</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#FFE0CC] rounded-xl p-4">
                <p className="text-sm text-[#7A5C4D] mb-1">갈등 유형</p>
                <p className="text-base font-semibold text-[#1F1410]">가치관 차이</p>
              </div>
              <div className="bg-[#FFE0CC] rounded-xl p-4">
                <p className="text-sm text-[#7A5C4D] mb-1">총 라운드</p>
                <p className="text-base font-semibold text-[#1F1410]">4라운드</p>
              </div>
              <div className="bg-[#E0F4E8] rounded-xl p-4">
                <p className="text-sm text-[#7A5C4D] mb-1">최종 갈등 온도</p>
                <p className="text-base font-semibold text-[#5A9F7C]">38° (해소됨)</p>
              </div>
            </div>
          </div>

          {/* 2. 각자의 핵심 감정 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">각자의 핵심 감정</h3>
            <div className="space-y-3">
              <div className="bg-[#FFF8F4] border-l-4 border-[#FF6347] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-xs font-bold text-[#1F1410]">여</div>
                  <span className="font-semibold text-[#1F1410] text-sm">여자친구 — 안정형 애착</span>
                </div>
                <p className="text-[#7A5C4D] text-sm pl-9">"인정받지 못하는 느낌, 자존감 하락, 혼자 남겨진 불안감"</p>
              </div>
              <div className="bg-[#FFF8F4] border-l-4 border-[#D4956A] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#FFB89A] ring-2 ring-[#D4956A] flex items-center justify-center text-xs font-bold text-[#1F1410]">지</div>
                  <span className="font-semibold text-[#1F1410] text-sm">남자친구 — 불안형 애착</span>
                </div>
                <p className="text-[#7A5C4D] text-sm pl-9">"지지받고 싶은 마음, 재충전 필요, 부담감"</p>
              </div>
            </div>
          </div>

          {/* 3. 서로 다르게 해석한 부분 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">서로 다르게 해석한 부분</h3>
            <div className="bg-[#FFE9DD] rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-[#FF6347] mb-2">여자친구의 해석</p>
                  <p className="text-[#7A5C4D]">"여행 제안 = 내 노력을 무시하는 것"</p>
                </div>
                <div>
                  <p className="font-medium text-[#D4956A] mb-2">남자친구의 해석</p>
                  <p className="text-[#7A5C4D]">"여행 제안 = 둘 다 지쳐있으니 쉬어가자는 것"</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 반복되는 관계 패턴 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">반복되는 관계 패턴</h3>
            <div className="bg-[#FF6347]/5 rounded-xl p-5 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🔄</span>
              <div>
                <p className="font-medium text-[#1F1410] mb-1">추격-회피 패턴</p>
                <p className="text-sm text-[#7A5C4D]">
                  한쪽(여자친구)은 확인받고 싶어 다가가고, 다른 한쪽(남자친구)은 부담을 느껴 물러나는 패턴이 반복되고 있어요.
                  이는 두 분의 애착유형 차이(안정형 vs 불안형)에서 비롯된 자연스러운 반응이에요.
                </p>
              </div>
            </div>
          </div>

          {/* 5. 서로에게 필요했던 것 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">서로에게 필요했던 것</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#E0F4E8] rounded-xl p-4">
                <p className="font-medium text-[#5A9F7C] mb-2">여자친구에게 필요했던 것</p>
                <p className="text-[#1F1410]">노력을 인정받고 싶은 마음, "네가 열심히 하고 있는 거 알아"라는 말</p>
              </div>
              <div className="bg-[#E0F4E8] rounded-xl p-4">
                <p className="font-medium text-[#5A9F7C] mb-2">남자친구에게 필요했던 것</p>
                <p className="text-[#1F1410]">재충전할 공간과 시간, "너도 지쳐있었구나"라는 이해</p>
              </div>
            </div>
          </div>

          {/* 6. 감정 중심 대화 문장 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">감정 중심 대화 문장</h3>
            <div className="space-y-3">
              <div className="bg-white border border-[#FF6347]/20 rounded-xl p-4">
                <p className="text-xs text-[#7A5C4D] mb-2">여자친구 → 남자친구에게</p>
                <p className="text-sm text-[#1F1410] leading-relaxed">
                  "네가 쉬고 싶었다는 건 이해해. 근데 그 순간 나는 혼자 남겨진 것 같아서 무서웠어."
                </p>
              </div>
              <div className="bg-white border border-[#D4956A]/20 rounded-xl p-4">
                <p className="text-xs text-[#7A5C4D] mb-2">남자친구 → 여자친구에게</p>
                <p className="text-sm text-[#1F1410] leading-relaxed">
                  "네 노력을 무시하려던 게 아니야. 나도 지쳐있었고, 우리 같이 숨 돌리고 싶었어."
                </p>
              </div>
            </div>
          </div>

          {/* 7. 합의 내용 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">합의 내용</h3>
            <div className="space-y-3">
              {[
                "시험 끝난 후 1박 2일 짧은 여행 가기",
                "힘들 때 서로 바로 말하기로 약속",
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#E0F4E8] rounded-lg p-4">
                  <div className="w-6 h-6 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <p className="text-[#1F1410] text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. 다음에 다시 이야기해볼 질문 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#D4956A]" />
              다음에 다시 이야기해볼 질문
            </h3>
            <p className="text-sm text-[#7A5C4D] mb-4">
              이번 갈등을 해결했지만, 아래 질문들을 천천히 함께 나눠보면 다음 갈등을 예방하는 데 도움이 돼요.
            </p>
            <div className="space-y-3">
              {[
                "우리가 갈등할 때 서로에게 가장 필요한 것은 무엇인가요? (사과, 공감, 시간, 안심 중에서)",
                "내가 힘들 때 상대에게 어떻게 말해주면 가장 마음이 편안해지나요?",
                "우리 관계에서 앞으로 반복하고 싶지 않은 패턴이 있다면 무엇인가요?",
              ].map((q, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#FFF8F4] border border-[#F0DFD0] rounded-xl p-4">
                  <span className="text-lg flex-shrink-0">💬</span>
                  <p className="text-[#1F1410] text-sm leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 9. AI Comment */}
          <div className="bg-[#FF6347]/5 rounded-xl p-6 border border-[#FF6347]/20">
            <h3 className="text-base font-semibold text-[#1F1410] mb-3 flex items-center gap-2">
              <span className="text-2xl">🧵</span>
              AI 코멘트
            </h3>
            <p className="text-[#1F1410] text-sm leading-relaxed">
              두 분 모두 상대를 진심으로 아끼고 있었어요. 갈등의 핵심은 표현 방식의 차이였고,
              이번 대화를 통해 서로를 더 잘 이해하게 됐어요. 앞으로도 이런 식으로
              솔직하게 대화하면서 관계를 더 단단하게 만들어가실 수 있을 거예요.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button className="py-4 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,99,71,0.25)]">
            <Download className="w-5 h-5" />
            보고서 저장하기
          </button>
          <Link
            to="/"
            className="py-4 border-2 border-[#F0DFD0] text-[#1F1410] rounded-full hover:bg-[#FFE0CC] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <Link
            to="/mypage/our-space"
            className="py-4 bg-[#5A9F7C] text-white rounded-full hover:bg-[#4d8f6d] transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            우리 공간에 저장하기
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
