import type { CasketTier, EyabantuPackage } from "@/lib/eyabantu-packages";
import { Users, User, UserPlus } from "lucide-react";

const accentStyles = {
  wood: {
    ring: "ring-amber-700/25",
    bg: "from-amber-900/90 via-amber-800 to-amber-950",
    badge: "bg-amber-100 text-amber-950",
    price: "text-[#f18a00]",
  },
  silver: {
    ring: "ring-slate-400/40",
    bg: "from-slate-300 via-slate-200 to-slate-400",
    badge: "bg-slate-100 text-slate-800",
    price: "text-[#142a55]",
  },
  gold: {
    ring: "ring-yellow-500/35",
    bg: "from-yellow-500 via-amber-400 to-yellow-600",
    badge: "bg-yellow-50 text-yellow-900",
    price: "text-[#c47f00]",
  },
  navy: {
    ring: "ring-[#142a55]/25",
    bg: "from-[#142a55] to-[#0f1f45]",
    badge: "bg-[#142a55]/10 text-[#142a55]",
    price: "text-[#142a55]",
  },
} as const;

function CasketSvg({ tier, className = "h-16 w-20" }: { tier: CasketTier | null; className?: string }) {
  if (tier === "BASIC") {
    return (
      <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden>
        <path d="M8 28 L40 14 L72 28 L72 38 L8 38 Z" fill="#5c3d2e" stroke="#3d2819" strokeWidth="1.5" />
        <path d="M12 28 L40 18 L68 28" stroke="#8b6914" strokeWidth="2" opacity="0.6" />
        <rect x="34" y="22" width="12" height="8" rx="1" fill="#3d2819" opacity="0.5" />
        <ellipse cx="40" cy="38" rx="32" ry="3" fill="#000" opacity="0.15" />
      </svg>
    );
  }
  if (tier === "MINI_DOME") {
    return (
      <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden>
        <path d="M10 30 L40 12 L70 30 L70 38 L10 38 Z" fill="url(#silverGrad)" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M22 30 Q40 8 58 30" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
        <defs>
          <linearGradient id="silverGrad" x1="10" y1="20" x2="70" y2="38">
            <stop stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <ellipse cx="40" cy="38" rx="30" ry="3" fill="#000" opacity="0.12" />
      </svg>
    );
  }
  if (tier === "PLATINUM_DOME") {
    return (
      <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden>
        <path d="M10 30 L40 12 L70 30 L70 38 L10 38 Z" fill="url(#goldGrad)" stroke="#b45309" strokeWidth="1.5" />
        <path d="M22 30 Q40 8 58 30" fill="url(#goldDome)" stroke="#d97706" strokeWidth="1.5" />
        <defs>
          <linearGradient id="goldGrad" x1="10" y1="20" x2="70" y2="38">
            <stop stopColor="#fde68a" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="goldDome" x1="22" y1="8" x2="58" y2="30">
            <stop stopColor="#fef3c7" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <ellipse cx="40" cy="38" rx="30" ry="3" fill="#000" opacity="0.12" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden>
      <circle cx="40" cy="22" r="12" fill="#142a55" opacity="0.12" />
      <circle cx="40" cy="18" r="5" fill="#142a55" opacity="0.35" />
      <path d="M28 32 h24 M34 28 v8 M46 28 v8" stroke="#142a55" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="40" cy="38" rx="28" ry="3" fill="#000" opacity="0.08" />
    </svg>
  );
}

function CoverIcon({ pkg }: { pkg: EyabantuPackage }) {
  if (pkg.kind === "ADDON") {
    return <UserPlus className="h-5 w-5 text-[#142a55]" aria-hidden />;
  }
  if (pkg.coverGroup === "SINGLE") {
    return <User className="h-5 w-5 text-[#142a55]" aria-hidden />;
  }
  return <Users className="h-5 w-5 text-[#142a55]" aria-hidden />;
}

type PackageCardProps = {
  pkg: EyabantuPackage;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
};

export function PackageCard({ pkg, selected, onSelect, compact }: PackageCardProps) {
  const styles = accentStyles[pkg.accent];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border-2 bg-white text-left shadow-sm transition hover:shadow-md ${
        selected ? `border-[#f18a00] ring-2 ring-[#f18a00]/30` : "border-slate-200 hover:border-[#142a55]/25"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className={`flex items-start justify-between gap-2 ${compact ? "" : "mb-3"}`}>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}>
          <CoverIcon pkg={pkg} />
          {pkg.kind === "ADDON" ? "Add-on" : pkg.coverCount ? `${pkg.coverCount} lives` : "Plan"}
        </span>
        <span className={`text-lg font-extrabold ${styles.price}`}>R{pkg.monthlyPremium}</span>
      </div>

      <div className={`flex items-center gap-3 ${compact ? "mt-2" : "mt-1"}`}>
        <div className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br p-2 ${styles.bg} ${styles.ring} ring-1`}>
          <CasketSvg tier={pkg.tier} className={compact ? "h-10 w-14" : "h-12 w-16"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-bold leading-snug text-[#142a55] ${compact ? "text-xs" : "text-sm"}`}>{pkg.title}</p>
          {!compact ? <p className="mt-0.5 text-[11px] text-slate-500">{pkg.subtitle}</p> : null}
        </div>
      </div>

      {!compact && pkg.cashBack ? (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-[10px] leading-relaxed text-slate-600">
          {pkg.benefits.slice(0, 3).map((b) => (
            <li key={b} className="flex gap-1.5">
              <span className="text-[#f18a00]">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {pkg.waitingDays}-day waiting · up to {pkg.maxAge} yrs
      </p>
    </button>
  );
}

export function CasketIllustration({ tier, className }: { tier: CasketTier | null; className?: string }) {
  return <CasketSvg tier={tier} className={className ?? "h-16 w-20"} />;
}
