import MyPageLayout from "./MyPageLayout";
import StitchDivider from "./ui/StitchDivider";

export default function ProfilePage() {
  return (
    <MyPageLayout>
      <div className="max-w-[1000px]">
        <h1 className="text-[36px] font-semibold text-[#1F1410] mb-8">내 프로필</h1>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-3xl font-bold flex-shrink-0">
              여
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-[#1F1410]">여자친구</h2>
                <button className="px-4 py-1.5 text-sm border border-[#F0DFD0] text-[#7A5C4D] rounded-lg hover:border-[#FF6347] hover:text-[#FF6347] transition-all">
                  이름 수정
                </button>
              </div>
              <p className="text-[#7A5C4D] mb-1">hello@baneujil.kr</p>
              <p className="text-sm text-[#7A5C4D]">가입일: 2024년 11월</p>
            </div>
          </div>
        </div>

        <StitchDivider className="my-2" />

        {/* Attachment Type (primary) and MBTI (secondary) Cards */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Attachment Type Card — 핵심 분석 기준 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-l-4 border-l-[#5A9F7C] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-[#1F1410]">나의 애착유형</h3>
              <button className="px-4 py-1.5 text-sm border border-[#5A9F7C] text-[#5A9F7C] rounded-lg hover:bg-[#5A9F7C]/5 transition-all">
                수정하기
              </button>
            </div>
            <p className="text-xs text-[#5A9F7C] mb-5">핵심 갈등 분석 기준 · EFT 상담 흐름 적용</p>

            <div className="text-center mb-6">
              <div className="inline-block px-8 py-4 bg-[#5A9F7C]/10 rounded-2xl mb-3">
                <span className="text-5xl font-bold text-[#5A9F7C]">안정형</span>
              </div>
              <h4 className="text-lg font-semibold text-[#1F1410] mb-2">신뢰와 안정을 추구해요</h4>
              <p className="text-sm text-[#7A5C4D]">관계에서 편안함을 느끼는 편이에요</p>
            </div>

            {/* Attachment Type Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="px-4 py-2 bg-[#5A9F7C] text-white rounded-full text-sm font-medium">
                ● 안정형
              </button>
              <button className="px-4 py-2 bg-[#F0DFD0] text-[#7A5C4D] rounded-full text-sm font-medium hover:bg-[#FFE0CC] transition-all">
                ○ 불안형
              </button>
              <button className="px-4 py-2 bg-[#F0DFD0] text-[#7A5C4D] rounded-full text-sm font-medium hover:bg-[#FFE0CC] transition-all">
                ○ 회피형
              </button>
              <button className="px-4 py-2 bg-[#F0DFD0] text-[#7A5C4D] rounded-full text-sm font-medium hover:bg-[#FFE0CC] transition-all">
                ○ 혼합형
              </button>
            </div>
          </div>

          {/* MBTI Card — 선택 보조 정보 */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-l border-l-[#F0DFD0] hover:border-l-4 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-[#1F1410]">나의 MBTI</h3>
              <button className="px-4 py-1.5 text-sm border border-[#F0DFD0] text-[#7A5C4D] rounded-lg hover:border-[#FF6347] hover:text-[#FF6347] transition-all">
                수정하기
              </button>
            </div>
            <p className="text-xs text-[#7A5C4D] mb-5">선택 보조 정보 · 분석에 참고용으로 활용</p>

            <div className="text-center mb-6">
              <div className="inline-block px-8 py-4 bg-[#F0DFD0] rounded-2xl mb-3">
                <span className="text-5xl font-bold text-[#7A5C4D]">ENFP</span>
              </div>
              <h4 className="text-lg font-semibold text-[#1F1410] mb-2">재기발랄한 활동가</h4>
              <p className="text-sm text-[#7A5C4D]">공감 능력 높음 · 자유로운 영혼</p>
            </div>

            {/* MBTI Bars */}
            <div className="space-y-3">
              {[
                { left: "E", right: "I", pct: 67 },
                { left: "N", right: "S", pct: 83 },
                { left: "F", right: "T", pct: 67 },
                { left: "P", right: "J", pct: 50 },
              ].map(({ left, right, pct }) => (
                <div key={left} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1F1410] w-4">{left}</span>
                  <div className="flex-1 h-2 bg-[#F0DFD0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4956A] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-[#7A5C4D] w-4">{right}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
}
