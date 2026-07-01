"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import type { EyabantuPackage } from "@/lib/eyabantu-packages";
import { buildPackageMailto, packagePrintPath } from "@/lib/package-share";
import { PrintDocumentToolbar } from "@/components/print/PrintDocumentToolbar";

type Props = {
  pkg: EyabantuPackage;
  backHref?: string;
};

export function PackageShareToolbar({ pkg, backHref = "/owner/packages" }: Props) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");

  function sendEmail() {
    window.location.href = buildPackageMailto(pkg, {
      to: recipientEmail,
      recipientName,
      origin: window.location.origin,
    });
  }

  return (
    <PrintDocumentToolbar
      backHref={backHref}
      backLabel="Back to packages"
      documentLabel={`${pkg.title} summary`}
      documentId="package-offer-document"
      downloadFileName={`Eyabantu-${pkg.code}.pdf`}
    >
      <div className="rounded-2xl border border-eyabantu-gold/25 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={sendEmail}
            className="inline-flex items-center gap-2 rounded-xl bg-eyabantu-gold px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-eyabantu-gold-light"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Send via email
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-eyabantu-navy">
            Recipient name (optional)
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Mr Dlamini"
              className="mt-1 w-full rounded-lg border border-eyabantu-gold/30 bg-eyabantu-cream/50 px-3 py-2 text-sm text-eyabantu-navy outline-none focus:border-eyabantu-gold focus:ring-1 focus:ring-eyabantu-gold/30"
            />
          </label>
          <label className="block text-xs font-semibold text-eyabantu-navy">
            Recipient email (optional)
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="prospect@email.com"
              className="mt-1 w-full rounded-lg border border-eyabantu-gold/30 bg-eyabantu-cream/50 px-3 py-2 text-sm text-eyabantu-navy outline-none focus:border-eyabantu-gold focus:ring-1 focus:ring-eyabantu-gold/30"
            />
          </label>
        </div>
      </div>
    </PrintDocumentToolbar>
  );
}

export function PackageShareQuickActions({ pkg }: { pkg: EyabantuPackage }) {
  const [recipientEmail, setRecipientEmail] = useState("");

  function sendEmail() {
    window.location.href = buildPackageMailto(pkg, {
      to: recipientEmail,
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
  }

  return (
    <div className="no-print border-t border-eyabantu-gold/20 bg-eyabantu-cream/40 p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <Link
          href={packagePrintPath(pkg.code)}
          prefetch={false}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-eyabantu-navy/20 bg-white px-3 py-2 text-[11px] font-semibold text-eyabantu-navy transition hover:border-eyabantu-gold"
        >
          Print / PDF
        </Link>
        <button
          type="button"
          onClick={sendEmail}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-eyabantu-gold px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-eyabantu-gold-light"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden />
          Email
        </button>
        <Link
          href={packagePrintPath(pkg.code)}
          prefetch={false}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-eyabantu-navy/15 px-3 py-2 text-[11px] font-semibold text-eyabantu-navy transition hover:bg-white"
        >
          Preview
        </Link>
      </div>
      <input
        type="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="Recipient email (optional)"
        className="w-full rounded-lg border border-eyabantu-gold/25 bg-white px-2.5 py-1.5 text-[11px] text-eyabantu-navy outline-none focus:border-eyabantu-gold"
      />
    </div>
  );
}
