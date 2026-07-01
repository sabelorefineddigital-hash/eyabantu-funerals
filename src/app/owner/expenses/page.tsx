import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerExpensesPage() {
  const session = await requireOwnerSession();

  const expenses = await prisma.expense.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { incurredAt: "desc" },
    include: { approvedBy: { select: { firstName: true, lastName: true } } },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Venue & operating expenses"
        subtitle="Categorised spend with approver attribution. Export hooks to accounting can be layered on without changing the CRM surface."
      />

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Rolling total (demo data)</p>
        <p className="mt-2 text-3xl font-semibold text-[var(--brand-ink)]">R{total.toFixed(2)}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Incurred</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((e) => (
              <tr key={e.id} className="group hover:bg-[var(--background)]/80">
                <td className="px-4 py-3 text-xs text-muted">{e.incurredAt.toLocaleDateString("en-ZA")}</td>
                <td className="px-4 py-3 text-xs font-semibold text-[var(--brand-ink)]">{e.category}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {e.description ?? "—"}
                  {e.approvedBy ? (
                    <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-wide text-brand group-hover:block">
                      Approved by {e.approvedBy.firstName} {e.approvedBy.lastName}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right text-xs font-semibold text-brand">R{e.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
