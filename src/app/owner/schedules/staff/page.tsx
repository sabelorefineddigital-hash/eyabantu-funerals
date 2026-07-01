import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerStaffSchedulePage() {
  const session = await requireOwnerSession();

  const rows = await prisma.employeeSchedule.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { shiftStart: "asc" },
    include: { user: { select: { firstName: true, lastName: true, jobTitle: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Employee schedule"
        subtitle="Shift planning for reception, claims intake, and chapel coordination. Pair with Internal Affairs for sensitive HR escalations."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Colleague</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="group hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--brand-ink)]">
                    {r.user.firstName} {r.user.lastName}
                  </p>
                  <p className="text-xs text-muted">{r.user.jobTitle ?? r.user.email}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {r.shiftStart.toLocaleString("en-ZA")} → {r.shiftEnd.toLocaleString("en-ZA")}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {r.location ?? "—"}
                  <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-wide text-brand group-hover:block">
                    Swap shift (demo)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
