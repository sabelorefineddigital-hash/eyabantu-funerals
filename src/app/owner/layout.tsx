import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmShell } from "@/components/crm/CrmShell";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireOwnerSession();

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { firstName: true, lastName: true, email: true, staffAccess: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <CrmShell variant="owner" user={user} staffAccess={user.staffAccess}>
      {children}
    </CrmShell>
  );
}
