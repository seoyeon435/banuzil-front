import { Link } from "react-router";
import { useEffect, useState } from "react";
import MyPageLayout from "./MyPageLayout";
import StitchDivider from "./ui/StitchDivider";
import { getCurrentDisplayUser } from "../utils/displayUser";
import {
  fetchFullUserProfile,
  getProfileEditErrorMessage,
  updateProfile,
  type UserProfile,
} from "../../api/userApi";
import { getAttachmentLabel } from "../../api/attachmentApi";

const MBTI_OPTIONS = [
  "", "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

export default function ProfilePage() {
  const fallbackUser = getCurrentDisplayUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchFullUserProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const nickname = profile?.nickname || fallbackUser.nickname;
  const email = profile?.email || fallbackUser.email || "이메일 정보 없음";
  const initial = (nickname.slice(0, 1) || "?").toUpperCase();
  const mbti = profile?.mbti || "—";
  const attachmentTypeLabel = profile?.attachmentType
    ? getAttachmentLabel(profile.attachmentType)
    : "검사 전";
  const attachmentDescription = profile?.attachmentTypeDescription || "애착 유형 검사를 완료하면 표시돼요";
  const joinDate = profile?.joinDate
    ? new Date(profile.joinDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
      })
    : "—";

  return (
    <MyPageLayout>
      <div className="max-w-[1000px] min-w-0 [word-break:keep-all]">
        <h1 className="text-[32px] sm:text-[36px] font-semibold text-[#1F1410] mb-8">내 프로필</h1>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 min-w-0">
            <div className="w-20 h-20 rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] flex items-center justify-center text-[#1F1410] text-3xl font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 min-w-0">
                <h2 className="text-2xl font-semibold text-[#1F1410] break-words">{nickname}</h2>
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-4 py-1.5 text-sm border border-[#F0DFD0] text-[#7A5C4D] rounded-lg hover:border-[#FF6347] hover:text-[#FF6347] transition-all"
                >
                  프로필 수정
                </button>
              </div>
              <p className="text-[#7A5C4D] mb-1 break-all">{email}</p>
              <p className="text-sm text-[#7A5C4D]">가입일: {joinDate}</p>
              {profile?.friendCode && (
                <p className="text-sm text-[#7A5C4D] mt-1">
                  내 친구코드: <span className="font-medium text-[#FF6347]">{profile.friendCode}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <StitchDivider className="my-2" />

        {/* Attachment Type (primary) and MBTI (secondary) Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Attachment Type Card — 핵심 분석 기준 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-l-4 border-l-[#5A9F7C] transition-all duration-300 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h3 className="text-xl font-semibold text-[#1F1410]">나의 애착유형</h3>
              <Link to="/signup/attachment-survey" className="px-4 py-1.5 text-sm border border-[#5A9F7C] text-[#5A9F7C] rounded-lg hover:bg-[#5A9F7C]/5 transition-all">
                {profile?.attachmentType ? "재검사" : "검사하기"}
              </Link>
            </div>
            <p className="text-xs text-[#5A9F7C] mb-5">핵심 갈등 분석 기준 · EFT 상담 흐름 적용</p>

            <div className="text-center mb-6">
              <div className="inline-block px-8 py-4 bg-[#5A9F7C]/10 rounded-2xl mb-3">
                <span className="text-4xl sm:text-5xl font-bold text-[#5A9F7C]">{attachmentTypeLabel}</span>
              </div>
              <p className="text-sm text-[#7A5C4D]">{attachmentDescription}</p>
            </div>
          </div>

          {/* MBTI Card — 선택 보조 정보 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-l border-l-[#F0DFD0] hover:border-l-4 transition-all duration-300 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h3 className="text-xl font-semibold text-[#1F1410]">나의 MBTI</h3>
              <button
                onClick={() => setEditOpen(true)}
                className="px-4 py-1.5 text-sm border border-[#F0DFD0] text-[#7A5C4D] rounded-lg hover:border-[#FF6347] hover:text-[#FF6347] transition-all"
              >
                수정하기
              </button>
            </div>
            <p className="text-xs text-[#7A5C4D] mb-5">선택 보조 정보 · 분석에 참고용으로 활용</p>

            <div className="text-center mb-6">
              <div className="inline-block px-8 py-4 bg-[#F0DFD0] rounded-2xl mb-3">
                <span className="text-4xl sm:text-5xl font-bold text-[#7A5C4D]">{mbti}</span>
              </div>
              <p className="text-sm text-[#7A5C4D]">
                {profile?.gender ? `성별: ${profile.gender}` : "회원가입 정보 기반"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          initial={profile}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => {
            setProfile(updated);
            setEditOpen(false);
          }}
        />
      )}
    </MyPageLayout>
  );
}

function EditProfileModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: UserProfile | null;
  onClose: () => void;
  onSaved: (next: UserProfile) => void;
}) {
  const [nickname, setNickname] = useState(initial?.nickname ?? "");
  const [gender, setGender] = useState(initial?.gender ?? "");
  const [mbti, setMbti] = useState(initial?.mbti ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSave = nickname.trim().length > 0 && !submitting;

  const handleSave = async () => {
    if (!canSave) return;
    setErrorMessage("");
    setSubmitting(true);
    try {
      const updated = await updateProfile({
        nickname: nickname.trim(),
        gender,
        mbti,
      });
      onSaved(updated);
    } catch (error) {
      setErrorMessage(getProfileEditErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-[440px] w-full p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-[#1F1410] mb-6">프로필 수정</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F1410] mb-2">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-11 px-4 border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F1410] mb-2">성별</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`h-11 rounded-xl border-2 transition-all text-sm font-medium ${
                  gender === "female"
                    ? "border-[#FF6347] bg-[#FF6347]/10 text-[#FF6347]"
                    : "border-[#F0DFD0] text-[#7A5C4D]"
                }`}
              >
                여성
              </button>
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`h-11 rounded-xl border-2 transition-all text-sm font-medium ${
                  gender === "male"
                    ? "border-[#5A9F7C] bg-[#5A9F7C]/10 text-[#5A9F7C]"
                    : "border-[#F0DFD0] text-[#7A5C4D]"
                }`}
              >
                남성
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F1410] mb-2">MBTI</label>
            <select
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              className="w-full h-11 px-4 border border-[#F0DFD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6347]"
            >
              {MBTI_OPTIONS.map((type) => (
                <option key={type || "none"} value={type}>
                  {type || "선택 안 함"}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && (
            <p className="text-sm text-[#DC3545] bg-[#FFE0E0] rounded-lg px-4 py-3">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 h-11 rounded-full border-2 border-[#F0DFD0] text-[#7A5C4D] font-medium hover:bg-[#FFE0CC] transition-all disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex-1 h-11 rounded-full font-medium transition-all ${
              canSave
                ? "bg-[#FF6347] text-white hover:bg-[#E84028]"
                : "bg-[#F0DFD0] text-[#7A5C4D] cursor-not-allowed"
            }`}
          >
            {submitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
