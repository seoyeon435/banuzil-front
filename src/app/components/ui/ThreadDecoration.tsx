/**
 * 페이지 배경의 얇은 라벤더 실 곡선 — 좌하 / 우상에 절대 위치로 깔아서
 * 페이지 전체가 한 가닥의 흐름 안에 있다는 시각적 인상을 만듦.
 */

type Position = "top-right" | "bottom-left";

type ThreadDecorationProps = {
  position?: Position;
  opacity?: number;
};

export default function ThreadDecoration({
  position = "top-right",
  opacity = 0.6,
}: ThreadDecorationProps) {
  const isTopRight = position === "top-right";
  const positionStyle = isTopRight
    ? { top: "-40px", right: "-40px", transform: "rotate(0deg)" }
    : { bottom: "-40px", left: "-40px", transform: "rotate(180deg)" };

  return (
    <svg
      width="520"
      height="280"
      viewBox="0 0 520 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
        ...positionStyle,
      }}
      aria-hidden="true"
    >
      {/* 라벤더 얇은 실 곡선 — 자연스러운 흐름 */}
      <path
        d="M 0 60 C 120 20, 220 110, 320 70 S 480 140, 520 100"
        stroke="#D4D0E8"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 30 160 C 150 130, 260 200, 360 150 S 500 220, 520 200"
        stroke="#D4D0E8"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
