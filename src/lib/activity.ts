import { prisma } from "@/lib/prisma";

export async function logActivity(input: {
  tenantId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.activityLog.create({
    data: {
      tenantId: input.tenantId,
      userId: input.userId ?? undefined,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? undefined,
      summary: input.summary,
      metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
    },
  });
}
