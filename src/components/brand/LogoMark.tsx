export function LogoMark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="7" fill="currentColor" opacity="0.9" />
      <circle cx="32" cy="32" r="11.5" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
      <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = ((i * 30 - 90) * Math.PI) / 180;
        const bx = 32 + Math.cos(angle) * 16;
        const by = 32 + Math.sin(angle) * 16;
        const tx = 32 + Math.cos(angle) * 21;
        const ty = 32 + Math.sin(angle) * 21;
        const hx = 32 + Math.cos(angle) * 24.5;
        const hy = 32 + Math.sin(angle) * 24.5;
        return (
          <g key={i} opacity="0.85">
            <line x1={bx} y1={by} x2={tx} y2={ty} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={hx} cy={hy} r="2.2" fill="currentColor" />
            <path
              d={`M ${tx - 1.8} ${ty + 1.2} Q ${hx} ${hy + 2.8} ${tx + 1.8} ${ty + 1.2} Z`}
              fill="currentColor"
              opacity="0.8"
            />
          </g>
        );
      })}
    </svg>
  );
}
