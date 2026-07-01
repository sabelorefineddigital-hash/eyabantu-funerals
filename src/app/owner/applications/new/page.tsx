import Link from "next/link";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function NewApplicationPage() {
  await requireOwnerSession();

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="New client application"
        subtitle="Complete the Eyabantu application form digitally — all sections from the paper form, ready to submit."
        action={
          <Link
            href="/owner/applications"
            className="rounded-xl border border-[#142a55]/15 bg-white px-4 py-2 text-xs font-semibold text-[#142a55] hover:bg-slate-50"
          >
            Back to applications
          </Link>
        }
      />
      <OnboardingWizard basePath="/owner/applications" />
    </div>
  );
}
