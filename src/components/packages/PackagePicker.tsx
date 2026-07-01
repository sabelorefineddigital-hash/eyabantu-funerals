"use client";

import { useMemo, useState } from "react";
import {
  COVER_GROUP_LABELS,
  addonPackages,
  packagesByGroup,
  type CoverGroup,
  type EyabantuPackage,
} from "@/lib/eyabantu-packages";
import { PackageCard } from "./PackageCard";

type Props = {
  name?: string;
  onPackageChange?: (pkg: EyabantuPackage | null) => void;
};

const TABS: { id: CoverGroup | "ADDON"; label: string }[] = [
  { id: "SIX", label: COVER_GROUP_LABELS.SIX },
  { id: "TEN", label: COVER_GROUP_LABELS.TEN },
  { id: "SINGLE", label: COVER_GROUP_LABELS.SINGLE },
  { id: "ADDON", label: "Extra people" },
];

export function PackagePicker({ name = "packageCode", onPackageChange }: Props) {
  const [tab, setTab] = useState<CoverGroup | "ADDON">("SIX");
  const [selectedCode, setSelectedCode] = useState<string>("");

  const visible = useMemo(() => {
    if (tab === "ADDON") return addonPackages();
    return packagesByGroup(tab);
  }, [tab]);

  function pick(pkg: EyabantuPackage) {
    setSelectedCode(pkg.code);
    onPackageChange?.(pkg);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#142a55]">Eyabantu package</p>
        <p className="mt-0.5 text-[11px] text-slate-500">Select the cover being paid — amount fills automatically.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
              tab === t.id
                ? "bg-[#142a55] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input type="hidden" name={name} value={selectedCode} required />

      <div className="grid max-h-[min(52vh,420px)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {visible.map((pkg) => (
          <PackageCard
            key={pkg.code}
            pkg={pkg}
            selected={selectedCode === pkg.code}
            onSelect={() => pick(pkg)}
            compact
          />
        ))}
      </div>

      {selectedCode ? (
        <p className="rounded-lg bg-[#fff8ef] px-3 py-2 text-[11px] text-[#142a55]">
          Selected:{" "}
          <span className="font-bold">{visible.find((p) => p.code === selectedCode)?.title ?? selectedCode}</span>
        </p>
      ) : (
        <p className="text-[11px] text-amber-800">Please select a package before capturing payment.</p>
      )}
    </div>
  );
}
