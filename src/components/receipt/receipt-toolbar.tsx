"use client";

import { Mail } from "lucide-react";
import { PrintDocumentToolbar } from "@/components/print/PrintDocumentToolbar";
import { buildReceiptShareUrl } from "@/lib/receipt-share";

type ShareProps = {
  paymentId: string;
  receiptNumber: string;
  memberName: string;
  memberEmail: string | null;
  amountFormatted: string;
  backHref?: string;
};

function buildMailto({ paymentId, receiptNumber, memberName, memberEmail, amountFormatted }: ShareProps) {
  const url = buildReceiptShareUrl(paymentId, typeof window !== "undefined" ? window.location.origin : undefined);
  const subject = encodeURIComponent(`Eyabantu Funerals receipt ${receiptNumber}`);
  const body = encodeURIComponent(
    `Dear ${memberName},\n\nThank you for your payment to Eyabantu Funerals.\n\nReceipt number: ${receiptNumber}\nAmount: ${amountFormatted}\n\nView or print this receipt:\n${url}\n\nKind regards,\nEyabantu Funerals`,
  );
  const to = memberEmail?.trim();
  return to ? `mailto:${to}?subject=${subject}&body=${body}` : `mailto:?subject=${subject}&body=${body}`;
}

export function ReceiptToolbar({ backHref = "/owner/payments", ...props }: ShareProps) {
  return (
    <PrintDocumentToolbar
      backHref={backHref}
      backLabel="Back to payments"
      documentLabel={`Receipt ${props.receiptNumber}`}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
      </div>
    </PrintDocumentToolbar>
  );
}

export function ReceiptQuickActions(props: ShareProps) {
  const receiptHref = `/print/receipt/${props.paymentId}`;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <a
        href={receiptHref}
        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#132039]"
        title="Open printable receipt"
      >
        Print / PDF
      </a>
      <button
        type="button"
        onClick={() => {
          window.location.href = buildMailto(props);
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:bg-sky-50"
        title={props.memberEmail ? `Draft email to ${props.memberEmail}` : "Draft email with receipt link"}
      >
        Email
      </button>
    </div>
  );
}
