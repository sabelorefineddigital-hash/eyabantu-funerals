export type CoverGroup = "SIX" | "TEN" | "SINGLE";
export type CasketTier = "BASIC" | "MINI_DOME" | "PLATINUM_DOME";
export type PackageKind = "PLAN" | "ADDON";

export type EyabantuPackage = {
  code: string;
  kind: PackageKind;
  coverGroup: CoverGroup | null;
  tier: CasketTier | null;
  title: string;
  subtitle: string;
  monthlyPremium: number;
  coverCount: number | null;
  cashBack: number | null;
  noFuneralPayout: number | null;
  waitingDays: number;
  maxAge: number;
  benefits: string[];
  accent: "wood" | "silver" | "gold" | "navy";
};

export const EYABANTU_WAITING_DAYS = 90;
export const EYABANTU_MAX_AGE = 100;

export const EYABANTU_PACKAGES: EyabantuPackage[] = [
  // —— 6 people ——
  {
    code: "6P-BASIC",
    kind: "PLAN",
    coverGroup: "SIX",
    tier: "BASIC",
    title: "6 People · Basic Casket",
    subtitle: "Affordable family cover",
    monthlyPremium: 250,
    coverCount: 6,
    cashBack: 2000,
    noFuneralPayout: 10000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Basic casket", "R2,000 cash back at claim", "R10,000 if no funeral held"],
    accent: "wood",
  },
  {
    code: "6P-MINI",
    kind: "PLAN",
    coverGroup: "SIX",
    tier: "MINI_DOME",
    title: "6 People · Mini Dome",
    subtitle: "Enhanced dome casket",
    monthlyPremium: 350,
    coverCount: 6,
    cashBack: 4000,
    noFuneralPayout: 15000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Mini dome casket", "R4,000 cash back at claim", "R15,000 if no funeral held"],
    accent: "silver",
  },
  {
    code: "6P-PLAT",
    kind: "PLAN",
    coverGroup: "SIX",
    tier: "PLATINUM_DOME",
    title: "6 People · Platinum Dome",
    subtitle: "Premium family cover",
    monthlyPremium: 450,
    coverCount: 6,
    cashBack: 6000,
    noFuneralPayout: 20000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Platinum dome casket", "R6,000 cash back at claim", "R20,000 if no funeral held"],
    accent: "gold",
  },
  // —— 10 people ——
  {
    code: "10P-BASIC",
    kind: "PLAN",
    coverGroup: "TEN",
    tier: "BASIC",
    title: "10 People · Basic Casket",
    subtitle: "Extended family cover",
    monthlyPremium: 350,
    coverCount: 10,
    cashBack: 2000,
    noFuneralPayout: 10000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Basic casket", "R2,000 cash back at claim", "R10,000 cash payout if no funeral"],
    accent: "wood",
  },
  {
    code: "10P-MINI",
    kind: "PLAN",
    coverGroup: "TEN",
    tier: "MINI_DOME",
    title: "10 People · Mini Dome",
    subtitle: "Extended family · dome",
    monthlyPremium: 450,
    coverCount: 10,
    cashBack: 4000,
    noFuneralPayout: 15000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Mini dome casket", "R4,000 cash back at claim", "R15,000 cash payout if no funeral"],
    accent: "silver",
  },
  {
    code: "10P-PLAT",
    kind: "PLAN",
    coverGroup: "TEN",
    tier: "PLATINUM_DOME",
    title: "10 People · Platinum Dome",
    subtitle: "Top extended family cover",
    monthlyPremium: 550,
    coverCount: 10,
    cashBack: 6000,
    noFuneralPayout: 20000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Platinum dome casket", "R6,000 cash back at claim", "R20,000 cash payout if no funeral"],
    accent: "gold",
  },
  // —— Single person ——
  {
    code: "1P-BASIC",
    kind: "PLAN",
    coverGroup: "SINGLE",
    tier: "BASIC",
    title: "Single · Basic Casket",
    subtitle: "Individual cover",
    monthlyPremium: 70,
    coverCount: 1,
    cashBack: 2000,
    noFuneralPayout: 10000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Basic casket", "R2,000 cash back at claim", "R10,000 cash payout if no funeral"],
    accent: "wood",
  },
  {
    code: "1P-MINI",
    kind: "PLAN",
    coverGroup: "SINGLE",
    tier: "MINI_DOME",
    title: "Single · Mini Dome",
    subtitle: "Individual · dome casket",
    monthlyPremium: 100,
    coverCount: 1,
    cashBack: 4000,
    noFuneralPayout: 15000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Mini dome casket", "R4,000 cash back at claim", "R15,000 cash payout if no funeral"],
    accent: "silver",
  },
  {
    code: "1P-PLAT",
    kind: "PLAN",
    coverGroup: "SINGLE",
    tier: "PLATINUM_DOME",
    title: "Single · Platinum Dome",
    subtitle: "Individual · premium",
    monthlyPremium: 150,
    coverCount: 1,
    cashBack: 6000,
    noFuneralPayout: 20000,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Platinum dome casket", "R6,000 cash back at claim", "R20,000 cash payout if no funeral"],
    accent: "gold",
  },
  // —— Extra people add-ons ——
  {
    code: "ADDON-BASIC",
    kind: "ADDON",
    coverGroup: null,
    tier: "BASIC",
    title: "Extra person · Casket",
    subtitle: "Add to existing plan",
    monthlyPremium: 50,
    coverCount: 1,
    cashBack: null,
    noFuneralPayout: null,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Additional covered life on casket tier"],
    accent: "wood",
  },
  {
    code: "ADDON-MINI",
    kind: "ADDON",
    coverGroup: null,
    tier: "MINI_DOME",
    title: "Extra person · Mini Dome",
    subtitle: "Add to existing plan",
    monthlyPremium: 75,
    coverCount: 1,
    cashBack: null,
    noFuneralPayout: null,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Additional covered life on mini dome tier"],
    accent: "silver",
  },
  {
    code: "ADDON-PLAT",
    kind: "ADDON",
    coverGroup: null,
    tier: "PLATINUM_DOME",
    title: "Extra person · Platinum",
    subtitle: "Add to existing plan",
    monthlyPremium: 100,
    coverCount: 1,
    cashBack: null,
    noFuneralPayout: null,
    waitingDays: EYABANTU_WAITING_DAYS,
    maxAge: EYABANTU_MAX_AGE,
    benefits: ["Additional covered life on platinum tier"],
    accent: "gold",
  },
];

const packageMap = new Map(EYABANTU_PACKAGES.map((p) => [p.code, p]));

export function getPackageByCode(code: string | null | undefined): EyabantuPackage | undefined {
  if (!code) return undefined;
  return packageMap.get(code);
}

export function formatZar(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}

export const COVER_GROUP_LABELS: Record<CoverGroup, string> = {
  SIX: "6 People",
  TEN: "10 People",
  SINGLE: "Single Person",
};

export const TIER_LABELS: Record<CasketTier, string> = {
  BASIC: "Basic Casket",
  MINI_DOME: "Mini Dome",
  PLATINUM_DOME: "Platinum Dome",
};

export function planPackages() {
  return EYABANTU_PACKAGES.filter((p) => p.kind === "PLAN");
}

export function addonPackages() {
  return EYABANTU_PACKAGES.filter((p) => p.kind === "ADDON");
}

export function packagesByGroup(group: CoverGroup) {
  return planPackages().filter((p) => p.coverGroup === group);
}
