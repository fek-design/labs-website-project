"use server";

import { prisma } from "@/lib/prisma";
import { HardwareType, OperationalStatus, TagFacet, TrackingType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { handleDatabaseError } from "@/lib/errors";
import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
} from "@/lib/validations/inventory";
import { requireAuth } from "@/lib/auth";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback when executed in non-request contexts or tests
  }
}

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

import {
  LAB_PREFIX_MAP,
  CATEGORY_CODE_MAP,
  resolveLocationPrefix,
} from "@/lib/inventory-utils";

/**
 * Deterministic Automated Asset Tag Generator
 * Pattern: [LOCATION]-[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]
 * Example: KG-MK-3DP-0001, KG-ML-CAM-0001, RO-MK-GEN-0001
 * Maintains full backward compatibility with legacy 3-tier tags (MK-3DP-0001)
 */
export async function generateAssetTag(params: {
  labSlug: string;
  tagSlug?: string;
  trackingType?: TrackingType;
  location?: string;
  locationPrefix?: string;
}): Promise<string> {
  const locPrefix = resolveLocationPrefix(params.location || params.locationPrefix);
  const labPrefix = LAB_PREFIX_MAP[params.labSlug.toLowerCase()] || "ZL";
  let catCode = params.tagSlug ? CATEGORY_CODE_MAP[params.tagSlug.toLowerCase()] : undefined;
  if (!catCode) {
    catCode = params.trackingType === TrackingType.BULK ? "ACC" : "GEN";
  }
  const searchPrefix = `${locPrefix}-${labPrefix}-${catCode}-`;
  const legacyPrefix = `${labPrefix}-${catCode}-`;

  // Find all existing asset tags with 4-tier or legacy 3-tier prefix to ensure sequence continuity
  const existingItems = await prisma.inventory.findMany({
    where: {
      OR: [
        { assetTag: { startsWith: searchPrefix } },
        { assetTag: { startsWith: legacyPrefix } },
      ],
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
 * 1. Get filtered inventory with Multi-Faceted (Discipline, Process) & Location filtering
 */
export async function getInventoryWithFilters(filters: {
  labSlug?: string;
  hardwareType?: HardwareType;
  operationalStatus?: OperationalStatus;
  tagSlug?: string;
  disciplineSlug?: string;
  processSlug?: string;
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

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.trim();
    where.OR = [
      { name: { contains: q } },
      { assetTag: { contains: q } },
      { notes: { contains: q } },
      { location: { contains: q } },
    ];
  }

  const items = await prisma.inventory.findMany({
    where,
    include: {
      lab: true,
      tags: { include: { tag: true } },
      manuals: { include: { manual: true } },
      assignedBundles: {
        include: {
          bundle: {
            include: {
              items: {
                include: { accessory: true },
              },
            },
          },
        },
      },
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

  return items.map((item) => {
    let availableQuantity = 0;
    if (item.trackingType === TrackingType.BULK) {
      const activeLoanedQuantity = item.loans.reduce((acc, l) => acc + (l.quantity - l.returnedQty), 0);
      availableQuantity = Math.max(0, item.totalQuantity - activeLoanedQuantity);
    } else {
      availableQuantity = item.operationalStatus === OperationalStatus.AVAILABLE && item.loans.length === 0 ? 1 : 0;
    }

    const accessoryMap = new Map<string, any>();
    for (const ab of item.assignedBundles || []) {
      for (const bi of ab.bundle.items) {
        if (accessoryMap.has(bi.accessoryInventoryId)) {
          accessoryMap.get(bi.accessoryInventoryId).defaultQuantity += bi.defaultQuantity;
        } else {
          accessoryMap.set(bi.accessoryInventoryId, {
            id: bi.id,
            bundleId: bi.bundleId,
            bundleName: ab.bundle.name,
            accessoryInventoryId: bi.accessoryInventoryId,
            defaultQuantity: bi.defaultQuantity,
            accessory: bi.accessory,
          });
        }
      }
    }
    const bundleAccessories = Array.from(accessoryMap.values());

    return {
      ...item,
      bundleAccessories,
      availableQuantity,
    };
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
 * 3. Get all taxonomy tags, grouped by 2-Tier Facet
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
  };
}

/**
 * Dynamic Tag Creation within a specific facet
 */
export async function createTag(data: { name: string; facet: TagFacet }) {
  await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
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

  safeRevalidatePath("/admin/pos");
  return { success: true, tag: newTag };
}

/**
 * 4. Create new Inventory Item with deterministic auto-tagging
 */
export async function createInventoryItem(data: {
  name: string;
  labSlug?: string;
  labId?: number;
  hardwareType: HardwareType;
  trackingType?: TrackingType;
  totalQuantity?: number;
  operationalStatus?: OperationalStatus;
  imageUrl?: string;
  notes?: string;
  location?: string;
  purchaseDate?: string | Date | null;
  customFields?: any;
  tagSlugs?: string[];
  bundleIds?: string[];
  adminId?: string;
}) {
  const parsed = createInventoryItemSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Valideringsfejl: ${parsed.error.issues[0]?.message || "Ugyldige udstyrsdata."}`);
  }

  const clientId = await getClientIdentifier();
  const rateLimit = checkRateLimit(`inventory:create:${clientId}`, 40, 60);
  if (!rateLimit.allowed) {
    throw new Error("For mange oprettelser på kort tid. Vent venligst et øjeblik.");
  }

  const authUser = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
  const actorId = authUser.id;

  const lab = data.labSlug
    ? await prisma.lab.findUnique({ where: { slug: data.labSlug } })
    : data.labId
    ? await prisma.lab.findUnique({ where: { id: data.labId } })
    : null;

  if (!lab) {
    throw new Error(`Lab with slug "${data.labSlug}" or id "${data.labId}" not found.`);
  }

  const normalizedName = parsed.data.name.trim();
  const normalizedLocation = parsed.data.location?.trim() || null;

  // Pre-flight duplicate check: prevent rapid double-clicks within 60 seconds
  const recentDuplicate = await prisma.inventory.findFirst({
    where: {
      labId: lab.id,
      name: normalizedName,
      location: normalizedLocation,
      createdAt: {
        gte: new Date(Date.now() - 60 * 1000),
      },
    },
  });

  if (recentDuplicate) {
    throw new Error(
      `Udstyret "${normalizedName}" er netop blevet oprettet (med stregkode ${recentDuplicate.assetTag}). Dobbeltoprettelse forhindret.`
    );
  }

  const trackingType = parsed.data.trackingType || TrackingType.SERIALIZED;
  const totalQuantity = parsed.data.totalQuantity !== undefined && parsed.data.totalQuantity > 0 ? parsed.data.totalQuantity : 1;

  // Generate deterministic asset tag
  const primaryTagSlug = parsed.data.tagSlugs && parsed.data.tagSlugs.length > 0 ? parsed.data.tagSlugs[0] : undefined;
  const generatedAssetTag = await generateAssetTag({
    labSlug: lab.slug,
    tagSlug: primaryTagSlug,
    trackingType,
    location: normalizedLocation || undefined,
  });

  let parsedPurchaseDate: Date | null = null;
  if (parsed.data.purchaseDate) {
    if (parsed.data.purchaseDate instanceof Date) {
      parsedPurchaseDate = parsed.data.purchaseDate;
    } else if (typeof parsed.data.purchaseDate === "string" && parsed.data.purchaseDate.trim()) {
      const parsedD = new Date(parsed.data.purchaseDate);
      if (!isNaN(parsedD.getTime())) {
        parsedPurchaseDate = parsedD;
      }
    }
  }

  try {
    const item = await prisma.inventory.create({
      data: {
        assetTag: generatedAssetTag,
        name: normalizedName,
        labId: lab.id,
        hardwareType: parsed.data.hardwareType,
        trackingType,
        totalQuantity,
        operationalStatus: parsed.data.operationalStatus || OperationalStatus.AVAILABLE,
        imageUrl: parsed.data.imageUrl?.trim() || null,
        notes: parsed.data.notes?.trim() || null,
        purchaseDate: parsedPurchaseDate,
        location: normalizedLocation,
        customFields: (parsed.data.customFields as any) ?? undefined,
      },
    });

    // Attach tags if provided
    if (parsed.data.tagSlugs && parsed.data.tagSlugs.length > 0) {
      const tags = await prisma.tag.findMany({
        where: { slug: { in: parsed.data.tagSlugs } },
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

    // Attach bundle assignments if provided
    if (parsed.data.bundleIds && parsed.data.bundleIds.length > 0) {
      for (const bId of parsed.data.bundleIds) {
        await prisma.equipmentBundleAssignment.create({
          data: {
            inventoryId: item.id,
            bundleId: bId,
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
          location: item.location,
          hardwareType: item.hardwareType,
          trackingType: item.trackingType,
          totalQuantity: item.totalQuantity,
        },
      },
    });

    safeRevalidatePath("/admin/pos");
    return { success: true, item };
  } catch (err: unknown) {
    const errRes = handleDatabaseError(err, "Kunne ikke oprette udstyret.");
    throw new Error(errRes.error);
  }
}

/**
 * 5. Update Inventory Item
 */
export async function updateInventoryItem(data: {
  id: string;
  name?: string;
  labSlug?: string;
  trackingType?: TrackingType;
  totalQuantity?: number;
  operationalStatus?: OperationalStatus;
  imageUrl?: string;
  notes?: string;
  location?: string;
  purchaseDate?: string | Date | null;
  customFields?: any;
  tagSlugs?: string[];
  bundleIds?: string[];
  adminId?: string;
}) {
  const parsed = updateInventoryItemSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Valideringsfejl: ${parsed.error.issues[0]?.message || "Ugyldige opdateringsdata."}`);
  }

  const clientId = await getClientIdentifier();
  const rateLimit = checkRateLimit(`inventory:update:${clientId}`, 60, 60);
  if (!rateLimit.allowed) {
    throw new Error("For mange opdateringer på kort tid. Vent venligst et øjeblik.");
  }

  const authUser = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
  const actorId = authUser.id;

  try {
    const existing = await prisma.inventory.findUnique({
      where: { id: parsed.data.id },
    });

    if (!existing) {
      throw new Error("Udstyret blev ikke fundet i databasen.");
    }

    let targetLabId = existing.labId;
    if (parsed.data.labSlug) {
      const lab = await prisma.lab.findUnique({ where: { slug: parsed.data.labSlug } });
      if (lab) targetLabId = lab.id;
    }

    let parsedPurchaseDate: Date | null | undefined = undefined;
    if (parsed.data.purchaseDate !== undefined) {
      if (parsed.data.purchaseDate === null || parsed.data.purchaseDate === "") {
        parsedPurchaseDate = null;
      } else if (parsed.data.purchaseDate instanceof Date) {
        parsedPurchaseDate = parsed.data.purchaseDate;
      } else if (typeof parsed.data.purchaseDate === "string") {
        const parsedD = new Date(parsed.data.purchaseDate);
        parsedPurchaseDate = !isNaN(parsedD.getTime()) ? parsedD : null;
      }
    }

    const updated = await prisma.inventory.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name !== undefined ? parsed.data.name.trim() : existing.name,
        labId: targetLabId,
        trackingType: parsed.data.trackingType || existing.trackingType,
        totalQuantity: parsed.data.totalQuantity !== undefined ? parsed.data.totalQuantity : existing.totalQuantity,
        operationalStatus: parsed.data.operationalStatus || existing.operationalStatus,
        imageUrl: parsed.data.imageUrl !== undefined ? parsed.data.imageUrl?.trim() || null : existing.imageUrl,
        notes: parsed.data.notes !== undefined ? parsed.data.notes?.trim() || null : existing.notes,
        location: parsed.data.location !== undefined ? (parsed.data.location?.trim() || null) : existing.location,
        purchaseDate: parsedPurchaseDate !== undefined ? parsedPurchaseDate : existing.purchaseDate,
        customFields: parsed.data.customFields !== undefined ? ((parsed.data.customFields as any) ?? undefined) : existing.customFields,
      },
    });

    if (parsed.data.tagSlugs) {
      await prisma.inventoryTag.deleteMany({
        where: { inventoryId: updated.id },
      });

      const tags = await prisma.tag.findMany({
        where: { slug: { in: parsed.data.tagSlugs } },
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

    if (parsed.data.bundleIds !== undefined) {
      await prisma.equipmentBundleAssignment.deleteMany({
        where: { inventoryId: updated.id },
      });
      for (const bId of parsed.data.bundleIds) {
        await prisma.equipmentBundleAssignment.create({
          data: {
            inventoryId: updated.id,
            bundleId: bId,
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
          location: updated.location,
          operationalStatus: updated.operationalStatus,
          trackingType: updated.trackingType,
          totalQuantity: updated.totalQuantity,
        },
      },
    });

    safeRevalidatePath("/admin/pos");
    return { success: true, item: updated };
  } catch (err: unknown) {
    const errRes = handleDatabaseError(err, "Kunne ikke opdatere udstyret.");
    throw new Error(errRes.error);
  }
}

/**
 * 6. Delete Inventory Item
 */
export async function deleteInventoryItem(id: string, adminId?: string) {
  const authUser = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
  const actorId = authUser.id;

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
  await prisma.equipmentBundleAssignment.deleteMany({ where: { inventoryId: item.id } });
  await prisma.bundleItem.deleteMany({ where: { accessoryInventoryId: item.id } });
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

  safeRevalidatePath("/admin/pos");
  return { success: true };
}

/**
 * 7. Standalone Bundle Preset Management Actions
 */
export async function getBundlePresets() {
  return await prisma.bundle.findMany({
    include: {
      items: {
        include: {
          accessory: true,
        },
        orderBy: { createdAt: "asc" },
      },
      assignments: {
        include: {
          inventory: {
            select: {
              id: true,
              name: true,
              assetTag: true,
              hardwareType: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function saveBundlePreset(data: {
  id?: string;
  name: string;
  description?: string;
  items: { accessoryInventoryId: string; defaultQuantity: number }[];
  adminId?: string;
}) {
  const authUser = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
  const actorId = authUser.id;
  const name = data.name.trim();
  if (!name) throw new Error("Pakkenavn er påkrævet");

  // Prevent duplicate bundle names
  const existingBundle = await prisma.bundle.findFirst({
    where: {
      name,
      ...(data.id ? { id: { not: data.id } } : {}),
    },
  });

  if (existingBundle) {
    throw new Error(`En udstyrspakke med navnet "${name}" findes allerede.`);
  }

  let bundle;
  if (data.id) {
    bundle = await prisma.bundle.update({
      where: { id: data.id },
      data: {
        name,
        description: data.description?.trim() || null,
      },
    });
    await prisma.bundleItem.deleteMany({ where: { bundleId: bundle.id } });
  } else {
    bundle = await prisma.bundle.create({
      data: {
        name,
        description: data.description?.trim() || null,
      },
    });
  }

  for (const item of data.items) {
    if (item.accessoryInventoryId) {
      await prisma.bundleItem.create({
        data: {
          bundleId: bundle.id,
          accessoryInventoryId: item.accessoryInventoryId,
          defaultQuantity: item.defaultQuantity > 0 ? item.defaultQuantity : 1,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: data.id ? "UPDATE_BUNDLE_PRESET" : "CREATE_BUNDLE_PRESET",
      targetTable: "Bundle",
      targetId: bundle.id,
      payloadDelta: {
        name: bundle.name,
        itemCount: data.items.length,
      },
    },
  });

  safeRevalidatePath("/admin/pos");
  return { success: true, bundle };
}

export async function deleteBundlePreset(id: string, adminId?: string) {
  const authUser = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
  const actorId = authUser.id;
  const bundle = await prisma.bundle.findUnique({ where: { id } });
  if (!bundle) throw new Error("Pakkesæt ikke fundet");

  await prisma.bundle.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: "DELETE_BUNDLE_PRESET",
      targetTable: "Bundle",
      targetId: id,
      payloadDelta: { name: bundle.name },
    },
  });

  safeRevalidatePath("/admin/pos");
  return { success: true };
}

export async function setEquipmentBundles(inventoryId: string, bundleIds: string[], adminId?: string) {
  const authUser = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);
  const actorId = authUser.id;
  await prisma.equipmentBundleAssignment.deleteMany({
    where: { inventoryId },
  });

  for (const bundleId of bundleIds) {
    await prisma.equipmentBundleAssignment.create({
      data: {
        inventoryId,
        bundleId,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: "SET_EQUIPMENT_BUNDLES",
      targetTable: "EquipmentBundleAssignment",
      targetId: inventoryId,
      payloadDelta: { bundleIds },
    },
  });

  safeRevalidatePath("/admin/pos");
  return { success: true };
}
