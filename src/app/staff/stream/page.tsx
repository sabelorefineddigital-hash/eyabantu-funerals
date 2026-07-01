import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { StreamFilters } from "@/components/crm/StreamFilters";

type Search = { [key: string]: string | string[] | undefined };

export default async function StaffStreamPage({ searchParams }: { searchParams: Promise<Search> }) {
  const session = await requireStaffSession();
  const sp = await searchParams;

  const action = typeof sp.action === "string" ? sp.action : undefined;
  const userId = typeof sp.userId === "string" ? sp.userId : undefined;
  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;

  const where = {
    tenantId: session.tenantId,
    ...(action ? { action } : {}),
    ...(userId ? { userId } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(`${from}T00:00:00`) } : {}),
            ...(to ? { lte: new Date(`${to}T23:59:59.999`) } : {}),
          },
        }
      : {}),
  };

  const [logs, users] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 80,
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.user.findMany({
      where: { tenantId: session.tenantId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  const userOptions = users.map((u) => ({
    id: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Activity stream"
        subtitle="Filtered telemetry for branch teams. Owners retain deeper configuration, but every role benefits from transparent operational history."
      />

      <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-white" />}>
        <StreamFilters users={userOptions} />
      </Suspense>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-[var(--background)]/80">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                  {l.createdAt.toLocaleString("en-ZA")}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-[var(--brand-ink)]">{l.action}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {l.user ? `${l.user.firstName} ${l.user.lastName}` : "System"}
                </td>
                <td className="px-4 py-3 text-xs text-foreground">{l.summary}</td>
              </tr>
            ))}
            {logs.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-muted" colSpan={4}>
                  No events match the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
