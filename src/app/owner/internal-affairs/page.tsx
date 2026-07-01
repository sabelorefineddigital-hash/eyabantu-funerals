import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerInternalAffairsPage() {
  const session = await requireOwnerSession();

  const cases = await prisma.internalAffairCase.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Internal affairs (HR secure)"
        subtitle="Confidential workplace reporting with severity, status, and immutable timestamps. Access is limited to owners and nominated management in production deployments."
      />

      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-950">
        Demo content only. Wire formal HR policies, legal review steps, and document storage before storing sensitive
        matters in any production database.
      </div>

      <div className="space-y-3">
        {cases.map((c) => (
          <article key={c.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--brand-ink)]">{c.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-900 ring-1 ring-red-100">
                  {c.severity}
                </span>
                <span className="inline-flex rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-900 ring-1 ring-slate-100">
                  {c.status}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">{c.details}</p>
            <p className="mt-3 text-xs text-muted">Opened {c.createdAt.toLocaleString("en-ZA")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
