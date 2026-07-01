import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CONTACT } from "@/lib/contact";
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
    <div className="relative flex min-h-screen flex-col bg-[#e9eaec] lg:flex-row">
      {/* Subtle logo watermark — matches flyer background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "url('/branding/logo.png')",
          backgroundSize: "220px auto",
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />

      {/* Left — flyer hero with family imagery & navy diagonal accent */}
      <section className="relative min-h-[320px] w-full overflow-hidden lg:min-h-screen lg:w-[58%]">
        <Image
          src="/marketing/eyabantu-flyer.png"
          alt=""
          fill
          priority
          className="object-cover object-[15%_20%] lg:object-[12%_18%]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f1f45]/88 via-[#142a55]/55 to-[#142a55]/15"
          aria-hidden
        />
        {/* Flyer-style navy diagonal wedge */}
        <div
          className="pointer-events-none absolute -right-16 top-0 h-[42%] w-[58%] bg-[#142a55] opacity-95"
          style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }}
          aria-hidden
        />

        <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between p-6 sm:p-8 lg:min-h-screen lg:p-10">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-white/60"
            >
              <BrandLogo priority bare maxHeightClass="max-h-12 sm:max-h-14" />
            </Link>

            <div className="mt-8 max-w-lg">
              <span className="inline-flex rounded-md bg-[#f5c518] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#142a55] shadow-sm">
                Staff portal
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
                Caring for families.
                <span className="mt-1 block text-[#f18a00]">Powered for your team.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
                Eyabantu Funerals operations workspace — members, claims, funerals, collections, and schedules in one
                place.
              </p>
            </div>
          </div>

          <div className="mt-8 hidden lg:block">
            <DemoCredentials accounts={DEMO_ACCOUNTS} variant="hero" />
          </div>
        </div>
      </section>

      {/* Right — login card on light flyer-grey */}
      <section className="relative flex w-full flex-1 flex-col justify-between px-4 py-8 sm:px-8 lg:w-[42%] lg:px-10 lg:py-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-6 lg:hidden">
            <div className="inline-flex rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-[#142a55]/10">
              <BrandLogo priority bare maxHeightClass="max-h-12" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-[#142a55]">Staff &amp; owner login</h1>
          </div>

          <LoginForm initialNext={sp.next} />

          <div className="mt-6 lg:hidden">
            <DemoCredentials accounts={DEMO_ACCOUNTS} variant="compact" />
          </div>
        </div>

        {/* Flyer-style navy footer strip */}
        <footer className="mx-auto mt-8 w-full max-w-md border-t border-[#142a55]/10 pt-6 text-center text-[11px] leading-relaxed text-[#4a5568]">
          <p className="font-semibold text-[#142a55]">Eyabantu Funerals</p>
          <p className="mt-1">{CONTACT.fullAddress}</p>
          <p className="mt-1">
            {CONTACT.phonePrimary} · {CONTACT.email}
          </p>
          <p className="mt-2 text-[10px] text-[#6b7280]">www.eyabantu.co.za · Demo workspace</p>
        </footer>
      </section>
    </div>
  );
}
