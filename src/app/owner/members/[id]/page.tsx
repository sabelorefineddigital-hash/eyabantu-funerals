import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { syncMemberAccountFromLedger } from "@/lib/member-account-sync";

export default async function OwnerMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireOwnerSession();
  const { id } = await params;

  await syncMemberAccountFromLedger(id, session.tenantId);

  const [member, paymentTotals] = await Promise.all([
    prisma.member.findFirst({
      where: { id, tenantId: session.tenantId },
      include: {
        beneficiaries: true,
        policies: true,
        payments: { orderBy: { receivedAt: "desc" }, take: 40 },
        claims: { orderBy: { submittedAt: "desc" } },
      },
    }),
    prisma.payment.aggregate({
      where: { memberId: id, status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  if (!member) notFound();

  const totalContributions = paymentTotals._sum.amount ?? 0;
  const notionalArrears =
    member.missedPayments > 0 && member.monthlyPremium > 0
      ? member.missedPayments * member.monthlyPremium
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <CrmTopBar
          title={member.mainMemberName}
          subtitle={`Policy ${member.policyNumber ?? "pending"} · ${member.phone ?? "No phone on file"}`}
        />
        <Link
          href="/owner/members"
          className="text-xs font-semibold text-brand hover:underline sm:mt-8"
        >
          Back to directory
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section id="member-profile" className="scroll-mt-28 rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">ID number</dt>
              <dd className="mt-1 text-foreground">{member.idNumber ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Email</dt>
              <dd className="mt-1 text-foreground">{member.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Address</dt>
              <dd className="mt-1 text-foreground">{member.address ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Premium</dt>
              <dd className="mt-1 font-semibold text-brand">R{member.monthlyPremium.toFixed(2)} / month</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Status</dt>
              <dd className="mt-1 text-foreground">{member.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Ledger (completed)</dt>
              <dd className="mt-1 font-semibold text-[var(--brand-ink)]">
                R{totalContributions.toFixed(2)} across {paymentTotals._count} receipt{paymentTotals._count === 1 ? "" : "s"}
              </dd>
            </div>
            {notionalArrears > 0 ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Notional arrears (demo)</dt>
                <dd className="mt-1 text-sm text-amber-900">
                  ~R{notionalArrears.toFixed(2)} ({member.missedPayments} missed × monthly premium)
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Beneficiaries</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Relationship</th>
                  <th className="px-3 py-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {member.beneficiaries.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2 font-medium text-[var(--brand-ink)]">{b.fullName}</td>
                    <td className="px-3 py-2 text-xs text-muted">{b.relationship}</td>
                    <td className="px-3 py-2 text-right text-xs">{b.sharePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="member-policies" className="mt-8 scroll-mt-28 text-sm font-semibold text-[var(--brand-ink)]">
            Policies
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {member.policies.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-[var(--background)] px-3 py-2">
                <div>
                  <p className="font-semibold text-[var(--brand-ink)]">{p.productName}</p>
                  <p className="text-xs text-muted">
                    Cover R{p.coverAmount.toFixed(0)} · {p.status}
                  </p>
                </div>
                <p className="text-xs font-semibold text-muted">{p.underwriterRef ?? "No ref"}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="member-payments" className="scroll-mt-28 text-sm font-semibold text-[var(--brand-ink)]">
              Recent payments
            </h2>
            <Link
              href={`/owner/payments?memberId=${encodeURIComponent(member.id)}`}
              prefetch={false}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Record payment →
            </Link>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {member.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-[var(--background)] px-3 py-2">
                <div>
                  <p className="font-semibold text-[var(--brand-ink)]">{p.receiptNumber}</p>
                  <p className="text-xs text-muted">
                    {p.method} · {p.receivedAt.toLocaleString("en-ZA")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand">R{p.amount.toFixed(2)}</p>
              </li>
            ))}
            {member.payments.length === 0 ? <p className="text-sm text-muted">No payments captured yet.</p> : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Claims</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {member.claims.map((c) => (
              <li key={c.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
                <p className="font-semibold text-[var(--brand-ink)]">{c.reference ?? c.id.slice(0, 8)}</p>
                <p className="text-xs text-muted">
                  {c.status}
                  {typeof c.amount === "number" ? ` · R${c.amount.toFixed(2)}` : ""}
                </p>
              </li>
            ))}
            {member.claims.length === 0 ? <p className="text-sm text-muted">No claims on file.</p> : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
