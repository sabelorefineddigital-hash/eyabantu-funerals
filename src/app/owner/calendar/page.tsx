import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerCalendarPage() {
  const session = await requireOwnerSession();

  const [funerals, shifts, drivers] = await Promise.all([
    prisma.funeral.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { funeralDate: "asc" },
      include: { venue: true },
    }),
    prisma.employeeSchedule.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { shiftStart: "asc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.driverSchedule.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { startAt: "asc" },
    }),
  ]);

  const events = [
    ...funerals
      .filter((f) => f.funeralDate)
      .map((f) => ({
        id: f.id,
        when: f.funeralDate as Date,
        label: `Funeral — ${f.deceasedName}`,
        detail: f.venue?.name ?? "Venue TBC",
      })),
    ...shifts.map((s) => ({
      id: s.id,
      when: s.shiftStart,
      label: `Shift — ${s.user.firstName} ${s.user.lastName}`,
      detail: s.location ?? "HQ",
    })),
    ...drivers.map((d) => ({
      id: d.id,
      when: d.startAt,
      label: `Fleet — ${d.vehicle ?? "Vehicle"}`,
      detail: d.routeNotes ?? "Logistics",
    })),
  ].sort((a, b) => a.when.getTime() - b.when.getTime());

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Master calendar"
        subtitle="Merged view of funerals, employee shifts, and fleet commitments. Ideal for morning operational reviews."
      />

      <ol className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="w-32 shrink-0 text-xs font-semibold text-muted">{e.when.toLocaleString("en-ZA")}</div>
            <div>
              <p className="text-sm font-semibold text-[var(--brand-ink)]">{e.label}</p>
              <p className="text-xs text-muted">{e.detail}</p>
            </div>
          </li>
        ))}
        {events.length === 0 ? <p className="text-sm text-muted">No dated events yet.</p> : null}
      </ol>
    </div>
  );
}
