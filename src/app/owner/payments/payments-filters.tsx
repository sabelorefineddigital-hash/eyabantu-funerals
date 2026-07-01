"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, User, X } from "lucide-react";

type MemberLite = { id: string; mainMemberName: string; monthlyPremium: number };

export function PaymentsFiltersBar({ members }: { members: MemberLite[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("memberId");
  const qParam = searchParams.get("q") ?? "";

  const [pickerQuery, setPickerQuery] = useState("");
  const [ledgerQuery, setLedgerQuery] = useState(qParam);

  const selected = useMemo(() => members.find((m) => m.id === memberId), [members, memberId]);

  useEffect(() => {
    setLedgerQuery(qParam);
  }, [qParam]);

  const pickerHits = useMemo(() => {
    const s = pickerQuery.trim().toLowerCase();
    if (!s) return [];
    return members.filter((m) => m.mainMemberName.toLowerCase().includes(s)).slice(0, 12);
  }, [members, pickerQuery]);

  function push(next: Record<string, string | undefined>) {
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === "") nextParams.delete(k);
      else nextParams.set(k, v);
    }
    router.push(`/owner/payments?${nextParams.toString()}`);
  }

  function clearAll() {
    setPickerQuery("");
    setLedgerQuery("");
    router.push("/owner/payments");
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Find a member</h2>
            <p className="mt-0.5 text-xs text-muted">
              Search by name, pick them for receipt capture, then scroll to recent receipts for that member.
            </p>
          </div>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="Type member name…"
              autoComplete="off"
              className="w-full rounded-xl border border-border bg-[var(--background)] py-2.5 pl-10 pr-3 text-sm outline-none ring-sky-500/25 placeholder:text-muted focus:border-sky-400 focus:bg-white focus:ring-2"
              aria-label="Search members by name"
            />
            {pickerHits.length > 0 ? (
              <ul
                className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
                role="listbox"
              >
                {pickerHits.map((m) => (
                  <li key={m.id} role="option">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-sky-50"
                      onClick={() => {
                        push({ memberId: m.id, q: undefined });
                        setPickerQuery("");
                      }}
                    >
                      <span className="font-medium text-[var(--brand-ink)]">{m.mainMemberName}</span>
                      <span className="shrink-0 text-xs text-muted">R{m.monthlyPremium.toFixed(2)} / mo</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3 lg:max-w-md">
          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Search receipts</h2>
            <p className="mt-0.5 text-xs text-muted">Match receipt number or member name in the ledger below.</p>
          </div>
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const raw = ledgerQuery.trim();
              push({
                q: raw || undefined,
                memberId: raw ? undefined : memberId ?? undefined,
              });
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                value={ledgerQuery}
                onChange={(e) => setLedgerQuery(e.target.value)}
                placeholder="Receipt no. or member…"
                className="w-full rounded-xl border border-border bg-[var(--background)] py-2.5 pl-10 pr-3 text-sm outline-none ring-sky-500/25 placeholder:text-muted focus:border-sky-400 focus:bg-white focus:ring-2"
                aria-label="Search receipts by number or member name"
              />
            </div>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--brand-ink)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#132039]"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {(selected || qParam) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3 py-2 text-xs">
          {selected ? (
            <span className="font-semibold text-sky-950">
              Member filter: <span className="text-[var(--brand-ink)]">{selected.mainMemberName}</span>
              <Link href={`/owner/members/${selected.id}`} prefetch={false} className="ml-2 font-semibold text-brand underline-offset-2 hover:underline">
                Open profile
              </Link>
            </span>
          ) : null}
          {qParam ? (
            <span className="font-semibold text-sky-950">
              Ledger search: <span className="font-mono text-[var(--brand-ink)]">{qParam}</span>
            </span>
          ) : null}
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <X className="h-3 w-3" aria-hidden />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
