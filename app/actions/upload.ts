"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

/**
 * 1. Upload or attach PDF manual
 */
export async function uploadMachineManual(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const machineId = formData.get("machineId") as string | null;

    if (!file) {
      throw new Error("No PDF file provided.");
    }

    if (!machineId) {
      throw new Error("Target machine ID is required.");
    }

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      throw new Error("Only PDF documents are allowed for machine user manuals.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "manuals");
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
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
      manualFileName: file.name,
    };

    await prisma.inventory.update({
      where: { id: machineId },
      data: {
        customFields: updatedCustomFields,
      },
    });

    revalidatePath("/admin/pos");
    return { success: true, manualUrl: publicUrl, fileName: file.name };
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

    revalidatePath("/admin/pos");
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
