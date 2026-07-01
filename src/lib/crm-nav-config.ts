import type { StaffAccessLevel } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Banknote,
  Building2,
  CalendarDays,
  CalendarClock,
  ClipboardList,
  FileSignature,
  Gauge,
  HeartPulse,
  Landmark,
  LayoutDashboard,
  ShieldAlert,
  Truck,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

export type CrmNavItem = { href: string; label: string; icon: LucideIcon };
export type CrmNavGroup = { label: string; items: CrmNavItem[] };

export function getOwnerNavGroups(): CrmNavGroup[] {
  return [
    {
      label: "Main",
      items: [
        { href: "/owner", label: "Home", icon: LayoutDashboard },
        { href: "/owner/stream", label: "Activity stream", icon: Activity },
        { href: "/owner/calendar", label: "Calendar", icon: CalendarDays },
      ],
    },
    {
      label: "Members & policies",
      items: [
        { href: "/owner/members", label: "Members", icon: Users },
        { href: "/owner/policies", label: "Policies", icon: FileSignature },
        { href: "/owner/accounts", label: "Accounts", icon: Banknote },
        { href: "/owner/payments", label: "Payments", icon: Wallet },
      ],
    },
    {
      label: "Claims & logistics",
      items: [
        { href: "/owner/claims", label: "Claims", icon: ClipboardList },
        { href: "/owner/funerals", label: "Funerals", icon: HeartPulse },
        { href: "/owner/schedules/drivers", label: "Driver schedule", icon: Truck },
        { href: "/owner/schedules/staff", label: "Staff schedule", icon: CalendarClock },
        { href: "/owner/venues", label: "Venues", icon: Building2 },
      ],
    },
    {
      label: "People & finance",
      items: [
        { href: "/owner/employees", label: "Users & access", icon: UserCog },
        { href: "/owner/expenses", label: "Expenses", icon: Landmark },
        { href: "/owner/complaints", label: "Complaints", icon: UserRound },
        { href: "/owner/internal-affairs", label: "Internal affairs", icon: ShieldAlert },
      ],
    },
    {
      label: "System",
      items: [{ href: "/owner/integrations", label: "Integrations", icon: Gauge }],
    },
  ];
}

export function getStaffNavGroups(access: StaffAccessLevel): CrmNavGroup[] {
  const main: CrmNavGroup = {
    label: "Main",
    items: [
      { href: "/staff", label: "Home", icon: LayoutDashboard },
      { href: "/staff/stream", label: "Activity stream", icon: Activity },
      { href: "/staff/schedule", label: "My schedule", icon: CalendarDays },
    ],
  };

  const work: CrmNavItem[] = [];
  if (access === "AGENT" || access === "MANAGEMENT" || access === "ADMINISTRATION") {
    work.push({ href: "/staff/members", label: "Members", icon: Users });
  }
  if (access === "AGENT" || access === "MANAGEMENT") {
    work.push({ href: "/staff/policies", label: "Policies", icon: FileSignature });
  }
  if (access === "MANAGEMENT" || access === "ADMINISTRATION") {
    work.push({ href: "/staff/accounts", label: "Accounts", icon: Banknote });
  }

  const groups: CrmNavGroup[] = [main];
  if (work.length) {
    groups.push({ label: "Workspace", items: work });
  }
  return groups;
}

export function staffRoleLabel(access: StaffAccessLevel): string {
  switch (access) {
    case "MANAGEMENT":
      return "Manager";
    case "ADMINISTRATION":
      return "Administrator";
    case "AGENT":
      return "Agent";
    case "VIEWER":
      return "Viewer";
    default:
      return "Staff";
  }
}
