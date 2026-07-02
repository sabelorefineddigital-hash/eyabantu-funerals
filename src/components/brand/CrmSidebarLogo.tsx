import Image from "next/image";

const LOGO_WIDTH = 617;
const LOGO_HEIGHT = 150;

type Props = {
  className?: string;
  maxHeightClass?: string;
  priority?: boolean;
};

/**
 * CRM sidebar logo — hides the PNG's baked-in "FUNERALS" with a navy mask,
 * then renders a single white "FUNERALS" label.
 */
export function CrmSidebarLogo({
  className = "",
  maxHeightClass = "max-h-11 md:max-h-12",
  priority = false,
}: Props) {
  return (
    <div className={`relative w-full max-w-[210px] ${maxHeightClass} ${className}`}>
      <div className={`relative h-full w-full ${maxHeightClass}`}>
        <Image
          src="/branding/logo.png"
          alt="Eyabantu Funerals"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority={priority}
          unoptimized
          className="h-full w-auto max-w-full object-contain object-left"
          sizes="(max-width: 768px) 200px, 210px"
        />
        {/* Mask the baked-in FUNERALS (and logo black strip) on the text side only */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[34%] right-0 bg-eyabantu-navy"
          style={{ height: "38%" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute font-sans text-[7px] font-bold uppercase leading-none tracking-[0.44em] text-white md:text-[8px]"
          style={{ bottom: "13%", right: "2%" }}
        >
          FUNERALS
        </span>
      </div>
    </div>
  );
}
