import { notFound } from "next/navigation";
import { requireCrmSession } from "@/lib/crm-auth";
import { getPackageByCode } from "@/lib/eyabantu-packages";
import { PackageOfferDocument } from "@/components/packages/PackageOfferDocument";
import { PackageShareToolbar } from "@/components/packages/PackageShareToolbar";

type Props = { params: Promise<{ code: string }> };

export default async function PackagePrintPage({ params }: Props) {
  await requireCrmSession();
  const { code } = await params;
  const pkg = getPackageByCode(decodeURIComponent(code));

  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-[210mm]">
      <PackageShareToolbar pkg={pkg} backHref="/owner/packages" />
      <PackageOfferDocument pkg={pkg} />
    </div>
  );
}
