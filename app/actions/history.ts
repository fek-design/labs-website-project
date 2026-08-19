"use server";

import { prisma } from "@/lib/prisma";

export async function getAuditLogs(filters?: {
  actionType?: string;
  limit?: number;
  searchQuery?: string;
}) {
  const limit = filters?.limit || 100;
  const where: any = {};

  if (filters?.actionType && filters.actionType !== "ALL") {
    where.actionType = filters.actionType;
  }

  if (filters?.searchQuery?.trim()) {
    const q = filters.searchQuery.trim();
    where.OR = [
      { actionType: { contains: q } },
      { targetTable: { contains: q } },
      { targetId: { contains: q } },
      { admin: { username: { contains: q } } },
    ];
  }

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      admin: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // Convert BigInt id to string for JSON serialization
  return logs.map((log) => ({
    ...log,
    id: log.id.toString(),
  }));
}

export async function getDistinctActionTypes() {
  const actions = await prisma.auditLog.findMany({
    select: { actionType: true },
    distinct: ["actionType"],
  });

  return actions.map((a) => a.actionType).sort();
}
