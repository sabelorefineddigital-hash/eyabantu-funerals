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
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#142a55]/10 bg-white shadow-[0_24px_60px_-32px_rgba(20,42,85,0.45)] ring-1 ring-white">
      {/* Navy header bar — flyer section style */}
      <div className="bg-[#142a55] px-6 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Sign in</h2>
            <p className="mt-0.5 text-xs text-white/75">Work email and password</p>
          </div>
          <button
            type="button"
            onClick={() => setDemo((d) => !d)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide shadow-sm transition ${
              demo
                ? "bg-[#f5c518] text-[#142a55] ring-1 ring-[#f5c518]/80"
                : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Demo
          </button>
        </div>
      </div>

      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="rounded-xl border border-[#f18a00]/25 bg-gradient-to-r from-[#fff8ef] to-white px-4 py-3 text-xs text-[#4a5568]">
          <span className="font-bold uppercase tracking-wide text-[#f18a00]">Demo password</span>
          <span className="mx-2 text-[#142a55]/30">·</span>
          <span className="font-mono font-bold text-[#142a55]">{DEMO_PASSWORD}</span>
        </div>

        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="next" value={initialNext ?? ""} />
          <div>
            <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#142a55]">
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
              className="mt-1.5 w-full rounded-xl border border-[#142a55]/15 bg-white px-3 py-2.5 text-sm text-[#142a55] shadow-inner outline-none transition focus:border-[#f18a00] focus:ring-4 focus:ring-[#f18a00]/15"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#142a55]">
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
              className="mt-1.5 w-full rounded-xl border border-[#142a55]/15 bg-white px-3 py-2.5 text-sm text-[#142a55] shadow-inner outline-none transition focus:border-[#f18a00] focus:ring-4 focus:ring-[#f18a00]/15"
            />
          </div>

          <div className="rounded-xl border border-dashed border-[#142a55]/15 bg-[#f4f5f7] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#142a55]/70">Quick picks</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  className="rounded-full border border-[#142a55]/10 bg-white px-3 py-1 text-[11px] font-semibold text-[#142a55] shadow-sm transition hover:border-[#f18a00]/40 hover:text-[#f18a00]"
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
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#f18a00] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#f18a00]/30 transition hover:bg-[#e07d00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Continue to workspace"}
          </button>
        </form>

        <p className="mt-5 hidden text-center text-xs text-[#6b7280] lg:block">
          <Link className="font-semibold text-[#142a55] hover:text-[#f18a00] hover:underline" href="/">
            Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}
