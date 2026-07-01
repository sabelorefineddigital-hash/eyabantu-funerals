import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function StaffMembersPage() {
  const session = await requireStaffSession();

  if (session.staffAccess === "VIEWER" || session.staffAccess === "NONE") {
    redirect("/staff");
  }

  const members = await prisma.member.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { mainMemberName: "asc" },
    select: {
      id: true,
      mainMemberName: true,
      policyNumber: true,
      status: true,
      monthlyPremium: true,
    },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Members"
        subtitle="Read-only directory for servicing teams. Financial adjustments remain owner-controlled in this demo."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Policy #</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <Link className="font-semibold text-brand hover:underline" href={`/staff/members/${m.id}`}>
                    {m.mainMemberName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{m.policyNumber ?? "—"}</td>
                <td className="px-4 py-3 text-xs">R{m.monthlyPremium.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted">{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
