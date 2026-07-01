import {
  PrismaClient,
  UserRole,
  StaffAccessLevel,
  MemberStatus,
  PolicyStatus,
  ClaimStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.policyApplication.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.funeral.deleteMany();
  await prisma.driverSchedule.deleteMany();
  await prisma.employeeSchedule.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.internalAffairCase.deleteMany();
  await prisma.underwriterLink.deleteMany();
  await prisma.paymentGatewaySetting.deleteMany();
  await prisma.member.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const passwordHash = await bcrypt.hash("Demo@2026", 10);

  const tenant = await prisma.tenant.create({
    data: {
      name: "Eyabantu Funerals",
      slug: "eyabantu",
    },
  });

  const musa = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "musa@eyabantu-funerals.co.za",
      passwordHash,
      firstName: "Musa",
      lastName: "Ntuli",
      role: UserRole.OWNER,
      staffAccess: StaffAccessLevel.NONE,
      jobTitle: "Principal Owner",
      isActive: true,
    },
  });

  const thandi = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "thandi@eyabantu-funerals.co.za",
      passwordHash,
      firstName: "Thandi",
      lastName: "Mkhize",
      role: UserRole.OWNER,
      staffAccess: StaffAccessLevel.NONE,
      jobTitle: "Co-owner",
      isActive: true,
    },
  });

  const lindiwe = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "lindiwe.mgmt@eyabantu-funerals.co.za",
      passwordHash,
      firstName: "Lindiwe",
      lastName: "Dlamini",
      role: UserRole.STAFF,
      staffAccess: StaffAccessLevel.MANAGEMENT,
      jobTitle: "Operations Manager",
      isActive: true,
    },
  });

  const nomfundo = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "nomfundo.admin@eyabantu-funerals.co.za",
      passwordHash,
      firstName: "Nomfundo",
      lastName: "Zulu",
      role: UserRole.STAFF,
      staffAccess: StaffAccessLevel.ADMINISTRATION,
      jobTitle: "Administration",
      isActive: true,
    },
  });

  const sibusiso = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "sibusiso.agent@eyabantu-funerals.co.za",
      passwordHash,
      firstName: "Sibusiso",
      lastName: "Ngcobo",
      role: UserRole.STAFF,
      staffAccess: StaffAccessLevel.AGENT,
      jobTitle: "Field Agent",
      isActive: true,
    },
  });

  const zanele = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "zanele.viewer@eyabantu-funerals.co.za",
      passwordHash,
      firstName: "Zanele",
      lastName: "Khumalo",
      role: UserRole.STAFF,
      staffAccess: StaffAccessLevel.VIEWER,
      jobTitle: "Reception",
      isActive: true,
    },
  });

  const venueMain = await prisma.venue.create({
    data: {
      tenantId: tenant.id,
      name: "Eyabantu Memorial Chapel — Greytown",
      address: "45 King Street, Greytown, 3250",
      capacity: 220,
    },
  });

  const member1 = await prisma.member.create({
    data: {
      tenantId: tenant.id,
      policyNumber: "NTF-2024-10432",
      mainMemberName: "Bongani Cele",
      idNumber: "8001015800087",
      phone: "+27 72 000 1234",
      email: "bongani.cele@example.com",
      monthlyPremium: 385,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      nextDebitAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    },
  });

  const member2 = await prisma.member.create({
    data: {
      tenantId: tenant.id,
      policyNumber: "NTF-2023-8821",
      mainMemberName: "Nokuthula Mthembu",
      idNumber: "7605125800081",
      phone: "+27 83 555 2211",
      monthlyPremium: 420,
      status: MemberStatus.DEFAULTED,
      missedPayments: 3,
      lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 95),
      nextDebitAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
  });

  const member3 = await prisma.member.create({
    data: {
      tenantId: tenant.id,
      policyNumber: "NTF-2025-12001",
      mainMemberName: "Sipho Dube",
      idNumber: "9008155800083",
      phone: "+27 60 991 4420",
      email: "sipho.dube@example.com",
      monthlyPremium: 310,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
      nextDebitAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    },
  });

  await prisma.beneficiary.createMany({
    data: [
      { memberId: member1.id, fullName: "Thobile Cele", relationship: "Spouse", sharePercent: 50 },
      { memberId: member1.id, fullName: "Lwazi Cele", relationship: "Child", sharePercent: 50 },
    ],
  });

  await prisma.policy.createMany({
    data: [
      {
        memberId: member1.id,
        productName: "Family Cover Plus",
        coverAmount: 85000,
        status: PolicyStatus.ACTIVE,
        underwriterRef: "RG-883921",
      },
      {
        memberId: member2.id,
        productName: "Standard Policy",
        coverAmount: 45000,
        status: PolicyStatus.LAPSED,
        underwriterRef: "RG-772110",
      },
      {
        memberId: member3.id,
        productName: "Premium Policy",
        coverAmount: 120000,
        status: PolicyStatus.ACTIVE,
        underwriterRef: "RG-991044",
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        memberId: member1.id,
        amount: 385,
        method: PaymentMethod.DEBIT_ORDER,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000891",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        memberId: member3.id,
        amount: 310,
        method: PaymentMethod.PAYFAST,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000892",
        externalRef: "PF-DEMO-99821",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
      },
      {
        memberId: member1.id,
        amount: 385,
        method: PaymentMethod.CASH,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000893",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
      },
      {
        memberId: member2.id,
        amount: 420,
        method: PaymentMethod.MANUAL,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000894",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      },
      {
        memberId: member1.id,
        amount: 770,
        method: PaymentMethod.MANUAL,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000895",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      },
      {
        memberId: member3.id,
        amount: 310,
        method: PaymentMethod.DEBIT_ORDER,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000896",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
      },
      {
        memberId: member2.id,
        amount: 200,
        method: PaymentMethod.CASH,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000897",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 102),
      },
      {
        memberId: member3.id,
        amount: 620,
        method: PaymentMethod.PAYFAST,
        status: PaymentStatus.COMPLETED,
        receiptNumber: "RCP-2026-000898",
        externalRef: "PF-DEMO-77204",
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      },
    ],
  });

  await prisma.claim.createMany({
    data: [
      {
        tenantId: tenant.id,
        memberId: member1.id,
        status: ClaimStatus.ASSESSING,
        amount: 12000,
        reference: "CLM-2026-0044",
        notes: "Transport and catering deposit submitted.",
      },
      {
        tenantId: tenant.id,
        memberId: member3.id,
        status: ClaimStatus.OPEN,
        amount: 8000,
        reference: "CLM-2026-0045",
        notes: "Awaiting death certificate upload.",
      },
    ],
  });

  await prisma.funeral.create({
    data: {
      tenantId: tenant.id,
      memberId: member2.id,
      deceasedName: "Thembi Mthembu",
      funeralDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      venueId: venueMain.id,
      status: "CONFIRMED",
      coordinator: lindiwe.firstName + " " + lindiwe.lastName,
    },
  });

  const now = Date.now();
  await prisma.driverSchedule.createMany({
    data: [
      {
        tenantId: tenant.id,
        driverUserId: sibusiso.id,
        vehicle: "Mercedes-Benz Sprinter — NTF GP",
        startAt: new Date(now + 1000 * 60 * 60 * 6),
        endAt: new Date(now + 1000 * 60 * 60 * 10),
        routeNotes: "Greytown → Ladysmith (family transport)",
      },
      {
        tenantId: tenant.id,
        driverUserId: null,
        vehicle: "Hearse — NTF 1",
        startAt: new Date(now + 1000 * 60 * 60 * 24),
        endAt: new Date(now + 1000 * 60 * 60 * 26),
        routeNotes: "Chapel standby — Greytown",
      },
    ],
  });

  await prisma.employeeSchedule.createMany({
    data: [
      {
        tenantId: tenant.id,
        userId: nomfundo.id,
        shiftStart: new Date(now + 1000 * 60 * 60 * 8),
        shiftEnd: new Date(now + 1000 * 60 * 60 * 16),
        location: "Greytown HQ — reception",
      },
      {
        tenantId: tenant.id,
        userId: lindiwe.id,
        shiftStart: new Date(now + 1000 * 60 * 60 * 9),
        shiftEnd: new Date(now + 1000 * 60 * 60 * 18),
        location: "Greytown HQ — operations",
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      {
        tenantId: tenant.id,
        category: "Fleet",
        amount: 4200,
        description: "Fuel — hearses and Sprinter",
        incurredAt: new Date(now - 1000 * 60 * 60 * 24 * 2),
        approvedById: musa.id,
      },
      {
        tenantId: tenant.id,
        category: "Venue",
        amount: 1800,
        description: "Chapel consumables restock",
        incurredAt: new Date(now - 1000 * 60 * 60 * 24 * 6),
        approvedById: thandi.id,
      },
    ],
  });

  await prisma.complaint.createMany({
    data: [
      {
        tenantId: tenant.id,
        subject: "Delayed certificate assistance",
        body: "Family requested faster liaison with Home Affairs.",
        status: "IN_PROGRESS",
        createdById: nomfundo.id,
      },
      {
        tenantId: tenant.id,
        subject: "Debit order timing",
        body: "Member prefers debit on the 25th instead of the 1st.",
        status: "OPEN",
        createdById: zanele.id,
      },
    ],
  });

  await prisma.internalAffairCase.createMany({
    data: [
      {
        tenantId: tenant.id,
        title: "Workplace conduct — after-hours messaging",
        severity: "MEDIUM",
        status: "UNDER_REVIEW",
        reporterUserId: lindiwe.id,
        details: "Confidential HR intake. Demo record for Internal Affairs module.",
      },
    ],
  });

  await prisma.policyApplication.createMany({
    data: [
      {
        tenantId: tenant.id,
        agentUserId: sibusiso.id,
        applicantName: "Ayanda Khoza",
        idNumber: "9202015800082",
        phone: "+27 78 221 0091",
        proposedCover: 65000,
        monthlyPremium: 360,
        status: PolicyStatus.PENDING_UNDERWRITER,
        notes: "Submitted via agent tablet — awaiting Redit Gateway response.",
      },
      {
        tenantId: tenant.id,
        agentUserId: sibusiso.id,
        applicantName: "Mandla Radebe",
        idNumber: "8811155800084",
        phone: "+27 82 441 7720",
        proposedCover: 90000,
        monthlyPremium: 410,
        status: PolicyStatus.PENDING_UNDERWRITER,
        notes: "Medical questionnaire attached (demo).",
      },
    ],
  });

  await prisma.underwriterLink.create({
    data: {
      tenantId: tenant.id,
      provider: "REDIT_GATEWAY",
      externalId: "tenant-link-demo-001",
      isActive: true,
    },
  });

  await prisma.paymentGatewaySetting.create({
    data: {
      tenantId: tenant.id,
      provider: "PAYFAST",
      merchantId: "demo-merchant-id",
      passphrase: "demo-passphrase",
      isSandbox: true,
    },
  });

  const logs: { userId?: string; action: string; entityType: string; entityId?: string; summary: string }[] = [
    { userId: musa.id, action: "MEMBER_ADDED", entityType: "Member", entityId: member1.id, summary: "Member Bongani Cele onboarded" },
    { userId: sibusiso.id, action: "PAYMENT_RECEIVED", entityType: "Payment", summary: "PayFast payment captured for Sipho Dube" },
    { userId: nomfundo.id, action: "CLAIM_UPDATED", entityType: "Claim", summary: "Claim CLM-2026-0044 moved to assessing" },
    { userId: lindiwe.id, action: "FUNERAL_SCHEDULED", entityType: "Funeral", summary: "Funeral confirmed for Thembi Mthembu" },
    { userId: thandi.id, action: "POLICY_SUBMITTED", entityType: "PolicyApplication", summary: "New policy application from agent Sibusiso Ngcobo" },
    { userId: musa.id, action: "USER_ACTIVATED", entityType: "User", entityId: zanele.id, summary: "Employee access activated for Zanele Khumalo" },
  ];

  for (const [i, log] of logs.entries()) {
    await prisma.activityLog.create({
      data: {
        tenantId: tenant.id,
        userId: log.userId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        summary: log.summary,
        createdAt: new Date(Date.now() - 1000 * 60 * 15 * (logs.length - i)),
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete. Demo password for all accounts: Demo@2026");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
