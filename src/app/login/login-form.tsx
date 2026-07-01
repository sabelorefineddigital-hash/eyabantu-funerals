"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/lib/demo-accounts";

const initial: AuthState = {};

type FormProps = { initialNext?: string };

export function LoginForm({ initialNext }: FormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [demo, setDemo] = useState(true);
  const [showDemoHelp, setShowDemoHelp] = useState(false);
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
    <div className="rounded-2xl border border-[#142a55]/8 bg-white p-6 shadow-[0_8px_40px_-12px_rgba(20,42,85,0.18)] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Staff sign in</p>
        <button
          type="button"
          onClick={() => setDemo((d) => !d)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
            demo
              ? "bg-[#fff8ef] text-[#f18a00] ring-1 ring-[#f18a00]/25"
              : "bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          Demo mode
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="next" value={initialNext ?? ""} />

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#142a55]">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@eyabantu-funerals.co.za"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#142a55] outline-none transition placeholder:text-slate-400 focus:border-[#142a55] focus:ring-2 focus:ring-[#142a55]/10"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#142a55]">
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
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#142a55] outline-none transition focus:border-[#142a55] focus:ring-2 focus:ring-[#142a55]/10"
          />
        </div>

        {state.error ? (
          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[#f18a00] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e07d00] focus:outline-none focus:ring-2 focus:ring-[#f18a00]/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setShowDemoHelp((v) => !v)}
        className="mt-5 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-[#142a55]"
      >
        Demo login details
        <ChevronDown className={`h-3.5 w-3.5 transition ${showDemoHelp ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {showDemoHelp ? (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs text-slate-600">
            Password for all demo accounts:{" "}
            <span className="font-mono font-bold text-[#142a55]">{DEMO_PASSWORD}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-[#142a55] transition hover:border-[#f18a00]/40 hover:text-[#f18a00]"
                onClick={() => {
                  setEmail(a.email);
                  setPassword(DEMO_PASSWORD);
                  setDemo(true);
                  startCopy(async () => {
                    try {
                      await navigator.clipboard.writeText(a.email);
                    } catch {
                      // ignore
                    }
                  });
                }}
              >
                {a.badge}: {a.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
