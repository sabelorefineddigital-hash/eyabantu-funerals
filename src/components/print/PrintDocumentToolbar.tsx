"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";
import {
  downloadDocumentAsPdf,
  printDocumentInIframe,
  triggerPrintSync,
  waitForPrintAssets,
} from "@/lib/trigger-print";

type Props = {
  backHref: string;
  backLabel?: string;
  documentLabel: string;
  documentId: string;
  downloadFileName: string;
  children?: React.ReactNode;
};

export function PrintDocumentToolbar({
  backHref,
  backLabel = "Back",
  documentLabel,
  documentId,
  downloadFileName,
  children,
}: Props) {
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void waitForPrintAssets().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handlePrint() {
    setStatus(null);
    const usedIframe = printDocumentInIframe(documentId);
    if (!usedIframe) {
      triggerPrintSync();
    }
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    setStatus(null);
    try {
      await downloadDocumentAsPdf(documentId, downloadFileName);
      setStatus("PDF saved to your Downloads folder.");
    } catch {
      setStatus("Could not create PDF. Try Print, then choose Microsoft Print to PDF.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="no-print mb-6 space-y-4">
      <div className="rounded-2xl border-2 border-eyabantu-gold/40 bg-gradient-to-br from-eyabantu-cream to-white p-5 shadow-sm">
        <p className="text-sm font-bold text-eyabantu-navy">{documentLabel} is ready</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          <strong className="text-eyabantu-navy">Download PDF</strong> saves a file directly (recommended). Use{" "}
          <strong className="text-eyabantu-navy">Print</strong> for a physical printer, or choose{" "}
          <strong className="text-eyabantu-navy">Microsoft Print to PDF</strong> in the dialog.
        </p>
        {!ready ? (
          <p className="mt-2 text-[11px] font-medium text-eyabantu-gold">Loading document assets…</p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleDownloadPdf()}
            disabled={!ready || downloading}
            className="inline-flex items-center gap-2 rounded-xl bg-eyabantu-gold px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-eyabantu-gold-light disabled:opacity-70"
          >
            <Download className="h-4 w-4" aria-hidden />
            {downloading ? "Creating PDF…" : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!ready}
            className="inline-flex items-center gap-2 rounded-xl bg-eyabantu-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-eyabantu-navy/90 disabled:opacity-70"
          >
            <Printer className="h-4 w-4" aria-hidden />
            Print
          </button>
          <Link
            href={backHref}
            prefetch={false}
            className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-eyabantu-navy underline-offset-4 hover:underline"
          >
            {backLabel}
          </Link>
        </div>
        {status ? <p className="mt-3 text-xs font-medium text-eyabantu-navy">{status}</p> : null}
      </div>
      {children}
    </div>
  );
}
