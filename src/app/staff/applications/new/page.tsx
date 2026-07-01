import Link from "next/link";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function StaffNewApplicationPage() {
  await requireStaffSession();

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="New client application"
        subtitle="Capture a new member using the official Eyabantu application form."
        action={
          <Link
            href="/staff/applications"
            className="rounded-xl border border-[#142a55]/15 bg-white px-4 py-2 text-xs font-semibold text-[#142a55] hover:bg-slate-50"
          >
            Back to applications
          </Link>
        }
      />
      <OnboardingWizard basePath="/staff/applications" />
    </div>
  );
}
