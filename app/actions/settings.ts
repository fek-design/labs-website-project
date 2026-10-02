"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export interface AdminProfileResponse {
  id: string;
  username: string;
  role: string;
  assignedCampus: string;
  assignedLabId: number | null;
  assignedLabSlug: string;
  assignedLabName: string;
  createdAt: string;
}

export async function getAdminProfile(): Promise<AdminProfileResponse | null> {
  try {
    const user = await requireAuth();
    const admin = await prisma.admin.findUnique({
      where: { id: user.id },
      include: { assignedLab: true },
    });

    if (!admin) return null;

    return {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      assignedCampus: admin.assignedCampus || "Køge Campus",
      assignedLabId: admin.assignedLabId,
      assignedLabSlug: admin.assignedLab?.slug || "medialab",
      assignedLabName: admin.assignedLab?.name || "MediaLab (Køge)",
      createdAt: admin.createdAt ? admin.createdAt.toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Fejl ved hentning af admin profil:", error);
    return null;
  }
}

export async function updateAdminCredentials(data: {
  adminId?: string;
  newUsername?: string;
  newPassword?: string;
  assignedCampus?: string;
  assignedLabSlug?: string;
}) {
  try {
    const user = await requireAuth();

    let targetAdminId = user.id;
    if (data.adminId && data.adminId.trim() !== "" && data.adminId.trim() !== user.id) {
      if (user.role !== "SUPER_ADMIN") {
        throw new Error("Kun SuperAdmin må redigere andre brugeres oplysninger.");
      }
      targetAdminId = data.adminId.trim();
    }

    const admin = await prisma.admin.findUnique({ where: { id: targetAdminId } });
    if (!admin) {
      throw new Error("Ingen administrator fundet i databasen.");
    }

    const updateData: Prisma.AdminUncheckedUpdateInput = {};

    if (data.newUsername && data.newUsername.trim()) {
      const trimmed = data.newUsername.trim();
      if (trimmed !== admin.username) {
        const existing = await prisma.admin.findUnique({ where: { username: trimmed } });
        if (existing && existing.id !== admin.id) {
          throw new Error(`Brugernavnet "${trimmed}" er allerede i brug.`);
        }
        updateData.username = trimmed;
      }
    }

    // Only process password if non-empty string provided
    const trimmedPassword = data.newPassword ? data.newPassword.trim() : "";
    if (trimmedPassword.length > 0) {
      if (trimmedPassword.length < 6) {
        throw new Error("Adgangskoden skal være på mindst 6 tegn.");
      }
      const hash = await bcrypt.hash(trimmedPassword, 10);
      updateData.passwordHash = hash;
    }

    if (data.assignedCampus && data.assignedCampus.trim()) {
      updateData.assignedCampus = data.assignedCampus.trim();
    }

    if (data.assignedLabSlug && data.assignedLabSlug.trim()) {
      const lab = await prisma.lab.findUnique({ where: { slug: data.assignedLabSlug.trim() } });
      if (lab) {
        updateData.assignedLabId = lab.id;
      }
    }

    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
      include: { assignedLab: true },
    });

    try {
      await prisma.auditLog.create({
        data: {
          actorAdminId: user.id,
          actionType: "UPDATE_CREDENTIALS",
          targetTable: "Admin",
          targetId: admin.id,
          payloadDelta: {
            username: updated.username,
            assignedCampus: updated.assignedCampus,
            assignedLabSlug: updated.assignedLab?.slug,
            passwordChanged: Boolean(trimmedPassword.length > 0),
          },
        },
      });
    } catch (auditErr) {
      console.warn("Audit log creation skipped:", auditErr);
    }

    try {
      revalidatePath("/admin/pos");
      revalidatePath("/admin");
    } catch (revalidateErr) {
      // Revalidation is non-blocking
    }

    return {
      success: true,
      username: updated.username,
      assignedCampus: updated.assignedCampus || "Køge Campus",
      assignedLabSlug: (updated.assignedLab?.slug as "medialab" | "makerspace") || "medialab",
    };
  } catch (error: any) {
    console.error("Fejl ved opdatering af admin credentials:", error);
    throw new Error(error.message || "Kunne ikke opdatere administratoroplysninger.");
  }
}
