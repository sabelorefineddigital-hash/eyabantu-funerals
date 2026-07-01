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

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function daysFromNow(n: number) {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

function hoursFromNow(n: number) {
  return new Date(Date.now() + n * 60 * 60 * 1000);
}

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.clientApplication.deleteMany();
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
    data: { name: "Eyabantu Funerals", slug: "eyabantu" },
  });

  const ayanda = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "ayanda.masikane@eyabantu.co.za",
      passwordHash,
      firstName: "Ayanda",
      lastName: "Masikane",
      role: UserRole.OWNER,
      staffAccess: StaffAccessLevel.NONE,
      jobTitle: "Principal Owner",
      phone: "+27 33 413 1188",
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

  const venuePmb = await prisma.venue.create({
    data: {
      tenantId: tenant.id,
      name: "Eyabantu Community Hall — Pietermaritzburg",
      address: "12 Church Street, Pietermaritzburg, 3201",
      capacity: 350,
    },
  });

  const memberDefs = [
    {
      policyNumber: "EYB-2024-10432",
      packageCode: "6P-MINI",
      mainMemberName: "Bongani Cele",
      idNumber: "8001015800087",
      phone: "+27 72 000 1234",
      email: "bongani.cele@example.com",
      address: "14 Mzinyathi Road, Greytown, 3250",
      monthlyPremium: 350,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: daysAgo(5),
      nextDebitAt: daysFromNow(2),
    },
    {
      policyNumber: "EYB-2023-8821",
      packageCode: "10P-BASIC",
      mainMemberName: "Nokuthula Mthembu",
      idNumber: "7605125800081",
      phone: "+27 83 555 2211",
      address: "8 Dlamini Street, Wartburg, 3233",
      monthlyPremium: 350,
      status: MemberStatus.DEFAULTED,
      missedPayments: 3,
      lastPaymentAt: daysAgo(95),
      nextDebitAt: daysAgo(30),
    },
    {
      policyNumber: "EYB-2025-12001",
      packageCode: "1P-MINI",
      mainMemberName: "Sipho Dube",
      idNumber: "9008155800083",
      phone: "+27 60 991 4420",
      email: "sipho.dube@example.com",
      address: "22 Bell Street, Greytown, 3250",
      monthlyPremium: 100,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: daysAgo(28),
      nextDebitAt: daysFromNow(2),
    },
    {
      policyNumber: "EYB-2024-11550",
      packageCode: "6P-PLAT",
      mainMemberName: "Lungile Khumalo",
      idNumber: "8503035800085",
      phone: "+27 71 882 3344",
      email: "lungile.k@example.com",
      address: "5 Farm Road, Dalton, 3236",
      monthlyPremium: 450,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: daysAgo(1),
      nextDebitAt: daysFromNow(29),
    },
    {
      policyNumber: "EYB-2022-7700",
      packageCode: "10P-PLAT",
      mainMemberName: "Mandla Radebe",
      idNumber: "8811155800084",
      phone: "+27 82 441 7720",
      address: "33 Main Road, New Hanover, 3240",
      monthlyPremium: 450,
      status: MemberStatus.LAPSED,
      missedPayments: 5,
      lastPaymentAt: daysAgo(180),
      nextDebitAt: daysAgo(150),
    },
    {
      policyNumber: "EYB-2025-13088",
      packageCode: "6P-BASIC",
      mainMemberName: "Ayanda Khoza",
      idNumber: "9202015800082",
      phone: "+27 78 221 0091",
      address: "19 Station Road, Greytown, 3250",
      monthlyPremium: 250,
      status: MemberStatus.PENDING,
      missedPayments: 0,
      lastPaymentAt: null,
      nextDebitAt: daysFromNow(7),
    },
    {
      policyNumber: "EYB-2024-9912",
      packageCode: "1P-PLAT",
      mainMemberName: "Thandeka Ngcobo",
      idNumber: "8706125800089",
      phone: "+27 84 300 1199",
      email: "thandeka.n@example.com",
      address: "7 Ridgeview, Pietermaritzburg, 3201",
      monthlyPremium: 150,
      status: MemberStatus.ACTIVE,
      missedPayments: 1,
      lastPaymentAt: daysAgo(35),
      nextDebitAt: daysFromNow(5),
    },
    {
      policyNumber: "EYB-2023-6601",
      packageCode: "10P-MINI",
      mainMemberName: "Jabulani Zulu",
      idNumber: "7910205800086",
      phone: "+27 73 550 8820",
      address: "2 Ezakheni Township, Ladysmith, 3370",
      monthlyPremium: 450,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: daysAgo(12),
      nextDebitAt: daysFromNow(18),
    },
    {
      policyNumber: "EYB-2025-14102",
      packageCode: "1P-BASIC",
      mainMemberName: "Nomsa Buthelezi",
      idNumber: "9504045800080",
      phone: "+27 61 220 4455",
      email: "nomsa.b@example.com",
      address: "11 Hlanganani Street, Greytown, 3250",
      monthlyPremium: 80,
      status: MemberStatus.ACTIVE,
      missedPayments: 0,
      lastPaymentAt: daysAgo(0),
      nextDebitAt: daysFromNow(30),
    },
    {
      policyNumber: "EYB-2024-10880",
      packageCode: "6P-MINI",
      mainMemberName: "Sizwe Mokoena",
      idNumber: "8307075800082",
      phone: "+27 79 118 9900",
      address: "44 Valley Drive, Wartburg, 3233",
      monthlyPremium: 350,
      status: MemberStatus.DEFAULTED,
      missedPayments: 2,
      lastPaymentAt: daysAgo(62),
      nextDebitAt: daysAgo(32),
    },
  ] as const;

  const members = await Promise.all(
    memberDefs.map((m) =>
      prisma.member.create({
        data: { tenantId: tenant.id, ...m },
      }),
    ),
  );

  const [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10] = members;

  await prisma.beneficiary.createMany({
    data: [
      { memberId: m1.id, fullName: "Thobile Cele", relationship: "Spouse", sharePercent: 50 },
      { memberId: m1.id, fullName: "Lwazi Cele", relationship: "Child", sharePercent: 50 },
      { memberId: m4.id, fullName: "Nokwanda Khumalo", relationship: "Spouse", sharePercent: 100 },
      { memberId: m7.id, fullName: "Sibusiso Ngcobo Jr", relationship: "Child", sharePercent: 50 },
      { memberId: m7.id, fullName: "Nolwazi Ngcobo", relationship: "Child", sharePercent: 50 },
      { memberId: m8.id, fullName: "Phumzile Zulu", relationship: "Spouse", sharePercent: 60 },
      { memberId: m8.id, fullName: "Themba Zulu", relationship: "Parent", sharePercent: 40 },
    ],
  });

  await prisma.policy.createMany({
    data: [
      { memberId: m1.id, productName: "6 People · Mini Dome", coverAmount: 15000, status: PolicyStatus.ACTIVE, underwriterRef: "RG-883921" },
      { memberId: m2.id, productName: "10 People · Basic Casket", coverAmount: 10000, status: PolicyStatus.LAPSED, underwriterRef: "RG-772110" },
      { memberId: m3.id, productName: "Single · Mini Dome", coverAmount: 15000, status: PolicyStatus.ACTIVE, underwriterRef: "RG-991044" },
      { memberId: m4.id, productName: "6 People · Platinum Dome", coverAmount: 20000, status: PolicyStatus.ACTIVE, underwriterRef: "RG-884201" },
      { memberId: m5.id, productName: "10 People · Platinum Dome", coverAmount: 20000, status: PolicyStatus.CANCELLED, underwriterRef: "RG-661002" },
      { memberId: m6.id, productName: "6 People · Basic Casket", coverAmount: 10000, status: PolicyStatus.PENDING_UNDERWRITER, underwriterRef: "RG-PENDING-441" },
      { memberId: m7.id, productName: "Single · Platinum Dome", coverAmount: 20000, status: PolicyStatus.ACTIVE, underwriterRef: "RG-992881" },
      { memberId: m8.id, productName: "10 People · Mini Dome", coverAmount: 15000, status: PolicyStatus.ACTIVE, underwriterRef: "RG-775502" },
      { memberId: m9.id, productName: "Single · Basic Casket", coverAmount: 10000, status: PolicyStatus.ACTIVE, underwriterRef: "RG-993110" },
      { memberId: m10.id, productName: "6 People · Mini Dome", coverAmount: 15000, status: PolicyStatus.LAPSED, underwriterRef: "RG-882330" },
    ],
  });

  const paymentRows: {
    memberId: string;
    amount: number;
    packageCode?: string;
    method: PaymentMethod;
    status: PaymentStatus;
    receiptNumber: string;
    externalRef?: string;
    receivedAt: Date;
  }[] = [
    { memberId: m1.id, amount: 350, packageCode: "6P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000891", receivedAt: daysAgo(5) },
    { memberId: m3.id, amount: 100, packageCode: "1P-MINI", method: PaymentMethod.PAYFAST, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000892", externalRef: "PF-DEMO-99821", receivedAt: daysAgo(28) },
    { memberId: m1.id, amount: 350, packageCode: "6P-MINI", method: PaymentMethod.CASH, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000893", receivedAt: daysAgo(1) },
    { memberId: m2.id, amount: 350, packageCode: "10P-BASIC", method: PaymentMethod.MANUAL, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000894", receivedAt: daysAgo(3) },
    { memberId: m1.id, amount: 700, packageCode: "6P-MINI", method: PaymentMethod.MANUAL, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000895", receivedAt: daysAgo(14) },
    { memberId: m3.id, amount: 100, packageCode: "1P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000896", receivedAt: daysAgo(35) },
    { memberId: m2.id, amount: 200, method: PaymentMethod.CASH, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000897", receivedAt: daysAgo(102) },
    { memberId: m3.id, amount: 620, method: PaymentMethod.PAYFAST, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000898", externalRef: "PF-DEMO-77204", receivedAt: daysAgo(8) },
    { memberId: m4.id, amount: 450, packageCode: "6P-PLAT", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000899", receivedAt: daysAgo(1) },
    { memberId: m4.id, amount: 450, packageCode: "6P-PLAT", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000900", receivedAt: daysAgo(31) },
    { memberId: m7.id, amount: 150, packageCode: "1P-PLAT", method: PaymentMethod.CASH, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000901", receivedAt: daysAgo(35) },
    { memberId: m8.id, amount: 450, packageCode: "10P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000902", receivedAt: daysAgo(12) },
    { memberId: m9.id, amount: 80, packageCode: "1P-BASIC", method: PaymentMethod.PAYFAST, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000903", externalRef: "PF-DEMO-88112", receivedAt: daysAgo(0) },
    { memberId: m9.id, amount: 80, packageCode: "1P-BASIC", method: PaymentMethod.PAYFAST, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000904", externalRef: "PF-DEMO-88101", receivedAt: daysAgo(30) },
    { memberId: m10.id, amount: 350, packageCode: "6P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.FAILED, receiptNumber: "RCP-2026-000905", receivedAt: daysAgo(32) },
    { memberId: m5.id, amount: 450, packageCode: "10P-PLAT", method: PaymentMethod.MANUAL, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000906", receivedAt: daysAgo(200) },
    { memberId: m1.id, amount: 350, packageCode: "6P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000907", receivedAt: daysAgo(0) },
    { memberId: m8.id, amount: 900, packageCode: "10P-MINI", method: PaymentMethod.MANUAL, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000908", receivedAt: daysAgo(60) },
    { memberId: m3.id, amount: 100, packageCode: "1P-MINI", method: PaymentMethod.CASH, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000909", receivedAt: daysAgo(1) },
    { memberId: m4.id, amount: 450, packageCode: "6P-PLAT", method: PaymentMethod.PAYFAST, status: PaymentStatus.PENDING, receiptNumber: "RCP-2026-000910", externalRef: "PF-DEMO-PENDING", receivedAt: daysAgo(0) },
    { memberId: m7.id, amount: 300, packageCode: "1P-PLAT", method: PaymentMethod.MANUAL, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000911", receivedAt: daysAgo(65) },
    { memberId: m2.id, amount: 350, packageCode: "10P-BASIC", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.FAILED, receiptNumber: "RCP-2026-000912", receivedAt: daysAgo(30) },
    { memberId: m6.id, amount: 250, packageCode: "6P-BASIC", method: PaymentMethod.CASH, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000913", receivedAt: daysAgo(2) },
    { memberId: m1.id, amount: 350, packageCode: "6P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000914", receivedAt: daysAgo(35) },
    { memberId: m8.id, amount: 450, packageCode: "10P-MINI", method: PaymentMethod.DEBIT_ORDER, status: PaymentStatus.COMPLETED, receiptNumber: "RCP-2026-000915", receivedAt: daysAgo(1) },
  ];

  await prisma.payment.createMany({ data: paymentRows });

  await prisma.claim.createMany({
    data: [
      { tenantId: tenant.id, memberId: m1.id, status: ClaimStatus.ASSESSING, amount: 12000, reference: "CLM-2026-0044", notes: "Transport and catering deposit submitted." },
      { tenantId: tenant.id, memberId: m3.id, status: ClaimStatus.OPEN, amount: 8000, reference: "CLM-2026-0045", notes: "Awaiting death certificate upload." },
      { tenantId: tenant.id, memberId: m4.id, status: ClaimStatus.APPROVED, amount: 18500, reference: "CLM-2026-0046", notes: "Approved — payout scheduled." },
      { tenantId: tenant.id, memberId: m5.id, status: ClaimStatus.PAID, amount: 20000, reference: "CLM-2025-0091", notes: "Full claim settled December 2025." },
      { tenantId: tenant.id, memberId: m10.id, status: ClaimStatus.DECLINED, amount: 0, reference: "CLM-2026-0047", notes: "Policy lapsed — claim declined per terms." },
      { tenantId: tenant.id, memberId: m8.id, status: ClaimStatus.OPEN, amount: 14000, reference: "CLM-2026-0048", notes: "New intake — coordinator assigned." },
      { tenantId: tenant.id, memberId: m7.id, status: ClaimStatus.ASSESSING, amount: 9500, reference: "CLM-2026-0049", notes: "Assessor visit booked." },
    ],
  });

  await prisma.funeral.createMany({
    data: [
      { tenantId: tenant.id, memberId: m2.id, deceasedName: "Thembi Mthembu", funeralDate: daysFromNow(4), venueId: venueMain.id, status: "CONFIRMED", coordinator: "Lindiwe Dlamini" },
      { tenantId: tenant.id, memberId: m5.id, deceasedName: "Grace Radebe", funeralDate: daysFromNow(12), venueId: venuePmb.id, status: "PLANNED", coordinator: "Nomfundo Zulu" },
      { tenantId: tenant.id, memberId: m8.id, deceasedName: "Samuel Zulu", funeralDate: daysFromNow(1), venueId: venueMain.id, status: "IN_PROGRESS", coordinator: "Ayanda Masikane" },
      { tenantId: tenant.id, memberId: null, deceasedName: "Community burial — Dalton", funeralDate: daysAgo(14), venueId: venueMain.id, status: "COMPLETED", coordinator: "Sibusiso Ngcobo" },
      { tenantId: tenant.id, memberId: m1.id, deceasedName: "Reserved — Cele family", funeralDate: daysFromNow(21), venueId: venueMain.id, status: "TENTATIVE", coordinator: "Lindiwe Dlamini" },
    ],
  });

  await prisma.driverSchedule.createMany({
    data: [
      { tenantId: tenant.id, driverUserId: sibusiso.id, vehicle: "Mercedes-Benz Sprinter — EYB GP", startAt: hoursFromNow(6), endAt: hoursFromNow(10), routeNotes: "Greytown → Ladysmith (family transport)" },
      { tenantId: tenant.id, driverUserId: null, vehicle: "Hearse — EYB 1", startAt: hoursFromNow(24), endAt: hoursFromNow(26), routeNotes: "Chapel standby — Greytown" },
      { tenantId: tenant.id, driverUserId: sibusiso.id, vehicle: "Toyota Quantum — EYB 3", startAt: hoursFromNow(48), endAt: hoursFromNow(52), routeNotes: "Pietermaritzburg venue shuttle" },
      { tenantId: tenant.id, driverUserId: null, vehicle: "Hearse — EYB 2", startAt: daysFromNow(1), endAt: daysFromNow(1), routeNotes: "Zulu family service — Greytown chapel" },
    ],
  });

  await prisma.employeeSchedule.createMany({
    data: [
      { tenantId: tenant.id, userId: nomfundo.id, shiftStart: hoursFromNow(8), shiftEnd: hoursFromNow(16), location: "Greytown HQ — reception" },
      { tenantId: tenant.id, userId: lindiwe.id, shiftStart: hoursFromNow(9), shiftEnd: hoursFromNow(18), location: "Greytown HQ — operations" },
      { tenantId: tenant.id, userId: zanele.id, shiftStart: hoursFromNow(7), shiftEnd: hoursFromNow(15), location: "Greytown HQ — front desk" },
      { tenantId: tenant.id, userId: sibusiso.id, shiftStart: hoursFromNow(26), shiftEnd: hoursFromNow(34), location: "Field — Wartburg & Dalton" },
      { tenantId: tenant.id, userId: nomfundo.id, shiftStart: hoursFromNow(50), shiftEnd: hoursFromNow(58), location: "Pietermaritzburg branch" },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { tenantId: tenant.id, category: "Fleet", amount: 4200, description: "Fuel — hearses and Sprinter", incurredAt: daysAgo(2), approvedById: ayanda.id },
      { tenantId: tenant.id, category: "Venue", amount: 1800, description: "Chapel consumables restock", incurredAt: daysAgo(6), approvedById: thandi.id },
      { tenantId: tenant.id, category: "Marketing", amount: 2500, description: "Flyers and community radio slots", incurredAt: daysAgo(10), approvedById: ayanda.id },
      { tenantId: tenant.id, category: "Staff", amount: 3200, description: "Overtime — weekend funerals", incurredAt: daysAgo(4), approvedById: lindiwe.id },
      { tenantId: tenant.id, category: "Supplies", amount: 980, description: "Casket lining materials", incurredAt: daysAgo(1), approvedById: thandi.id },
    ],
  });

  await prisma.complaint.createMany({
    data: [
      { tenantId: tenant.id, subject: "Delayed certificate assistance", body: "Family requested faster liaison with Home Affairs.", status: "IN_PROGRESS", createdById: nomfundo.id },
      { tenantId: tenant.id, subject: "Debit order timing", body: "Member prefers debit on the 25th instead of the 1st.", status: "OPEN", createdById: zanele.id },
      { tenantId: tenant.id, subject: "Chapel seating arrangement", body: "Request for additional chairs at Saturday service.", status: "RESOLVED", createdById: nomfundo.id },
      { tenantId: tenant.id, subject: "Premium query", body: "Member believes incorrect package was loaded on debit order.", status: "OPEN", createdById: lindiwe.id },
    ],
  });

  await prisma.internalAffairCase.createMany({
    data: [
      { tenantId: tenant.id, title: "Workplace conduct — after-hours messaging", severity: "MEDIUM", status: "UNDER_REVIEW", reporterUserId: lindiwe.id, details: "Confidential HR intake. Demo record for Internal Affairs module." },
      { tenantId: tenant.id, title: "Uniform policy breach", severity: "LOW", status: "OPEN", reporterUserId: nomfundo.id, details: "Field agent attended site visit without branded vest." },
    ],
  });

  await prisma.policyApplication.createMany({
    data: [
      { tenantId: tenant.id, agentUserId: sibusiso.id, applicantName: "Ayanda Khoza", idNumber: "9202015800082", phone: "+27 78 221 0091", proposedCover: 65000, monthlyPremium: 250, status: PolicyStatus.PENDING_UNDERWRITER, notes: "Submitted via agent tablet — awaiting Redit Gateway response.", createdAt: daysAgo(0) },
      { tenantId: tenant.id, agentUserId: sibusiso.id, applicantName: "Mandla Radebe", idNumber: "8811155800084", phone: "+27 82 441 7720", proposedCover: 90000, monthlyPremium: 450, status: PolicyStatus.PENDING_UNDERWRITER, notes: "Medical questionnaire attached (demo).", createdAt: daysAgo(1) },
      { tenantId: tenant.id, agentUserId: sibusiso.id, applicantName: "Precious Ndlovu", idNumber: "9308185800087", phone: "+27 76 330 2210", proposedCover: 15000, monthlyPremium: 100, status: PolicyStatus.ACTIVE, notes: "Approved and converted to member.", createdAt: daysAgo(14) },
      { tenantId: tenant.id, agentUserId: sibusiso.id, applicantName: "Vusi Mabaso", idNumber: "8601015800083", phone: "+27 81 900 4422", proposedCover: 20000, monthlyPremium: 350, status: PolicyStatus.PENDING_UNDERWRITER, notes: "Family of 6 — mini dome package.", createdAt: daysAgo(0) },
      { tenantId: tenant.id, agentUserId: sibusiso.id, applicantName: "Lerato Mokoena", idNumber: "9405055800081", phone: "+27 63 221 7788", proposedCover: 10000, monthlyPremium: 80, status: PolicyStatus.CANCELLED, notes: "Applicant withdrew before underwriting.", createdAt: daysAgo(21) },
    ],
  });

  const spousesSample = JSON.stringify([{ fullName: "Thobile Cele", idNumber: "8202025800088", dateOfBirth: "1982-02-02" }]);
  const dependantsSample = JSON.stringify([
    { fullName: "Lwazi Cele", idNumber: "1001015800081", relationship: "Child" },
    { fullName: "Sanele Cele", idNumber: "1203035800082", relationship: "Child" },
  ]);
  const beneficiariesSample = JSON.stringify([{ fullName: "Thobile Cele", relationship: "Spouse", sharePercent: 100 }]);

  await prisma.clientApplication.createMany({
    data: [
      {
        tenantId: tenant.id,
        submittedById: sibusiso.id,
        reference: "APP-2026-0101",
        status: "SUBMITTED",
        surname: "Cele",
        firstName: "Bongani",
        idNumber: "8001015800087",
        cellphone: "+27 72 000 1234",
        email: "bongani.cele@example.com",
        address: "14 Mzinyathi Road, Greytown, 3250",
        packageCode: "6P-MINI",
        totalPremium: 350,
        extendedPremium: 0,
        spousesJson: spousesSample,
        dependantsJson: dependantsSample,
        beneficiariesJson: beneficiariesSample,
        declarationAccepted: true,
        popiaAccepted: true,
        signatureName: "Bongani Cele",
        signedAt: daysAgo(0),
        createdAt: daysAgo(0),
      },
      {
        tenantId: tenant.id,
        submittedById: nomfundo.id,
        reference: "APP-2026-0102",
        status: "UNDER_REVIEW",
        surname: "Ndlovu",
        firstName: "Precious",
        idNumber: "9308185800087",
        cellphone: "+27 76 330 2210",
        address: "3 Willow Crescent, Greytown, 3250",
        packageCode: "1P-MINI",
        totalPremium: 100,
        bankName: "FNB",
        accountNumber: "62000012345",
        debitDay: "1",
        declarationAccepted: true,
        popiaAccepted: true,
        signatureName: "Precious Ndlovu",
        signedAt: daysAgo(1),
        createdAt: daysAgo(1),
      },
      {
        tenantId: tenant.id,
        submittedById: sibusiso.id,
        reference: "APP-2026-0103",
        status: "APPROVED",
        surname: "Mabaso",
        firstName: "Vusi",
        idNumber: "8601015800083",
        cellphone: "+27 81 900 4422",
        address: "9 Industrial Road, Wartburg, 3233",
        packageCode: "6P-MINI",
        totalPremium: 350,
        employerName: "Greytown Municipality",
        employeeNumber: "GM-4421",
        declarationAccepted: true,
        popiaAccepted: true,
        signatureName: "Vusi Mabaso",
        signedAt: daysAgo(3),
        createdAt: daysAgo(3),
      },
      {
        tenantId: tenant.id,
        submittedById: sibusiso.id,
        reference: "APP-2026-0104",
        status: "SUBMITTED",
        surname: "Buthelezi",
        firstName: "Nomsa",
        idNumber: "9504045800080",
        cellphone: "+27 61 220 4455",
        email: "nomsa.b@example.com",
        address: "11 Hlanganani Street, Greytown, 3250",
        packageCode: "1P-BASIC",
        totalPremium: 80,
        declarationAccepted: true,
        popiaAccepted: true,
        signatureName: "Nomsa Buthelezi",
        signedAt: daysAgo(0),
        createdAt: daysAgo(0),
      },
      {
        tenantId: tenant.id,
        submittedById: nomfundo.id,
        reference: "APP-2026-0098",
        status: "DECLINED",
        surname: "Mokoena",
        firstName: "Lerato",
        idNumber: "9405055800081",
        cellphone: "+27 63 221 7788",
        packageCode: "1P-BASIC",
        totalPremium: 80,
        declarationAccepted: true,
        popiaAccepted: true,
        createdAt: daysAgo(21),
      },
    ],
  });

  await prisma.underwriterLink.create({
    data: { tenantId: tenant.id, provider: "REDIT_GATEWAY", externalId: "tenant-link-demo-001", isActive: true },
  });

  await prisma.paymentGatewaySetting.create({
    data: { tenantId: tenant.id, provider: "PAYFAST", merchantId: "demo-merchant-id", passphrase: "demo-passphrase", isSandbox: true },
  });

  const logs = [
    { userId: ayanda.id, action: "MEMBER_ADDED", entityType: "Member", entityId: m1.id, summary: "Member Bongani Cele onboarded" },
    { userId: sibusiso.id, action: "PAYMENT_RECEIVED", entityType: "Payment", summary: "PayFast payment captured for Sipho Dube" },
    { userId: nomfundo.id, action: "CLAIM_UPDATED", entityType: "Claim", summary: "Claim CLM-2026-0044 moved to assessing" },
    { userId: lindiwe.id, action: "FUNERAL_SCHEDULED", entityType: "Funeral", summary: "Funeral confirmed for Thembi Mthembu" },
    { userId: thandi.id, action: "POLICY_SUBMITTED", entityType: "PolicyApplication", summary: "New policy application from agent Sibusiso Ngcobo" },
    { userId: ayanda.id, action: "USER_ACTIVATED", entityType: "User", entityId: zanele.id, summary: "Employee access activated for Zanele Khumalo" },
    { userId: sibusiso.id, action: "APPLICATION_SUBMITTED", entityType: "ClientApplication", summary: "Onboarding form APP-2026-0101 received" },
    { userId: nomfundo.id, action: "PAYMENT_RECEIVED", entityType: "Payment", summary: "Cash receipt RCP-2026-000913 for Ayanda Khoza" },
    { userId: lindiwe.id, action: "CLAIM_OPENED", entityType: "Claim", summary: "Claim CLM-2026-0048 opened for Jabulani Zulu" },
    { userId: ayanda.id, action: "EXPENSE_APPROVED", entityType: "Expense", summary: "Fleet fuel expense approved — R4,200" },
    { userId: zanele.id, action: "COMPLAINT_LOGGED", entityType: "Complaint", summary: "Debit order timing complaint logged" },
    { userId: sibusiso.id, action: "MEMBER_ADDED", entityType: "Member", entityId: m9.id, summary: "Member Nomsa Buthelezi onboarded today" },
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
        createdAt: new Date(Date.now() - 1000 * 60 * 20 * (logs.length - i)),
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete. Primary owner: ayanda.masikane@eyabantu.co.za — password: Demo@2026");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
