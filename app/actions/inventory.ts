"use server";

import { prisma } from "@/lib/prisma";
import { HardwareType, OperationalStatus, TagFacet } from "@prisma/client";
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
  "3d-fabrication": "3DP",
  "3d-printing": "3DP",
  "fdm-3d-printing": "3DP",
  "laser-cutting": "LSR",
  textile: "TEX",
  "direct-to-garment": "DTG",
  "rapid-prototyping": "RPD",
  "camera-gear": "CAM",
  "cinema-4k-recording": "CAM",
  "audio-equipment": "AUD",
  "wireless-audio": "AUD",
  lighting: "LGT",
  "studio-lighting": "LGT",
  "xr-vr": "VRX",
  "vr-spatial-computing": "VRX",
  electronics: "ELC",
  "soldering-smd": "ELC",
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
 * 1. Get filtered inventory with Multi-Faceted (Discipline, Process, Material) & Location filtering
 */
export async function getInventoryWithFilters(filters: {
  labSlug?: string;
  hardwareType?: HardwareType;
  operationalStatus?: OperationalStatus;
  tagSlug?: string;
  disciplineSlug?: string;
  processSlug?: string;
  materialSlug?: string;
  searchQuery?: string;
}) {
  const where: any = {};
  const andConditions: any[] = [];

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
    andConditions.push({
      tags: {
        some: { tag: { slug: filters.tagSlug } },
      },
    });
  }

  if (filters.disciplineSlug && filters.disciplineSlug !== "ALL") {
    andConditions.push({
      tags: {
        some: { tag: { slug: filters.disciplineSlug, facet: TagFacet.DISCIPLINE } },
      },
    });
  }

  if (filters.processSlug && filters.processSlug !== "ALL") {
    andConditions.push({
      tags: {
        some: { tag: { slug: filters.processSlug, facet: TagFacet.PROCESS } },
      },
    });
  }

  if (filters.materialSlug && filters.materialSlug !== "ALL") {
    andConditions.push({
      tags: {
        some: { tag: { slug: filters.materialSlug, facet: TagFacet.MATERIAL } },
      },
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
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
 * 3. Get all taxonomy tags, grouped by 3-Tier Facet
 */
export async function getTagsList() {
  return await prisma.tag.findMany({
    orderBy: [{ facet: "asc" }, { name: "asc" }],
  });
}

export async function getFacetedTags() {
  const allTags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return {
    disciplines: allTags.filter((t) => t.facet === TagFacet.DISCIPLINE),
    processes: allTags.filter((t) => t.facet === TagFacet.PROCESS),
    materials: allTags.filter((t) => t.facet === TagFacet.MATERIAL),
  };
}

/**
 * Dynamic Tag Creation within a specific facet
 */
export async function createTag(data: { name: string; facet: TagFacet }) {
  const cleanName = data.name.trim();
  if (!cleanName) {
    throw new Error("Tag name cannot be empty.");
  }

  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const existing = await prisma.tag.findUnique({
    where: { slug },
  });

  if (existing) {
    return { success: true, tag: existing };
  }

  const newTag = await prisma.tag.create({
    data: {
      name: cleanName,
      slug,
      facet: data.facet,
    },
  });

  revalidatePath("/admin/pos");
  return { success: true, tag: newTag };
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
