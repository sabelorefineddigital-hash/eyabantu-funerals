"use client";

import { useState, useTransition } from "react";
import { createPayfastDemoIntent } from "@/app/actions/payfast";

export function PayfastDemoButton({
  amount,
  memberName,
  memberId,
}: {
  amount: number;
  memberName: string;
  memberId?: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          start(async () => {
            const res = await createPayfastDemoIntent({ amount, memberName, memberId });
            const extra =
              res.receiptNumber && res.recordedPaymentId
                ? `\n\nDemo ledger updated — receipt ${res.receiptNumber} (member account synced).`
                : "\n\nNo ledger row (select a member on this page to record a demo PayFast payment).";
            setMsg(`${res.message}\n\nSandbox URL:\n${res.checkoutUrl}${extra}`);
          });
        }}
        className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-[var(--brand-ink)] shadow-sm transition hover:border-brand/40 disabled:opacity-60"
      >
        {pending ? "Preparing…" : "Simulate PayFast checkout"}
      </button>
      {msg ? (
        <pre className="max-h-40 overflow-auto rounded-xl bg-[var(--background)] p-3 text-[11px] text-muted">{msg}</pre>
      ) : null}
    </div>
  );
}
