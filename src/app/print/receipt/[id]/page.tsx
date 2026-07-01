import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCrmSession } from "@/lib/crm-auth";
import { ReceiptDocument } from "@/components/receipt/receipt-document";
import { ReceiptToolbar } from "@/components/receipt/receipt-toolbar";

type Props = { params: Promise<{ id: string }> };

export default async function ReceiptPrintPage({ params }: Props) {
  const session = await requireCrmSession();
  const { id } = await params;

  const [payment, tenant] = await Promise.all([
    prisma.payment.findFirst({
      where: {
        id,
        member: { tenantId: session.tenantId },
      },
      include: {
        member: {
          select: {
            mainMemberName: true,
            policyNumber: true,
            phone: true,
            email: true,
            address: true,
          },
        },
      },
    }),
    prisma.tenant.findUnique({
      where: { id: session.tenantId },
      select: { name: true },
    }),
  ]);

  if (!payment || !tenant) notFound();

  const amountFormatted = `R${payment.amount.toFixed(2)}`;

  return (
    <div className="mx-auto max-w-[210mm]">
      <ReceiptToolbar
        paymentId={payment.id}
        receiptNumber={payment.receiptNumber}
        memberName={payment.member.mainMemberName}
        memberEmail={payment.member.email}
        amountFormatted={amountFormatted}
        backHref="/owner/payments"
      />
      <ReceiptDocument
        tenantName={tenant.name}
        receiptNumber={payment.receiptNumber}
        receivedAt={payment.receivedAt}
        amount={payment.amount}
        method={payment.method}
        externalRef={payment.externalRef}
        packageCode={payment.packageCode}
        member={payment.member}
      />
    </div>
  );
}
