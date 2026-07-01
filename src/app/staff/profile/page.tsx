import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { staffRoleLabel } from "@/lib/crm-nav-config";

export default async function StaffProfilePage() {
  const session = await requireStaffSession();

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { firstName: true, lastName: true, email: true, staffAccess: true, createdAt: true },
  });

  if (!user) redirect("/login");

  const band = staffRoleLabel(user.staffAccess);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <CrmTopBar
        title="Account & profile"
        subtitle="Staff workspace profile. Access to modules follows your band (agent, administration, management, or viewer)."
      />
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Full name</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-800">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Access band</dt>
            <dd className="mt-1 text-slate-800">{band}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Member since</dt>
            <dd className="mt-1 text-slate-800">
              {user.createdAt.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
