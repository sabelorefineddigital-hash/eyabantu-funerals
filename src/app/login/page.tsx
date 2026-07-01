import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { DemoCredentials } from "./demo-credentials";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a1628]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(94,181,247,0.35),transparent_55%),radial-gradient(700px_400px_at_90%_10%,rgba(45,138,214,0.22),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, #fff 0 1px, transparent 1px 48px), repeating-linear-gradient(72deg, #fff 0 1px, transparent 1px 52px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col lg:flex-row">
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden lg:min-h-screen">
          <div className="relative flex flex-1 flex-col p-6 sm:p-10 lg:max-w-xl lg:justify-center">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 rounded-2xl bg-black px-4 py-3 shadow-md ring-1 ring-white/10"
            >
              <BrandLogo priority maxHeightClass="max-h-14 sm:max-h-16" />
            </Link>

            <div className="mt-8 hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Eyabantu Funerals</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Welcome to your operations workspace
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-sky-100/90">
                Owners and staff use one connected workspace for members, claims, schedules, and collections.
                Access is role-based so each team sees only the tools they need.
              </p>
            </div>
          </div>

          <div className="relative hidden border-t border-white/10 p-6 lg:block">
            <div className="mx-auto max-w-xl">
              <DemoCredentials accounts={DEMO_ACCOUNTS} />
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-col justify-center bg-gradient-to-b from-white via-sky-50/60 to-white px-4 py-10 sm:px-8 lg:w-[min(520px,100%)] lg:border-l lg:border-sky-200/80 lg:py-12 lg:shadow-[-24px_0_60px_-40px_rgba(10,22,40,0.45)]">
          <div className="mb-6 lg:hidden">
            <BrandLogo priority maxHeightClass="max-h-16" />
            <h1 className="mt-3 text-2xl font-semibold text-[var(--brand-ink)]">Staff &amp; owner login</h1>
          </div>

          <LoginForm initialNext={sp.next} />

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0a1628] p-4 ring-1 ring-slate-800 lg:hidden">
            <DemoCredentials accounts={DEMO_ACCOUNTS} />
          </div>

          <p className="mt-8 text-center text-[11px] text-muted">Eyabantu Funerals</p>
        </div>
      </div>
    </div>
  );
}
