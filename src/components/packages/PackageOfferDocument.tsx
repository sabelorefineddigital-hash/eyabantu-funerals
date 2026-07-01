import { BrandLogo } from "@/components/brand/BrandLogo";
import { CasketIllustration } from "@/components/packages/PackageCard";
import { formatZar, type EyabantuPackage } from "@/lib/eyabantu-packages";

type Props = {
  pkg: EyabantuPackage;
  preparedAt?: Date;
};

export function PackageOfferDocument({ pkg, preparedAt = new Date() }: Props) {
  const dateLabel = new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(preparedAt);

  return (
    <article
      id="package-offer-document"
      className="mx-auto max-w-[210mm] rounded-2xl border-2 border-eyabantu-gold/40 bg-white p-8 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none md:p-10"
    >
      <header className="flex flex-col gap-6 border-b border-eyabantu-gold/25 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <BrandLogo priority maxHeightClass="max-h-12 sm:max-h-14" />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-eyabantu-gold">Funeral cover summary</p>
            <h1 className="mt-1 text-xl font-bold text-eyabantu-navy">Eyabantu Funerals</h1>
            <p className="mt-1 text-xs text-muted">Affordable funeral services cover — official rate card excerpt</p>
          </div>
        </div>
        <div className="w-full shrink-0 rounded-xl bg-eyabantu-cream px-4 py-3 text-center sm:w-auto sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-eyabantu-navy/60">Prepared</p>
          <p className="mt-1 text-sm font-semibold text-eyabantu-navy">{dateLabel}</p>
          <p className="mt-2 text-[10px] font-mono text-muted">{pkg.code}</p>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border-2 border-eyabantu-gold/35 bg-gradient-to-br from-eyabantu-cream/80 to-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-24 items-center justify-center rounded-xl bg-eyabantu-navy/5 ring-1 ring-eyabantu-gold/30">
              <CasketIllustration tier={pkg.tier} className="h-14 w-20" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-eyabantu-navy">{pkg.title}</h2>
              <p className="mt-0.5 text-sm text-muted">{pkg.subtitle}</p>
              {pkg.coverCount ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-eyabantu-navy/70">
                  Covers {pkg.coverCount} {pkg.coverCount === 1 ? "person" : "people"}
                </p>
              ) : null}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-eyabantu-navy/60">Monthly premium</p>
            <p className="mt-1 text-3xl font-extrabold text-eyabantu-gold">{formatZar(pkg.monthlyPremium)}</p>
            <p className="mt-1 text-xs text-muted">per month</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-eyabantu-navy/60">What is included</h3>
        <ul className="mt-4 space-y-2">
          {pkg.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2 text-sm text-eyabantu-navy">
              <span className="font-bold text-eyabantu-gold">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-eyabantu-gold/25 bg-eyabantu-cream/50 p-4">
          <p className="text-[10px] font-bold uppercase text-eyabantu-navy/60">Waiting period</p>
          <p className="mt-1 text-sm font-semibold text-eyabantu-navy">{pkg.waitingDays} days (natural death)</p>
          <p className="mt-1 text-[11px] text-muted">No waiting on accidental death</p>
        </div>
        <div className="rounded-xl border border-eyabantu-gold/25 bg-eyabantu-cream/50 p-4">
          <p className="text-[10px] font-bold uppercase text-eyabantu-navy/60">Maximum age</p>
          <p className="mt-1 text-sm font-semibold text-eyabantu-navy">Up to {pkg.maxAge} years</p>
        </div>
        <div className="rounded-xl border border-eyabantu-gold/25 bg-eyabantu-cream/50 p-4">
          <p className="text-[10px] font-bold uppercase text-eyabantu-navy/60">Cash back at claim</p>
          <p className="mt-1 text-sm font-semibold text-eyabantu-navy">
            {pkg.cashBack ? formatZar(pkg.cashBack) : "As per plan schedule"}
          </p>
        </div>
      </section>

      {pkg.noFuneralPayout ? (
        <p className="mt-6 rounded-xl bg-eyabantu-navy px-4 py-3 text-center text-sm text-white">
          If no funeral is held: <strong className="text-eyabantu-gold-light">{formatZar(pkg.noFuneralPayout)}</strong> cash
          payout may apply — subject to policy terms.
        </p>
      ) : null}

      <footer className="mt-10 border-t border-eyabantu-gold/25 pt-6 text-center text-xs leading-relaxed text-muted">
        <p className="font-bold text-eyabantu-navy">Eyabantu Funerals (Pty) Ltd</p>
        <p className="mt-1">33 Bell Street, Greytown, KwaZulu-Natal 3250</p>
        <p className="mt-1">
          033 413 1188 / 033 004 0424 ·{" "}
          <span className="text-eyabantu-navy">funerals@eyabantu.co.za</span> · www.eyabantu.co.za
        </p>
        <p className="mt-3 font-semibold italic text-eyabantu-gold">Siyakunakala Ngezikhathi Zonke</p>
        <p className="mt-4 text-[10px] text-muted">
          This summary is for information purposes. Full terms and conditions apply on acceptance of membership.
        </p>
      </footer>
    </article>
  );
}
