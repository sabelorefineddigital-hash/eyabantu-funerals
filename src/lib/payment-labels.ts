import type { PaymentMethod } from "@prisma/client";

const LABELS: Record<PaymentMethod, string> = {
  DEBIT_ORDER: "Debit order",
  PAYFAST: "PayFast",
  MANUAL: "Manual / EFT",
  CASH: "Cash",
};

export function paymentMethodLabel(method: PaymentMethod): string {
  return LABELS[method] ?? method;
}
