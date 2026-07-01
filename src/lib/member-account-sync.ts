import type { MemberStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MS_PER_DAY = 86400000;
/** Expected days between premium collections for arrears heuristics. */
const BILLING_CYCLE_DAYS = 30;

type LedgerComputed = {
  lastPaymentAt: Date | null;
  missedPayments: number;
  status: MemberStatus;
};

/**
 * Derives missed debits and status from the latest completed payment vs monthly premium.
 * Used after every payment write and periodically so Accounts / Members stay aligned with the ledger.
 */
export function computeMemberLedgerFromPayments(args: {
  monthlyPremium: number;
  memberCreatedAt: Date;
  lastCompletedPaymentAt: Date | null;
}): LedgerComputed {
  const { monthlyPremium, memberCreatedAt, lastCompletedPaymentAt } = args;

  const lastPaymentAt = lastCompletedPaymentAt;

  if (monthlyPremium <= 0) {
    return {
      lastPaymentAt,
      missedPayments: 0,
      status: "ACTIVE",
    };
  }

  const anchor = lastCompletedPaymentAt ?? memberCreatedAt;
  const daysSince = Math.max(0, Math.floor((Date.now() - anchor.getTime()) / MS_PER_DAY));
  const missed =
    daysSince < BILLING_CYCLE_DAYS ? 0 : Math.min(12, Math.floor(daysSince / BILLING_CYCLE_DAYS));

  let status: MemberStatus = "ACTIVE";
  if (missed >= 3) status = "DEFAULTED";

  return { lastPaymentAt, missedPayments: missed, status };
}

function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * MS_PER_DAY);
}

export async function syncMemberAccountFromLedger(memberId: string, tenantId: string) {
  const member = await prisma.member.findFirst({
    where: { id: memberId, tenantId },
    select: { id: true, monthlyPremium: true, createdAt: true },
  });
  if (!member) return;

  const lastPay = await prisma.payment.findFirst({
    where: { memberId, status: "COMPLETED" },
    orderBy: { receivedAt: "desc" },
    select: { receivedAt: true },
  });

  const computed = computeMemberLedgerFromPayments({
    monthlyPremium: member.monthlyPremium,
    memberCreatedAt: member.createdAt,
    lastCompletedPaymentAt: lastPay?.receivedAt ?? null,
  });

  await prisma.member.update({
    where: { id: memberId },
    data: {
      lastPaymentAt: computed.lastPaymentAt,
      missedPayments: computed.missedPayments,
      status: computed.status,
      ...(computed.lastPaymentAt
        ? { nextDebitAt: addDays(computed.lastPaymentAt, BILLING_CYCLE_DAYS) }
        : {}),
    },
  });
}

export async function syncAllMemberAccountsForTenant(tenantId: string) {
  const members = await prisma.member.findMany({
    where: { tenantId },
    select: { id: true },
  });
  for (const m of members) {
    await syncMemberAccountFromLedger(m.id, tenantId);
  }
}
