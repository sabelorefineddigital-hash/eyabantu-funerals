import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
  maxHeightClass?: string;
  withWordmark?: boolean;
};

/**
 * Official mark from `public/branding/logo.png` — replace that file to update site-wide.
 * Uses `unoptimized` so local PNG swaps always show without optimizer/cache quirks in dev.
 */
export function BrandLogo({
  className = "",
  priority = false,
  maxHeightClass = "max-h-16",
  withWordmark = false,
}: Props) {
  return (
    <div className={`inline-flex flex-col items-start justify-center bg-transparent ${className}`}>
      <Image
        src="/branding/logo.png"
        alt="Eyabantu Funerals"
        width={640}
        height={240}
        priority={priority}
        unoptimized
        className={`h-auto w-auto max-w-full bg-transparent object-contain object-left ${maxHeightClass}`}
        sizes="(max-width: 768px) 200px, 280px"
      />
      {withWordmark ? (
        <p className="mt-1 text-center text-sm font-semibold text-[var(--brand-ink)] sm:text-base">Eyabantu Funerals</p>
      ) : null}
    </div>
  );
}
