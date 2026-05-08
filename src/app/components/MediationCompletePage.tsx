import { Link } from "react-router";
import { Download, Home, Share2, CheckCircle } from "lucide-react";

export default function MediationCompletePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F4] py-12 px-6">
      <div className="max-w-[800px] mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#6BAF8C] mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-[36px] font-semibold text-[#2C1810] mb-3">
            중재가 완료되었어요 🧵
          </h1>
          <p className="text-lg text-[#8C6B5A]">
            두 사람의 이야기를 잘 들었어요
          </p>
        </div>

        {/* Final Report Card */}
        <div className="bg-white rounded-2xl p-10 shadow-[0_12px_48px_rgba(255,140,122,0.15)] mb-8">
          {/* Header */}
          <div className="border-b border-[#EDD9CC] pb-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#2C1810]">최종 보고서</h2>
              <span className="text-sm text-[#8C6B5A]">2025년 4월 10일</span>
            </div>
          </div>

          {/* Section 1 - Conflict Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4">갈등 요약</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F5E6D8] rounded-xl p-4">
                <p className="text-sm text-[#8C6B5A] mb-2">갈등 유형</p>
                <p className="text-lg font-semibold text-[#2C1810]">가치관 차이</p>
              </div>
              <div className="bg-[#F5E6D8] rounded-xl p-4">
                <p className="text-sm text-[#8C6B5A] mb-2">총 라운드</p>
                <p className="text-lg font-semibold text-[#2C1810]">2라운드</p>
              </div>
              <div className="bg-[#E6F7EE] rounded-xl p-4">
                <p className="text-sm text-[#8C6B5A] mb-2">최종 갈등 온도</p>
                <p className="text-lg font-semibold text-[#6BAF8C]">38° (해소됨)</p>
              </div>
            </div>
          </div>

          {/* Section 2 - Core Emotions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4">각자의 핵심 감정</h3>
            <div className="space-y-4">
              <div className="bg-[#FFF8F4] border-l-4 border-[#FF8C7A] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white text-sm font-bold">
                    박
                  </div>
                  <span className="font-semibold text-[#2C1810]">박서연 (ENFP)</span>
                </div>
                <p className="text-[#8C6B5A] pl-10">
                  "인정받지 못하는 느낌, 자존감 하락"
                </p>
              </div>
              <div className="bg-[#FFF8F4] border-l-4 border-[#D4956A] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white text-sm font-bold">
                    지
                  </div>
                  <span className="font-semibold text-[#2C1810]">지현 (INFP)</span>
                </div>
                <p className="text-[#8C6B5A] pl-10">
                  "지지받고 싶은 마음, 재충전 필요"
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Agreements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-4">합의 내용</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#E6F7EE] rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-[#6BAF8C] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-[#2C1810]">
                  시험 끝난 후 1박 2일 짧은 여행 가기로 합의
                </p>
              </div>
              <div className="flex items-start gap-3 bg-[#E6F7EE] rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-[#6BAF8C] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-[#2C1810]">
                  힘들 때 서로 바로 말하기로 약속
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 - AI Comment */}
          <div className="bg-[#FF8C7A]/5 rounded-xl p-6 border border-[#FF8C7A]/20">
            <h3 className="text-lg font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
              <span className="text-2xl">🧵</span>
              AI 코멘트
            </h3>
            <p className="text-[#2C1810] leading-relaxed">
              두 분 모두 상대를 진심으로 아끼고 있었어요. 갈등의 핵심은 표현 방식의 차이였고,
              이번 대화를 통해 서로를 더 잘 이해하게 됐어요. 앞으로도 이런 식으로
              솔직하게 대화하면서 관계를 더 단단하게 만들어가실 수 있을 거예요.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-[#FF8C7A] text-white rounded-full hover:bg-[#E56B58] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,140,122,0.2)]">
            <Download className="w-5 h-5" />
            보고서 저장하기
          </button>
          <Link
            to="/"
            className="flex-1 py-4 border-2 border-[#EDD9CC] text-[#2C1810] rounded-full hover:bg-[#F5E6D8] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <button className="flex-1 py-4 bg-[#6BAF8C] text-white rounded-full hover:bg-[#5A9F7C] transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            친구에게 공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
