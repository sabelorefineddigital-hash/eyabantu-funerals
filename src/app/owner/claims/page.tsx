import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerClaimsPage() {
  const session = await requireOwnerSession();

  const claims = await prisma.claim.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { submittedAt: "desc" },
    include: { member: { select: { mainMemberName: true, id: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Claims"
        subtitle="Track assessments, documentation gaps, and pay-outs. Status changes should always emit activity stream events for governance."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {claims.map((c) => (
              <tr key={c.id} className="group hover:bg-[var(--background)]/80">
                <td className="px-4 py-3 text-xs font-semibold text-[var(--brand-ink)]">{c.reference ?? c.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <Link className="text-xs font-semibold text-brand hover:underline" href={`/owner/members/${c.member.id}`}>
                    {c.member.mainMemberName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-900 ring-1 ring-slate-100">
                    {c.status}
                  </span>
                  <p className="mt-2 hidden text-[10px] font-semibold uppercase tracking-wide text-brand group-hover:block">
                    Attachments checklist (demo)
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted">
                  {typeof c.amount === "number" ? `R${c.amount.toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
