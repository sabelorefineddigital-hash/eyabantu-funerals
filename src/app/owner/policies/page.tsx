import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { getPackageByCode } from "@/lib/eyabantu-packages";

type Search = { [key: string]: string | string[] | undefined };

export default async function OwnerPoliciesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const session = await requireOwnerSession();
  const sp = await searchParams;
  const memberId = typeof sp.memberId === "string" ? sp.memberId : undefined;

  const [activePolicies, pendingApplications] = await Promise.all([
    prisma.policy.findMany({
      where: {
        member: { tenantId: session.tenantId },
        ...(memberId ? { memberId } : {}),
      },
      orderBy: { effectiveAt: "desc" },
      include: {
        member: {
          select: {
            id: true,
            mainMemberName: true,
            packageCode: true,
            policyNumber: true,
            monthlyPremium: true,
          },
        },
      },
    }),
    prisma.policyApplication.findMany({
      where: {
        tenantId: session.tenantId,
        status: { not: "ACTIVE" },
      },
      orderBy: { createdAt: "desc" },
      include: { agent: { select: { firstName: true, lastName: true, email: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Policies & new business"
        subtitle="Active member policies from onboarded applications, plus pending underwriting pipeline."
      />

      {memberId ? (
        <p className="rounded-2xl border border-brand/20 bg-white px-4 py-3 text-xs text-muted">
          Filter context: showing policies for{" "}
          <Link className="font-semibold text-brand hover:underline" href={`/owner/members/${memberId}`}>
            member profile
          </Link>
          .
        </p>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-[var(--background)] px-4 py-3">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted">Active policies</h2>
        </div>
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-white text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Policy #</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activePolicies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                  No active policies yet. Submit a client application to create a member and policy automatically.
                </td>
              </tr>
            ) : (
              activePolicies.map((policy) => {
                const pkg = getPackageByCode(policy.member.packageCode);
                return (
                  <tr key={policy.id} className="group hover:bg-[var(--background)]/80">
                    <td className="px-4 py-3">
                      <Link
                        className="font-semibold text-brand hover:underline"
                        href={`/owner/members/${policy.member.id}`}
                      >
                        {policy.member.mainMemberName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{policy.member.policyNumber ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">{pkg?.title ?? policy.productName}</td>
                    <td className="px-4 py-3 text-xs">R{policy.coverAmount.toLocaleString("en-ZA")}</td>
                    <td className="px-4 py-3 text-xs">R{policy.member.monthlyPremium.toFixed(2)} / mo</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-100">
                        {policy.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {pendingApplications.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border bg-[var(--background)] px-4 py-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">Pending underwriting</h2>
          </div>
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-white text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Premium</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingApplications.map((a) => (
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
