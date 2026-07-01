import type { Prisma } from "@prisma/client";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { ReceiptQuickActions } from "@/components/receipt/receipt-toolbar";
import { paymentMethodLabel } from "@/lib/payment-labels";
import { ManualPaymentForm } from "./manual-payment-form";
import { PayfastDemoButton } from "./payfast-demo-button";
import { PaymentsFiltersBar } from "./payments-filters";

type Search = { [key: string]: string | string[] | undefined };

export default async function OwnerPaymentsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const session = await requireOwnerSession();
  await syncAllMemberAccountsForTenant(session.tenantId);
  const sp = await searchParams;
  const memberId = typeof sp.memberId === "string" ? sp.memberId : undefined;
  const ledgerQ = typeof sp.q === "string" ? sp.q.trim() : "";

  const members = await prisma.member.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { mainMemberName: "asc" },
    select: { id: true, mainMemberName: true, monthlyPremium: true },
  });

  const validMemberId = memberId && members.some((m) => m.id === memberId) ? memberId : undefined;

  let paymentWhere: Prisma.PaymentWhereInput;
  if (validMemberId) {
    paymentWhere = {
      memberId: validMemberId,
      member: { tenantId: session.tenantId },
    };
  } else if (ledgerQ) {
    paymentWhere = {
      AND: [
        { member: { tenantId: session.tenantId } },
        {
          OR: [
            { receiptNumber: { contains: ledgerQ } },
            { member: { mainMemberName: { contains: ledgerQ } } },
          ],
        },
      ],
    };
  } else {
    paymentWhere = { member: { tenantId: session.tenantId } };
  }

  const payments = await prisma.payment.findMany({
    where: paymentWhere,
    orderBy: { receivedAt: "desc" },
    take: validMemberId ? 100 : ledgerQ ? 80 : 50,
    include: {
      member: {
        select: {
          mainMemberName: true,
          email: true,
        },
      },
    },
  });

  const memberOptions = members.map((m) => ({
    id: m.id,
    label: `${m.mainMemberName} · R${m.monthlyPremium.toFixed(2)} / mo`,
  }));

  const payfastSubject = validMemberId ? members.find((m) => m.id === validMemberId) : members[0];

  const filteredCopy =
    validMemberId || ledgerQ
      ? "Filtered ledger — use View receipt for print/PDF; Email opens your mail app with a link."
      : "Demo ledger — view print-ready receipts or draft an email to the member with one click.";

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Payments & receipts"
        subtitle="Search by member or receipt, capture collections, then open any row to view or email the receipt."
      />

      <Suspense fallback={<div className="h-44 animate-pulse rounded-2xl bg-slate-100/90" aria-hidden />}>
        <PaymentsFiltersBar members={members} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <ManualPaymentForm
          key={validMemberId ?? "default-member"}
          members={memberOptions}
          defaultMemberId={validMemberId}
        />
        <div className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-ink)]">PayFast / debit order</h2>
            <p className="mt-1 text-xs text-muted">
              Demo button logs a PayFast intent in the activity stream. Integrate merchant keys from the integrations
              module before going live.
            </p>
          </div>
          {payfastSubject ? (
            <PayfastDemoButton
              amount={payfastSubject.monthlyPremium}
              memberName={payfastSubject.mainMemberName}
              memberId={payfastSubject.id}
            />
          ) : (
            <p className="text-sm text-muted">Add members to exercise PayFast stubs.</p>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-[var(--background)] px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Recent receipts</h2>
            <p className="mt-0.5 text-xs text-muted">{filteredCopy}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200/80">
            {payments.length} shown
          </span>
        </div>
        {payments.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted">
            {validMemberId || ledgerQ ? (
              <>No receipts match this filter — clear filters or capture a payment above.</>
            ) : (
              <>No payments yet — capture a manual receipt above or reseed the demo database.</>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-white text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="min-w-[200px] px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--background)]/80">
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-[var(--brand-ink)]">
                      {p.receiptNumber}
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs text-muted" title={p.member.mainMemberName}>
                      {p.member.mainMemberName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{paymentMethodLabel(p.method)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                      {new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(p.receivedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-brand">
                      R{p.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right align-middle">
                      <ReceiptQuickActions
                        paymentId={p.id}
                        receiptNumber={p.receiptNumber}
                        memberName={p.member.mainMemberName}
                        memberEmail={p.member.email}
                        amountFormatted={`R${p.amount.toFixed(2)}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
