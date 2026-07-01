"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { StaffAccessLevel, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { syncMemberAccountFromLedger } from "@/lib/member-account-sync";
import { getSessionFromCookies } from "@/lib/session";

async function requireOwner() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "OWNER") {
    throw new Error("Unauthorized");
  }
  return session;
}

export type EmployeeCreateState = { error?: string; success?: boolean; tempPassword?: string };

export async function createEmployeeAction(
  _prev: EmployeeCreateState,
  formData: FormData,
): Promise<EmployeeCreateState> {
  const session = await requireOwner();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const accessRaw = String(formData.get("staffAccess") ?? "ADMINISTRATION");
  const staffAccess: StaffAccessLevel =
    accessRaw === "MANAGEMENT"
      ? StaffAccessLevel.MANAGEMENT
      : accessRaw === "AGENT"
        ? StaffAccessLevel.AGENT
        : accessRaw === "VIEWER"
          ? StaffAccessLevel.VIEWER
          : StaffAccessLevel.ADMINISTRATION;

  if (!email || !firstName || !lastName) {
    return { error: "Email, first name, and last name are required." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "That email is already registered." };
  }

  const passwordHash = await bcrypt.hash("Demo@2026", 10);

  const user = await prisma.user.create({
    data: {
      tenantId: session.tenantId,
      email,
      passwordHash,
      firstName,
      lastName,
      jobTitle: jobTitle || null,
      role: UserRole.STAFF,
      staffAccess,
      isActive: true,
    },
  });

  await logActivity({
    tenantId: session.tenantId,
    userId: session.sub,
    action: "EMPLOYEE_CREATED",
    entityType: "User",
    entityId: user.id,
    summary: `New employee login created for ${user.firstName} ${user.lastName} (${user.email})`,
    metadata: { staffAccess: user.staffAccess },
  });

  revalidatePath("/owner/employees");
  return { success: true, tempPassword: "Demo@2026" };
}

export async function setEmployeeActiveAction(userId: string, isActive: boolean) {
  const session = await requireOwner();
  await prisma.user.updateMany({
    where: { id: userId, tenantId: session.tenantId, role: "STAFF" },
    data: { isActive },
  });

  await logActivity({
    tenantId: session.tenantId,
    userId: session.sub,
    action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
    entityType: "User",
    entityId: userId,
    summary: isActive ? "Employee access activated" : "Employee access suspended",
  });

  revalidatePath("/owner/employees");
}

export type PaymentManualState = {
  error?: string;
  success?: boolean;
  receiptNumber?: string;
  paymentId?: string;
};

export async function recordManualPaymentAction(
  _prev: PaymentManualState,
  formData: FormData,
): Promise<PaymentManualState> {
  const session = await requireOwner();
  const memberId = String(formData.get("memberId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  if (!memberId || !Number.isFinite(amount) || amount <= 0) {
    return { error: "Select a member and enter a valid amount." };
  }

  const member = await prisma.member.findFirst({
    where: { id: memberId, tenantId: session.tenantId },
  });
  if (!member) return { error: "Member not found." };

  const receiptNumber = `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;

  const payment = await prisma.payment.create({
    data: {
      memberId,
      amount,
      method: "MANUAL",
      status: "COMPLETED",
      receiptNumber,
    },
  });

  await syncMemberAccountFromLedger(memberId, session.tenantId);

  await logActivity({
    tenantId: session.tenantId,
    userId: session.sub,
    action: "PAYMENT_RECEIVED",
    entityType: "Payment",
    summary: `Manual payment of R${amount.toFixed(2)} recorded for ${member.mainMemberName}`,
    metadata: { receiptNumber },
  });

  revalidatePath("/owner/payments");
  revalidatePath("/owner/members");
  revalidatePath("/owner/accounts");
  revalidatePath("/owner");
  revalidatePath("/staff");
  return { success: true, receiptNumber, paymentId: payment.id };
}
