"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StaffAccessLevel } from "@prisma/client";
import { Bell, LogOut, Mail, Menu, Search, Settings, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CrmSidebarLogo } from "@/components/brand/CrmSidebarLogo";
import {
  getOwnerNavGroups,
  getStaffNavGroups,
  staffRoleLabel,
  type CrmNavGroup,
} from "@/lib/crm-nav-config";

type Props = {
  variant: "owner" | "staff";
  user: { firstName: string; lastName: string; email: string };
  staffAccess?: StaffAccessLevel;
  children: React.ReactNode;
};

function initials(first: string, last: string) {
  const a = first?.[0] ?? "";
  const b = last?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function linkActive(pathname: string, href: string) {
  if (href === "/owner" || href === "/staff") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  groups,
  pathname,
  profileHref,
  user,
  variant,
  staffAccess,
  onNavigate,
}: {
  groups: CrmNavGroup[];
  pathname: string;
  profileHref: string;
  user: Props["user"];
  variant: "owner" | "staff";
  staffAccess: StaffAccessLevel;
  onNavigate?: () => void;
}) {
  const ini = initials(user.firstName, user.lastName);
  const roleLine =
    variant === "owner" ? "Owner" : `${staffRoleLabel(staffAccess)} · Staff workspace`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <Link
        href={variant === "owner" ? "/owner" : "/staff"}
        prefetch={false}
        onClick={onNavigate}
        aria-label="Eyabantu Funerals — Home"
        className="flex items-center border-b border-eyabantu-gold/30 bg-eyabantu-navy px-4 py-4 transition hover:bg-eyabantu-navy/95"
      >
        <span className="flex min-w-0 flex-1 items-center justify-center md:justify-start">
          <CrmSidebarLogo priority maxHeightClass="max-h-11 md:max-h-12" />
        </span>
      </Link>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-eyabantu-cream/50 px-3 py-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-eyabantu-silver">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = linkActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-eyabantu-navy text-white shadow-md shadow-eyabantu-navy/20"
                          : "text-eyabantu-navy/75 hover:bg-white hover:text-eyabantu-navy"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${isActive ? "text-eyabantu-gold" : "text-eyabantu-silver"}`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-eyabantu-gold/25 bg-white p-3">
        <Link
          href={profileHref}
          prefetch={false}
          onClick={onNavigate}
          className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-eyabantu-cream"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eyabantu-navy text-xs font-bold text-eyabantu-gold">
            {ini}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-eyabantu-navy">Account</span>
            <span className="block truncate text-xs text-muted">Profile & sign out</span>
          </span>
          <Settings className="h-4 w-4 shrink-0 text-eyabantu-silver" aria-hidden />
        </Link>
        <p className="truncate px-1 text-xs font-semibold text-eyabantu-navy">
          {user.firstName} {user.lastName}
        </p>
        <p className="truncate px-1 text-[10px] text-muted">{roleLine}</p>
        <p className="mt-0.5 truncate px-1 text-[10px] text-eyabantu-silver">{user.email}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-eyabantu-gold/40 bg-white px-3 py-2 text-xs font-semibold text-eyabantu-navy shadow-sm transition hover:border-eyabantu-gold hover:bg-eyabantu-cream"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

function WorkspaceHeader({
  onOpenMenu,
  user,
  variant,
}: {
  onOpenMenu: () => void;
  user: Props["user"];
  variant: "owner" | "staff";
}) {
  const dashHome = variant === "owner" ? "/owner" : "/staff";

  return (
    <header className="sticky top-0 z-30 flex shrink-0 flex-col gap-3 border-b border-eyabantu-gold/25 bg-white/95 px-4 py-3 backdrop-blur print:hidden md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3 md:min-w-0 md:flex-1">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-eyabantu-gold/30 bg-eyabantu-cream text-eyabantu-navy shadow-sm md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href={dashHome}
          prefetch={false}
          className="shrink-0 transition hover:opacity-90 md:hidden"
          aria-label="Eyabantu Funerals — Home"
        >
          <BrandLogo maxHeightClass="max-h-9 sm:max-h-10" />
        </Link>
        <div className="relative min-w-0 flex-1 max-md:max-w-none md:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-eyabantu-silver" />
          <input
            type="search"
            readOnly
            placeholder="Search member, claim, funeral, or receipt…"
            className="w-full rounded-xl border border-eyabantu-gold/25 bg-eyabantu-cream py-2.5 pl-10 pr-4 text-sm text-eyabantu-navy outline-none ring-eyabantu-gold/20 placeholder:text-eyabantu-silver focus:border-eyabantu-gold focus:bg-white focus:ring-2"
            aria-label="Demo search (non-functional)"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-eyabantu-gold/25 bg-white text-eyabantu-silver shadow-sm transition hover:bg-eyabantu-cream hover:text-eyabantu-navy"
          aria-label="Notifications (demo)"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-eyabantu-gold/25 bg-white text-eyabantu-silver shadow-sm transition hover:bg-eyabantu-cream hover:text-eyabantu-navy"
          aria-label="Messages (demo)"
        >
          <Mail className="h-4 w-4" />
        </button>
        <div className="hidden items-center gap-2 rounded-xl border border-eyabantu-gold/25 bg-eyabantu-cream px-3 py-1.5 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-eyabantu-navy text-xs font-bold text-eyabantu-gold">
            {initials(user.firstName, user.lastName)}
          </span>
          <span className="max-w-[140px] truncate text-xs font-semibold text-eyabantu-navy">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
    </header>
  );
}

export function CrmShellClient({ variant, user, staffAccess = "NONE", children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = variant === "owner" ? getOwnerNavGroups() : getStaffNavGroups(staffAccess);
  const profileHref = variant === "owner" ? "/owner/profile" : "/staff/profile";

  return (
    <div className="flex min-h-screen eyabantu-crm-bg text-eyabantu-navy print:bg-white">
      <aside className="relative z-20 hidden w-64 shrink-0 border-r border-eyabantu-gold/25 shadow-sm print:hidden md:flex md:flex-col">
        <SidebarNav
          groups={groups}
          pathname={pathname}
          profileHref={profileHref}
          user={user}
          variant={variant}
          staffAccess={staffAccess}
        />
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-eyabantu-navy/60 backdrop-blur-sm print:hidden md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(18rem,100vw-2rem)] max-w-[85vw] border-r border-eyabantu-gold/25 bg-white shadow-xl transition-transform duration-200 ease-out print:hidden md:hidden ${
          mobileOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex h-12 items-center justify-end border-b border-eyabantu-gold/25 bg-eyabantu-navy px-2">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-hidden">
          <SidebarNav
            groups={groups}
            pathname={pathname}
            profileHref={profileHref}
            user={user}
            variant={variant}
            staffAccess={staffAccess}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <WorkspaceHeader onOpenMenu={() => setMobileOpen(true)} user={user} variant={variant} />
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 print:bg-white print:p-6">{children}</div>
      </div>
    </div>
  );
}
