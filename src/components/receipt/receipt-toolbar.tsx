"use client";

import Link from "next/link";
import { Eye, Mail, Printer } from "lucide-react";

type ShareProps = {
  paymentId: string;
  receiptNumber: string;
  memberName: string;
  memberEmail: string | null;
  amountFormatted: string;
};

function buildMailto({ paymentId, receiptNumber, memberName, memberEmail, amountFormatted }: ShareProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const path = `/owner/payments/receipt/${paymentId}`;
  const url = origin ? `${origin}${path}` : path;
  const subject = encodeURIComponent(`Eyabantu Funerals receipt ${receiptNumber}`);
  const body = encodeURIComponent(
    `Dear ${memberName},\n\nThank you for your payment to Eyabantu Funerals.\n\nReceipt number: ${receiptNumber}\nAmount: ${amountFormatted}\n\nView or print this receipt:\n${url}\n\nKind regards,\nEyabantu Funerals`,
  );
  const to = memberEmail?.trim();
  return to ? `mailto:${to}?subject=${subject}&body=${body}` : `mailto:?subject=${subject}&body=${body}`;
}

export function ReceiptToolbar(props: ShareProps) {
  return (
    <div className="no-print mb-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
      >
        <Printer className="h-4 w-4" aria-hidden />
        Print / Save as PDF
      </button>
      <button
        type="button"
        onClick={() => {
          window.location.href = buildMailto(props);
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
      >
        <Mail className="h-4 w-4" aria-hidden />
        Send to member
      </button>
      <Link
        href="/owner/payments"
        prefetch={false}
        className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-sky-800 underline-offset-4 hover:underline"
      >
        Back to payments
      </Link>
    </div>
  );
}

export function ReceiptQuickActions(props: ShareProps) {
  const receiptHref = `/owner/payments/receipt/${props.paymentId}`;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link
        href={receiptHref}
        prefetch={false}
        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#132039]"
        title="Open printable receipt"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden />
        View receipt
      </Link>
      <button
        type="button"
        onClick={() => {
          window.location.href = buildMailto(props);
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:bg-sky-50"
        title={props.memberEmail ? `Draft email to ${props.memberEmail}` : "Draft email with receipt link"}
      >
        <Mail className="h-3.5 w-3.5" aria-hidden />
        Email
      </button>
    </div>
  );
}
