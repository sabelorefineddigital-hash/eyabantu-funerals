"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/lib/demo-accounts";

const initial: AuthState = {};

type FormProps = { initialNext?: string };

export function LoginForm({ initialNext }: FormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [demo, setDemo] = useState(true);
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0]?.email ?? "");
  const [password, setPassword] = useState<string>(DEMO_PASSWORD);
  const [, startCopy] = useTransition();

  useEffect(() => {
    if (demo) {
      setEmail(DEMO_ACCOUNTS[0]?.email ?? "");
      setPassword(DEMO_PASSWORD);
    } else {
      setEmail("");
      setPassword("");
    }
  }, [demo]);

  return (
    <div className="w-full max-w-md rounded-[1.75rem] border border-sky-200/80 bg-white/90 p-6 shadow-[0_30px_80px_-40px_rgba(47,111,163,0.55)] ring-1 ring-sky-100 backdrop-blur sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-ink)]">Sign in</h2>
          <p className="mt-1 text-xs text-muted">Work email + demo password below.</p>
        </div>
        <button
          type="button"
          onClick={() => setDemo((d) => !d)}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 transition ${
            demo
              ? "bg-gradient-to-r from-brand to-brand-deep text-white ring-brand/40"
              : "bg-white text-foreground ring-border hover:ring-brand/40"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Demo mode
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white px-4 py-3 text-xs text-muted">
        <span className="font-semibold text-brand-deep">Password for everyone:</span>{" "}
        <span className="font-mono font-bold text-[var(--brand-ink)]">{DEMO_PASSWORD}</span>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={initialNext ?? ""} />
        <div>
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-brand-deep">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-sky-200/80 bg-white px-3 py-2.5 text-sm shadow-inner outline-none ring-brand/0 transition focus:border-brand focus:ring-4 focus:ring-sky-200/80"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-brand-deep">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-sky-200/80 bg-white px-3 py-2.5 text-sm shadow-inner outline-none focus:border-brand focus:ring-4 focus:ring-sky-200/80"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-deep">Quick picks</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand-deep shadow-sm ring-1 ring-sky-200/80 transition hover:ring-brand/50"
                onClick={() => {
                  setEmail(a.email);
                  setPassword(DEMO_PASSWORD);
                  startCopy(async () => {
                    try {
                      await navigator.clipboard.writeText(a.email);
                    } catch {
                      // ignore
                    }
                  });
                }}
                title={`Use ${a.email}`}
              >
                {a.badge}: {a.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-deep to-[#0a1628] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Continue to workspace"}
        </button>
      </form>

      <p className="mt-6 hidden text-center text-xs text-muted lg:block">
        <Link className="font-semibold text-brand-deep hover:underline" href="/">
          Back to public site
        </Link>
      </p>
    </div>
  );
}
