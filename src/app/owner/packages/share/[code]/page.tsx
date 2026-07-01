import { redirect } from "next/navigation";
import { packagePrintPath } from "@/lib/package-share";

type Props = { params: Promise<{ code: string }> };

/** Legacy URL — redirect to the dedicated print layout (no CRM sidebar). */
export default async function LegacyPackageShareRedirect({ params }: Props) {
  const { code } = await params;
  redirect(packagePrintPath(decodeURIComponent(code)));
}
