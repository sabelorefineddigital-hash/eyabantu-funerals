export type SpouseEntry = {
  surname: string;
  firstName: string;
  idNumber: string;
  dateOfBirth: string;
};

export type DependantEntry = {
  nameSurname: string;
  idOrDob: string;
  relationship: string;
  benefitAmount: string;
  premiumAmount: string;
};

export type BeneficiaryEntry = {
  name: string;
  surname: string;
  idNumber: string;
  phone: string;
  relationship: string;
};

export type OnboardingFormData = {
  principal: {
    surname: string;
    firstName: string;
    idNumber: string;
    employeeNumber: string;
    employerName: string;
    maritalStatus: string;
    email: string;
    cellphone: string;
    address: string;
    addressCode: string;
    inceptionDate: string;
    groupBranch: string;
  };
  spouses: [SpouseEntry, SpouseEntry];
  dependants: DependantEntry[];
  packageCode: string;
  addonCodes: string[];
  extendedPremium: number;
  beneficiaries: BeneficiaryEntry[];
  banking: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    branchCode: string;
    accountType: string;
    debitDay: string;
  };
  declarationAccepted: boolean;
  popiaAccepted: boolean;
  signatureName: string;
};

export const EMPTY_SPOUSE: SpouseEntry = { surname: "", firstName: "", idNumber: "", dateOfBirth: "" };

export const EMPTY_DEPENDANT: DependantEntry = {
  nameSurname: "",
  idOrDob: "",
  relationship: "",
  benefitAmount: "",
  premiumAmount: "",
};

export const EMPTY_BENEFICIARY: BeneficiaryEntry = {
  name: "",
  surname: "",
  idNumber: "",
  phone: "",
  relationship: "",
};

export function emptyOnboardingForm(): OnboardingFormData {
  return {
    principal: {
      surname: "",
      firstName: "",
      idNumber: "",
      employeeNumber: "",
      employerName: "",
      maritalStatus: "",
      email: "",
      cellphone: "",
      address: "",
      addressCode: "",
      inceptionDate: "",
      groupBranch: "",
    },
    spouses: [{ ...EMPTY_SPOUSE }, { ...EMPTY_SPOUSE }],
    dependants: Array.from({ length: 4 }, () => ({ ...EMPTY_DEPENDANT })),
    packageCode: "",
    addonCodes: [],
    extendedPremium: 0,
    beneficiaries: [{ ...EMPTY_BENEFICIARY }],
    banking: {
      accountHolder: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      branchCode: "",
      accountType: "",
      debitDay: "",
    },
    declarationAccepted: false,
    popiaAccepted: false,
    signatureName: "",
  };
}

export const ONBOARDING_STEPS = [
  { id: 1, title: "Principal member", section: "1" },
  { id: 2, title: "Spouse details", section: "2" },
  { id: 3, title: "Dependants", section: "3" },
  { id: 4, title: "Premium plan", section: "4" },
  { id: 5, title: "Beneficiaries", section: "5" },
  { id: 6, title: "Banking & consent", section: "8–10" },
  { id: 7, title: "Review & submit", section: "✓" },
] as const;

export const MARITAL_OPTIONS = ["Single", "Married", "Divorced", "Widowed", "Customary union"];
export const ACCOUNT_TYPES = ["Savings", "Current", "Cheque"];
export const DEBIT_DAYS = ["1st", "15th", "25th", "Last day of month"];
