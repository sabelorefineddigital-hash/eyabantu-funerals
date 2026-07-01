import type { DemoAccount } from "@/lib/demo-accounts";
import { DEMO_PASSWORD } from "@/lib/demo-accounts";

const accentMap: Record<DemoAccount["accent"], string> = {
  ink: "border-white/20 bg-white/10 text-white",
  sky: "border-white/20 bg-white/10 text-white",
  violet: "border-white/20 bg-white/10 text-white",
  amber: "border-[#f5c518]/40 bg-[#f5c518]/15 text-white",
  emerald: "border-white/20 bg-white/10 text-white",
  rose: "border-white/20 bg-white/10 text-white",
};

type Props = {
  accounts: DemoAccount[];
  variant?: "hero" | "compact";
};

export function DemoCredentials({ accounts, variant = "hero" }: Props) {
  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-[#142a55]/10 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#142a55]/70">Demo password</p>
        <p className="mt-1 font-mono text-lg font-bold text-[#f18a00]">{DEMO_PASSWORD}</p>
        <p className="mt-2 text-xs text-[#6b7280]">Tap a quick pick on the sign-in card to switch accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/20 bg-[#142a55]/75 p-4 backdrop-blur-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5c518]">Demo password (every account)</p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-wide text-white">{DEMO_PASSWORD}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/80">
          Enable <span className="font-semibold text-[#f5c518]">Demo</span> on the sign-in card, or tap a role below to
          copy an email.
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">Owner &amp; staff emails</p>
        <div className="mt-3 grid max-h-[min(40vh,380px)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {accounts.map((a) => (
            <article
              key={a.email}
              className={`rounded-xl border p-3 backdrop-blur-sm ${accentMap[a.accent]}`}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">{a.badge}</p>
              <p className="mt-0.5 text-sm font-semibold leading-snug">{a.name}</p>
              <p className="mt-1.5 break-all font-mono text-[10px] opacity-90">{a.email}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
