"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

/**
 * 1. Upload or attach PDF manual with strict security & anti-injection validation
 */
export async function uploadMachineManual(formData: FormData) {
  try {
    const user = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);

    const file = formData.get("file") as File | null;
    const machineId = formData.get("machineId") as string | null;

    if (!file) {
      throw new Error("No PDF file provided.");
    }

    if (!machineId) {
      throw new Error("Target machine ID is required.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Filen overskrider den maksimale tilladte størrelse på 20 MB.");
    }

    const cleanBaseName = path.basename(file.name);
    if (!cleanBaseName.toLowerCase().endsWith(".pdf")) {
      throw new Error("Kun PDF-dokumenter (.pdf) er tilladt til maskinmanualer.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error("Filen overskrider den maksimale tilladte størrelse på 20 MB.");
    }

    // Verify PDF Magic Bytes: %PDF- (hex: 25 50 44 46 2d)
    const magicHeader = buffer.subarray(0, 5).toString("latin1");
    if (magicHeader !== "%PDF-") {
      throw new Error("Ugyldigt filformat: Filen mangler en gyldig PDF-signatur (%PDF-).");
    }

    // Anti-injection check: Reject any file containing executable script markers
    const previewContent = buffer.subarray(0, 1024).toString("latin1").toLowerCase();
    if (
      previewContent.includes("<?php") ||
      previewContent.includes("#!/bin") ||
      previewContent.includes("<script") ||
      previewContent.includes("<html")
    ) {
      throw new Error("Sikkerhedsafvisning: Filen indeholder potentielt eksekverbar kode eller script-tags.");
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "manuals");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFileNamePart = cleanBaseName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const sanitizedFileName = `${Date.now()}-${safeFileNamePart}`;
    const filePath = path.join(uploadDir, sanitizedFileName);

    await fs.writeFile(filePath, buffer);
    const publicUrl = `/uploads/manuals/${sanitizedFileName}`;

    const existing = await prisma.inventory.findUnique({
      where: { id: machineId },
    });

    if (!existing) {
      throw new Error("Machine not found.");
    }

    const currentCustomFields = (existing.customFields as Record<string, any>) || {};
    const updatedCustomFields = {
      ...currentCustomFields,
      manualUrl: publicUrl,
      manualFileName: cleanBaseName,
    };

    await prisma.inventory.update({
      where: { id: machineId },
      data: {
        customFields: updatedCustomFields,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorAdminId: user.id,
        actionType: "UPLOAD_MACHINE_MANUAL",
        targetTable: "Inventory",
        targetId: machineId,
        payloadDelta: {
          manualUrl: publicUrl,
          manualFileName: cleanBaseName,
        },
      },
    });

    revalidatePath("/admin/pos");
    revalidatePath("/admin");
    return { success: true, manualUrl: publicUrl, fileName: cleanBaseName };
  } catch (err: any) {
    console.error("Upload error:", err);
    throw new Error(err.message || "Failed to upload PDF manual.");
  }
}

/**
 * 2. Delete existing machine manual and remove local file if stored locally
 */
export async function deleteMachineManual(machineId: string) {
  try {
    const user = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);

    const existing = await prisma.inventory.findUnique({
      where: { id: machineId },
    });

    if (!existing) {
      throw new Error("Machine not found.");
    }

    const currentCustomFields = (existing.customFields as Record<string, any>) || {};
    const manualUrl = currentCustomFields.manualUrl;

    // If file is stored locally in /uploads/manuals/
    if (manualUrl && manualUrl.startsWith("/uploads/manuals/")) {
      try {
        const localPath = path.join(process.cwd(), "public", manualUrl);
        await fs.unlink(localPath).catch(() => {});
      } catch (e) {
        console.warn("Could not remove local PDF file", e);
      }
    }

    const { manualUrl: _, manualFileName: __, ...cleanedFields } = currentCustomFields;

    await prisma.inventory.update({
      where: { id: machineId },
      data: {
        customFields: cleanedFields,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorAdminId: user.id,
        actionType: "DELETE_MACHINE_MANUAL",
        targetTable: "Inventory",
        targetId: machineId,
        payloadDelta: {
          removedManualUrl: manualUrl,
        },
      },
    });

    revalidatePath("/admin/pos");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Delete manual error:", err);
    throw new Error(err.message || "Failed to delete manual.");
  }
}

/**
 * 3. Replace machine manual
 */
export async function replaceMachineManual(formData: FormData) {
  const machineId = formData.get("machineId") as string | null;
  if (machineId) {
    await deleteMachineManual(machineId);
  }
  return await uploadMachineManual(formData);
}
