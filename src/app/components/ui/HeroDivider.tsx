/**
 * Hero 영역의 시그니처 미니 그래픽 — 더스티블루 점 · 잉크색 실 곡선 · 코랄 점.
 * 페이지의 시각적 심볼이자 발표 슬라이드에서 그대로 가져갈 수 있는 마크.
 */

type HeroDividerProps = {
  width?: number;
  className?: string;
};

export default function HeroDivider({ width = 240, className = "" }: HeroDividerProps) {
  const aspectRatio = 240 / 22;
  const height = width / aspectRatio;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 좌측 더스티블루 점 (A) */}
      <circle cx="6" cy="11" r="4" fill="#6F8197" />
      {/* 잉크색 실 곡선 — 두 점을 잇는 자연스러운 한 가닥 */}
      <path
        d="M 12 11 Q 80 -2 120 11 T 228 11"
        stroke="#1A1A2E"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      {/* 우측 코랄 점 (B) */}
      <circle cx="234" cy="11" r="4" fill="#C88579" />
    </svg>
  );
}
