"use client";

import Link from "next/link";
import { useState } from "react";
import { Printer } from "lucide-react";
import { triggerPrint } from "@/lib/trigger-print";

type Props = {
  backHref: string;
  backLabel?: string;
  documentLabel: string;
  children?: React.ReactNode;
};

export function PrintDocumentToolbar({
  backHref,
  backLabel = "Back",
  documentLabel,
  children,
}: Props) {
  const [printing, setPrinting] = useState(false);

  async function handlePrint() {
    setPrinting(true);
    try {
      await triggerPrint();
    } finally {
      setPrinting(false);
    }
  }

  return (
    <div className="no-print mb-6 space-y-4">
      <div className="rounded-2xl border-2 border-eyabantu-gold/40 bg-gradient-to-br from-eyabantu-cream to-white p-5 shadow-sm">
        <p className="text-sm font-bold text-eyabantu-navy">{documentLabel} is ready</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Click the button below to open your printer dialog. To save a file, choose{" "}
          <strong className="text-eyabantu-navy">Microsoft Print to PDF</strong> (or &quot;Save as PDF&quot;) as the
          printer, then click Print.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handlePrint()}
            disabled={printing}
            className="inline-flex items-center gap-2 rounded-xl bg-eyabantu-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-eyabantu-navy/90 disabled:opacity-70"
          >
            <Printer className="h-4 w-4" aria-hidden />
            {printing ? "Preparing document…" : "Print / Save as PDF"}
          </button>
          <Link
            href={backHref}
            prefetch={false}
            className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-eyabantu-navy underline-offset-4 hover:underline"
          >
            {backLabel}
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
