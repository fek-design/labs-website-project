"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getAdminProfile() {
  const admin =
    (await prisma.admin.findFirst({ where: { isActive: true, role: "SUPER_ADMIN" } })) ||
    (await prisma.admin.findFirst({ where: { isActive: true } }));

  if (!admin) return null;

  return {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    createdAt: admin.createdAt,
  };
}

export async function updateAdminCredentials(data: {
  adminId?: string;
  newUsername?: string;
  newPassword?: string;
}) {
  const admin = data.adminId
    ? await prisma.admin.findUnique({ where: { id: data.adminId } })
    : await prisma.admin.findFirst({ where: { isActive: true } });

  if (!admin) {
    throw new Error("Admin user not found.");
  }

  const updateData: any = {};

  if (data.newUsername && data.newUsername.trim()) {
    const trimmed = data.newUsername.trim();
    if (trimmed !== admin.username) {
      const existing = await prisma.admin.findUnique({ where: { username: trimmed } });
      if (existing && existing.id !== admin.id) {
        throw new Error(`Username "${trimmed}" is already in use.`);
      }
      updateData.username = trimmed;
    }
  }

  if (data.newPassword && data.newPassword.trim()) {
    if (data.newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    const hash = await bcrypt.hash(data.newPassword.trim(), 10);
    updateData.passwordHash = hash;
  }

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      actorAdminId: admin.id,
      actionType: "UPDATE_CREDENTIALS",
      targetTable: "Admin",
      targetId: admin.id,
      payloadDelta: {
        username: updated.username,
        passwordChanged: Boolean(data.newPassword),
      },
    },
  });

  revalidatePath("/admin/pos");
  return { success: true, username: updated.username };
}
