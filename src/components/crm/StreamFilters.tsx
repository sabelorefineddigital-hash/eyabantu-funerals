"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UserOption = { id: string; label: string };

export function StreamFilters({ users }: { users: UserOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentAction = searchParams.get("action") ?? "";
  const currentUser = searchParams.get("userId") ?? "";
  const currentFrom = searchParams.get("from") ?? "";
  const currentTo = searchParams.get("to") ?? "";

  const qs = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function push(next: URLSearchParams) {
    const s = next.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          Action
          <select
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
            value={currentAction}
            onChange={(e) => {
              const n = new URLSearchParams(qs);
              if (e.target.value) n.set("action", e.target.value);
              else n.delete("action");
              push(n);
            }}
          >
            <option value="">All actions</option>
            {[
              "MEMBER_ADDED",
              "PAYMENT_RECEIVED",
              "USER_LOGIN",
              "CLAIM_UPDATED",
              "FUNERAL_SCHEDULED",
              "POLICY_SUBMITTED",
              "USER_ACTIVATED",
              "EMPLOYEE_CREATED",
              "PAYFAST_INTENT_CREATED",
            ].map((a) => (
              <option key={a} value={a}>
                {a.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          User
          <select
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
            value={currentUser}
            onChange={(e) => {
              const n = new URLSearchParams(qs);
              if (e.target.value) n.set("userId", e.target.value);
              else n.delete("userId");
              push(n);
            }}
          >
            <option value="">Everyone</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          From
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
            value={currentFrom}
            onChange={(e) => {
              const n = new URLSearchParams(qs);
              if (e.target.value) n.set("from", e.target.value);
              else n.delete("from");
              push(n);
            }}
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          To
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
            value={currentTo}
            onChange={(e) => {
              const n = new URLSearchParams(qs);
              if (e.target.value) n.set("to", e.target.value);
              else n.delete("to");
              push(n);
            }}
          />
        </label>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl border border-border bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--brand-ink)] hover:border-brand/40"
        onClick={() => router.push(pathname)}
      >
        Clear filters
      </button>
    </div>
  );
}
