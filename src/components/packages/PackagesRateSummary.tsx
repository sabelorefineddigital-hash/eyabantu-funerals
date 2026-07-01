import { User, Users } from "lucide-react";
import {
  COVER_GROUP_LABELS,
  EYABANTU_MAX_AGE,
  EYABANTU_WAITING_DAYS,
  addonPackages,
  formatZar,
  packagesByGroup,
  type CoverGroup,
} from "@/lib/eyabantu-packages";

const GROUPS: { key: CoverGroup; icon: typeof Users }[] = [
  { key: "SIX", icon: Users },
  { key: "TEN", icon: Users },
  { key: "SINGLE", icon: User },
];

function fromPrice(group: CoverGroup) {
  return Math.min(...packagesByGroup(group).map((p) => p.monthlyPremium));
}

/** Rate-card summary — no flyer image, matches CRM navy/gold theme. */
export function PackagesRateSummary() {
  const addons = addonPackages();

  return (
    <section className="overflow-hidden eyabantu-card">
      <div className="bg-eyabantu-navy px-5 py-5 md:px-6 md:py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-eyabantu-gold-light">Official rate card</p>
        <h2 className="mt-1 text-xl font-bold text-white md:text-2xl">Affordable funeral services cover</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          {EYABANTU_WAITING_DAYS}-day waiting period on natural death · up to {EYABANTU_MAX_AGE} years · R2,000–R6,000
          cash back at claim · use these tariffs when capturing payments.
        </p>
      </div>

      <div className="grid gap-3 border-b border-eyabantu-gold/20 bg-white p-4 sm:grid-cols-3 md:p-5">
        {GROUPS.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-eyabantu-gold/30 bg-eyabantu-cream/50 px-4 py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-eyabantu-navy text-eyabantu-gold">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-eyabantu-navy">{COVER_GROUP_LABELS[key]}</p>
              <p className="text-sm font-extrabold text-eyabantu-gold">from {formatZar(fromPrice(key))}/mo</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-eyabantu-cream px-4 py-3 text-[11px] font-semibold text-eyabantu-navy">
        <span>
          Extra people:{" "}
          {addons.map((a, i) => (
            <span key={a.code}>
              {i > 0 ? " · " : ""}
              {formatZar(a.monthlyPremium)}
            </span>
          ))}
        </span>
        <span className="text-muted">033 413 1188 · funerals@eyabantu.co.za</span>
      </div>
    </section>
  );
}
