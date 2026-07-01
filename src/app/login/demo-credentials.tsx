import type { DemoAccount } from "@/lib/demo-accounts";
import { DEMO_PASSWORD } from "@/lib/demo-accounts";

const accentMap: Record<DemoAccount["accent"], string> = {
  ink: "border-slate-800/20 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/25",
  sky: "border-sky-300/60 bg-gradient-to-br from-sky-50 to-sky-100 text-slate-900 shadow-md shadow-sky-500/10",
  violet: "border-violet-300/60 bg-gradient-to-br from-violet-50 to-fuchsia-50 text-slate-900 shadow-md shadow-violet-500/10",
  amber: "border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50 text-slate-900 shadow-md shadow-amber-500/10",
  emerald: "border-emerald-300/60 bg-gradient-to-br from-emerald-50 to-teal-50 text-slate-900 shadow-md shadow-emerald-500/10",
  rose: "border-rose-300/60 bg-gradient-to-br from-rose-50 to-pink-50 text-slate-900 shadow-md shadow-rose-500/10",
};

export function DemoCredentials({ accounts }: { accounts: DemoAccount[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Demo password (every account)</p>
        <p className="mt-2 font-mono text-lg font-bold tracking-wide text-white">{DEMO_PASSWORD}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/80">
          Turn on <span className="font-semibold text-white">Demo mode</span> on the card to pre-fill Musa’s owner
          login, or tap a tile below to copy the email into your clipboard where supported.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Owner & staff emails</p>
        <div className="mt-3 grid max-h-[min(52vh,520px)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {accounts.map((a) => (
            <article
              key={a.email}
              className={`rounded-2xl border p-4 ring-1 ring-black/5 ${accentMap[a.accent]}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{a.badge}</p>
              <p className="mt-1 text-sm font-semibold leading-snug">{a.name}</p>
              <p className="mt-2 break-all font-mono text-[11px] opacity-90">{a.email}</p>
              <p className="mt-2 text-[11px] leading-relaxed opacity-80">{a.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
