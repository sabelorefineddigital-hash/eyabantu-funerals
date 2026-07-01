import Image from "next/image";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { PackageCard } from "@/components/packages/PackageCard";
import {
  COVER_GROUP_LABELS,
  EYABANTU_MAX_AGE,
  EYABANTU_WAITING_DAYS,
  addonPackages,
  packagesByGroup,
  type CoverGroup,
} from "@/lib/eyabantu-packages";

const GROUPS: CoverGroup[] = ["SIX", "TEN", "SINGLE"];

export default function OwnerPackagesPage() {
  return (
    <div className="space-y-8">
      <CrmTopBar
        title="Eyabantu packages"
        subtitle="Official funeral cover tariffs — 90-day waiting period, up to 100 years. Use these when capturing payments."
      />

      <div className="overflow-hidden rounded-2xl border-2 border-eyabantu-gold/35 bg-white shadow-sm">
        <div className="relative h-36 w-full sm:h-44">
          <Image
            src="/marketing/eyabantu-packages-flyer.png"
            alt="Eyabantu funeral cover packages"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-eyabantu-navy/90 via-eyabantu-navy/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-eyabantu-gold-light">Rate card</p>
            <h2 className="text-xl font-bold">Affordable Funeral Services Cover</h2>
            <p className="mt-1 text-xs text-white/80">
              {EYABANTU_WAITING_DAYS}-day waiting · up to {EYABANTU_MAX_AGE} years old
            </p>
          </div>
        </div>
      </div>

      {GROUPS.map((group) => (
        <section key={group} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-eyabantu-navy">{COVER_GROUP_LABELS[group]}</h2>
            <span className="h-px flex-1 bg-eyabantu-gold/30" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {packagesByGroup(group).map((pkg) => (
              <PackageCard key={pkg.code} pkg={pkg} />
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-eyabantu-navy">Extra people add-ons</h2>
          <span className="h-px flex-1 bg-eyabantu-gold/30" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {addonPackages().map((pkg) => (
            <PackageCard key={pkg.code} pkg={pkg} />
          ))}
        </div>
      </section>

      <footer className="rounded-2xl bg-[#142a55] px-5 py-4 text-center text-[11px] leading-relaxed text-white/85">
        <p className="font-semibold text-white">Eyabantu Funerals (Pty) Ltd</p>
        <p className="mt-1">33 Bell Street, Greytown, KwaZulu-Natal, 3250 · Reg 2019/239315/07</p>
        <p className="mt-1">033 413 1188 · funerals@eyabantu.co.za · www.eyabantu.co.za</p>
      </footer>
    </div>
  );
}
