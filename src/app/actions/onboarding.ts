"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/session";
import type { OnboardingFormData } from "@/lib/onboarding-form";
import { getPackageByCode } from "@/lib/eyabantu-packages";

export type SubmitOnboardingState = {
  error?: string;
  success?: boolean;
  reference?: string;
  applicationId?: string;
};

function calcTotalPremium(data: OnboardingFormData): number {
  const plan = getPackageByCode(data.packageCode)?.monthlyPremium ?? 0;
  const addons = data.addonCodes.reduce((sum, code) => sum + (getPackageByCode(code)?.monthlyPremium ?? 0), 0);
  const extended = data.dependants.reduce((sum, d) => sum + (parseFloat(d.premiumAmount) || 0), 0);
  return plan + addons + extended;
}

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `APP-${stamp.slice(-8)}`;
}

export async function submitOnboardingApplication(
  _prev: SubmitOnboardingState,
  payload: string,
): Promise<SubmitOnboardingState> {
  const session = await getSessionFromCookies();
  if (!session) return { error: "You must be signed in to submit an application." };
  if (session.role !== "OWNER" && session.role !== "STAFF") {
    return { error: "Only staff or owners can submit applications." };
  }

  let data: OnboardingFormData;
  try {
    data = JSON.parse(payload) as OnboardingFormData;
  } catch {
    return { error: "Invalid form data. Please try again." };
  }

  if (!data.principal.surname.trim() || !data.principal.firstName.trim()) {
    return { error: "Principal member surname and first name are required." };
  }
  if (!data.packageCode) {
    return { error: "Please select a premium plan before submitting." };
  }
  if (!data.declarationAccepted || !data.popiaAccepted) {
    return { error: "Declaration and POPIA consent must be accepted." };
  }
  if (!data.signatureName.trim()) {
    return { error: "Please type your full name as your digital signature." };
  }

  const totalPremium = calcTotalPremium(data);
  const extendedPremium = data.dependants.reduce((sum, d) => sum + (parseFloat(d.premiumAmount) || 0), 0);
  const reference = makeReference();

  const row = await prisma.clientApplication.create({
    data: {
      tenantId: session.tenantId,
      submittedById: session.sub,
      reference,
      status: "SUBMITTED",
      surname: data.principal.surname.trim(),
      firstName: data.principal.firstName.trim(),
      idNumber: data.principal.idNumber.trim() || null,
      employeeNumber: data.principal.employeeNumber.trim() || null,
      employerName: data.principal.employerName.trim() || null,
      maritalStatus: data.principal.maritalStatus || null,
      email: data.principal.email.trim() || null,
      cellphone: data.principal.cellphone.trim() || null,
      address: data.principal.address.trim() || null,
      addressCode: data.principal.addressCode.trim() || null,
      inceptionDate: data.principal.inceptionDate ? new Date(data.principal.inceptionDate) : null,
      groupBranch: data.principal.groupBranch.trim() || null,
      packageCode: data.packageCode,
      addonCodes: JSON.stringify(data.addonCodes),
      extendedPremium,
      totalPremium,
      accountHolder: data.banking.accountHolder.trim() || null,
      accountNumber: data.banking.accountNumber.trim() || null,
      bankName: data.banking.bankName.trim() || null,
      branchName: data.banking.branchName.trim() || null,
      branchCode: data.banking.branchCode.trim() || null,
      accountType: data.banking.accountType || null,
      debitDay: data.banking.debitDay || null,
      spousesJson: JSON.stringify(data.spouses),
      dependantsJson: JSON.stringify(data.dependants),
      beneficiariesJson: JSON.stringify(data.beneficiaries),
      declarationAccepted: data.declarationAccepted,
      popiaAccepted: data.popiaAccepted,
      signatureName: data.signatureName.trim(),
      signedAt: new Date(),
    },
  });

  revalidatePath("/owner/applications");
  revalidatePath("/staff/applications");

  return { success: true, reference: row.reference, applicationId: row.id };
}
