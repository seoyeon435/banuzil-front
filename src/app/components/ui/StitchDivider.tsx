type StitchDividerProps = {
  className?: string;
};

export default function StitchDivider({ className = "" }: StitchDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`h-px w-full ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(255,99,71,0.4) 0 4px, transparent 4px 8px)",
      }}
    />
  );
}
