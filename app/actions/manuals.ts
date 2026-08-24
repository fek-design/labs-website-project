"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
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

/**
 * 1. Get entire centralized Manuals catalog with linked machine associations
 */
export async function getManualsCatalog(searchQuery?: string) {
  const where: any = {};

  if (searchQuery?.trim()) {
    const q = searchQuery.trim();
    where.OR = [
      { title: { contains: q } },
      { fileName: { contains: q } },
      { description: { contains: q } },
    ];
  }

  return await prisma.manual.findMany({
    where,
    include: {
      machines: {
        include: {
          inventory: {
            select: {
              id: true,
              name: true,
              assetTag: true,
              hardwareType: true,
              operationalStatus: true,
              lab: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 2. Upload a new standalone PDF manual to the catalog and optionally link it to a machine
 */
export async function uploadManual(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim();
    const inventoryId = (formData.get("inventoryId") as string | null)?.trim() || (formData.get("machineId") as string | null)?.trim();
    const actorAdminIdParam = formData.get("actorAdminId") as string | null;

    if (!file) {
      throw new Error("No PDF file provided.");
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      throw new Error("Only PDF documents are allowed for user manuals.");
    }

    const manualTitle = title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "manuals");
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, sanitizedFileName);

    await fs.writeFile(filePath, buffer);
    const publicUrl = `/uploads/manuals/${sanitizedFileName}`;

    const actorAdminId = await getActorAdminId(actorAdminIdParam || undefined);

    // Create standalone Manual record
    const createdManual = await prisma.manual.create({
      data: {
        title: manualTitle,
        fileName: file.name,
        fileUrl: publicUrl,
        fileSize: buffer.length,
        mimeType: "application/pdf",
        description: description || null,
      },
    });

    // Optionally associate with machine if inventoryId provided
    if (inventoryId) {
      await prisma.inventoryManual.create({
        data: {
          inventoryId,
          manualId: createdManual.id,
        },
      });
    }

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        actorAdminId,
        actionType: "UPLOAD_MANUAL",
        targetTable: "Manual",
        targetId: createdManual.id,
        payloadDelta: {
          title: createdManual.title,
          fileName: createdManual.fileName,
          fileUrl: createdManual.fileUrl,
          inventoryId: inventoryId || null,
        },
      },
    });

    revalidatePath("/makerspace");
    revalidatePath("/inventory");

    return {
      success: true,
      manual: createdManual,
    };
  } catch (error: any) {
    console.error("Error uploading manual:", error);
    throw new Error(error.message || "Failed to upload manual.");
  }
}

/**
 * 3. Assign an existing manual from the catalog to a machine (Many-to-Many)
 */
export async function assignManualToMachine(params: {
  inventoryId: string;
  manualId: string;
  actorAdminId?: string;
}) {
  try {
    const { inventoryId, manualId, actorAdminId: actorId } = params;

    const existingLink = await prisma.inventoryManual.findUnique({
      where: {
        inventoryId_manualId: {
          inventoryId,
          manualId,
        },
      },
    });

    if (existingLink) {
      return { success: true, message: "Manual already linked to this machine." };
    }

    await prisma.inventoryManual.create({
      data: {
        inventoryId,
        manualId,
      },
    });

    const actorAdminId = await getActorAdminId(actorId);

    await prisma.auditLog.create({
      data: {
        actorAdminId,
        actionType: "ASSIGN_MANUAL",
        targetTable: "InventoryManual",
        targetId: `${inventoryId}:${manualId}`,
        payloadDelta: { inventoryId, manualId },
      },
    });

    revalidatePath("/makerspace");
    revalidatePath("/inventory");

    return { success: true };
  } catch (error: any) {
    console.error("Error assigning manual:", error);
    throw new Error(error.message || "Failed to assign manual to machine.");
  }
}

/**
 * 4. Unassign a manual from a machine (preserves manual in catalog)
 */
export async function unassignManualFromMachine(params: {
  inventoryId: string;
  manualId: string;
  actorAdminId?: string;
}) {
  try {
    const { inventoryId, manualId, actorAdminId: actorId } = params;

    await prisma.inventoryManual.delete({
      where: {
        inventoryId_manualId: {
          inventoryId,
          manualId,
        },
      },
    });

    const actorAdminId = await getActorAdminId(actorId);

    await prisma.auditLog.create({
      data: {
        actorAdminId,
        actionType: "UNASSIGN_MANUAL",
        targetTable: "InventoryManual",
        targetId: `${inventoryId}:${manualId}`,
        payloadDelta: { inventoryId, manualId },
      },
    });

    revalidatePath("/makerspace");
    revalidatePath("/inventory");

    return { success: true };
  } catch (error: any) {
    console.error("Error unassigning manual:", error);
    throw new Error(error.message || "Failed to unlink manual.");
  }
}

/**
 * 5. Delete a manual from the catalog (unlinks from all machines and removes file)
 */
export async function deleteManual(params: {
  manualId: string;
  actorAdminId?: string;
}) {
  try {
    const { manualId, actorAdminId: actorId } = params;

    const manual = await prisma.manual.findUnique({
      where: { id: manualId },
    });

    if (!manual) {
      throw new Error("Manual not found.");
    }

    // Delete database record (cascading deletes InventoryManual rows)
    await prisma.manual.delete({
      where: { id: manualId },
    });

    // Delete local physical file if hosted in public uploads
    if (manual.fileUrl && manual.fileUrl.startsWith("/uploads/manuals/")) {
      const otherUsing = await prisma.manual.count({
        where: { fileUrl: manual.fileUrl },
      });

      if (otherUsing === 0) {
        const filePath = path.join(process.cwd(), "public", manual.fileUrl);
        await fs.unlink(filePath).catch(() => {
          // ignore file not found error on disk
        });
      }
    }

    const actorAdminId = await getActorAdminId(actorId);

    await prisma.auditLog.create({
      data: {
        actorAdminId,
        actionType: "DELETE_MANUAL",
        targetTable: "Manual",
        targetId: manualId,
        payloadDelta: {
          title: manual.title,
          fileName: manual.fileName,
          fileUrl: manual.fileUrl,
        },
      },
    });

    revalidatePath("/makerspace");
    revalidatePath("/inventory");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting manual:", error);
    throw new Error(error.message || "Failed to delete manual.");
  }
}
