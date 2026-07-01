import Link from "next/link";
import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

export function CrmStatCard({
  title,
  value,
  hint,
  trendLabel,
  trendUp,
  icon: Icon,
  href,
}: {
  title: string;
  value: string | number;
  hint?: string;
  trendLabel: string;
  trendUp: boolean;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link href={href} className="group relative overflow-hidden eyabantu-card p-5 transition">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-eyabantu-silver/10" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-eyabantu-navy/60">{title}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-eyabantu-navy md:text-3xl">{value}</p>
          {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
          <p
            className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
              trendUp ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trendLabel}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-eyabantu-navy text-eyabantu-gold">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-eyabantu-gold/40 opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}

type BarRow = { label: string; amount: string; widthPct: number; change: string; up: boolean };

export function CrmRevenueBreakdown({ rows, title = "Revenue mix (demo)" }: { rows: BarRow[]; title?: string }) {
  return (
    <section className="eyabantu-card p-5 md:p-6">
      <div className="eyabantu-section-header">{title}</div>
      <p className="mt-3 text-xs text-muted">Illustrative split for this demo tenant — connect ledger exports for live figures.</p>
      <ul className="mt-5 space-y-4">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-eyabantu-navy">{r.label}</span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-eyabantu-navy">{r.amount}</span>
                <span className={r.up ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>{r.change}</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-eyabantu-cream">
              <div
                className="h-full rounded-full bg-gradient-to-r from-eyabantu-gold to-eyabantu-gold-light"
                style={{ width: `${r.widthPct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const HEAT_LEVELS = [0, 1, 2, 1, 3, 2, 4, 1, 2, 3, 2, 1, 0, 2, 3, 4, 2, 1, 3, 2, 1];

export function CrmActivityHeatmap({ title = "Activity heat (demo)" }: { title?: string }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["06–10", "10–14", "14–18"];
  return (
    <section className="eyabantu-card p-5 md:p-6">
      <div className="eyabantu-section-header">{title}</div>
      <p className="mt-3 text-xs text-muted">Synthetic intensity grid — replace with audit log timestamps in production.</p>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-block min-w-[280px]">
          <div className="grid grid-cols-8 gap-1 text-[10px] font-semibold uppercase text-eyabantu-silver">
            <div />
            {days.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
            {slots.map((slot, ri) => (
              <Fragment key={slot}>
                <div className="flex items-center text-[10px] font-semibold normal-case text-muted">{slot}</div>
                {days.map((d, ci) => {
                  const idx = (ri * 7 + ci) % HEAT_LEVELS.length;
                  const v = HEAT_LEVELS[idx] ?? 0;
                  const bg =
                    v === 0
                      ? "bg-eyabantu-cream"
                      : v === 1
                        ? "bg-eyabantu-silver/35"
                        : v === 2
                          ? "bg-eyabantu-silver/55"
                          : v === 3
                            ? "bg-eyabantu-navy/70"
                            : "bg-eyabantu-navy";
                  return (
                    <div
                      key={`${d}-${slot}`}
                      title={`${d} ${slot}: demo load ${v}`}
                      className={`aspect-square rounded-md ${bg}`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export type DealRow = {
  id: string;
  org: string;
  rep: string;
  paidOn: string;
  amount: string;
  status: "Paid" | "Pending" | "Review";
};

export function CrmDealTable({
  title,
  rows,
  viewHref,
}: {
  title: string;
  rows: DealRow[];
  viewHref: string;
}) {
  return (
    <section className="overflow-hidden eyabantu-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-eyabantu-gold/25 bg-eyabantu-navy px-5 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">{title}</h2>
        <Link href={viewHref} className="text-xs font-semibold text-eyabantu-gold-light hover:underline">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-eyabantu-gold/15 text-sm">
          <thead className="bg-eyabantu-cream text-left text-[11px] font-bold uppercase tracking-wide text-eyabantu-navy/70">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Member / account</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eyabantu-gold/10">
            {rows.map((r) => (
              <tr key={r.id} className="bg-white hover:bg-eyabantu-cream/80">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">{r.id}</td>
                <td className="max-w-[180px] truncate px-4 py-3 font-semibold text-eyabantu-navy">{r.org}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{r.rep}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{r.paidOn}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="eyabantu-price-pill">{r.amount}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      r.status === "Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "Pending"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-eyabantu-silver/25 text-eyabantu-navy"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={viewHref} className="text-xs font-semibold text-eyabantu-gold hover:text-eyabantu-navy">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
