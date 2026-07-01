import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireOwnerSession } from "@/lib/crm-auth";
import { getPackageByCode } from "@/lib/eyabantu-packages";
import { PackageOfferDocument } from "@/components/packages/PackageOfferDocument";
import { PackageShareToolbar } from "@/components/packages/PackageShareToolbar";

type Props = { params: Promise<{ code: string }> };

export default async function PackageSharePage({ params }: Props) {
  await requireOwnerSession();
  const { code } = await params;
  const pkg = getPackageByCode(decodeURIComponent(code));

  if (!pkg) notFound();

  return (
    <div className="package-share-page mx-auto max-w-4xl">
      <Suspense fallback={null}>
        <PackageShareToolbar pkg={pkg} />
      </Suspense>
      <PackageOfferDocument pkg={pkg} />
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          aside, header.sticky { display: none !important; }
        }
      `}</style>
    </div>
  );
}
