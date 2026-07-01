export function receiptPrintPath(paymentId: string) {
  return `/print/receipt/${encodeURIComponent(paymentId)}`;
}

export function buildReceiptShareUrl(paymentId: string, origin?: string) {
  const path = receiptPrintPath(paymentId);
  return origin ? `${origin}${path}` : path;
}
