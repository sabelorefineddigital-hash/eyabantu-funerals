"use client";

import Link from "next/link";
import { useActionState } from "react";
import { recordManualPaymentAction, type PaymentManualState } from "@/app/actions/owner";

const initial: PaymentManualState = {};

export function ManualPaymentForm({
  members,
  defaultMemberId,
}: {
  members: { id: string; label: string }[];
  defaultMemberId?: string;
}) {
  const [state, formAction, pending] = useActionState(recordManualPaymentAction, initial);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Manual receipt</h2>
        <p className="mt-1 text-xs text-muted">
          Capture cash, EFT, or in-branch payments. A digital receipt number is generated automatically and logged in
          the activity stream.
        </p>
      </div>

      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
        Member
        <select
          name="memberId"
          required
          defaultValue={defaultMemberId ?? members[0]?.id}
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
        Amount (ZAR)
        <input
          name="amount"
          type="number"
          min="1"
          step="0.01"
          required
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
        />
      </label>

      {state.error ? <p className="text-xs text-red-700">{state.error}</p> : null}
      {state.success && state.paymentId ? (
        <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-950">
          <p className="font-semibold">
            Payment captured. Receipt <span className="font-mono">{state.receiptNumber}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/owner/payments/receipt/${state.paymentId}`}
              prefetch={false}
              className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-[#132039]"
            >
              View receipt
            </Link>
            <Link
              href="/owner/payments"
              prefetch={false}
              className="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100/80"
            >
              Recent list
            </Link>
          </div>
        </div>
      ) : state.success ? (
        <p className="text-xs font-semibold text-emerald-800">
          Payment captured. Receipt <span className="font-mono">{state.receiptNumber}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand-ink)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#132039] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Generate receipt"}
      </button>
    </form>
  );
}
