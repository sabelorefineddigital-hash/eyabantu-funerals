import type { PaymentMethod } from "@prisma/client";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CasketIllustration } from "@/components/packages/PackageCard";
import { getPackageByCode } from "@/lib/eyabantu-packages";
import { paymentMethodLabel } from "@/lib/payment-labels";

export type ReceiptDocumentProps = {
  tenantName: string;
  receiptNumber: string;
  receivedAt: Date;
  amount: number;
  method: PaymentMethod;
  externalRef: string | null;
  packageCode?: string | null;
  member: {
    mainMemberName: string;
    policyNumber: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
};

function formatZar(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

export function ReceiptDocument({
  tenantName,
  receiptNumber,
  receivedAt,
  amount,
  method,
  externalRef,
  packageCode,
  member,
}: ReceiptDocumentProps) {
  const amt = formatZar(amount);
  const pkg = getPackageByCode(packageCode);

  return (
    <article
      id="receipt-document"
      className="receipt-sheet mx-auto max-w-[210mm] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none md:p-10"
    >
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 print:border-slate-300 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex shrink-0 justify-center sm:justify-start">
            <BrandLogo
              priority
              maxHeightClass="max-h-[2.625rem] sm:max-h-14 print:max-h-16"
              className="w-auto max-w-[min(100%,220px)] sm:max-w-[240px]"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c45f1c]">Official receipt</p>
            <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">{tenantName}</h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Funeral services administration — this document confirms premium or contribution received.
            </p>
          </div>
        </div>
        <div className="w-full shrink-0 rounded-xl bg-slate-50 px-4 py-3 text-center sm:w-auto sm:text-right print:bg-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Receipt no.</p>
          <p className="mt-1 font-mono text-base font-bold text-slate-900">{receiptNumber}</p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date issued</p>
          <p className="mt-1 text-xs font-medium text-slate-800">{formatDate(receivedAt)}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Received from</h2>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 print:border-slate-200 print:bg-white">
            <p className="text-base font-semibold text-slate-900">{member.mainMemberName}</p>
            {member.policyNumber ? (
              <p className="mt-2 text-xs text-slate-600">
                Policy / reference: <span className="font-mono font-medium text-slate-800">{member.policyNumber}</span>
              </p>
            ) : null}
            {member.phone ? <p className="mt-1 text-xs text-slate-600">Phone: {member.phone}</p> : null}
            {member.email ? <p className="mt-1 text-xs text-slate-600">Email: {member.email}</p> : null}
            {member.address ? (
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{member.address}</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Payment details</h2>
          <dl className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 print:border-slate-200">
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-slate-600">Method</dt>
              <dd className="font-semibold text-slate-900">{paymentMethodLabel(method)}</dd>
            </div>
            {externalRef ? (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-slate-600">Gateway reference</dt>
                <dd className="font-mono text-xs font-semibold text-slate-900">{externalRef}</dd>
              </div>
            ) : null}
            {pkg ? (
              <div className="rounded-lg border border-[#142a55]/10 bg-[#f8f9fb] p-3">
                <div className="flex items-center gap-3">
                  <CasketIllustration tier={pkg.tier} className="h-10 w-14 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#f18a00]">Package</p>
                    <p className="text-sm font-semibold text-[#142a55]">{pkg.title}</p>
                    {pkg.cashBack ? (
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Cash back R{pkg.cashBack.toLocaleString("en-ZA")}
                        {pkg.noFuneralPayout ? ` · No-funeral R${pkg.noFuneralPayout.toLocaleString("en-ZA")}` : ""}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="border-t border-dashed border-slate-200 pt-3">
              <div className="flex items-end justify-between gap-4">
                <dt className="text-sm font-semibold text-slate-700">Amount received</dt>
                <dd className="text-2xl font-bold tracking-tight text-[#c45f1c]">{amt}</dd>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Amount shown is in South African Rand (ZAR) and reflects funds allocated to the member account at time of
                capture.
              </p>
            </div>
          </dl>
        </section>
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-6 print:border-slate-300">
        <p className="text-center text-[11px] leading-relaxed text-slate-500">
          Thank you for supporting Eyabantu Funerals. Retain this receipt for your records. Queries: refer to your policy schedule or
          contact the scheme office. Demo environment — replace contact blocks with production details before go-live.
        </p>
      </footer>
    </article>
  );
}
