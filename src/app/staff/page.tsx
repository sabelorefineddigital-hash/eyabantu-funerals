import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import {
  CrmActivityHeatmap,
  CrmDealTable,
  type DealRow,
  CrmRevenueBreakdown,
  CrmStatCard,
} from "@/components/crm/CrmDashboardKit";
import { staffRoleLabel } from "@/lib/crm-nav-config";
import { Activity, Banknote, ClipboardList, FileSignature, Users } from "lucide-react";

function fmtMoney(n: number) {
  return `R${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function StaffHomePage() {
  const session = await requireStaffSession();

  const tenantId = session.tenantId;
  await syncAllMemberAccountsForTenant(tenantId);
  const access = session.staffAccess;
  const role = staffRoleLabel(access);

  const [members, myApps, openClaims, recentPayments] = await Promise.all([
    prisma.member.count({ where: { tenantId } }),
    prisma.policyApplication.count({
      where: { tenantId, agentUserId: session.sub },
    }),
    prisma.claim.count({ where: { tenantId, status: { in: ["OPEN", "ASSESSING"] } } }),
    prisma.payment.findMany({
      where: { member: { tenantId } },
      orderBy: { receivedAt: "desc" },
      take: access === "MANAGEMENT" || access === "ADMINISTRATION" ? 6 : 4,
      include: { member: { select: { mainMemberName: true } } },
    }),
  ]);

  const ytdDemo =
    access === "MANAGEMENT" || access === "ADMINISTRATION"
      ? recentPayments.reduce((s, p) => s + p.amount, 0) * 2.4
      : recentPayments.reduce((s, p) => s + p.amount, 0);

  const dealRows: DealRow[] = recentPayments.map((p) => ({
    id: p.receiptNumber.slice(0, 12),
    org: p.member.mainMemberName,
    rep: access === "AGENT" ? "My desk" : "Tenant",
    paidOn: fmtDate(p.receivedAt),
    amount: fmtMoney(p.amount),
    status: p.status === "COMPLETED" ? "Paid" : "Pending",
  }));

  const barTitle =
    access === "MANAGEMENT"
      ? "Branch performance mix (demo)"
      : access === "ADMINISTRATION"
        ? "Collections focus (demo)"
        : "Pipeline emphasis (demo)";

  const barRows =
    access === "VIEWER"
      ? [
          { label: "Reporting views", amount: "—", widthPct: 35, change: "N/A", up: true },
          { label: "Stream volume", amount: "—", widthPct: 30, change: "N/A", up: true },
          { label: "Audit events", amount: "—", widthPct: 20, change: "N/A", up: true },
          { label: "Other", amount: "—", widthPct: 15, change: "N/A", up: true },
        ]
      : [
          { label: "Field applications", amount: fmtMoney(ytdDemo * 0.35), widthPct: 45, change: "+5.1%", up: true },
          { label: "Servicing & reinstatements", amount: fmtMoney(ytdDemo * 0.28), widthPct: 32, change: "+2.4%", up: true },
          { label: "Collections assists", amount: fmtMoney(ytdDemo * 0.22), widthPct: 24, change: "-0.8%", up: false },
          { label: "Other", amount: fmtMoney(ytdDemo * 0.15), widthPct: 18, change: "+0.2%", up: true },
        ];

  const statGrid = () => {
    if (access === "VIEWER") {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrmStatCard
            title="Activity stream"
            value="Live"
            hint="Read-only operational feed"
            trendLabel="+2.4% sessions (demo)"
            trendUp
            icon={Activity}
            href="/staff/stream"
          />
          <CrmStatCard
            title="Members on file"
            value={members}
            hint="Directory hidden for viewer band"
            trendLabel="Flat (demo)"
            trendUp
            icon={Users}
            href="/staff/stream"
          />
        </div>
      );
    }

    if (access === "AGENT") {
      return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CrmStatCard
            title="My applications"
            value={myApps}
            hint="Originated by you"
            trendLabel="+9.0% vs last month (demo)"
            trendUp
            icon={FileSignature}
            href="/staff/policies"
          />
          <CrmStatCard
            title="Members on file"
            value={members}
            hint="Tenant directory"
            trendLabel="+1.1% net adds (demo)"
            trendUp
            icon={Users}
            href="/staff/members"
          />
          <CrmStatCard
            title="Open claims"
            value={openClaims}
            hint="Tenant snapshot"
            trendLabel="-3.2% (demo)"
            trendUp={false}
            icon={ClipboardList}
            href="/staff/stream"
          />
          <CrmStatCard
            title="Activity stream"
            value="Open"
            hint="Stand-ups & escalations"
            trendLabel="+6.0% volume (demo)"
            trendUp
            icon={Activity}
            href="/staff/stream"
          />
        </div>
      );
    }

    // MANAGEMENT + ADMINISTRATION
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CrmStatCard
          title="Members on file"
          value={members}
          hint="Full tenant register"
          trendLabel="+2.6% vs last month (demo)"
          trendUp
          icon={Users}
          href="/staff/members"
        />
        <CrmStatCard
          title="Open claims"
          value={openClaims}
          hint="Open + assessing"
          trendLabel="-1.2% (demo)"
          trendUp={false}
          icon={ClipboardList}
          href="/staff/stream"
        />
        <CrmStatCard
          title="My applications"
          value={myApps}
          hint="Applications you own"
          trendLabel="+4.4% (demo)"
          trendUp
          icon={FileSignature}
          href="/staff/policies"
        />
        <CrmStatCard
          title="Collections pulse"
          value={fmtMoney(recentPayments.reduce((s, p) => s + p.amount, 0))}
          hint="Recent receipt window"
          trendLabel="+7.8% (demo)"
          trendUp
          icon={Banknote}
          href="/staff/accounts"
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <CrmTopBar
          title="Dashboard overview"
          subtitle={`Signed in as ${role}. This layout mirrors the owner dashboard shell with role-aware metrics — ${access === "MANAGEMENT" ? "management sees branch KPIs and collections context." : access === "ADMINISTRATION" ? "administration sees servicing and accounts weighting." : access === "AGENT" ? "agents see pipeline and member touchpoints." : "viewers get a safe read-only slice."}`}
        />
        <Link href="/staff/stream" className="shrink-0 text-sm font-semibold text-eyabantu-gold hover:text-eyabantu-navy md:mb-1">
          Activity stream →
        </Link>
      </div>

      {statGrid()}

      {access !== "VIEWER" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <CrmRevenueBreakdown rows={barRows} title={barTitle} />
          <CrmActivityHeatmap title="Team rhythm (demo)" />
        </div>
      ) : (
        <CrmActivityHeatmap title="Engagement (demo)" />
      )}

      {access !== "VIEWER" && dealRows.length ? (
        <CrmDealTable
          title={access === "MANAGEMENT" || access === "ADMINISTRATION" ? "Recent tenant receipts" : "Latest receipts (tenant)"}
          rows={dealRows}
          viewHref={access === "MANAGEMENT" || access === "ADMINISTRATION" ? "/staff/accounts" : "/staff/stream"}
        />
      ) : null}

      {access === "VIEWER" ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Viewer accounts hide financial detail. Ask an owner to adjust your access band if your duties change.
        </p>
      ) : null}
    </div>
  );
}
