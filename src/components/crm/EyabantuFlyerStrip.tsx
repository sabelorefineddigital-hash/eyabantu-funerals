import Image from "next/image";
import Link from "next/link";

type Props = {
  packagesHref?: string;
  ctaLabel?: string;
};

/** Flyer-inspired promo strip for dashboard home — navy bar + gold accents like rate card. */
export function EyabantuFlyerStrip({
  packagesHref = "/owner/packages",
  ctaLabel = "View rate card →",
}: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border-2 border-eyabantu-gold/40 bg-white shadow-sm">
      <div className="relative flex min-h-[7.5rem] flex-col justify-end sm:min-h-[9rem]">
        <Image
          src="/marketing/eyabantu-packages-flyer.png"
          alt=""
          fill
          className="object-cover object-top opacity-90"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-eyabantu-navy via-eyabantu-navy/85 to-eyabantu-navy/40" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4 p-5 md:p-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-eyabantu-gold-light">
              Affordable funeral services cover
            </p>
            <h2 className="mt-1 text-lg font-bold text-white md:text-xl">
              6 · 10 · Single person plans — Basic, Mini Dome & Platinum
            </h2>
            <p className="mt-1.5 text-xs text-white/75">
              90-day waiting period · up to 100 years · R2,000–R6,000 cash back at claim
            </p>
          </div>
          <Link
            href={packagesHref}
            className="shrink-0 rounded-full bg-eyabantu-gold px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-eyabantu-gold-light"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-eyabantu-gold/30 bg-eyabantu-navy px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
        <span>Extra people: Casket R50 · Mini Dome R75 · Platinum R100</span>
        <span className="text-eyabantu-gold">033 413 1188 · funerals@eyabantu.co.za</span>
      </div>
    </section>
  );
}
