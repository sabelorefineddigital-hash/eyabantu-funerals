import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerDriverSchedulePage() {
  const session = await requireOwnerSession();

  const rows = await prisma.driverSchedule.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { startAt: "asc" },
    include: { driver: { select: { firstName: true, lastName: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Driver schedule"
        subtitle="Fleet movements for hearses, Sprinters, and family transport. Assign drivers from the employee directory as soon as HR activates new logistics staff."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Window</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="group hover:bg-[var(--background)]/80">
                <td className="px-4 py-3 text-xs text-muted">
                  {r.startAt.toLocaleString("en-ZA")} → {r.endAt.toLocaleString("en-ZA")}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-[var(--brand-ink)]">{r.vehicle ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {r.driver ? `${r.driver.firstName} ${r.driver.lastName}` : "Unassigned"}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {r.routeNotes ?? "—"}
                  <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-wide text-brand group-hover:block">
                    Quick assign driver (demo)
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
