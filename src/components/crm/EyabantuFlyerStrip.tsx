import Link from "next/link";
import { User, Users } from "lucide-react";
import {
  COVER_GROUP_LABELS,
  EYABANTU_MAX_AGE,
  EYABANTU_WAITING_DAYS,
  formatZar,
  packagesByGroup,
  type CoverGroup,
} from "@/lib/eyabantu-packages";

type Props = {
  packagesHref?: string;
  ctaLabel?: string;
};

const PLAN_GROUPS: { key: CoverGroup; icon: typeof Users }[] = [
  { key: "SIX", icon: Users },
  { key: "TEN", icon: Users },
  { key: "SINGLE", icon: User },
];

function groupFromPrice(group: CoverGroup) {
  const plans = packagesByGroup(group);
  return Math.min(...plans.map((p) => p.monthlyPremium));
}

function groupTiers(group: CoverGroup) {
  return packagesByGroup(group)
    .map((p) => formatZar(p.monthlyPremium))
    .join(" · ");
}

/** Rate-card summary strip — pure UI, no flyer image. */
export function EyabantuFlyerStrip({
  packagesHref = "/owner/packages",
  ctaLabel = "View rate card →",
}: Props) {
  return (
    <section className="overflow-hidden eyabantu-card">
      <div className="border-b border-eyabantu-gold/20 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="eyabantu-section-header">Affordable funeral services cover</div>
            <h2 className="mt-3 text-lg font-bold text-eyabantu-navy md:text-xl">
              6 · 10 · Single person plans — Basic, Mini Dome & Platinum
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              {EYABANTU_WAITING_DAYS}-day waiting period · up to {EYABANTU_MAX_AGE} years · R2,000–R6,000 cash
              back at claim
            </p>
          </div>
          <Link
            href={packagesHref}
            className="shrink-0 rounded-full bg-eyabantu-gold px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-eyabantu-gold-light"
          >
            {ctaLabel}
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PLAN_GROUPS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="rounded-xl border-2 border-eyabantu-gold/35 bg-eyabantu-cream/60 p-4 transition hover:border-eyabantu-gold"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-eyabantu-navy text-eyabantu-gold">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="eyabantu-price-pill">from {formatZar(groupFromPrice(key))}</span>
              </div>
              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-eyabantu-navy">
                {COVER_GROUP_LABELS[key]}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">{groupTiers(key)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-eyabantu-navy px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-white/90">
        <span>Extra people: Casket R50 · Mini Dome R75 · Platinum R100</span>
        <span className="text-eyabantu-gold">033 413 1188 · funerals@eyabantu.co.za</span>
      </div>
    </section>
  );
}
