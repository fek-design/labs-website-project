"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

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

    // Target upload directory in public/uploads/manuals
    const uploadDir = path.join(process.cwd(), "public", "uploads", "manuals");
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, sanitizedFileName);

    await fs.writeFile(filePath, buffer);
    const publicUrl = `/uploads/manuals/${sanitizedFileName}`;

    // Update machine inventory record
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

    const updated = await prisma.inventory.update({
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
