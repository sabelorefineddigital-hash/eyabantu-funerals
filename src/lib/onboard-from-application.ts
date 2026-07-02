import {
  MemberStatus,
  PaymentMethod,
  PaymentStatus,
  PolicyStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPackageByCode } from "@/lib/eyabantu-packages";
import type { BeneficiaryEntry } from "@/lib/onboarding-form";
import { logActivity } from "@/lib/activity";
import { syncMemberAccountFromLedger } from "@/lib/member-account-sync";

function coverAmountForPackage(packageCode: string | null | undefined): number {
  const pkg = getPackageByCode(packageCode);
  if (!pkg) return 10000;
  return pkg.noFuneralPayout ?? (pkg.cashBack ? pkg.cashBack * 3 : 10000);
}

async function nextPolicyNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.member.count({ where: { tenantId } });
  return `EYB-${year}-${String(10001 + count).padStart(5, "0")}`;
}

async function nextReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.payment.count();
  return `RCP-${year}-${String(100001 + count).slice(-6)}`;
}

export async function onboardMemberFromClientApplication(args: {
  applicationId: string;
  tenantId: string;
  submittedByUserId?: string | null;
}) {
  const app = await prisma.clientApplication.findFirst({
    where: { id: args.applicationId, tenantId: args.tenantId },
  });
  if (!app) throw new Error("Application not found");
  if (app.memberId) {
    return { memberId: app.memberId, alreadyOnboarded: true as const };
  }

  let beneficiaries: BeneficiaryEntry[] = [];
  try {
    beneficiaries = app.beneficiariesJson ? JSON.parse(app.beneficiariesJson) : [];
  } catch {
    beneficiaries = [];
  }

  const filledBeneficiaries = beneficiaries.filter((b) => b.name?.trim() || b.surname?.trim());
  const shareEach =
    filledBeneficiaries.length > 0 ? Math.floor(100 / filledBeneficiaries.length) : 100;

  const pkg = getPackageByCode(app.packageCode);
  const productName = pkg?.title ?? app.packageCode ?? "Eyabantu funeral cover";
  const coverAmount = coverAmountForPackage(app.packageCode);
  const mainMemberName = `${app.firstName} ${app.surname}`.trim();
  const address = [app.address, app.addressCode].filter(Boolean).join(", ") || null;

  if (app.idNumber?.trim()) {
    const duplicate = await prisma.member.findFirst({
      where: { tenantId: args.tenantId, idNumber: app.idNumber.trim() },
    });
    if (duplicate) {
      throw new Error("A member with this ID number already exists in the system.");
    }
  }

  const policyNumber = await nextPolicyNumber(args.tenantId);
  const receiptNumber = await nextReceiptNumber();
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.member.create({
      data: {
        tenantId: args.tenantId,
        policyNumber,
        packageCode: app.packageCode,
        mainMemberName,
        idNumber: app.idNumber?.trim() || null,
        phone: app.cellphone?.trim() || null,
        email: app.email?.trim() || null,
        address,
        monthlyPremium: app.totalPremium,
        status: MemberStatus.ACTIVE,
        missedPayments: 0,
        lastPaymentAt: now,
        nextDebitAt: new Date(now.getTime() + 30 * 86400000),
      },
    });

    if (filledBeneficiaries.length > 0) {
      await tx.beneficiary.createMany({
        data: filledBeneficiaries.map((b, i) => ({
          memberId: member.id,
          fullName: `${b.name} ${b.surname}`.trim(),
          relationship: b.relationship?.trim() || "Beneficiary",
          sharePercent:
            i === filledBeneficiaries.length - 1
              ? 100 - shareEach * (filledBeneficiaries.length - 1)
              : shareEach,
        })),
      });
    } else {
      await tx.beneficiary.create({
        data: {
          memberId: member.id,
          fullName: mainMemberName,
          relationship: "Principal member",
          sharePercent: 100,
        },
      });
    }

    await tx.policy.create({
      data: {
        memberId: member.id,
        productName,
        coverAmount,
        status: PolicyStatus.ACTIVE,
        underwriterRef: `RG-${policyNumber.replace("EYB-", "")}`,
        effectiveAt: app.inceptionDate ?? now,
      },
    });

    await tx.policyApplication.create({
      data: {
        tenantId: args.tenantId,
        agentUserId: args.submittedByUserId ?? app.submittedById,
        applicantName: mainMemberName,
        idNumber: app.idNumber?.trim() || null,
        phone: app.cellphone?.trim() || null,
        proposedCover: coverAmount,
        monthlyPremium: app.totalPremium,
        status: PolicyStatus.ACTIVE,
        notes: `Onboarded from client application ${app.reference}`,
      },
    });

    await tx.payment.create({
      data: {
        memberId: member.id,
        amount: app.totalPremium,
        packageCode: app.packageCode,
        method: PaymentMethod.DEBIT_ORDER,
        status: PaymentStatus.COMPLETED,
        receiptNumber,
        receivedAt: now,
      },
    });

    await tx.clientApplication.update({
      where: { id: app.id },
      data: {
        status: "ONBOARDED",
        memberId: member.id,
      },
    });

    return { memberId: member.id, policyNumber, receiptNumber };
  });

  await syncMemberAccountFromLedger(result.memberId, args.tenantId);

  await logActivity({
    tenantId: args.tenantId,
    userId: args.submittedByUserId ?? app.submittedById,
    action: "MEMBER_ONBOARDED",
    entityType: "Member",
    entityId: result.memberId,
    summary: `${mainMemberName} onboarded from application ${app.reference}`,
    metadata: { applicationId: app.id, policyNumber: result.policyNumber },
  });

  return { ...result, alreadyOnboarded: false as const };
}
