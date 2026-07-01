import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function StaffPoliciesPage() {
  const session = await requireStaffSession();

  if (session.staffAccess !== "AGENT" && session.staffAccess !== "MANAGEMENT") {
    redirect("/staff");
  }

  const applications = await prisma.policyApplication.findMany({
    where: {
      tenantId: session.tenantId,
      ...(session.staffAccess === "MANAGEMENT" ? {} : { agentUserId: session.sub }),
    },
    orderBy: { createdAt: "desc" },
    include: { agent: { select: { firstName: true, lastName: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Policy pipeline"
        subtitle={
          session.staffAccess === "MANAGEMENT"
            ? "Management view across all agent submissions."
            : "Applications you captured in the field awaiting underwriting."
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--brand-ink)]">{a.applicantName}</p>
                  <p className="text-xs text-muted">{a.phone ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {a.agent ? `${a.agent.firstName} ${a.agent.lastName}` : "—"}
                </td>
                <td className="px-4 py-3 text-xs">R{a.monthlyPremium.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-brand">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Full underwriting controls, PayFast secrets, and Redit Gateway mappings are owner-only in this demo workspace.
      </p>
    </div>
  );
}
