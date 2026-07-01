import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { FormSectionBody, FormSectionHeader } from "@/components/onboarding/FormSectionHeader";
import { formatZar, getPackageByCode } from "@/lib/eyabantu-packages";
import type { BeneficiaryEntry, DependantEntry, SpouseEntry } from "@/lib/onboarding-form";

type Search = { [key: string]: string | string[] | undefined };

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Search>;
}) {
  const session = await requireOwnerSession();
  const { id } = await params;
  const sp = await searchParams;
  const justSubmitted = sp.submitted === "1";

  const app = await prisma.clientApplication.findFirst({
    where: { id, tenantId: session.tenantId },
    include: { submittedBy: { select: { firstName: true, lastName: true, email: true } } },
  });

  if (!app) notFound();

  const pkg = getPackageByCode(app.packageCode);
  const addonCodes: string[] = app.addonCodes ? JSON.parse(app.addonCodes) : [];
  const spouses: SpouseEntry[] = app.spousesJson ? JSON.parse(app.spousesJson) : [];
  const dependants: DependantEntry[] = app.dependantsJson ? JSON.parse(app.dependantsJson) : [];
  const beneficiaries: BeneficiaryEntry[] = app.beneficiariesJson ? JSON.parse(app.beneficiariesJson) : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <CrmTopBar
        title={`Application ${app.reference}`}
        subtitle={`${app.firstName} ${app.surname} · ${app.status}`}
        action={
          <Link href="/owner/applications" className="rounded-xl border border-[#142a55]/15 px-4 py-2 text-xs font-semibold text-[#142a55]">
            All applications
          </Link>
        }
      />

      {justSubmitted ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Application submitted successfully. Reference <strong className="font-mono">{app.reference}</strong>.
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-[10px] font-bold uppercase text-slate-500">Principal member</dt>
            <dd className="font-semibold text-[#142a55]">
              {app.firstName} {app.surname}
            </dd>
            <dd className="text-xs text-slate-500">ID: {app.idNumber ?? "—"} · {app.cellphone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase text-slate-500">Plan & premium</dt>
            <dd className="font-semibold text-[#142a55]">{pkg?.title ?? "—"}</dd>
            <dd className="text-lg font-extrabold text-[#f18a00]">{formatZar(app.totalPremium)}/mo</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase text-slate-500">Banking</dt>
            <dd>{app.bankName ?? "—"}</dd>
            <dd className="text-xs text-slate-500">
              {app.accountHolder ?? "—"} · {app.accountType ?? "—"} · Debit {app.debitDay ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase text-slate-500">Signature</dt>
            <dd className="font-serif italic">{app.signatureName ?? "—"}</dd>
            <dd className="text-xs text-slate-500">{app.signedAt?.toLocaleDateString("en-ZA") ?? "—"}</dd>
          </div>
        </dl>
      </div>

      {spouses.some((s) => s.surname || s.firstName) ? (
        <section>
          <FormSectionHeader number="2" title="Spouse details" />
          <FormSectionBody>
            <ul className="space-y-2 text-sm">
              {spouses.map((s, i) =>
                s.surname || s.firstName ? (
                  <li key={i}>
                    {s.firstName} {s.surname} — {s.idNumber || "—"}
                  </li>
                ) : null,
              )}
            </ul>
          </FormSectionBody>
        </section>
      ) : null}

      {dependants.some((d) => d.nameSurname) ? (
        <section>
          <FormSectionHeader number="3" title="Dependants" />
          <FormSectionBody>
            <ul className="space-y-1 text-sm">
              {dependants
                .filter((d) => d.nameSurname)
                .map((d, i) => (
                  <li key={i}>
                    {d.nameSurname} ({d.relationship}) — premium {d.premiumAmount || "—"}
                  </li>
                ))}
            </ul>
          </FormSectionBody>
        </section>
      ) : null}

      {addonCodes.length > 0 ? (
        <section>
          <FormSectionHeader number="4.4" title="Additional rates" />
          <FormSectionBody>
            <ul className="text-sm">
              {addonCodes.map((code) => (
                <li key={code}>{getPackageByCode(code)?.title ?? code}</li>
              ))}
            </ul>
          </FormSectionBody>
        </section>
      ) : null}

      {beneficiaries.some((b) => b.name || b.surname) ? (
        <section>
          <FormSectionHeader number="5" title="Beneficiaries" />
          <FormSectionBody>
            <ul className="space-y-1 text-sm">
              {beneficiaries
                .filter((b) => b.name || b.surname)
                .map((b, i) => (
                  <li key={i}>
                    {b.name} {b.surname} — {b.relationship} — {b.phone}
                  </li>
                ))}
            </ul>
          </FormSectionBody>
        </section>
      ) : null}

      <p className="text-center text-xs text-slate-400">
        Captured by {app.submittedBy ? `${app.submittedBy.firstName} ${app.submittedBy.lastName}` : "system"} on{" "}
        {app.createdAt.toLocaleString("en-ZA")}
      </p>
    </div>
  );
}
