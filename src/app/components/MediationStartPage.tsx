import { Link } from "react-router";
import { Check } from "lucide-react";
import { useState } from "react";

const friends = [
  { id: 1, name: "지현", username: "@jihyun_bak", mbti: "INFP" },
  { id: 2, name: "원규", username: "@wongyu_j", mbti: "ISTJ" },
  { id: 3, name: "민지", username: "@minji_k", mbti: "ENFJ" },
  { id: 4, name: "서준", username: "@seojun_p", mbti: "INTP" },
];

export default function MediationStartPage() {
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center py-12">
      <div className="w-full max-w-[640px] px-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF8C7A] text-white flex items-center justify-center text-sm font-bold">
              ①
            </div>
            <span className="text-[#FF8C7A] font-medium">친구 선택</span>
          </div>
          <div className="w-8 h-[2px] bg-[#EDD9CC]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EDD9CC] text-[#8C6B5A] flex items-center justify-center text-sm font-bold">
              ②
            </div>
            <span className="text-[#8C6B5A]">상황 입력</span>
          </div>
          <div className="w-8 h-[2px] bg-[#EDD9CC]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EDD9CC] text-[#8C6B5A] flex items-center justify-center text-sm font-bold">
              ③
            </div>
            <span className="text-[#8C6B5A]">AI 중재</span>
          </div>
          <div className="w-8 h-[2px] bg-[#EDD9CC]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EDD9CC] text-[#8C6B5A] flex items-center justify-center text-sm font-bold">
              ④
            </div>
            <span className="text-[#8C6B5A]">완료</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[36px] font-semibold text-[#2C1810] text-center mb-10">
          누구와의 갈등인가요?
        </h1>

        {/* Friend Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {friends.map((friend) => {
            const isSelected = selectedFriend === friend.id;
            return (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend.id)}
                className={`
                  relative bg-white rounded-xl p-6 transition-all
                  ${isSelected
                    ? 'border-2 border-[#FF8C7A] bg-[#FF8C7A]/5'
                    : 'border-2 border-transparent hover:border-[#FF8C7A]/50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF8C7A] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white font-bold">
                    {friend.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-[#2C1810]">{friend.name}</p>
                    <p className="text-sm text-[#8C6B5A]">{friend.username}</p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-[#FF8C7A]/10 text-[#FF8C7A] text-sm rounded-full">
                  {friend.mbti}
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Friend Link */}
        <div className="text-center mb-10">
          <p className="text-[#8C6B5A] mb-2">목록에 없나요?</p>
          <Link to="/mypage/friends" className="text-[#FF8C7A] hover:text-[#E56B58] underline font-medium">
            친구 추가하기
          </Link>
        </div>

        {/* Next Button */}
        <Link
          to={selectedFriend ? "/mediation/input" : "#"}
          className={`
            block w-full h-14 rounded-full text-white text-center leading-[56px] font-medium transition-all
            ${selectedFriend
              ? 'bg-[#FF8C7A] hover:bg-[#E56B58] shadow-[0_4px_16px_rgba(255,140,122,0.2)] cursor-pointer'
              : 'bg-[#EDD9CC] text-[#8C6B5A] cursor-not-allowed'
            }
          `}
          onClick={(e) => !selectedFriend && e.preventDefault()}
        >
          다음 →
        </Link>
      </div>
    </div>
  );
}
