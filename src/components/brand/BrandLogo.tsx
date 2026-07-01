"use client";

import Image from "next/image";

const LOGO_WIDTH = 617;
const LOGO_HEIGHT = 150;

type Props = {
  className?: string;
  maxHeightClass?: string;
};

/** Plain img for print pages — more reliable than Next Image in print/PDF pipelines. */
export function PrintBrandLogo({ className = "", maxHeightClass = "max-h-14" }: Props) {
  return (
    <img
      src="/branding/logo.png"
      alt="Eyabantu Funerals"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={`h-auto w-auto max-w-full object-contain object-left ${maxHeightClass} ${className}`}
    />
  );
}

/** Next/Image variant for screen UI elsewhere. */
export function BrandLogo({
  className = "",
  priority = false,
  maxHeightClass = "max-h-14",
  withWordmark = false,
}: {
  className?: string;
  priority?: boolean;
  maxHeightClass?: string;
  withWordmark?: boolean;
  bare?: boolean;
}) {
  return (
    <div className={`inline-flex flex-col items-start justify-center ${className}`}>
      <span className="inline-flex items-center justify-center overflow-hidden rounded-md">
        <Image
          src="/branding/logo.png"
          alt="Eyabantu Funerals"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority={priority}
          unoptimized
          className={`h-auto w-auto max-w-full object-contain object-left ${maxHeightClass}`}
          sizes="(max-width: 768px) 200px, 280px"
        />
      </span>
      {withWordmark ? (
        <p className="mt-1 text-center text-sm font-semibold text-[var(--brand-ink)] sm:text-base">Eyabantu Funerals</p>
      ) : null}
    </div>
  );
}
