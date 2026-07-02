"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { submitOnboardingApplication } from "@/app/actions/onboarding";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  FieldLabel,
  FormSectionBody,
  FormSectionHeader,
  fieldInputClass,
  fieldSelectClass,
} from "@/components/onboarding/FormSectionHeader";
import { PackageCard } from "@/components/packages/PackageCard";
import {
  ACCOUNT_TYPES,
  DEBIT_DAYS,
  EMPTY_BENEFICIARY,
  EMPTY_DEPENDANT,
  MARITAL_OPTIONS,
  ONBOARDING_STEPS,
  emptyOnboardingForm,
  type OnboardingFormData,
} from "@/lib/onboarding-form";
import {
  EYABANTU_WAITING_DAYS,
  addonPackages,
  formatZar,
  getPackageByCode,
  planPackages,
} from "@/lib/eyabantu-packages";

const inputClass = fieldInputClass;
const selectClass = fieldSelectClass;

const PLAN_GROUPS = [
  { section: "4.1", title: "Basic Caskets Premium Plan", tier: "BASIC" as const },
  { section: "4.2", title: "Mini Dome Premium Plan", tier: "MINI_DOME" as const },
  { section: "4.3", title: "Platinum Dome Premium Plan", tier: "PLATINUM_DOME" as const },
];

type Props = {
  basePath: "/owner/applications" | "/staff/applications";
};

export function OnboardingWizard({ basePath }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingFormData>(emptyOnboardingForm);
  const [planInitial, setPlanInitial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totalPremium = useMemo(() => {
    const plan = getPackageByCode(form.packageCode)?.monthlyPremium ?? 0;
    const addons = form.addonCodes.reduce((s, c) => s + (getPackageByCode(c)?.monthlyPremium ?? 0), 0);
    const extended = form.dependants.reduce((s, d) => s + (parseFloat(d.premiumAmount) || 0), 0);
    return plan + addons + extended;
  }, [form]);

  function updatePrincipal<K extends keyof OnboardingFormData["principal"]>(key: K, value: string) {
    setForm((f) => ({ ...f, principal: { ...f.principal, [key]: value } }));
  }

  function updateBanking<K extends keyof OnboardingFormData["banking"]>(key: K, value: string) {
    setForm((f) => ({ ...f, banking: { ...f.banking, [key]: value } }));
  }

  function next() {
    setError(null);
    if (step === 0 && (!form.principal.surname.trim() || !form.principal.firstName.trim())) {
      setError("Surname and first name are required.");
      return;
    }
    if (step === 3 && !form.packageCode) {
      setError("Please select one premium plan.");
      return;
    }
    setStep((s) => Math.min(s + 1, ONBOARDING_STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    setError(null);
    if (!form.declarationAccepted || !form.popiaAccepted) {
      setError("Please accept the declaration and POPIA consent.");
      return;
    }
    if (!form.signatureName.trim()) {
      setError("Type your full name as your digital signature.");
      return;
    }

    startTransition(async () => {
      const result = await submitOnboardingApplication({}, JSON.stringify(form));
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.applicationId) {
        router.push(`${basePath}/${result.applicationId}?submitted=1`);
        router.refresh();
      } else if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandLogo maxHeightClass="max-h-12" />
          <h1 className="mt-3 text-lg font-bold uppercase tracking-wide text-[#142a55] sm:text-xl">
            Eyabantu Funerals Application Form
          </h1>
          <p className="mt-1 text-xs text-slate-500">Digital onboarding — complete each section and submit.</p>
        </div>
        <div className="text-right text-[10px] text-slate-500">
          <p className="font-semibold text-[#142a55]">Siyakunakala Ngezikhathi Zonke</p>
          <p className="mt-1">033 413 1188 / 033 004 0424</p>
          <p>funerals@eyabantu.co.za</p>
        </div>
      </header>

      <nav aria-label="Form sections" className="overflow-x-auto">
        <ol className="flex min-w-max gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {ONBOARDING_STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
                  i === step
                    ? "bg-[#142a55] text-white shadow"
                    : i < step
                      ? "bg-white text-[#142a55]"
                      : "text-slate-500 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] ${
                    i < step ? "bg-[#f18a00] text-white" : i === step ? "bg-white/20" : "bg-slate-200"
                  }`}
                >
                  {i < step ? <Check className="h-3 w-3" /> : s.section}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="shadow-sm">
        {step === 0 && <PrincipalStep form={form} update={updatePrincipal} />}
        {step === 1 && <SpouseStep form={form} setForm={setForm} />}
        {step === 2 && <DependantsStep form={form} setForm={setForm} />}
        {step === 3 && (
          <PlanStep form={form} setForm={setForm} planInitial={planInitial} setPlanInitial={setPlanInitial} />
        )}
        {step === 4 && <BeneficiariesStep form={form} setForm={setForm} totalPremium={totalPremium} />}
        {step === 5 && <BankingConsentStep form={form} setForm={setForm} updateBanking={updateBanking} />}
        {step === 6 && <ReviewStep form={form} totalPremium={totalPremium} planInitial={planInitial} />}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <p className="text-xs text-slate-500">
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </p>

        {step < ONBOARDING_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1 rounded-xl bg-[#142a55] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f1f45]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f18a00] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#d97a00] disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit application
          </button>
        )}
      </footer>

      <p className="text-center text-[10px] text-slate-400">
        <Link href={basePath} className="text-[#142a55] hover:underline">
          View submitted applications
        </Link>
        {" · "}
        33 Bell Street, Greytown, KwaZulu-Natal 3250
      </p>
    </div>
  );
}

function PrincipalStep({
  form,
  update,
}: {
  form: OnboardingFormData;
  update: (k: keyof OnboardingFormData["principal"], v: string) => void;
}) {
  const p = form.principal;
  return (
    <>
      <FormSectionHeader number="1" title="Principal Member Details" />
      <FormSectionBody>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel htmlFor="surname">Surname</FieldLabel>
            <input id="surname" className={inputClass} value={p.surname} onChange={(e) => update("surname", e.target.value)} required />
          </div>
          <div>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <input id="firstName" className={inputClass} value={p.firstName} onChange={(e) => update("firstName", e.target.value)} required />
          </div>
          <div>
            <FieldLabel htmlFor="idNumber">ID Number</FieldLabel>
            <input id="idNumber" className={inputClass} value={p.idNumber} onChange={(e) => update("idNumber", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="employeeNumber">Employee / Member Number</FieldLabel>
            <input id="employeeNumber" className={inputClass} value={p.employeeNumber} onChange={(e) => update("employeeNumber", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="employerName">Employer Name</FieldLabel>
            <input id="employerName" className={inputClass} value={p.employerName} onChange={(e) => update("employerName", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="maritalStatus">Marital Status</FieldLabel>
            <select id="maritalStatus" className={selectClass} value={p.maritalStatus} onChange={(e) => update("maritalStatus", e.target.value)}>
              <option value="">Select…</option>
              {MARITAL_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <input id="email" type="email" className={inputClass} value={p.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="cellphone">Cellphone</FieldLabel>
            <input id="cellphone" className={inputClass} value={p.cellphone} onChange={(e) => update("cellphone", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="inceptionDate">Inception Date</FieldLabel>
            <input id="inceptionDate" type="date" className={inputClass} value={p.inceptionDate} onChange={(e) => update("inceptionDate", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <input id="address" className={inputClass} value={p.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="addressCode">Code</FieldLabel>
            <input id="addressCode" className={inputClass} value={p.addressCode} onChange={(e) => update("addressCode", e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="groupBranch">Group / Branch</FieldLabel>
            <input id="groupBranch" className={inputClass} value={p.groupBranch} onChange={(e) => update("groupBranch", e.target.value)} />
          </div>
        </div>
      </FormSectionBody>
    </>
  );
}

function SpouseStep({ form, setForm }: { form: OnboardingFormData; setForm: React.Dispatch<React.SetStateAction<OnboardingFormData>> }) {
  return (
    <>
      <FormSectionHeader number="2" title="Spouse's Details" />
      <FormSectionBody className="space-y-6">
        {form.spouses.map((spouse, idx) => (
          <div key={idx}>
            <p className="mb-3 text-xs font-bold uppercase text-[#142a55]">Spouse {idx + 1}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(["surname", "firstName", "idNumber"] as const).map((field) => (
                <div key={field}>
                  <FieldLabel>{field === "firstName" ? "First Name" : field === "idNumber" ? "ID Number" : "Surname"}</FieldLabel>
                  <input
                    className={inputClass}
                    value={spouse[field]}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const spouses = [...f.spouses] as typeof f.spouses;
                        spouses[idx] = { ...spouses[idx], [field]: v };
                        return { ...f, spouses };
                      });
                    }}
                  />
                </div>
              ))}
              <div>
                <FieldLabel>Date of Birth</FieldLabel>
                <input
                  type="date"
                  className={inputClass}
                  value={spouse.dateOfBirth}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      const spouses = [...f.spouses] as typeof f.spouses;
                      spouses[idx] = { ...spouses[idx], dateOfBirth: v };
                      return { ...f, spouses };
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </FormSectionBody>
    </>
  );
}

function DependantsStep({ form, setForm }: { form: OnboardingFormData; setForm: React.Dispatch<React.SetStateAction<OnboardingFormData>> }) {
  const totalExtended = form.dependants.reduce((s, d) => s + (parseFloat(d.premiumAmount) || 0), 0);

  function updateRow(i: number, field: keyof typeof EMPTY_DEPENDANT, value: string) {
    setForm((f) => {
      const dependants = [...f.dependants];
      dependants[i] = { ...dependants[i], [field]: value };
      return { ...f, dependants };
    });
  }

  function addRow() {
    if (form.dependants.length >= 10) return;
    setForm((f) => ({ ...f, dependants: [...f.dependants, { ...EMPTY_DEPENDANT }] }));
  }

  return (
    <>
      <FormSectionHeader number="3" title="Dependants & Extended Family Member Details" />
      <FormSectionBody>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-left text-[10px] font-bold uppercase text-slate-600">
                <th className="w-8 border border-slate-300 px-2 py-2">#</th>
                <th className="border border-slate-300 px-2 py-2">Name & Surname</th>
                <th className="border border-slate-300 px-2 py-2">ID Number / Date of Birth</th>
                <th className="border border-slate-300 px-2 py-2">Relationship</th>
                <th className="border border-slate-300 px-2 py-2">Benefit Amount</th>
                <th className="border border-slate-300 px-2 py-2">Premium Amount</th>
              </tr>
            </thead>
            <tbody>
              {form.dependants.map((row, i) => (
                <tr key={i}>
                  <td className="border border-slate-300 px-2 py-1 text-center font-semibold text-slate-500">{i + 1}</td>
                  {(["nameSurname", "idOrDob", "relationship", "benefitAmount", "premiumAmount"] as const).map((field) => (
                    <td key={field} className="border border-slate-300 p-1">
                      <input
                        className="w-full min-w-[100px] rounded border border-slate-200 px-2 py-1.5 text-xs"
                        value={row[field]}
                        onChange={(e) => updateRow(i, field, e.target.value)}
                        placeholder={field === "premiumAmount" ? "R" : ""}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={addRow}
            disabled={form.dependants.length >= 10}
            className="rounded-lg border border-dashed border-[#142a55]/30 px-3 py-1.5 text-xs font-semibold text-[#142a55] disabled:opacity-40"
          >
            + Add row ({form.dependants.length}/10)
          </button>
          <div className="text-sm font-bold text-[#142a55]">Total extended family premium: {formatZar(totalExtended)}</div>
        </div>
      </FormSectionBody>
    </>
  );
}

function PlanStep({
  form,
  setForm,
  planInitial,
  setPlanInitial,
}: {
  form: OnboardingFormData;
  setForm: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  planInitial: string;
  setPlanInitial: (v: string) => void;
}) {
  const plans = planPackages();
  const addons = addonPackages();

  function selectPlan(code: string) {
    setForm((f) => ({ ...f, packageCode: code }));
  }

  function toggleAddon(code: string) {
    setForm((f) => ({
      ...f,
      addonCodes: f.addonCodes.includes(code) ? f.addonCodes.filter((c) => c !== code) : [...f.addonCodes, code],
    }));
  }

  return (
    <>
      <FormSectionHeader number="4" title="Premium Plan Selection" />
      <FormSectionBody className="space-y-6">
        {PLAN_GROUPS.map((group) => {
          const groupPlans = plans.filter((p) => p.tier === group.tier);
          return (
            <div key={group.section}>
              <p className="mb-3 text-xs font-bold uppercase text-slate-700">
                {group.section} {group.title}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {groupPlans.map((pkg) => (
                  <div key={pkg.code} className="space-y-2">
                    <PackageCard pkg={pkg} selected={form.packageCode === pkg.code} onSelect={() => selectPlan(pkg.code)} compact />
                    {form.packageCode === pkg.code ? (
                      <div className="flex items-center gap-2 rounded-lg border border-[#f18a00]/40 bg-[#fff8ef] px-2 py-1.5">
                        <span className="text-[9px] font-bold uppercase text-slate-500">Initial</span>
                        <input
                          className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs uppercase"
                          value={planInitial}
                          onChange={(e) => setPlanInitial(e.target.value)}
                          placeholder="Your initials"
                          maxLength={4}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div>
          <p className="mb-3 text-xs font-bold uppercase text-slate-700">4.4 Additional Individual Rates</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {addons.map((pkg) => (
              <label
                key={pkg.code}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${
                  form.addonCodes.includes(pkg.code) ? "border-[#f18a00] bg-[#fff8ef]" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.addonCodes.includes(pkg.code)}
                  onChange={() => toggleAddon(pkg.code)}
                  className="h-4 w-4 accent-[#f18a00]"
                />
                <div>
                  <p className="text-sm font-bold text-[#142a55]">{formatZar(pkg.monthlyPremium)}</p>
                  <p className="text-[10px] text-slate-500">{pkg.title}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </FormSectionBody>
    </>
  );
}

function BeneficiariesStep({
  form,
  setForm,
  totalPremium,
}: {
  form: OnboardingFormData;
  setForm: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  totalPremium: number;
}) {
  const plan = getPackageByCode(form.packageCode);
  const addonTotal = form.addonCodes.reduce((s, c) => s + (getPackageByCode(c)?.monthlyPremium ?? 0), 0);
  const extended = form.dependants.reduce((s, d) => s + (parseFloat(d.premiumAmount) || 0), 0);

  function updateBeneficiary(i: number, field: keyof typeof EMPTY_BENEFICIARY, value: string) {
    setForm((f) => {
      const beneficiaries = [...f.beneficiaries];
      beneficiaries[i] = { ...beneficiaries[i], [field]: value };
      return { ...f, beneficiaries };
    });
  }

  function addBeneficiary() {
    setForm((f) => ({ ...f, beneficiaries: [...f.beneficiaries, { ...EMPTY_BENEFICIARY }] }));
  }

  return (
    <>
      <FormSectionHeader number="5" title="Beneficiary Nomination" />
      <FormSectionBody className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-left text-[10px] font-bold uppercase text-slate-600">
                <th className="border border-slate-300 px-2 py-2">Name</th>
                <th className="border border-slate-300 px-2 py-2">Surname</th>
                <th className="border border-slate-300 px-2 py-2">ID Number</th>
                <th className="border border-slate-300 px-2 py-2">Phone Number</th>
                <th className="border border-slate-300 px-2 py-2">Relationship</th>
              </tr>
            </thead>
            <tbody>
              {form.beneficiaries.map((b, i) => (
                <tr key={i}>
                  {(["name", "surname", "idNumber", "phone", "relationship"] as const).map((field) => (
                    <td key={field} className="border border-slate-300 p-1">
                      <input
                        className="w-full min-w-[90px] rounded border border-slate-200 px-2 py-1.5 text-xs"
                        value={b[field]}
                        onChange={(e) => updateBeneficiary(i, field, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addBeneficiary}
          className="mt-3 rounded-lg border border-dashed border-[#142a55]/30 px-3 py-1.5 text-xs font-semibold text-[#142a55]"
        >
          + Add beneficiary
        </button>
      </FormSectionBody>

      <FormSectionHeader number="6" title="Premium Calculation Summary" />
      <FormSectionBody className="mb-6">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 font-medium text-slate-600">Premium plan</td>
              <td className="py-2 text-right font-semibold text-[#142a55]">
                {plan ? `${plan.title} — ${formatZar(plan.monthlyPremium)}` : "—"}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 font-medium text-slate-600">Additional amounts</td>
              <td className="py-2 text-right font-semibold text-[#142a55]">{formatZar(addonTotal)}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 font-medium text-slate-600">Extended family premium</td>
              <td className="py-2 text-right font-semibold text-[#142a55]">{formatZar(extended)}</td>
            </tr>
            <tr>
              <td className="py-3 text-base font-bold text-[#142a55]">Total premium due</td>
              <td className="py-3 text-right text-lg font-extrabold text-[#f18a00]">{formatZar(totalPremium)}</td>
            </tr>
          </tbody>
        </table>
      </FormSectionBody>

      <FormSectionHeader number="7" title="Waiting Periods" />
      <FormSectionBody>
        <p className="text-sm leading-relaxed text-slate-700">
          There is no waiting period in respect of accidental death claims. All insured members have a{" "}
          <strong>{EYABANTU_WAITING_DAYS} days</strong> waiting period on natural death in this promotional product.
        </p>
      </FormSectionBody>
    </>
  );
}

function BankingConsentStep({
  form,
  setForm,
  updateBanking,
}: {
  form: OnboardingFormData;
  setForm: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  updateBanking: (k: keyof OnboardingFormData["banking"], v: string) => void;
}) {
  const b = form.banking;

  return (
    <>
      <FormSectionHeader number="8" title="Declaration" />
      <FormSectionBody className="mb-6">
        <p className="text-sm leading-relaxed text-slate-700">
          I hereby declare that all information provided on this application form is true and correct. I authorise
          Eyabantu Funerals to collect monthly premiums in accordance with the selected plan and to process this
          application for funeral cover.
        </p>
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.declarationAccepted}
            onChange={(e) => setForm((f) => ({ ...f, declarationAccepted: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[#f18a00]"
          />
          <span className="text-sm font-medium text-[#142a55]">I accept the declaration above</span>
        </label>
      </FormSectionBody>

      <FormSectionHeader number="9" title="Debit Order Authorisation & Banking Details" />
      <FormSectionBody className="mb-6">
        <p className="mb-4 text-xs leading-relaxed text-slate-600">
          I authorise Eyabantu Funerals to deduct the monthly premium from my bank account on the selected debit date
          until I cancel this mandate in writing.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel>Account Holder Name</FieldLabel>
            <input className={inputClass} value={b.accountHolder} onChange={(e) => updateBanking("accountHolder", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Account Number</FieldLabel>
            <input className={inputClass} value={b.accountNumber} onChange={(e) => updateBanking("accountNumber", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Bank Name</FieldLabel>
            <input className={inputClass} value={b.bankName} onChange={(e) => updateBanking("bankName", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Branch Name</FieldLabel>
            <input className={inputClass} value={b.branchName} onChange={(e) => updateBanking("branchName", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Branch Code</FieldLabel>
            <input className={inputClass} value={b.branchCode} onChange={(e) => updateBanking("branchCode", e.target.value)} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="text-[10px] font-bold uppercase text-slate-600">Account Type</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {ACCOUNT_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="accountType"
                    checked={b.accountType === t}
                    onChange={() => updateBanking("accountType", t)}
                    className="accent-[#f18a00]"
                  />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[10px] font-bold uppercase text-slate-600">Debit Date</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {DEBIT_DAYS.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="debitDay"
                    checked={b.debitDay === d}
                    onChange={() => updateBanking("debitDay", d)}
                    className="accent-[#f18a00]"
                  />
                  {d}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </FormSectionBody>

      <FormSectionHeader number="10" title="POPIA Consent" />
      <FormSectionBody>
        <p className="text-sm leading-relaxed text-slate-700">
          I consent to Eyabantu Funerals storing, verifying, and sharing my personal information as required to
          process this application, administer my policy, and comply with applicable law (POPIA).
        </p>
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.popiaAccepted}
            onChange={(e) => setForm((f) => ({ ...f, popiaAccepted: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[#f18a00]"
          />
          <span className="text-sm font-medium text-[#142a55]">I consent under POPIA</span>
        </label>

        <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="signatureName">Signature of principal member (type full name)</FieldLabel>
            <input
              id="signatureName"
              className={`${inputClass} font-serif italic`}
              value={form.signatureName}
              onChange={(e) => setForm((f) => ({ ...f, signatureName: e.target.value }))}
              placeholder="Full legal name"
            />
          </div>
          <div>
            <FieldLabel>Date</FieldLabel>
            <input className={inputClass} type="date" defaultValue={new Date().toISOString().slice(0, 10)} readOnly />
          </div>
        </div>
      </FormSectionBody>
    </>
  );
}

function ReviewStep({
  form,
  totalPremium,
  planInitial,
}: {
  form: OnboardingFormData;
  totalPremium: number;
  planInitial: string;
}) {
  const plan = getPackageByCode(form.packageCode);
  const p = form.principal;

  return (
    <>
      <FormSectionHeader number="✓" title="Review & Submit" />
      <FormSectionBody className="space-y-4 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewBlock title="Principal member">
            <p>
              {p.firstName} {p.surname}
            </p>
            <p className="text-slate-500">
              ID: {p.idNumber || "—"} · {p.cellphone || "—"}
            </p>
          </ReviewBlock>
          <ReviewBlock title="Selected plan">
            <p className="font-semibold text-[#142a55]">{plan?.title ?? "—"}</p>
            <p className="text-slate-500">
              {formatZar(plan?.monthlyPremium ?? 0)}
              {planInitial ? ` · Initials: ${planInitial}` : ""}
            </p>
          </ReviewBlock>
          <ReviewBlock title="Banking">
            <p>{form.banking.bankName || "—"}</p>
            <p className="text-slate-500">
              {form.banking.accountHolder || "—"} · Debit: {form.banking.debitDay || "—"}
            </p>
          </ReviewBlock>
          <ReviewBlock title="Total monthly premium">
            <p className="text-xl font-extrabold text-[#f18a00]">{formatZar(totalPremium)}</p>
          </ReviewBlock>
        </div>
        <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          By submitting, you confirm all details are correct and your digital signature ({form.signatureName || "—"}) is
          binding.
        </p>
      </FormSectionBody>
    </>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-[10px] font-bold uppercase text-slate-500">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
