import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDisplayNames } from "../utils/useDisplayNames";
import BrandMark from "./ui/BrandMark";

export default function MediationAnalyzingPage() {
  const navigate = useNavigate();
  const { currentName, partnerName } = useDisplayNames();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const statusMessages = [
    `${currentName}님의 감정 패턴 분석 중...`,
    `${partnerName}님의 입장 이해 중...`,
    "애착유형 기반 감정 욕구 파악 중...",
    "EFT 흐름에 따라 중재 방식 준비 중...",
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => navigate("/mediation/result"), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    // Message cycling
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % statusMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-[#1A1A2E]/10 blur-3xl animate-pulse" />
      </div>

      {/* Center Animation */}
      <div className="relative z-10 mb-12">
        <div className="relative flex items-center justify-center">
          {/* Outer Glow */}
          <div className="absolute w-48 h-48 rounded-full bg-[#1A1A2E]/20 blur-xl animate-pulse" />

          {/* Middle Glow */}
          <div className="absolute w-32 h-32 rounded-full bg-[#1A1A2E]/40 animate-ping" style={{ animationDuration: '2s' }} />

          {/* Icon */}
          <div className="relative z-10"><BrandMark size={72} /></div>
        </div>
      </div>

      {/* Main Text */}
      <h1 className="text-[28px] font-semibold text-white mb-12 text-center">
        두 사람의 이야기를 읽고 있어요...
      </h1>

      {/* Status Messages */}
      <div className="min-h-[80px] mb-12">
        {statusMessages.map((message, index) => (
          <p
            key={index}
            className={`
              text-lg text-white/80 text-center transition-all duration-500
              ${index === currentMessage
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 absolute translate-y-4'
              }
            `}
          >
            {message}
          </p>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1A1A2E] to-[#0F0F1F] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-white/60 text-sm mt-3">{progress}%</p>
      </div>
    </div>
  );
}
