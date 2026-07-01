import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function StaffAccountsPage() {
  const session = await requireStaffSession();

  if (session.staffAccess !== "ADMINISTRATION" && session.staffAccess !== "MANAGEMENT") {
    redirect("/staff");
  }

  await syncAllMemberAccountsForTenant(session.tenantId);

  const defaulted = await prisma.member.findMany({
    where: { tenantId: session.tenantId, status: "DEFAULTED" },
    orderBy: { missedPayments: "desc" },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Collections focus"
        subtitle="Read-only view of defaulted members for branch follow-up. Receipting and rehabilitation remain owner actions in this demo build."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Missed</th>
              <th className="px-4 py-3">Last payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {defaulted.map((m) => (
              <tr key={m.id} className="hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <Link className="font-semibold text-brand hover:underline" href={`/staff/members/${m.id}`}>
                    {m.mainMemberName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-red-800">{m.missedPayments}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {m.lastPaymentAt ? m.lastPaymentAt.toLocaleDateString("en-ZA") : "—"}
                </td>
              </tr>
            ))}
            {defaulted.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-muted" colSpan={3}>
                  No defaulted members right now.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
