import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function StaffSchedulePage() {
  const session = await requireStaffSession();

  const shifts = await prisma.employeeSchedule.findMany({
    where: { tenantId: session.tenantId, userId: session.sub },
    orderBy: { shiftStart: "asc" },
  });

  const driver = await prisma.driverSchedule.findMany({
    where: { tenantId: session.tenantId, driverUserId: session.sub },
    orderBy: { startAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="My schedule"
        subtitle="Personal shifts plus any fleet duties assigned to your profile."
      />

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Branch shifts</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {shifts.map((s) => (
            <li key={s.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
              <p className="font-semibold text-[var(--brand-ink)]">{s.shiftStart.toLocaleString("en-ZA")}</p>
              <p className="text-xs text-muted">{s.location ?? "Eyabantu HQ"}</p>
            </li>
          ))}
          {shifts.length === 0 ? <p className="text-sm text-muted">No upcoming shifts assigned.</p> : null}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Fleet duties</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {driver.map((d) => (
            <li key={d.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
              <p className="font-semibold text-[var(--brand-ink)]">{d.vehicle ?? "Vehicle"}</p>
              <p className="text-xs text-muted">
                {d.startAt.toLocaleString("en-ZA")} → {d.endAt.toLocaleString("en-ZA")}
              </p>
              <p className="text-xs text-muted">{d.routeNotes ?? ""}</p>
            </li>
          ))}
          {driver.length === 0 ? <p className="text-sm text-muted">No driver duties assigned to you.</p> : null}
        </ul>
      </section>
    </div>
  );
}
