import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { formatZar, getPackageByCode } from "@/lib/eyabantu-packages";
import { Plus } from "lucide-react";

export default async function OwnerApplicationsPage() {
  const session = await requireOwnerSession();

  const applications = await prisma.clientApplication.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      submittedBy: { select: { firstName: true, lastName: true } },
      member: { select: { id: true, mainMemberName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Client applications"
        subtitle="Submitted onboarding forms from staff and owners — review details and reference numbers."
        action={
          <Link
            href="/owner/applications/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f18a00] px-4 py-2 text-xs font-bold text-white hover:bg-[#d97a00]"
          >
            <Plus className="h-4 w-4" />
            New application
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted">
                  No applications yet.{" "}
                  <Link href="/owner/applications/new" className="font-semibold text-brand hover:underline">
                    Start the first one
                  </Link>
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const pkg = getPackageByCode(app.packageCode);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link href={`/owner/applications/${app.id}`} className="font-mono text-xs font-semibold text-brand hover:underline">
                        {app.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {app.firstName} {app.surname}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{pkg?.title ?? app.packageCode ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-[#142a55]">{formatZar(app.totalPremium)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                          app.status === "ONBOARDED"
                            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                            : "bg-amber-50 text-amber-900 ring-1 ring-amber-100"
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.member ? (
                        <p className="mt-1 text-[10px] text-muted">
                          <Link href={`/owner/members/${app.member.id}`} className="font-semibold text-brand hover:underline">
                            {app.member.mainMemberName}
                          </Link>
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{app.createdAt.toLocaleDateString("en-ZA")}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {app.submittedBy ? `${app.submittedBy.firstName} ${app.submittedBy.lastName}` : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
