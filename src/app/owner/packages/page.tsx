import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { PackageCard } from "@/components/packages/PackageCard";
import { PackagesRateSummary } from "@/components/packages/PackagesRateSummary";
import {
  COVER_GROUP_LABELS,
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

      <PackagesRateSummary />

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

      <footer className="rounded-2xl bg-eyabantu-navy px-5 py-4 text-center text-[11px] leading-relaxed text-white/85">
        <p className="font-semibold text-white">Eyabantu Funerals (Pty) Ltd</p>
        <p className="mt-1">33 Bell Street, Greytown, KwaZulu-Natal, 3250 · Reg 2019/239315/07</p>
        <p className="mt-1">033 413 1188 · funerals@eyabantu.co.za · www.eyabantu.co.za</p>
      </footer>
    </div>
  );
}
