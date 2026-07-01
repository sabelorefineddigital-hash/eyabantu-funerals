export function LogoMark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.85" />
      <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 32 + Math.cos(angle) * 20;
        const y1 = 32 + Math.sin(angle) * 20;
        const x2 = 32 + Math.cos(angle) * 26;
        const y2 = 32 + Math.sin(angle) * 26;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <circle cx={x2} cy={y2} r="2.5" fill="currentColor" opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}
