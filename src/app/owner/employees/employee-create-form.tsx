"use client";

import { useActionState } from "react";
import { createEmployeeAction, type EmployeeCreateState } from "@/app/actions/owner";

const initial: EmployeeCreateState = {};

export function EmployeeCreateForm() {
  const [state, formAction, pending] = useActionState(createEmployeeAction, initial);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Create employee login</h2>
        <p className="mt-1 text-xs text-muted">
          New staff receive the demo password <span className="font-mono font-semibold">Demo@2026</span> until you
          enforce a password rotation policy.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          First name
          <input name="firstName" required className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          Last name
          <input name="lastName" required className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" />
        </label>
      </div>

      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
        Work email
        <input
          name="email"
          type="email"
          required
          placeholder="name@eyabantu-funerals.co.za"
          className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
        Job title
        <input name="jobTitle" className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" />
      </label>

      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
        Access level
        <select name="staffAccess" className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm">
          <option value="MANAGEMENT">Management</option>
          <option value="ADMINISTRATION">Administration</option>
          <option value="AGENT">Agent / field sales</option>
          <option value="VIEWER">Viewer / reception</option>
        </select>
      </label>

      {state.error ? <p className="text-xs text-red-700">{state.error}</p> : null}
      {state.success ? (
        <p className="text-xs font-semibold text-emerald-800">
          Employee created. Temporary password <span className="font-mono">{state.tempPassword}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand-ink)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#132039] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Activate employee"}
      </button>
    </form>
  );
}
