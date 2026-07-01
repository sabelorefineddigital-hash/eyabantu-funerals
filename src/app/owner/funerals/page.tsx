import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerFuneralsPage() {
  const session = await requireOwnerSession();

  const funerals = await prisma.funeral.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { funeralDate: "asc" },
    include: { venue: true, member: { select: { id: true, mainMemberName: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Funerals"
        subtitle="Coordinate venues, coordinators, and linked member policies. Tie-ins with driver schedules keep logistics visible to owners in real time."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Deceased</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {funerals.map((f) => (
              <tr key={f.id} className="hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--brand-ink)]">{f.deceasedName}</p>
                  {f.member ? (
                    <Link className="text-xs text-brand hover:underline" href={`/owner/members/${f.member.id}`}>
                      Linked member: {f.member.mainMemberName}
                    </Link>
                  ) : (
                    <p className="text-xs text-muted">Walk-in / non-member service</p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {f.funeralDate ? f.funeralDate.toLocaleString("en-ZA") : "TBC"}
                </td>
                <td className="px-4 py-3 text-xs text-muted">{f.venue?.name ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-semibold text-brand">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
