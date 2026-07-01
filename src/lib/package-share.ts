import type { EyabantuPackage } from "@/lib/eyabantu-packages";
import { formatZar } from "@/lib/eyabantu-packages";

export function packagePrintPath(code: string) {
  return `/print/package/${encodeURIComponent(code)}`;
}

/** @deprecated Use packagePrintPath — kept as alias for existing imports. */
export function packageSharePath(code: string) {
  return packagePrintPath(code);
}

export function buildPackageShareUrl(code: string, origin?: string) {
  const path = packagePrintPath(code);
  return origin ? `${origin}${path}` : path;
}

export function buildPackageEmailText(pkg: EyabantuPackage, shareUrl: string, recipientName?: string) {
  const greeting = recipientName?.trim() ? `Dear ${recipientName.trim()},` : "Dear Sir/Madam,";
  const benefits = pkg.benefits.map((b) => `  • ${b}`).join("\n");
  const lines = [
    greeting,
    "",
    "Thank you for your interest in Eyabantu Funerals.",
    "",
    "We are pleased to share the following funeral cover option:",
    "",
    `  ${pkg.title}`,
    `  ${pkg.subtitle}`,
    `  Monthly premium: ${formatZar(pkg.monthlyPremium)}`,
    "",
    "Benefits:",
    benefits,
    "",
    `${pkg.waitingDays}-day waiting period on natural death · up to ${pkg.maxAge} years`,
    pkg.cashBack ? `Cash back at claim: ${formatZar(pkg.cashBack)}` : "",
    pkg.noFuneralPayout ? `If no funeral held: ${formatZar(pkg.noFuneralPayout)}` : "",
    "",
    "View the full branded summary (print or save as PDF):",
    shareUrl,
    "",
    "Contact Eyabantu Funerals:",
    "  033 413 1188 / 033 004 0424",
    "  funerals@eyabantu.co.za",
    "  www.eyabantu.co.za",
    "  33 Bell Street, Greytown, KwaZulu-Natal 3250",
    "",
    "Kind regards,",
    "Eyabantu Funerals",
    "Siyakunakala Ngezikhathi Zonke",
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildPackageMailto(pkg: EyabantuPackage, options?: { to?: string; recipientName?: string; origin?: string }) {
  const shareUrl = buildPackageShareUrl(pkg.code, options?.origin);
  const subject = encodeURIComponent(`Eyabantu Funerals — ${pkg.title}`);
  const body = encodeURIComponent(buildPackageEmailText(pkg, shareUrl, options?.recipientName));
  const to = options?.to?.trim();
  return to ? `mailto:${to}?subject=${subject}&body=${body}` : `mailto:?subject=${subject}&body=${body}`;
}
