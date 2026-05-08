import { Link } from "react-router";
import { AlertTriangle, Copy, Lightbulb, Handshake, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function MediationResultPage() {
  const [response, setResponse] = useState("");

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex">
      {/* Left Column - Status */}
      <div className="w-[320px] bg-[#F5E6D8] p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-[#2C1810] mb-6">중재 현황</h2>

        {/* Round Status */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(255,140,122,0.08)]">
          <div className="text-[#FF8C7A] font-semibold mb-2">1라운드 진행중</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6BAF8C]" />
              <span className="text-[#8C6B5A]">상황 공유</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF8C7A]" />
              <span className="text-[#2C1810] font-medium">입장 전달</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EDD9CC]" />
              <span className="text-[#8C6B5A]">합의 도출</span>
            </div>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(255,140,122,0.08)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌡️</span>
            <span className="font-semibold text-[#2C1810]">갈등 온도</span>
          </div>
          <div className="text-3xl font-bold text-[#D4956A] mb-3">62°</div>
          <div className="h-2 bg-gradient-to-r from-[#6BAF8C] via-[#D4956A] to-[#E57373] rounded-full relative">
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#2C1810] rounded-full" style={{ left: '62%' }} />
          </div>
          <div className="flex justify-between text-xs text-[#8C6B5A] mt-1">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>

        {/* Gottman Warning */}
        <div className="bg-[#FFE6E6] border border-[#E57373] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E57373] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#E57373] mb-1">Gottman 위험신호</p>
              <p className="text-xs text-[#8C6B5A]">비난 감지 (A측)</p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(255,140,122,0.08)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white font-bold">
                박
              </div>
              <div>
                <p className="text-sm font-medium text-[#2C1810]">나 (박서연)</p>
                <span className="text-xs text-[#FF8C7A]">ENFP</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white font-bold">
                지
              </div>
              <div>
                <p className="text-sm font-medium text-[#2C1810]">지현</p>
                <span className="text-xs text-[#FF8C7A]">INFP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* End Mediation */}
        <button className="w-full py-3 border-2 border-[#E57373] text-[#E57373] rounded-full hover:bg-[#FFE6E6] transition-all">
          중재 종료하기
        </button>
      </div>

      {/* Center Column - Chat Timeline */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[700px] mx-auto space-y-6">
          {/* AI Message 1 */}
          <div className="bg-[#FF8C7A]/5 border-l-4 border-[#FF8C7A] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#2C1810]">바느질 AI</span>
            </div>
            <p className="text-[#2C1810] mb-6">
              박서연님과 지현님의 이야기를 들었어요.
            </p>

            {/* Message to 박서연 */}
            <div className="bg-white rounded-xl p-5 mb-4">
              <div className="text-sm font-semibold text-[#FF8C7A] mb-2">[박서연님에게]</div>
              <p className="text-[#2C1810] leading-relaxed">
                솔직히 그 말 듣고 진짜 기분 나쁘지. 열심히 하고 있는데 그런 말 들으니까
                내가 아무것도 아닌 것 같은 느낌이었을 것 같아.
              </p>
            </div>

            {/* Message to 지현 (Blurred) */}
            <div className="bg-white rounded-xl p-5 relative overflow-hidden">
              <div className="text-sm font-semibold text-[#8C6B5A] mb-2">[지현님에게는]</div>
              <div className="blur-sm select-none">
                <p className="text-[#8C6B5A]">
                  지현님의 메시지는 지현님께만 보여요...
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <div className="flex items-center gap-2 text-[#8C6B5A]">
                  <span className="text-xl">🔒</span>
                  <span className="text-sm font-medium">지현님의 메시지는 지현님께만 보여요</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#EDD9CC]" />
            <span className="text-sm text-[#8C6B5A]">지현님의 입장이 전달되었어요</span>
            <div className="flex-1 h-[1px] bg-[#EDD9CC]" />
          </div>

          {/* AI Message 2 */}
          <div className="bg-[#FF8C7A]/5 border-l-4 border-[#FF8C7A] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#2C1810]">바느질 AI</span>
            </div>
            <p className="text-[#2C1810] font-semibold mb-3">지현님은 이렇게 느꼈대요</p>
            <p className="text-[#2C1810] leading-relaxed">
              지현님은 사실 여행을 가고 싶었던 게 도피가 아니라 재충전이 필요했던 거였어요.
              시험 준비하면서 많이 힘들었는데, 그 순간만큼은 숨을 돌리고 싶었대요.
              서연님을 응원하는 마음은 진심이었지만, 자신도 지쳐있었던 거예요.
            </p>
          </div>

          {/* Response Input */}
          <div className="bg-white rounded-xl p-6 shadow-[0_8px_32px_rgba(255,140,122,0.12)]">
            <label className="block text-sm font-medium text-[#2C1810] mb-3">
              나의 반응 입력
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="이 내용을 듣고 어떤 생각이 드나요?"
              className="w-full h-[120px] p-4 bg-[#FFF8F4] border-2 border-[#EDD9CC] rounded-xl focus:outline-none focus:border-[#FF8C7A] resize-none text-[#2C1810]"
            />
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 bg-[#FF8C7A] text-white rounded-full hover:bg-[#E56B58] transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                내 입장 추가하기
              </button>
              <Link
                to="/mediation/complete"
                className="flex-1 py-3 bg-[#6BAF8C] text-white rounded-full hover:bg-[#5A9F7C] transition-all flex items-center justify-center gap-2"
              >
                <span>✓</span>
                중재 완료하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - AI Insights */}
      <div className="w-[300px] bg-white p-6 border-l border-[#EDD9CC] overflow-y-auto">
        <h2 className="text-xl font-semibold text-[#2C1810] mb-6">AI 인사이트</h2>

        {/* Common Ground */}
        <div className="bg-[#FFF4E6] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#D4956A]" />
            <span className="font-semibold text-[#2C1810]">공통점 발견</span>
          </div>
          <p className="text-sm text-[#2C1810] mb-2 font-medium">
            결국 둘 다 원하는 건 같아요
          </p>
          <p className="text-sm text-[#8C6B5A]">
            서로에게 인정받고 싶은 마음
          </p>
        </div>

        {/* Agreement Suggestions */}
        <div className="bg-[#E6F7EE] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Handshake className="w-5 h-5 text-[#6BAF8C]" />
            <span className="font-semibold text-[#2C1810]">합의안 제안</span>
          </div>
          <p className="text-sm text-[#2C1810] mb-3 font-medium">
            이런 방법은 어떨까요
          </p>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-white border border-[#6BAF8C] text-[#2C1810] rounded-lg hover:bg-[#6BAF8C]/5 transition-all text-sm">
              시험 끝나고 짧은 여행 가기
            </button>
            <button className="w-full text-left px-3 py-2 bg-white border border-[#6BAF8C] text-[#2C1810] rounded-lg hover:bg-[#6BAF8C]/5 transition-all text-sm">
              서로 힘들 때 바로 말하기
            </button>
          </div>
        </div>

        {/* Script Suggestion */}
        <div className="bg-[#FF8C7A]/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-[#FF8C7A]" />
            <span className="font-semibold text-[#2C1810]">나의 스크립트</span>
          </div>
          <p className="text-sm text-[#2C1810] mb-3 font-medium">
            이렇게 말해볼 수 있어요
          </p>
          <div className="bg-white rounded-lg p-3 mb-3 text-sm text-[#2C1810] leading-relaxed border border-[#FF8C7A]/20">
            "나도 네가 힘들었다는 거 이해해. 내가 너무 내 입장만 생각했던 것 같아. 미안해."
          </div>
          <button className="w-full py-2 border border-[#FF8C7A] text-[#FF8C7A] rounded-lg hover:bg-[#FF8C7A]/5 transition-all flex items-center justify-center gap-2 text-sm">
            <Copy className="w-4 h-4" />
            복사하기
          </button>
        </div>
      </div>
    </div>
  );
}
