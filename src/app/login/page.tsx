import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Staff Login",
};

type LoginPageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile hero strip */}
      <div className="relative h-44 w-full shrink-0 lg:hidden">
        <Image
          src="/marketing/login-family.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f45]/80 to-transparent" aria-hidden />
        <div className="absolute bottom-4 left-6 right-6">
          <p className="text-xs font-medium uppercase tracking-widest text-white/70">Eyabantu Funerals</p>
          <p className="mt-1 text-lg font-bold text-white">Staff workspace</p>
        </div>
      </div>

      {/* Left — family portrait (desktop) */}
      <section className="relative hidden min-h-[280px] w-full lg:block lg:min-h-screen lg:w-1/2">
        <Image
          src="/marketing/login-family.png"
          alt="Eyabantu Funerals — caring for families"
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1f45]/75 via-[#142a55]/20 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="inline-flex w-fit rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
            <BrandLogo priority bare maxHeightClass="max-h-11" />
          </Link>

          <div className="max-w-md">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">Eyabantu Funerals</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
              Caring for families,
              <span className="block text-[#f5c518]">every step of the way.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Secure workspace for owners and staff — members, claims, collections, and funeral coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Right — login */}
      <section className="flex w-full flex-1 flex-col justify-center bg-[#f7f8fa] px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#142a55]/8">
              <BrandLogo priority bare maxHeightClass="max-h-11" />
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#142a55]">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to your Eyabantu staff workspace.</p>
          </div>

          <LoginForm initialNext={sp.next} />

          <p className="mt-10 text-center text-[11px] leading-relaxed text-slate-400">
            Eyabantu Funerals · 33 Bell Street, Greytown ·{" "}
            <a href="https://www.eyabantu.co.za" className="text-[#142a55]/70 hover:text-[#f18a00]">
              www.eyabantu.co.za
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
