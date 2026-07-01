import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerComplaintsPage() {
  const session = await requireOwnerSession();

  const complaints = await prisma.complaint.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { firstName: true, lastName: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Complaints"
        subtitle="Branch-level service recovery. Pair structured complaints with activity stream entries for accountability."
      />

      <div className="space-y-3">
        {complaints.map((c) => (
          <article key={c.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--brand-ink)]">{c.subject}</h2>
              <span className="inline-flex rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-900 ring-1 ring-slate-100">
                {c.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{c.body}</p>
            <p className="mt-3 text-xs text-muted">
              Logged {c.createdAt.toLocaleString("en-ZA")}
              {c.createdBy ? ` · ${c.createdBy.firstName} ${c.createdBy.lastName}` : ""}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
