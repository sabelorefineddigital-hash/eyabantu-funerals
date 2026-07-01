import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { ReceiptDocument } from "@/components/receipt/receipt-document";
import { ReceiptToolbar } from "@/components/receipt/receipt-toolbar";

type Props = { params: Promise<{ id: string }> };

export default async function OwnerReceiptPage({ params }: Props) {
  const { id } = await params;
  const session = await requireOwnerSession();

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
    <div className="receipt-page">
      <ReceiptToolbar
        paymentId={payment.id}
        receiptNumber={payment.receiptNumber}
        memberName={payment.member.mainMemberName}
        memberEmail={payment.member.email}
        amountFormatted={amountFormatted}
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
      <style>{`
        #receipt-document img {
          background: transparent !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
