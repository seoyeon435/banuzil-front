import MyPageLayout from "./MyPageLayout";
import { Bell, Lock, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <MyPageLayout>
      <div className="max-w-[800px]">
        <h1 className="text-[36px] font-semibold text-[#1F1410] mb-8">설정</h1>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-[#FF6347]" />
            <h2 className="text-xl font-semibold text-[#1F1410]">알림 설정</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[#1F1410] font-medium">친구 신청 알림</p>
                <p className="text-sm text-[#7A5C4D]">새로운 친구 신청이 왔을 때 알림을 받아요</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#F0DFD0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6347]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6347]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#F0DFD0]">
              <div>
                <p className="text-[#1F1410] font-medium">갈등 중재 완료 알림</p>
                <p className="text-sm text-[#7A5C4D]">중재가 완료되면 알림을 받아요</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#F0DFD0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6347]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6347]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#F0DFD0]">
              <div>
                <p className="text-[#1F1410] font-medium">마케팅 알림</p>
                <p className="text-sm text-[#7A5C4D]">이벤트 및 새로운 기능 소식을 받아요</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[#F0DFD0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6347]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6347]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-[#FF6347]" />
            <h2 className="text-xl font-semibold text-[#1F1410]">보안 설정</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full text-left py-3 hover:text-[#FF6347] transition-colors">
              <p className="text-[#1F1410] font-medium">비밀번호 변경</p>
              <p className="text-sm text-[#7A5C4D]">계정 비밀번호를 변경할 수 있어요</p>
            </button>

            <button className="w-full text-left py-3 border-t border-[#F0DFD0] hover:text-[#FF6347] transition-colors">
              <p className="text-[#1F1410] font-medium">이메일 변경</p>
              <p className="text-sm text-[#7A5C4D]">로그인에 사용하는 이메일을 변경할 수 있어요</p>
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[#FF6347]" />
            <h2 className="text-xl font-semibold text-[#1F1410]">개인정보 설정</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full text-left py-3 hover:text-[#FF6347] transition-colors">
              <p className="text-[#1F1410] font-medium">개인정보 다운로드</p>
              <p className="text-sm text-[#7A5C4D]">내 모든 데이터를 다운로드할 수 있어요</p>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] border-2 border-[#FFE0E0]">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-6 h-6 text-[#DC3545]" />
            <h2 className="text-xl font-semibold text-[#DC3545]">위험 영역</h2>
          </div>

          <button className="w-full text-left py-3 hover:opacity-80 transition-opacity">
            <p className="text-[#DC3545] font-medium">계정 삭제</p>
            <p className="text-sm text-[#7A5C4D]">
              계정과 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </button>
        </div>
      </div>
    </MyPageLayout>
  );
}
