import type { StaffAccessLevel } from "@prisma/client";
import { CrmShellClient } from "@/components/crm/CrmShellClient";

type Props = {
  variant: "owner" | "staff";
  user: { firstName: string; lastName: string; email: string };
  staffAccess?: StaffAccessLevel;
  children: React.ReactNode;
};

export function CrmShell({ variant, user, staffAccess, children }: Props) {
  return (
    <CrmShellClient variant={variant} user={user} staffAccess={staffAccess}>
      {children}
    </CrmShellClient>
  );
}
