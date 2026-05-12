import { Link } from "react-router";
import { AlertTriangle, Copy, Lightbulb, Handshake, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

const eftQuestions = [
  "상대의 말에서 가장 아프게 느껴진 부분은 무엇이었나요?",
  "그 순간 내가 정말 원했던 것은 사과였나요, 이해였나요, 안심이었나요?",
  "상대가 나를 공격한다고 느낀 이유는 무엇인가요?",
  "이번 갈등에서 반복되는 감정 패턴이 있다면 무엇인가요?",
  "지금 상대에게 가장 안전하게 전달하고 싶은 말은 무엇인가요?",
];

export default function MediationResultPage() {
  const [response, setResponse] = useState("");
  const [eftAnswers, setEftAnswers] = useState<Record<number, string>>({});

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex">
      {/* Left Column - Status */}
      <div className="w-[320px] bg-[#FFE0CC] p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-[#1F1410] mb-6">중재 현황</h2>

        {/* Round Status */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="text-[#FF6347] font-semibold mb-2">1라운드 진행중</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5A9F7C]" />
              <span className="text-[#7A5C4D]">상황 공유</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF6347]" />
              <span className="text-[#1F1410] font-medium">감정 확인 중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F0DFD0]" />
              <span className="text-[#7A5C4D]">합의 도출</span>
            </div>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌡️</span>
            <span className="font-semibold text-[#1F1410]">갈등 온도</span>
          </div>
          <div className="text-3xl font-bold text-[#D4956A] mb-3">62°</div>
          <div className="h-2 bg-gradient-to-r from-[#5A9F7C] via-[#D4956A] to-[#DC3545] rounded-full relative">
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1F1410] rounded-full" style={{ left: '62%' }} />
          </div>
          <div className="flex justify-between text-xs text-[#7A5C4D] mt-1">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>

        {/* Gottman Warning */}
        <div className="bg-[#FFE0E0] border border-[#DC3545] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-[#DC3545] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#DC3545] mb-1">Gottman 위험신호</p>
              <p className="text-xs text-[#7A5C4D]">비난 감지 (A측)</p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] font-bold">
                박
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F1410]">나 (박서연)</p>
                <span className="text-xs text-[#FF6347]">안정형 애착</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] font-bold">
                지
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F1410]">지현</p>
                <span className="text-xs text-[#FF6347]">불안형 애착</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <button className="w-full py-3 border-2 border-[#DC3545] text-[#DC3545] rounded-full hover:bg-[#FFE0E0] transition-all">
          중재 종료하기
        </button>
      </div>

      {/* Center Column - Chat Timeline */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[700px] mx-auto space-y-6">

          {/* ① 공감 메시지 */}
          <div className="bg-[#FF6347]/5 border-l-4 border-[#FF6347] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#1F1410]">바느질 AI — 공감 메시지</span>
            </div>
            <p className="text-[#1F1410] mb-6">
              박서연님과 지현님의 이야기를 들었어요.
            </p>
            <div className="bg-white rounded-xl p-5 mb-4">
              <div className="text-sm font-semibold text-[#FF6347] mb-2">[박서연님에게]</div>
              <p className="text-[#1F1410] leading-relaxed">
                솔직히 그 말 듣고 진짜 기분 나쁘지. 열심히 하고 있는데 그런 말 들으니까
                내가 아무것도 아닌 것 같은 느낌이었을 것 같아.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 relative overflow-hidden">
              <div className="text-sm font-semibold text-[#7A5C4D] mb-2">[지현님에게는]</div>
              <div className="blur-sm select-none">
                <p className="text-[#7A5C4D]">지현님의 메시지는 지현님께만 보여요...</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <div className="flex items-center gap-2 text-[#7A5C4D]">
                  <span className="text-xl">🔒</span>
                  <span className="text-sm font-medium">지현님의 메시지는 지현님께만 보여요</span>
                </div>
              </div>
            </div>
          </div>

          {/* ② 상대방 입장 요약 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#F0DFD0]" />
            <span className="text-sm text-[#7A5C4D]">지현님의 입장이 전달되었어요</span>
            <div className="flex-1 h-[1px] bg-[#F0DFD0]" />
          </div>

          <div className="bg-[#FF6347]/5 border-l-4 border-[#FF6347] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧵</span>
              <span className="font-semibold text-[#1F1410]">상대방 입장 요약</span>
            </div>
            <p className="text-[#1F1410] font-semibold mb-3">지현님은 이렇게 느꼈대요</p>
            <p className="text-[#1F1410] leading-relaxed">
              지현님은 사실 여행을 가고 싶었던 게 도피가 아니라 재충전이 필요했던 거였어요.
              시험 준비하면서 많이 힘들었는데, 그 순간만큼은 숨을 돌리고 싶었대요.
              서연님을 응원하는 마음은 진심이었지만, 자신도 지쳐있었던 거예요.
            </p>
          </div>

          {/* ③ EFT 감정 확인 질문 */}
          <div className="bg-white border-l-4 border-[#D4956A] rounded-xl p-6 shadow-[0_4px_16px_rgba(255,99,71,0.13)]">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-6 h-6 text-[#D4956A]" />
              <span className="font-semibold text-[#1F1410]">AI가 묻는 감정 확인 질문</span>
            </div>
            <p className="text-sm text-[#7A5C4D] mb-5">
              EFT 상담 흐름에 따라, 내 감정과 욕구를 더 깊이 돌아볼 수 있도록 도와드려요.
              답변은 선택사항이에요.
            </p>
            <div className="space-y-4">
              {eftQuestions.map((q, i) => (
                <div key={i} className="bg-[#FFF8F4] rounded-xl p-4">
                  <p className="text-sm font-medium text-[#1F1410] mb-2">Q{i + 1}. {q}</p>
                  <textarea
                    value={eftAnswers[i] || ""}
                    onChange={(e) => setEftAnswers({ ...eftAnswers, [i]: e.target.value })}
                    placeholder="여기에 자유롭게 적어보세요..."
                    className="w-full h-16 p-3 bg-white border border-[#F0DFD0] rounded-lg focus:outline-none focus:border-[#D4956A] resize-none text-[#1F1410] text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ④ 나의 반응 입력 */}
          <div className="bg-white rounded-xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
            <label className="block text-sm font-medium text-[#1F1410] mb-3">
              나의 반응 입력
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="이 내용을 듣고 어떤 생각이 드나요?"
              className="w-full h-[120px] p-4 bg-[#FFF8F4] border-2 border-[#F0DFD0] rounded-xl focus:outline-none focus:border-[#FF6347] resize-none text-[#1F1410]"
            />
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 bg-[#FF6347] text-white rounded-full hover:bg-[#E84028] transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                내 입장 추가하기
              </button>
              <Link
                to="/mediation/complete"
                className="flex-1 py-3 bg-[#5A9F7C] text-white rounded-full hover:bg-[#4d8f6d] transition-all flex items-center justify-center gap-2"
              >
                <span>✓</span>
                중재 완료하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - AI Insights */}
      <div className="w-[300px] bg-white p-6 border-l border-[#F0DFD0] overflow-y-auto">
        <h2 className="text-xl font-semibold text-[#1F1410] mb-6">AI 인사이트</h2>

        {/* Common Ground */}
        <div className="bg-[#FFE9DD] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#D4956A]" />
            <span className="font-semibold text-[#1F1410]">공통점 발견</span>
          </div>
          <p className="text-sm text-[#1F1410] mb-2 font-medium">결국 둘 다 원하는 건 같아요</p>
          <p className="text-sm text-[#7A5C4D]">서로에게 인정받고 싶은 마음</p>
        </div>

        {/* Recurring Pattern */}
        <div className="bg-[#FF6347]/5 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#FF6347]" />
            <span className="font-semibold text-[#1F1410]">반복되는 갈등 패턴</span>
          </div>
          <p className="text-sm text-[#7A5C4D]">
            "내가 힘들다고 말하지 못하고 쌓아두다가 폭발하는 패턴"이 두 분 모두에게 보여요.
          </p>
        </div>

        {/* Agreement Suggestions */}
        <div className="bg-[#E0F4E8] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Handshake className="w-5 h-5 text-[#5A9F7C]" />
            <span className="font-semibold text-[#1F1410]">합의안 제안</span>
          </div>
          <p className="text-sm text-[#1F1410] mb-3 font-medium">이런 방법은 어떨까요</p>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-white border border-[#5A9F7C] text-[#1F1410] rounded-lg hover:bg-[#5A9F7C]/5 transition-all text-sm">
              시험 끝나고 짧은 여행 가기
            </button>
            <button className="w-full text-left px-3 py-2 bg-white border border-[#5A9F7C] text-[#1F1410] rounded-lg hover:bg-[#5A9F7C]/5 transition-all text-sm">
              서로 힘들 때 바로 말하기
            </button>
          </div>
        </div>

        {/* Script Suggestion */}
        <div className="bg-[#FF6347]/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-[#FF6347]" />
            <span className="font-semibold text-[#1F1410]">대화 스크립트</span>
          </div>
          <p className="text-sm text-[#1F1410] mb-3 font-medium">이렇게 말해볼 수 있어요</p>
          <div className="bg-white rounded-lg p-3 mb-3 text-sm text-[#1F1410] leading-relaxed border border-[#FF6347]/20">
            "나도 네가 힘들었다는 거 이해해. 내가 너무 내 입장만 생각했던 것 같아. 미안해."
          </div>
          <button className="w-full py-2 border border-[#FF6347] text-[#FF6347] rounded-lg hover:bg-[#FF6347]/5 transition-all flex items-center justify-center gap-2 text-sm">
            <Copy className="w-4 h-4" />
            복사하기
          </button>
        </div>
      </div>
    </div>
  );
}
