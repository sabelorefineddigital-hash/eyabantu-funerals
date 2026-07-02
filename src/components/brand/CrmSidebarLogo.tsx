import Image from "next/image";

const LOGO_WIDTH = 617;
const LOGO_HEIGHT = 150;

type Props = {
  className?: string;
  maxHeightClass?: string;
  priority?: boolean;
};

/**
 * CRM sidebar logo — clips the PNG's baked-in "FUNERALS" and renders white text only.
 */
export function CrmSidebarLogo({
  className = "",
  maxHeightClass = "max-h-11 md:max-h-12",
  priority = false,
}: Props) {
  return (
    <div className={`relative inline-flex items-end ${className}`}>
      <Image
        src="/branding/logo.png"
        alt="Eyabantu Funerals"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        unoptimized
        className={`h-auto w-auto max-w-full object-contain object-left ${maxHeightClass} [clip-path:inset(0_0_21%_0)]`}
        sizes="(max-width: 768px) 200px, 240px"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute font-sans text-[7.5px] font-bold uppercase tracking-[0.38em] text-white md:text-[8.5px]"
        style={{ bottom: "2%", right: "5%" }}
      >
        FUNERALS
      </span>
    </div>
  );
}
