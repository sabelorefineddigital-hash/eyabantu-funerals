import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function StaffMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaffSession();
  if (session.staffAccess === "VIEWER" || session.staffAccess === "NONE") redirect("/staff");

  const { id } = await params;
  const member = await prisma.member.findFirst({
    where: { id, tenantId: session.tenantId },
    include: { beneficiaries: true, policies: true },
  });
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <CrmTopBar title={member.mainMemberName} subtitle="Read-only member profile for branch servicing." />
        <Link href="/staff/members" className="text-xs font-semibold text-brand hover:underline sm:mt-8">
          Back to directory
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Beneficiaries</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {member.beneficiaries.map((b) => (
              <li key={b.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
                <p className="font-semibold text-[var(--brand-ink)]">{b.fullName}</p>
                <p className="text-xs text-muted">
                  {b.relationship} · {b.sharePercent}%
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Policies</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {member.policies.map((p) => (
              <li key={p.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
                <p className="font-semibold text-[var(--brand-ink)]">{p.productName}</p>
                <p className="text-xs text-muted">
                  {p.status} · Cover R{p.coverAmount.toFixed(0)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
