export type MediationStep = "start" | "input" | "waiting" | "analysis" | "complete";

const STEPS: { key: MediationStep; label: string }[] = [
  { key: "start",    label: "갈등 시작" },
  { key: "input",    label: "나의 입장 입력" },
  { key: "waiting",  label: "상대방 대기" },
  { key: "analysis", label: "AI 분석" },
  { key: "complete", label: "완료" },
];

interface Props {
  currentStep: MediationStep;
}

export default function MediationProgressHeader({ currentStep }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-[#FFF8F4] px-6 py-5">
      <div className="max-w-[900px] mx-auto">
        <div className="grid grid-cols-5 gap-3">
          {STEPS.map((step, i) => {
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <div
                key={step.key}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#FF6347] text-white shadow-[0_4px_12px_rgba(255,99,71,0.3)]"
                    : isDone
                    ? "bg-[#E0F4E8] text-[#5A9F7C]"
                    : "bg-[#F0DFD0] text-[#7A5C4D]"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isActive
                      ? "bg-white/25"
                      : isDone
                      ? "bg-[#5A9F7C]/20"
                      : "bg-[#7A5C4D]/15"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="text-xs whitespace-nowrap">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
