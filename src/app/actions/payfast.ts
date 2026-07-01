"use server";

import { revalidatePath } from "next/cache";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/session";
import { logActivity } from "@/lib/activity";
import { syncMemberAccountFromLedger } from "@/lib/member-account-sync";

/**
 * Demo-only stub: in production, build a signed PayFast payment request
 * and redirect the member to PayFast hosted checkout.
 *
 * When `memberId` is provided, a completed PAYFAST payment row is also written
 * so the ledger, member status, and Accounts view stay in sync.
 */
export async function createPayfastDemoIntent(input: {
  amount: number;
  memberName: string;
  memberId?: string;
}) {
  const session = await getSessionFromCookies();
  if (!session) throw new Error("Unauthorized");

  const { amount, memberName, memberId } = input;

  await logActivity({
    tenantId: session.tenantId,
    userId: session.sub,
    action: "PAYFAST_INTENT_CREATED",
    entityType: "PaymentGateway",
    summary: `PayFast sandbox intent prepared for R${amount.toFixed(2)} — ${memberName}`,
    metadata: { provider: "PAYFAST", sandbox: true },
  });

  let paymentId: string | undefined;
  let receiptNumber: string | undefined;

  if (memberId && Number.isFinite(amount) && amount > 0) {
    const member = await prisma.member.findFirst({
      where: { id: memberId, tenantId: session.tenantId },
      select: { id: true, mainMemberName: true },
    });
    if (member) {
      receiptNumber = `RCP-PF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
      const payment = await prisma.payment.create({
        data: {
          memberId: member.id,
          amount,
          method: PaymentMethod.PAYFAST,
          status: PaymentStatus.COMPLETED,
          receiptNumber,
          externalRef: `PF-DEMO-${Date.now()}`,
        },
      });
      paymentId = payment.id;
      await syncMemberAccountFromLedger(member.id, session.tenantId);
      await logActivity({
        tenantId: session.tenantId,
        userId: session.sub,
        action: "PAYMENT_RECEIVED",
        entityType: "Payment",
        entityId: payment.id,
        summary: `PayFast (demo) payment of R${amount.toFixed(2)} recorded for ${member.mainMemberName}`,
        metadata: { receiptNumber, provider: "PAYFAST", sandbox: true },
      });
      revalidatePath("/owner/payments");
      revalidatePath("/owner/members");
      revalidatePath("/owner/accounts");
      revalidatePath("/owner");
      revalidatePath("/staff");
    }
  }

  return {
    checkoutUrl: `https://sandbox.payfast.co.za/eng/process?demo=1&amount=${encodeURIComponent(String(amount))}`,
    message:
      "This is a demo stub. Wire your merchant ID, passphrase, and ITN handler before accepting live payments.",
    recordedPaymentId: paymentId,
    receiptNumber,
  };
}
