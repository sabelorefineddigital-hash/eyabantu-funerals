"use client";

import type { EyabantuPackage } from "@/lib/eyabantu-packages";
import { PackageCard } from "@/components/packages/PackageCard";
import { PackageShareQuickActions } from "@/components/packages/PackageShareToolbar";

export function PackageOfferCard({ pkg }: { pkg: EyabantuPackage }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition hover:border-eyabantu-gold/50 hover:shadow-md">
      <PackageCard pkg={pkg} variant="display" className="border-0 shadow-none hover:shadow-none rounded-none" />
      <PackageShareQuickActions pkg={pkg} />
    </div>
  );
}
