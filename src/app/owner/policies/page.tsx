import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

type Search = { [key: string]: string | string[] | undefined };

export default async function OwnerPoliciesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const session = await requireOwnerSession();
  const sp = await searchParams;
  const memberId = typeof sp.memberId === "string" ? sp.memberId : undefined;

  const applications = await prisma.policyApplication.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    include: { agent: { select: { firstName: true, lastName: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Policies & new business"
        subtitle="Track agent-submitted policies, underwriting responses, and linkage to Redit Gateway references — the Pol360-style pipeline for Eyabantu."
      />

      {memberId ? (
        <p className="rounded-2xl border border-brand/20 bg-white px-4 py-3 text-xs text-muted">
          Filter context: showing applications alongside member{" "}
          <Link className="font-semibold text-brand hover:underline" href={`/owner/members/${memberId}`}>
            quick profile
          </Link>
          . Clear by returning from the members grid.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((a) => (
              <tr key={a.id} className="group hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--brand-ink)]">{a.applicantName}</p>
                  <p className="text-xs text-muted">{a.phone ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {a.agent ? `${a.agent.firstName} ${a.agent.lastName}` : "Unassigned"}
                </td>
                <td className="px-4 py-3 text-xs">R{a.proposedCover.toFixed(0)}</td>
                <td className="px-4 py-3 text-xs">R{a.monthlyPremium.toFixed(2)} / mo</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-100">
                    {a.status}
                  </span>
                  <p className="mt-2 hidden text-[10px] font-semibold uppercase tracking-wide text-brand group-hover:block">
                    Push to Redit Gateway (demo)
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
