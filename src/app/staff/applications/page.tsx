import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { formatZar, getPackageByCode } from "@/lib/eyabantu-packages";
import { Plus } from "lucide-react";

export default async function StaffApplicationsPage() {
  const session = await requireStaffSession();

  const applications = await prisma.clientApplication.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Client applications"
        subtitle="Onboarding forms you and your team have submitted."
        action={
          <Link
            href="/staff/applications/new"
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
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">
                  No applications yet.{" "}
                  <Link href="/staff/applications/new" className="font-semibold text-brand hover:underline">
                    Start one
                  </Link>
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const pkg = getPackageByCode(app.packageCode);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand">{app.reference}</td>
                    <td className="px-4 py-3 font-medium">
                      {app.firstName} {app.surname}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{pkg?.title ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold">{formatZar(app.totalPremium)}</td>
                    <td className="px-4 py-3 text-xs text-muted">{app.createdAt.toLocaleDateString("en-ZA")}</td>
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
