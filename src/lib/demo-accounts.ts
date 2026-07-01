/** Seeded demo users — password is the same for all (see `DEMO_PASSWORD`). */
export const DEMO_PASSWORD = "Demo@2026" as const;

export type DemoAccount = {
  badge: string;
  name: string;
  email: string;
  description: string;
  accent: "ink" | "sky" | "violet" | "amber" | "emerald" | "rose";
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    badge: "Owner",
    name: "Ayanda Masikane",
    email: "ayanda.masikane@eyabantu.co.za",
    description: "Principal owner — full command centre, integrations, HR, fleet.",
    accent: "ink",
  },
  {
    badge: "Owner",
    name: "Thandi Mkhize",
    email: "thandi@eyabantu-funerals.co.za",
    description: "Co-owner — same god-view as Ayanda for continuity planning.",
    accent: "ink",
  },
  {
    badge: "Management",
    name: "Lindiwe Dlamini",
    email: "lindiwe.mgmt@eyabantu-funerals.co.za",
    description: "Operations — policies pipeline, collections overview, schedules.",
    accent: "sky",
  },
  {
    badge: "Administration",
    name: "Nomfundo Zulu",
    email: "nomfundo.admin@eyabantu-funerals.co.za",
    description: "Branch admin — members, complaints, servicing workflows.",
    accent: "violet",
  },
  {
    badge: "Agent",
    name: "Sibusiso Ngcobo",
    email: "sibusiso.agent@eyabantu-funerals.co.za",
    description: "Field sales — capture new policies and track personal pipeline.",
    accent: "amber",
  },
  {
    badge: "Viewer",
    name: "Zanele Khumalo",
    email: "zanele.viewer@eyabantu-funerals.co.za",
    description: "Reception — read-only stream; no sensitive financial screens.",
    accent: "emerald",
  },
];
