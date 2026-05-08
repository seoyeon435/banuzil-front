import MyPageLayout from "./MyPageLayout";
import { Search, AtSign, MoreVertical, UserPlus, Check, X } from "lucide-react";
import { useState } from "react";

const friendRequests = [
  { id: 1, name: "정원규", username: "@wongyu_j", mbti: "ISTJ" },
  { id: 2, name: "김민수", username: "@minsu_k", mbti: "ENFJ" },
];

const friends = [
  { id: 1, name: "지현", username: "@jihyun_bak", mbti: "INFP", lastConflict: "3일 전", count: 3 },
  { id: 2, name: "원규", username: "@wongyu_j", mbti: "ISTJ", lastConflict: "2주 전", count: 5 },
  { id: 3, name: "민지", username: "@minji_k", mbti: "ENFJ", lastConflict: "1개월 전", count: 1 },
  { id: 4, name: "서준", username: "@seojun_p", mbti: "INTP", lastConflict: "2개월 전", count: 2 },
  { id: 5, name: "하은", username: "@haeun_l", mbti: "ISFJ", lastConflict: "3개월 전", count: 4 },
];

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        <h1 className="text-[36px] font-semibold text-[#2C1810] mb-8">친구 관리</h1>

        {/* Add Friend Section */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,140,122,0.12)] mb-8">
          <h2 className="text-xl font-semibold text-[#2C1810] mb-2">친구 추가</h2>
          <p className="text-sm text-[#8C6B5A] mb-6">
            상대방의 바느질 아이디로 친구 신청을 보내요
          </p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C6B5A]" />
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                className="w-full h-12 pl-12 pr-4 bg-white border border-[#EDD9CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C7A] focus:border-transparent transition-all"
              />
            </div>
            <button className="px-8 h-12 bg-[#FF8C7A] text-white rounded-full hover:bg-[#E56B58] transition-all">
              친구 신청
            </button>
          </div>

          {/* Search Result Example */}
          <div className="mt-4 p-4 bg-[#F5E6D8] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white font-bold">
                이
              </div>
              <div>
                <p className="text-[#2C1810] font-medium">이지수 (@jisoo_lee)</p>
                <span className="inline-block px-2 py-0.5 bg-[#FF8C7A]/10 text-[#FF8C7A] text-xs rounded-full mt-0.5">
                  INFJ
                </span>
              </div>
            </div>
            <button className="px-6 py-2 bg-[#FF8C7A] text-white rounded-full hover:bg-[#E56B58] transition-all text-sm">
              친구 신청 보내기
            </button>
          </div>
        </div>

        {/* Friend Requests Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-[#2C1810]">받은 친구 신청</h2>
            <span className="px-2.5 py-0.5 bg-[#FF8C7A] text-white text-sm rounded-full">
              {friendRequests.length}
            </span>
          </div>

          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,140,122,0.12)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white font-bold">
                    {request.name[0]}
                  </div>
                  <div>
                    <p className="text-[#2C1810] font-medium">{request.username}</p>
                    <p className="text-sm text-[#8C6B5A]">
                      {request.name}님이 친구 신청을 보냈어요
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-6 py-2 bg-[#FF8C7A] text-white rounded-full hover:bg-[#E56B58] transition-all flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    수락
                  </button>
                  <button className="px-6 py-2 border border-[#EDD9CC] text-[#8C6B5A] rounded-full hover:bg-[#F5E6D8] transition-all flex items-center gap-2">
                    <X className="w-4 h-4" />
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-[#2C1810]">친구 목록</h2>
              <span className="text-[#8C6B5A]">{friends.length}명</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C6B5A]" />
            <input
              type="text"
              placeholder="친구 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-[#EDD9CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C7A] focus:border-transparent transition-all"
            />
          </div>

          {/* Friends Table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(255,140,122,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5E6D8] border-b border-[#EDD9CC]">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#8C6B5A]">프로필</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#8C6B5A]">MBTI</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#8C6B5A]">마지막 갈등</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#8C6B5A]">갈등 횟수</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-[#8C6B5A]">액션</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {friends.map((friend) => (
                    <tr key={friend.id} className="border-b border-[#EDD9CC] last:border-b-0 hover:bg-[#FFF8F4] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C7A] to-[#E56B58] flex items-center justify-center text-white font-bold">
                            {friend.name[0]}
                          </div>
                          <div>
                            <p className="text-[#2C1810] font-medium">{friend.name}</p>
                            <p className="text-sm text-[#8C6B5A]">{friend.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 bg-[#FF8C7A]/10 text-[#FF8C7A] text-sm rounded-full">
                          {friend.mbti}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#8C6B5A]">{friend.lastConflict}</td>
                      <td className="py-4 px-6 text-[#2C1810] font-medium">{friend.count}회</td>
                      <td className="py-4 px-6">
                        <button className="px-4 py-1.5 border border-[#FF8C7A] text-[#FF8C7A] rounded-lg hover:bg-[#FF8C7A]/5 transition-all text-sm">
                          중재 시작
                        </button>
                      </td>
                      <td className="py-4 px-6 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === friend.id ? null : friend.id)}
                          className="p-1 hover:bg-[#F5E6D8] rounded transition-all"
                        >
                          <MoreVertical className="w-5 h-5 text-[#8C6B5A]" />
                        </button>
                        {openMenuId === friend.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-[#EDD9CC] rounded-lg shadow-lg py-2 w-40 z-10">
                            <button className="w-full text-left px-4 py-2 hover:bg-[#F5E6D8] text-[#2C1810] text-sm">
                              친구 정보 보기
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-[#F5E6D8] text-[#2C1810] text-sm">
                              갈등 기록 보기
                            </button>
                            <div className="border-t border-[#EDD9CC] my-1" />
                            <button className="w-full text-left px-4 py-2 hover:bg-[#FFE6E6] text-[#E57373] text-sm">
                              친구 삭제
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
}
