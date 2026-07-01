import Link from "next/link";
import { LogIn } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/moments", label: "Moments" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-sky-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BrandLogo priority maxHeightClass="max-h-11 sm:max-h-12" />
        </Link>
        <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-brand-deep md:order-none md:w-auto md:justify-end md:gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-600/30 transition hover:brightness-110"
        >
          <LogIn className="h-4 w-4" aria-hidden />
          Staff Login
        </Link>
      </div>
    </header>
  );
}
