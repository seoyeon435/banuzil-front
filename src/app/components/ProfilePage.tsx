import MyPageLayout from "./MyPageLayout";

export default function ProfilePage() {
  return (
    <MyPageLayout>
      <div className="max-w-[1000px]">
        <h1 className="text-[36px] font-semibold text-[#2C1810] mb-8">내 프로필</h1>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,140,122,0.12)] mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              박
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-[#2C1810]">박서연</h2>
                <button className="px-4 py-1.5 text-sm border border-[#EDD9CC] text-[#8C6B5A] rounded-lg hover:border-[#FF8C7A] hover:text-[#FF8C7A] transition-all">
                  이름 수정
                </button>
              </div>
              <p className="text-[#8C6B5A] mb-1">hello@baneujil.kr</p>
              <p className="text-sm text-[#8C6B5A]">가입일: 2024년 11월</p>
            </div>
          </div>
        </div>

        {/* MBTI and Attachment Type Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* MBTI Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,140,122,0.12)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#2C1810]">나의 MBTI</h3>
              <button className="px-4 py-1.5 text-sm border border-[#FF8C7A] text-[#FF8C7A] rounded-lg hover:bg-[#FF8C7A]/5 transition-all">
                수정하기
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block px-8 py-4 bg-[#FF8C7A]/10 rounded-2xl mb-3">
                <span className="text-5xl font-bold text-[#FF8C7A]">ENFP</span>
              </div>
              <h4 className="text-lg font-semibold text-[#2C1810] mb-2">재기발랄한 활동가</h4>
              <p className="text-sm text-[#8C6B5A]">공감 능력 높음 · 자유로운 영혼</p>
            </div>

            {/* MBTI Bars */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#2C1810] w-4">E</span>
                <div className="flex-1 h-2 bg-[#EDD9CC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF8C7A] rounded-full" style={{ width: '67%' }} />
                </div>
                <span className="text-sm font-medium text-[#8C6B5A] w-4">I</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#2C1810] w-4">N</span>
                <div className="flex-1 h-2 bg-[#EDD9CC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF8C7A] rounded-full" style={{ width: '83%' }} />
                </div>
                <span className="text-sm font-medium text-[#8C6B5A] w-4">S</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#2C1810] w-4">F</span>
                <div className="flex-1 h-2 bg-[#EDD9CC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF8C7A] rounded-full" style={{ width: '67%' }} />
                </div>
                <span className="text-sm font-medium text-[#8C6B5A] w-4">T</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#2C1810] w-4">P</span>
                <div className="flex-1 h-2 bg-[#EDD9CC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF8C7A] rounded-full" style={{ width: '50%' }} />
                </div>
                <span className="text-sm font-medium text-[#8C6B5A] w-4">J</span>
              </div>
            </div>
          </div>

          {/* Attachment Type Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,140,122,0.12)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#2C1810]">나의 애착유형</h3>
              <button className="px-4 py-1.5 text-sm border border-[#6BAF8C] text-[#6BAF8C] rounded-lg hover:bg-[#6BAF8C]/5 transition-all">
                수정하기
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block px-8 py-4 bg-[#6BAF8C]/10 rounded-2xl mb-3">
                <span className="text-5xl font-bold text-[#6BAF8C]">안정형</span>
              </div>
              <h4 className="text-lg font-semibold text-[#2C1810] mb-2">신뢰와 안정을 추구해요</h4>
              <p className="text-sm text-[#8C6B5A]">관계에서 편안함을 느끼는 편이에요</p>
            </div>

            {/* Attachment Type Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="px-4 py-2 bg-[#6BAF8C] text-white rounded-full text-sm font-medium">
                ● 안정형
              </button>
              <button className="px-4 py-2 bg-[#EDD9CC] text-[#8C6B5A] rounded-full text-sm font-medium hover:bg-[#F5E6D8] transition-all">
                ○ 불안형
              </button>
              <button className="px-4 py-2 bg-[#EDD9CC] text-[#8C6B5A] rounded-full text-sm font-medium hover:bg-[#F5E6D8] transition-all">
                ○ 회피형
              </button>
              <button className="px-4 py-2 bg-[#EDD9CC] text-[#8C6B5A] rounded-full text-sm font-medium hover:bg-[#F5E6D8] transition-all">
                ○ 혼합형
              </button>
            </div>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
}
