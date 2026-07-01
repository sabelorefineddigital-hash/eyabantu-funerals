import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerVenuesPage() {
  const session = await requireOwnerSession();

  const venues = await prisma.venue.findMany({ where: { tenantId: session.tenantId }, orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Venues"
        subtitle="Chapels, halls, and third-party venues linked to upcoming funerals. Capacity planning prevents double bookings during peak periods."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {venues.map((v) => (
          <article key={v.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--brand-ink)]">{v.name}</h2>
            <p className="mt-2 text-sm text-muted">{v.address ?? "Address on file internally."}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Capacity {v.capacity ?? "—"} seated
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
