import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";
import { EmployeeCreateForm } from "./employee-create-form";
import { EmployeeToggle } from "./employee-toggle";

export default async function OwnerEmployeesPage() {
  const session = await requireOwnerSession();

  const users = await prisma.user.findMany({
    where: { tenantId: session.tenantId },
    orderBy: [{ role: "asc" }, { lastName: "asc" }],
  });

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Employees & access control"
        subtitle="Owners issue Eyabantu-branded emails, choose management vs administration vs agent access, and suspend compromised accounts without touching the database."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <EmployeeCreateForm />
        <div className="rounded-2xl border border-dashed border-border bg-white p-5 text-sm text-muted shadow-sm">
          <p className="font-semibold text-[var(--brand-ink)]">Access model</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              <span className="font-semibold text-foreground">Management</span> sees collections, policies, and
              operational modules.
            </li>
            <li>
              <span className="font-semibold text-foreground">Administration</span> focuses on members, complaints, and
              branch paperwork.
            </li>
            <li>
              <span className="font-semibold text-foreground">Agents</span> carry a mobile-first policy pipeline.
            </li>
            <li>
              <span className="font-semibold text-foreground">Viewers</span> keep read-only awareness for reception.
            </li>
          </ul>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[var(--background)] text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Colleague</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3 text-right">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--background)]/80">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--brand-ink)]">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-muted">{u.role}</td>
                <td className="px-4 py-3 text-xs text-muted">{u.role === "STAFF" ? u.staffAccess : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {u.role === "STAFF" ? <EmployeeToggle userId={u.id} isActive={u.isActive} /> : <span className="text-xs text-muted">Owner</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
