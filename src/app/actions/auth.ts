"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { postLoginPath } from "@/lib/crm-auth";
import { logActivity } from "@/lib/activity";
import { syncAllMemberAccountsForTenant } from "@/lib/member-account-sync";
import { clearSessionCookie, setSessionCookie, signSession } from "@/lib/session";

export type AuthState = { error?: string };

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your work email and password." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user || !user.isActive) {
    return { error: "Invalid credentials or inactive account." };
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return { error: "Invalid credentials or inactive account." };
  }

  const token = await signSession({
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
    staffAccess: user.staffAccess,
    email: user.email,
  });

  await setSessionCookie(token);

  await logActivity({
    tenantId: user.tenantId,
    userId: user.id,
    action: "USER_LOGIN",
    entityType: "User",
    entityId: user.id,
    summary: `${user.firstName} ${user.lastName} signed in (${user.role === "OWNER" ? "owner" : "staff"} workspace)`,
    metadata: { email: user.email },
  });

  await syncAllMemberAccountsForTenant(user.tenantId);

  redirect(postLoginPath(user.role, formData.get("next")));
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
