"use server";

import { prisma } from "@/lib/prisma";
import { HardwareType, OperationalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getActorAdminId(providedAdminId?: string): Promise<string> {
  if (providedAdminId) {
    const admin = await prisma.admin.findUnique({ where: { id: providedAdminId } });
    if (admin) return admin.id;
  }
  const defaultAdmin =
    (await prisma.admin.findFirst({ where: { isActive: true, role: "TECHNICIAN" } })) ||
    (await prisma.admin.findFirst({ where: { isActive: true } }));

  return defaultAdmin?.id || "system";
}

const LAB_PREFIX_MAP: Record<string, string> = {
  makerspace: "MK",
  medialab: "ML",
  roskilde: "RK",
};

const CATEGORY_CODE_MAP: Record<string, string> = {
  "3d-printing": "3DP",
  "laser-cutting": "LSR",
  "camera-gear": "CAM",
  "audio-equipment": "AUD",
  lighting: "LGT",
  "xr-vr": "VRX",
  electronics: "ELC",
  "general-tools": "GEN",
};

/**
 * Deterministic Automated Asset Tag Generator
 * Pattern: [LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]
 * Example: MK-3DP-0001, ML-CAM-0001, RK-AUD-0001
 */
export async function generateAssetTag(params: {
  labSlug: string;
  tagSlug?: string;
}): Promise<string> {
  const labPrefix = LAB_PREFIX_MAP[params.labSlug.toLowerCase()] || "ZL";
  const catCode = (params.tagSlug && CATEGORY_CODE_MAP[params.tagSlug.toLowerCase()]) || "GEN";
  const searchPrefix = `${labPrefix}-${catCode}-`;

  // Find all existing asset tags with this prefix
  const existingItems = await prisma.inventory.findMany({
    where: {
      assetTag: {
        startsWith: searchPrefix,
      },
    },
    select: { assetTag: true },
  });

  let maxSeq = 0;
  for (const item of existingItems) {
    const parts = item.assetTag.split("-");
    const numPart = parts[parts.length - 1];
    const num = parseInt(numPart, 10);
    if (!isNaN(num) && num > maxSeq) {
      maxSeq = num;
    }
  }

  const nextSeq = maxSeq + 1;
  return `${searchPrefix}${String(nextSeq).padStart(4, "0")}`;
}

/**
 * 1. Get filtered inventory with Macro-Lab, taxonomy tag, and status filters
 */
export async function getInventoryWithFilters(filters: {
  labSlug?: string;
  hardwareType?: HardwareType;
  operationalStatus?: OperationalStatus;
  tagSlug?: string;
  searchQuery?: string;
}) {
  const where: any = {};

  if (filters.labSlug && filters.labSlug !== "ALL") {
    where.lab = { slug: filters.labSlug };
  }

  if (filters.hardwareType && (filters.hardwareType as any) !== "ALL") {
    where.hardwareType = filters.hardwareType;
  }

  if (filters.operationalStatus && (filters.operationalStatus as any) !== "ALL") {
    where.operationalStatus = filters.operationalStatus;
  }

  if (filters.tagSlug && filters.tagSlug !== "ALL") {
    where.tags = {
      some: {
        tag: { slug: filters.tagSlug },
      },
    };
  }

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.trim();
    where.OR = [
      { name: { contains: q } },
      { assetTag: { contains: q } },
      { notes: { contains: q } },
    ];
  }

  return await prisma.inventory.findMany({
    where,
    include: {
      lab: true,
      tags: { include: { tag: true } },
      loans: {
        where: { status: "ACTIVE" },
        include: { patron: true },
      },
      repairs: {
        orderBy: { sentDate: "desc" },
        take: 3,
      },
    },
    orderBy: [{ lab: { name: "asc" } }, { name: "asc" }],
  });
}

/**
 * 2. Get list of all available Macro-Labs
 */
export async function getLabsList() {
  return await prisma.lab.findMany({
    orderBy: { id: "asc" },
  });
}

/**
 * 3. Get all taxonomy tags
 */
export async function getTagsList() {
  return await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * 4. Create new Inventory Item with deterministic auto-tagging
 */
export async function createInventoryItem(data: {
  name: string;
  labSlug: string;
  hardwareType: HardwareType;
  operationalStatus?: OperationalStatus;
  imageUrl?: string;
  notes?: string;
  customFields?: any;
  tagSlugs?: string[];
  adminId?: string;
}) {
  const actorId = await getActorAdminId(data.adminId);

  const lab = await prisma.lab.findUnique({
    where: { slug: data.labSlug },
  });

  if (!lab) {
    throw new Error(`Lab with slug "${data.labSlug}" not found.`);
  }

  // Generate deterministic asset tag
  const primaryTagSlug = data.tagSlugs && data.tagSlugs.length > 0 ? data.tagSlugs[0] : undefined;
  const generatedAssetTag = await generateAssetTag({
    labSlug: data.labSlug,
    tagSlug: primaryTagSlug,
  });

  const item = await prisma.inventory.create({
    data: {
      assetTag: generatedAssetTag,
      name: data.name.trim(),
      labId: lab.id,
      hardwareType: data.hardwareType,
      operationalStatus: data.operationalStatus || OperationalStatus.AVAILABLE,
      imageUrl: data.imageUrl?.trim() || null,
      notes: data.notes?.trim() || null,
      customFields: data.customFields || null,
    },
  });

  // Attach tags if provided
  if (data.tagSlugs && data.tagSlugs.length > 0) {
    const tags = await prisma.tag.findMany({
      where: { slug: { in: data.tagSlugs } },
    });

    for (const tag of tags) {
      await prisma.inventoryTag.create({
        data: {
          inventoryId: item.id,
          tagId: tag.id,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: "CREATE_INVENTORY",
      targetTable: "Inventory",
      targetId: item.id,
      payloadDelta: {
        assetTag: item.assetTag,
        name: item.name,
        lab: lab.name,
        hardwareType: item.hardwareType,
      },
    },
  });

  revalidatePath("/admin/pos");
  return { success: true, item };
}

/**
 * 5. Update Inventory Item
 */
export async function updateInventoryItem(data: {
  id: string;
  name?: string;
  labSlug?: string;
  operationalStatus?: OperationalStatus;
  imageUrl?: string;
  notes?: string;
  customFields?: any;
  tagSlugs?: string[];
  adminId?: string;
}) {
  const actorId = await getActorAdminId(data.adminId);

  const existing = await prisma.inventory.findUnique({
    where: { id: data.id },
  });

  if (!existing) {
    throw new Error("Inventory item not found.");
  }

  let targetLabId = existing.labId;
  if (data.labSlug) {
    const lab = await prisma.lab.findUnique({ where: { slug: data.labSlug } });
    if (lab) targetLabId = lab.id;
  }

  const updated = await prisma.inventory.update({
    where: { id: data.id },
    data: {
      name: data.name !== undefined ? data.name.trim() : existing.name,
      labId: targetLabId,
      operationalStatus: data.operationalStatus || existing.operationalStatus,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl.trim() || null : existing.imageUrl,
      notes: data.notes !== undefined ? data.notes.trim() || null : existing.notes,
      customFields: data.customFields !== undefined ? data.customFields : existing.customFields,
    },
  });

  if (data.tagSlugs) {
    await prisma.inventoryTag.deleteMany({
      where: { inventoryId: updated.id },
    });

    const tags = await prisma.tag.findMany({
      where: { slug: { in: data.tagSlugs } },
    });

    for (const tag of tags) {
      await prisma.inventoryTag.create({
        data: {
          inventoryId: updated.id,
          tagId: tag.id,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: "UPDATE_INVENTORY",
      targetTable: "Inventory",
      targetId: updated.id,
      payloadDelta: {
        assetTag: updated.assetTag,
        name: updated.name,
        operationalStatus: updated.operationalStatus,
      },
    },
  });

  revalidatePath("/admin/pos");
  return { success: true, item: updated };
}

/**
 * 6. Delete Inventory Item
 */
export async function deleteInventoryItem(id: string, adminId?: string) {
  const actorId = await getActorAdminId(adminId);

  const item = await prisma.inventory.findUnique({
    where: { id },
    include: {
      loans: { where: { status: "ACTIVE" } },
    },
  });

  if (!item) {
    throw new Error("Item not found.");
  }

  if (item.loans.length > 0) {
    throw new Error(`Cannot delete item ${item.assetTag} because it currently has active loans.`);
  }

  await prisma.inventoryTag.deleteMany({ where: { inventoryId: item.id } });
  await prisma.repairLog.deleteMany({ where: { inventoryId: item.id } });
  await prisma.loan.deleteMany({ where: { inventoryId: item.id } });
  await prisma.inventory.delete({ where: { id: item.id } });

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: "DELETE_INVENTORY",
      targetTable: "Inventory",
      targetId: item.id,
      payloadDelta: {
        assetTag: item.assetTag,
        name: item.name,
      },
    },
  });

  revalidatePath("/admin/pos");
  return { success: true };
}
