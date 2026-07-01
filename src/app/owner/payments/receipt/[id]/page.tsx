import { redirect } from "next/navigation";
import { receiptPrintPath } from "@/lib/receipt-share";

type Props = { params: Promise<{ id: string }> };

/** Legacy URL — redirect to the dedicated print layout (no CRM sidebar). */
export default async function LegacyReceiptRedirect({ params }: Props) {
  const { id } = await params;
  redirect(receiptPrintPath(id));
}
