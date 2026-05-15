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
          "repeating-linear-gradient(to right, rgba(35,40,56,0.24) 0 4px, transparent 4px 8px)",
      }}
    />
  );
}
