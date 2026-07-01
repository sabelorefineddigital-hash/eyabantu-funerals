import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import {
  CrmActivityHeatmap,
  CrmDealTable,
  type DealRow,
  CrmRevenueBreakdown,
  CrmStatCard,
} from "@/components/crm/CrmDashboardKit";
import { Banknote, ClipboardList, HeartPulse, Users } from "lucide-react";

function fmtMoney(n: number) {
  return `R${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

const DEMO_DEALS: DealRow[] = [
  {
    id: "DEMO-001",
    org: "Mkhize household",
    rep: "Debit order",
    paidOn: "—",
    amount: "R1 240.00",
    status: "Paid",
  },
  {
    id: "DEMO-002",
    org: "Zulu family policy",
    rep: "PayFast",
    paidOn: "—",
    amount: "R890.00",
    status: "Pending",
  },
];

export default async function OwnerHomePage() {
  const session = await requireOwnerSession();

  const tenantId = session.tenantId;
  await syncAllMemberAccountsForTenant(tenantId);
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  const [members, defaulted, claimsOpen, funeralsUpcoming, applicationsPending, lastPayments, activeMembers, ytdSum] =
    await Promise.all([
      prisma.member.count({ where: { tenantId } }),
      prisma.member.count({ where: { tenantId, status: "DEFAULTED" } }),
      prisma.claim.count({ where: { tenantId, status: { in: ["OPEN", "ASSESSING"] } } }),
      prisma.funeral.count({
        where: { tenantId, funeralDate: { gte: new Date() } },
      }),
      prisma.policyApplication.count({
        where: { tenantId, status: "PENDING_UNDERWRITER" },
      }),
      prisma.payment.findMany({
        where: { member: { tenantId } },
        orderBy: { receivedAt: "desc" },
        take: 6,
        include: { member: { select: { mainMemberName: true } } },
      }),
      prisma.member.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { member: { tenantId }, receivedAt: { gte: yearStart } },
        _sum: { amount: true },
      }),
    ]);

  const collectionRate = members === 0 ? 0 : Math.round((activeMembers / members) * 100);
  const ytd = ytdSum._sum.amount ?? 0;

  const dealRows: DealRow[] =
    lastPayments.length > 0
      ? lastPayments.map((p) => ({
          id: p.receiptNumber.slice(0, 12),
          org: p.member.mainMemberName,
          rep: p.method === "PAYFAST" ? "PayFast" : p.method === "DEBIT_ORDER" ? "Debit order" : String(p.method),
          paidOn: fmtDate(p.receivedAt),
          amount: fmtMoney(p.amount),
          status: p.status === "COMPLETED" ? ("Paid" as const) : ("Pending" as const),
        }))
      : DEMO_DEALS;

  const barRows =
    ytd > 0
      ? [
          { label: "Premiums collected", amount: fmtMoney(ytd * 0.62), widthPct: 62, change: "+6.2%", up: true },
          { label: "Add-ons & riders", amount: fmtMoney(ytd * 0.18), widthPct: 28, change: "+2.1%", up: true },
          { label: "Arrears recovery", amount: fmtMoney(ytd * 0.12), widthPct: 18, change: "-1.4%", up: false },
          { label: "Other / adjustments", amount: fmtMoney(ytd * 0.08), widthPct: 12, change: "+0.3%", up: true },
        ]
      : [
          { label: "Premiums collected", amount: "R0.00", widthPct: 40, change: "—", up: true },
          { label: "Add-ons & riders", amount: "R0.00", widthPct: 25, change: "—", up: true },
          { label: "Arrears recovery", amount: "R0.00", widthPct: 20, change: "—", up: false },
          { label: "Other / adjustments", amount: "R0.00", widthPct: 15, change: "—", up: true },
        ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <CrmTopBar
          title="Dashboard overview"
          subtitle="Owner workspace — full visibility across members, collections, claims, funerals, and compliance. Figures blend live tenant data with illustrative trends for this demo."
        />
        <Link
          href="/owner/stream"
          className="shrink-0 text-sm font-semibold text-eyabantu-gold hover:text-eyabantu-navy md:mb-1"
        >
          Open activity stream →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CrmStatCard
          title="Total members"
          value={members}
          hint={`${activeMembers} active · ${defaulted} in default`}
          trendLabel="+3.8% vs last month (demo)"
          trendUp
          icon={Users}
          href="/owner/members"
        />
        <CrmStatCard
          title="Revenue (YTD)"
          value={fmtMoney(ytd)}
          hint="Receipted premiums in calendar year"
          trendLabel="+11.2% vs prior YTD (demo)"
          trendUp
          icon={Banknote}
          href="/owner/payments"
        />
        <CrmStatCard
          title="Open claims"
          value={claimsOpen}
          hint="Open + assessing"
          trendLabel="-4.0% vs last month (demo)"
          trendUp={false}
          icon={ClipboardList}
          href="/owner/claims"
        />
        <CrmStatCard
          title="Upcoming funerals"
          value={funeralsUpcoming}
          hint="Scheduled from today"
          trendLabel="+1 funeral vs last week (demo)"
          trendUp
          icon={HeartPulse}
          href="/owner/funerals"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CrmRevenueBreakdown rows={barRows} />
        <CrmActivityHeatmap title="Workspace activity (demo)" />
      </div>

      <section className="eyabantu-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="eyabantu-section-header">Underwriting & logistics</div>
            <p className="mt-3 max-w-xl text-xs text-muted">
              {applicationsPending} application{applicationsPending === 1 ? "" : "s"} awaiting underwriter gateway.
              Hearses, Sprinters, and chapel allocations stay aligned with driver and staff rosters.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/owner/policies"
              className="rounded-lg border border-eyabantu-gold/40 bg-eyabantu-cream px-3 py-2 text-xs font-semibold text-eyabantu-navy hover:border-eyabantu-gold"
            >
              Policies
            </Link>
            <Link
              href="/owner/internal-affairs"
              className="rounded-lg border border-eyabantu-gold/40 bg-eyabantu-cream px-3 py-2 text-xs font-semibold text-eyabantu-navy hover:border-eyabantu-gold"
            >
              Internal affairs
            </Link>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Collection health (active vs total): <span className="font-bold text-eyabantu-navy">{collectionRate}%</span>
        </p>
      </section>

      <CrmDealTable title="Recent receipts & collections" rows={dealRows} viewHref="/owner/payments" />
    </div>
  );
}
