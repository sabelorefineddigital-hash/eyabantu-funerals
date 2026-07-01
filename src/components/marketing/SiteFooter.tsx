import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-sky-200/80 bg-[#071426] py-10 text-center text-xs text-sky-100/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4">
        <Link href="/" className="rounded-xl transition hover:opacity-95">
          <BrandLogo maxHeightClass="max-h-11" />
        </Link>
        <nav className="flex flex-wrap justify-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-sky-200/90">
          <Link className="hover:text-white" href="/services">
            Services
          </Link>
          <span className="text-sky-600">·</span>
          <Link className="hover:text-white" href="/moments">
            Moments
          </Link>
          <span className="text-sky-600">·</span>
          <Link className="hover:text-white" href="/about">
            About
          </Link>
          <span className="text-sky-600">·</span>
          <Link className="hover:text-white" href="/gallery">
            Gallery
          </Link>
          <span className="text-sky-600">·</span>
          <Link className="hover:text-white" href="/contact">
            Contact
          </Link>
        </nav>
        <p>
          © {new Date().getFullYear()} Eyabantu Funerals. Demo software — configure before production use.
        </p>
      </div>
    </footer>
  );
}

