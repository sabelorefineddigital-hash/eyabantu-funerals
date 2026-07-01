import Image from "next/image";

/** Eyabantu horizontal lockup — `public/branding/logo.png` (617×150, black background). */
const LOGO_WIDTH = 617;
const LOGO_HEIGHT = 150;

type Props = {
  className?: string;
  priority?: boolean;
  maxHeightClass?: string;
  withWordmark?: boolean;
  /** @deprecated Logo includes its own black background; kept for call-site compatibility. */
  bare?: boolean;
};

/**
 * Official Eyabantu Funerals mark. Swap `public/branding/logo.png` to update site-wide.
 */
export function BrandLogo({
  className = "",
  priority = false,
  maxHeightClass = "max-h-14",
  withWordmark = false,
}: Props) {
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
