/**
 * 두 점(A·B) + 한 가닥 실 — 제품의 핵심 메타포(AI가 두 사람을 잇는다)를 로고 마크에 박은 형태.
 * 잉크 점 2개 + 코랄 곡선 1개. 우상 점은 옵션으로 더스티블루로 바꿔도 됨.
 */

type BrandMarkProps = {
  size?: number;
  className?: string;
  /** 우측 점을 더스티블루로 (히어로 디바이더용) */
  variant?: "default" | "dual";
};

export default function BrandMark({ size = 24, className = "", variant = "default" }: BrandMarkProps) {
  const rightDotColor = variant === "dual" ? "#6F8197" : "#1A1A2E";
  const aspectRatio = 36 / 14; // viewBox 비율
  const width = size * aspectRatio;
  const height = size;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 좌측 잉크 점 */}
      <circle cx="4" cy="7" r="2.6" fill="#1A1A2E" />
      {/* 코랄 곡선 — 두 점을 잇는 실 */}
      <path
        d="M 7 7 Q 18 1.5 29 7"
        stroke="#C88579"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* 우측 점 (variant에 따라 잉크 또는 더스티블루) */}
      <circle cx="32" cy="7" r="2.6" fill={rightDotColor} />
    </svg>
  );
}
