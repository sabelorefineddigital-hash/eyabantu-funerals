import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerAccountsPage() {
  const session = await requireOwnerSession();
  await syncAllMemberAccountsForTenant(session.tenantId);

  const defaulted = await prisma.member.findMany({
    where: { tenantId: session.tenantId, status: "DEFAULTED" },
    orderBy: { missedPayments: "desc" },
  });

  const atRisk = await prisma.member.findMany({
    where: { tenantId: session.tenantId, missedPayments: { gte: 1 }, NOT: { status: "DEFAULTED" } },
    orderBy: { missedPayments: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Accounts & defaults"
        subtitle="Automatically surface households with missed debits or sustained arrears. Pair this view with the payments workspace to log recoveries and issue receipts."
      />

      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-red-900">Defaulted ledger</h2>
        <p className="mt-2 text-xs text-red-900/80">
          Members in <span className="font-semibold">DEFAULTED</span> status require structured rehabilitation or
          handover to legal, depending on your policy.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-red-100 bg-white">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Missed</th>
                <th className="px-4 py-3">Last payment</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {defaulted.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--background)]/60">
                  <td className="px-4 py-3">
                    <Link className="font-semibold text-brand hover:underline" href={`/owner/members/${m.id}`}>
                      {m.mainMemberName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-red-800">{m.missedPayments}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {m.lastPaymentAt ? m.lastPaymentAt.toLocaleDateString("en-ZA") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <Link className="font-semibold text-brand hover:underline" href={`/owner/payments?memberId=${m.id}`}>
                      Record payment
                    </Link>
                  </td>
                </tr>
              ))}
              {defaulted.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-muted" colSpan={4}>
                    No defaulted members — collections posture is healthy.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-amber-950">Early warning</h2>
        <p className="mt-2 text-xs text-amber-950/80">
          Members with one or more missed collections who are not yet classified as defaulted.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {atRisk.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-amber-100">
              <div>
                <p className="font-semibold text-[var(--brand-ink)]">{m.mainMemberName}</p>
                <p className="text-xs text-muted">{m.missedPayments} missed debit(s)</p>
              </div>
              <Link className="text-xs font-semibold text-brand hover:underline" href={`/owner/members/${m.id}`}>
                Review
              </Link>
            </li>
          ))}
          {atRisk.length === 0 ? <p className="text-sm text-muted">No at-risk members beyond defaults.</p> : null}
        </ul>
      </section>
    </div>
  );
}
