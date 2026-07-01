import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerProfilePage() {
  const session = await requireOwnerSession();

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { firstName: true, lastName: true, email: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <CrmTopBar
        title="Account & profile"
        subtitle="Your owner identity for this demo tenant. Production deployments would add password change, MFA, and audit history."
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
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Role</dt>
            <dd className="mt-1 text-slate-800">Owner — full CRM access</dd>
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
