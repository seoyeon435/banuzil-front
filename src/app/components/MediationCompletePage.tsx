import { Link } from "react-router";
import { Download, Home, Share2, CheckCircle, MessageCircle } from "lucide-react";

export default function MediationCompletePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F4] py-12 px-6">
      <div className="max-w-[800px] mx-auto">
        {/* Success Animation */}
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
              <h2 className="text-2xl font-semibold text-[#1F1410]">최종 보고서</h2>
              <span className="text-sm text-[#7A5C4D]">2025년 4월 10일</span>
            </div>
          </div>

          {/* Section 1 - Conflict Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">갈등 요약</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#FFE0CC] rounded-xl p-4">
                <p className="text-sm text-[#7A5C4D] mb-2">갈등 유형</p>
                <p className="text-lg font-semibold text-[#1F1410]">가치관 차이</p>
              </div>
              <div className="bg-[#FFE0CC] rounded-xl p-4">
                <p className="text-sm text-[#7A5C4D] mb-2">총 라운드</p>
                <p className="text-lg font-semibold text-[#1F1410]">2라운드</p>
              </div>
              <div className="bg-[#E0F4E8] rounded-xl p-4">
                <p className="text-sm text-[#7A5C4D] mb-2">최종 갈등 온도</p>
                <p className="text-lg font-semibold text-[#5A9F7C]">38° (해소됨)</p>
              </div>
            </div>
          </div>

          {/* Section 2 - Core Emotions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">각자의 핵심 감정</h3>
            <div className="space-y-4">
              <div className="bg-[#FFF8F4] border-l-4 border-[#FF6347] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-sm font-bold">
                    박
                  </div>
                  <span className="font-semibold text-[#1F1410]">박서연 (ENFP)</span>
                </div>
                <p className="text-[#7A5C4D] pl-10">
                  "인정받지 못하는 느낌, 자존감 하락"
                </p>
              </div>
              <div className="bg-[#FFF8F4] border-l-4 border-[#D4956A] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-sm font-bold">
                    지
                  </div>
                  <span className="font-semibold text-[#1F1410]">지현 (INFP)</span>
                </div>
                <p className="text-[#7A5C4D] pl-10">
                  "지지받고 싶은 마음, 재충전 필요"
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Agreements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-4">합의 내용</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#E0F4E8] rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-[#1F1410]">
                  시험 끝난 후 1박 2일 짧은 여행 가기로 합의
                </p>
              </div>
              <div className="flex items-start gap-3 bg-[#E0F4E8] rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-[#5A9F7C] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-[#1F1410]">
                  힘들 때 서로 바로 말하기로 약속
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 - AI Comment */}
          <div className="bg-[#FF6347]/5 rounded-xl p-6 border border-[#FF6347]/20">
            <h3 className="text-lg font-semibold text-[#1F1410] mb-3 flex items-center gap-2">
              <span className="text-2xl">🧵</span>
              AI 코멘트
            </h3>
            <p className="text-[#1F1410] leading-relaxed">
              두 분 모두 상대를 진심으로 아끼고 있었어요. 갈등의 핵심은 표현 방식의 차이였고,
              이번 대화를 통해 서로를 더 잘 이해하게 됐어요. 앞으로도 이런 식으로
              솔직하게 대화하면서 관계를 더 단단하게 만들어가실 수 있을 거예요.
            </p>
          </div>
        </div>

        {/* Next Conversation Questions */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-8">
          <div className="flex items-center gap-3 mb-5">
            <MessageCircle className="w-6 h-6 text-[#D4956A]" />
            <h3 className="text-lg font-semibold text-[#1F1410]">다음에 다시 이야기해볼 질문</h3>
          </div>
          <p className="text-sm text-[#7A5C4D] mb-5">
            이번 갈등을 해결했지만, 아래 질문들을 천천히 함께 나눠보면 다음 갈등을 예방하는 데 도움이 돼요.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-[#FFF8F4] border border-[#F0DFD0] rounded-xl p-4">
              <span className="text-lg flex-shrink-0">💬</span>
              <p className="text-[#1F1410] text-sm leading-relaxed">
                우리가 갈등할 때 서로에게 가장 필요한 것은 무엇인가요? (사과, 공감, 시간, 안심 중에서)
              </p>
            </div>
            <div className="flex items-start gap-3 bg-[#FFF8F4] border border-[#F0DFD0] rounded-xl p-4">
              <span className="text-lg flex-shrink-0">💬</span>
              <p className="text-[#1F1410] text-sm leading-relaxed">
                내가 힘들 때 상대에게 어떻게 말해주면 가장 마음이 편안해지나요?
              </p>
            </div>
            <div className="flex items-start gap-3 bg-[#FFF8F4] border border-[#F0DFD0] rounded-xl p-4">
              <span className="text-lg flex-shrink-0">💬</span>
              <p className="text-[#1F1410] text-sm leading-relaxed">
                우리 관계에서 앞으로 반복하고 싶지 않은 패턴이 있다면 무엇인가요?
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,99,71,0.25)]">
            <Download className="w-5 h-5" />
            보고서 저장하기
          </button>
          <Link
            to="/"
            className="flex-1 py-4 border-2 border-[#F0DFD0] text-[#1F1410] rounded-full hover:bg-[#FFE0CC] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <button className="flex-1 py-4 bg-[#5A9F7C] text-white rounded-full hover:bg-[#4d8f6d] transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            우리 공간에 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
