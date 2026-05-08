import MyPageLayout from "./MyPageLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Thermometer, CheckCircle, AlertTriangle } from "lucide-react";

const monthlyData = [
  { month: "11월", count: 1 },
  { month: "12월", count: 2 },
  { month: "1월", count: 3 },
  { month: "2월", count: 2 },
  { month: "3월", count: 2 },
  { month: "4월", count: 2 },
];

const conflictTypeData = [
  { name: "연락문제", value: 35, color: "#FF6347" },
  { name: "가치관차이", value: 25, color: "#D4956A" },
  { name: "약속파기", value: 20, color: "#5A9F7C" },
  { name: "데이트비용", value: 12, color: "#B794F4" },
  { name: "기타", value: 8, color: "#FFE0CC" },
];

export default function StatisticsPage() {
  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[36px] font-semibold text-[#1F1410]">갈등 통계</h1>
          <select className="px-4 py-2 bg-white border border-[#F0DFD0] rounded-lg text-[#1F1410] focus:outline-none focus:ring-2 focus:ring-[#FF6347]">
            <option>최근 6개월</option>
            <option>최근 1년</option>
            <option>전체 기간</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Conflicts */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#7A5C4D]">총 갈등 횟수</span>
              <TrendingUp className="w-5 h-5 text-[#FF6347]" />
            </div>
            <div className="text-4xl font-bold text-[#1F1410] mb-2">12회</div>
            <div className="flex items-center gap-1 text-sm text-[#DC3545]">
              <span>↑</span>
              <span>전월 대비 2회 증가</span>
            </div>
          </div>

          {/* Average Temperature */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#7A5C4D]">평균 갈등 온도</span>
              <Thermometer className="w-5 h-5 text-[#D4956A]" />
            </div>
            <div className="text-4xl font-bold text-[#1F1410] mb-2">58°</div>
            <div className="flex items-center gap-1 text-sm text-[#D4956A]">
              <span>🌡️</span>
              <span>보통</span>
            </div>
          </div>

          {/* Agreement Rate */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,99,71,0.17)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#7A5C4D]">합의율</span>
              <CheckCircle className="w-5 h-5 text-[#5A9F7C]" />
            </div>
            <div className="text-4xl font-bold text-[#1F1410] mb-2">75%</div>
            <div className="flex items-center gap-1 text-sm text-[#5A9F7C]">
              <span>✓</span>
              <span>양호</span>
            </div>
          </div>
        </div>

        {/* Monthly Conflicts Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          <h2 className="text-xl font-semibold text-[#1F1410] mb-6">월별 갈등 횟수</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0DFD0" />
              <XAxis dataKey="month" stroke="#7A5C4D" />
              <YAxis stroke="#7A5C4D" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F0DFD0",
                  borderRadius: "8px",
                  color: "#1F1410",
                }}
                cursor={{ fill: "#FF634710" }}
              />
              <Bar dataKey="count" fill="#FF6347" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conflict Type Distribution */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(255,99,71,0.17)] mb-6">
          <h2 className="text-xl font-semibold text-[#1F1410] mb-6">갈등 유형 분포</h2>
          <div className="flex items-center gap-12">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={280} height={280}>
                <PieChart>
                  <Pie
                    data={conflictTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {conflictTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-48">
                <div className="text-sm text-[#7A5C4D]">총</div>
                <div className="text-2xl font-bold text-[#1F1410]">12회</div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {conflictTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#1F1410]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-[#1F1410]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Alert */}
        <div className="bg-[#FFE9DD] border border-[#FFD19A] rounded-2xl p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-[#D4956A] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-[#1F1410] mb-1">
              연락문제 갈등이 3개월 연속 반복되고 있어요
            </h3>
            <p className="text-[#7A5C4D]">
              같은 유형의 갈등이 반복될 때 근본 원인을 살펴보는 게 좋아요
            </p>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
}
