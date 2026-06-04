import { useEffect, useState } from "react";
import MyPageLayout from "./MyPageLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, CheckCircle } from "lucide-react";
import { fetchMyPageStats, type MyPageStats } from "../../api/userApi";

function formatMonth(yyyyMM: string): string {
  const [, month] = yyyyMM.split("-");
  return `${parseInt(month, 10)}월`;
}

function agreementLabel(rate: number): { text: string; color: string } {
  if (rate >= 70) return { text: "양호", color: "#5A9F7C" };
  if (rate >= 40) return { text: "보통", color: "#6F8197" };
  return { text: "노력 필요", color: "#DC3545" };
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<MyPageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyPageStats()
      .then(setStats)
      .catch(() => setError("통계를 불러오지 못했어요. 잠시 후 다시 시도해주세요."))
      .finally(() => setIsLoading(false));
  }, []);

  const chartData = (stats?.monthlyConflictCounts ?? [])
    .slice()
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((item) => ({ month: formatMonth(item.month), count: item.count }));

  const agreement = agreementLabel(stats?.agreementRate ?? 0);

  return (
    <MyPageLayout>
      <div className="max-w-[1100px]">
        <div className="mb-8">
          <h1 className="text-[36px] font-semibold text-[#1A1A2E]">갈등 통계</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-[#6F7787]">
            통계를 불러오는 중입니다...
          </div>
        ) : error ? (
          <div className="bg-[#FFF3F3] border border-[#DC3545]/20 rounded-xl p-6 text-sm text-[#DC3545]">
            {error}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(35,40,56,0.102)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#6F7787]">총 갈등 횟수</span>
                  <TrendingUp className="w-5 h-5 text-[#1A1A2E]" />
                </div>
                <div className="text-4xl font-bold text-[#1A1A2E]">
                  {stats?.totalConflictCount ?? 0}회
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(35,40,56,0.102)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#6F7787]">합의율</span>
                  <CheckCircle className="w-5 h-5 text-[#5A9F7C]" />
                </div>
                <div className="text-4xl font-bold text-[#1A1A2E] mb-2">
                  {stats?.agreementRate ?? 0}%
                </div>
                <div className="flex items-center gap-1 text-sm" style={{ color: agreement.color }}>
                  <span>✓</span>
                  <span>{agreement.text}</span>
                </div>
              </div>
            </div>

            {/* Monthly Conflicts Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(35,40,56,0.102)]">
              <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6">월별 갈등 횟수</h2>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm text-[#6F7787]">
                  아직 기록된 갈등이 없어요.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DC" />
                    <XAxis dataKey="month" stroke="#6F7787" />
                    <YAxis stroke="#6F7787" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E2DC",
                        borderRadius: "8px",
                        color: "#1A1A2E",
                      }}
                      cursor={{ fill: "#1A1A2E10" }}
                      formatter={(value: number) => [`${value}회`, "갈등 횟수"]}
                    />
                    <Bar dataKey="count" fill="#1A1A2E" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </MyPageLayout>
  );
}
