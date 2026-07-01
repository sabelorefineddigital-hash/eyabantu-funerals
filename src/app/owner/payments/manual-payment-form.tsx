"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { recordManualPaymentAction, type PaymentManualState } from "@/app/actions/owner";
import { PackagePicker } from "@/components/packages/PackagePicker";
import type { EyabantuPackage } from "@/lib/eyabantu-packages";

const initial: PaymentManualState = {};

export function ManualPaymentForm({
  members,
  defaultMemberId,
}: {
  members: { id: string; label: string }[];
  defaultMemberId?: string;
}) {
  const [state, formAction, pending] = useActionState(recordManualPaymentAction, initial);
  const [selectedPackage, setSelectedPackage] = useState<EyabantuPackage | null>(null);
  const [amount, setAmount] = useState("");

  function handlePackageChange(pkg: EyabantuPackage | null) {
    setSelectedPackage(pkg);
    if (pkg) setAmount(String(pkg.monthlyPremium));
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[#142a55]/10 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-bold text-[#142a55]">Capture payment</h2>
        <p className="mt-1 text-xs text-slate-500">
          Select the Eyabantu cover package, choose the member, then generate a receipt.
        </p>
      </div>

      <PackagePicker onPackageChange={handlePackageChange} />

      <label className="block text-xs font-bold uppercase tracking-wide text-[#142a55]/70">
        Member
        <select
          name="memberId"
          required
          defaultValue={defaultMemberId ?? members[0]?.id}
          className="mt-1.5 w-full rounded-xl border border-[#142a55]/15 bg-white px-3 py-2 text-sm"
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-bold uppercase tracking-wide text-[#142a55]/70">
        Amount (ZAR)
        <input
          id="payment-amount"
          name="amount"
          type="number"
          min="1"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          readOnly={!!selectedPackage}
          className={`mt-1.5 w-full rounded-xl border border-[#142a55]/15 bg-white px-3 py-2 text-sm font-semibold text-[#142a55] ${
            selectedPackage ? "bg-[#fff8ef] cursor-default" : ""
          }`}
        />
        {selectedPackage ? (
          <p className="mt-1 text-[10px] text-slate-500">Locked to package premium — clear selection to edit manually.</p>
        ) : null}
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
              className="inline-flex items-center rounded-lg bg-[#142a55] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-[#0f1f45]"
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
        disabled={pending || !selectedPackage}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#f18a00] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-[#f18a00]/25 transition hover:bg-[#e07d00] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving…" : "Generate receipt"}
      </button>
    </form>
  );
}
