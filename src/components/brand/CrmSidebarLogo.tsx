import Image from "next/image";

const LOGO_WIDTH = 617;
const LOGO_HEIGHT = 150;

type Props = {
  className?: string;
  maxHeightClass?: string;
  priority?: boolean;
};

/**
 * CRM sidebar logo — same mark as the brand PNG, but with white "FUNERALS"
 * on the navy dashboard sidebar only.
 */
export function CrmSidebarLogo({
  className = "",
  maxHeightClass = "max-h-11 md:max-h-12",
  priority = false,
}: Props) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Image
        src="/branding/logo.png"
        alt="Eyabantu Funerals"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        unoptimized
        className={`h-auto w-auto max-w-full object-contain object-left ${maxHeightClass}`}
        sizes="(max-width: 768px) 200px, 240px"
      />
      {/* Cover the navy "FUNERALS" baked into the PNG */}
      <span
        aria-hidden
        className="pointer-events-none absolute bg-eyabantu-navy"
        style={{ bottom: "7%", right: "0.5%", width: "50%", height: "24%" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute font-sans text-[7px] font-bold uppercase tracking-[0.36em] text-white md:text-[8px]"
        style={{ bottom: "12%", right: "5.5%" }}
      >
        FUNERALS
      </span>
    </div>
  );
}
