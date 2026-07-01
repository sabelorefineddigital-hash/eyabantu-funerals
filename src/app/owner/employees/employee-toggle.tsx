"use client";

import { useTransition } from "react";
import { setEmployeeActiveAction } from "@/app/actions/owner";

export function EmployeeToggle({ userId, isActive }: { userId: string; isActive: boolean }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => setEmployeeActiveAction(userId, !isActive))}
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition ${
        isActive
          ? "bg-emerald-50 text-emerald-900 ring-emerald-100 hover:bg-emerald-100"
          : "bg-slate-50 text-slate-800 ring-slate-200 hover:bg-slate-100"
      }`}
    >
      {pending ? "Updating…" : isActive ? "Suspend access" : "Activate access"}
    </button>
  );
}
