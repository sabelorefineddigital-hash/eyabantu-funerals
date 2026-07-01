import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { MemberRowQuickActions } from "./member-row-actions";

export default async function OwnerMembersPage() {
  const session = await requireOwnerSession();
  await syncAllMemberAccountsForTenant(session.tenantId);

  const members = await prisma.member.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { updatedAt: "desc" },
    include: {
      beneficiaries: true,
      policies: true,
    },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Members"
        subtitle="Household profiles with beneficiary splits, linked policies, and premium posture. Row hover actions jump straight into payments or underwriting context."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Policy #</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Quick actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id} className="group hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <Link className="font-semibold text-brand hover:underline" href={`/owner/members/${m.id}`}>
                    {m.mainMemberName}
                  </Link>
                  <p className="text-xs text-muted">
                    {m.beneficiaries.length} beneficiary{m.beneficiaries.length === 1 ? "" : "ies"}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{m.policyNumber ?? "—"}</td>
                <td className="px-4 py-3 text-xs">R{m.monthlyPremium.toFixed(2)} / month</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
                      m.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                        : m.status === "DEFAULTED"
                          ? "bg-red-50 text-red-800 ring-1 ring-red-100"
                          : "bg-amber-50 text-amber-900 ring-1 ring-amber-100"
                    }`}
                  >
                    {m.status}
                  </span>
                  {m.missedPayments > 0 ? (
                    <span className="ml-2 text-[11px] font-semibold text-red-700">{m.missedPayments} missed</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <MemberRowQuickActions memberId={m.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
