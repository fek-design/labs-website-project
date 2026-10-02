"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export interface OperatorDTO {
  id: string;
  username: string;
  role: Role;
  isActive: boolean;
  assignedCampus: string | null;
  assignedLabId: number | null;
  assignedLabSlug?: string | null;
  assignedLabName?: string | null;
  createdAt: string;
}

/**
 * List all registered operators/administrators.
 * Requires an authenticated SUPER_ADMIN session.
 */
export async function listOperators(): Promise<OperatorDTO[]> {
  await requireAuth(["SUPER_ADMIN"]);

  const admins = await prisma.admin.findMany({
    include: {
      assignedLab: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
    orderBy: [
      { role: "asc" },
      { username: "asc" },
    ],
  });

  return admins.map((admin) => ({
    id: admin.id,
    username: admin.username,
    role: admin.role,
    isActive: admin.isActive,
    assignedCampus: admin.assignedCampus,
    assignedLabId: admin.assignedLabId,
    assignedLabSlug: admin.assignedLab?.slug || null,
    assignedLabName: admin.assignedLab?.name || null,
    createdAt: admin.createdAt.toISOString(),
  }));
}

/**
 * Create a new operator account with hashed credentials and role assignment.
 */
export async function createOperator(data: {
  username: string;
  password: string;
  role: Role;
  assignedCampus?: string;
  assignedLabSlug?: string;
}) {
  const actor = await requireAuth(["SUPER_ADMIN"]);

  const cleanUsername = data.username.trim().toLowerCase();
  const cleanPassword = data.password.trim();

  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error("Brugernavn skal være på mindst 3 tegn.");
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    throw new Error("Adgangskode skal være på mindst 6 tegn.");
  }

  // Check unique username
  const existing = await prisma.admin.findUnique({
    where: { username: cleanUsername },
  });

  if (existing) {
    throw new Error(`En administrator med brugernavnet "${cleanUsername}" findes allerede.`);
  }

  let assignedLabId: number | null = null;
  if (data.assignedLabSlug && data.assignedLabSlug !== "all") {
    const lab = await prisma.lab.findUnique({
      where: { slug: data.assignedLabSlug.trim() },
    });
    if (lab) assignedLabId = lab.id;
  }

  const passwordHash = await bcrypt.hash(cleanPassword, 12);

  const created = await prisma.admin.create({
    data: {
      username: cleanUsername,
      passwordHash,
      role: data.role,
      isActive: true,
      assignedCampus: data.assignedCampus?.trim() || "Køge Campus",
      assignedLabId,
    },
    include: {
      assignedLab: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorAdminId: actor.id,
      actionType: "CREATE_OPERATOR",
      targetTable: "Admin",
      targetId: created.id,
      payloadDelta: {
        username: created.username,
        role: created.role,
        assignedCampus: created.assignedCampus,
        assignedLabSlug: created.assignedLab?.slug || null,
      },
    },
  });

  revalidatePath("/admin/pos");
  revalidatePath("/admin");

  return {
    success: true,
    operator: {
      id: created.id,
      username: created.username,
      role: created.role,
      isActive: created.isActive,
      assignedCampus: created.assignedCampus,
      assignedLabSlug: created.assignedLab?.slug || null,
      assignedLabName: created.assignedLab?.name || null,
      createdAt: created.createdAt.toISOString(),
    },
  };
}

/**
 * Toggle an operator's active status (deactivate or activate).
 * Prevents a SuperAdmin from deactivating their own account if they are the sole active SuperAdmin.
 */
export async function toggleOperatorActive(targetAdminId: string, isActive: boolean) {
  const actor = await requireAuth(["SUPER_ADMIN"]);

  const targetAdmin = await prisma.admin.findUnique({
    where: { id: targetAdminId },
  });

  if (!targetAdmin) {
    throw new Error("Operatøren blev ikke fundet.");
  }

  // Prevent locking out the system: cannot deactivate self
  if (targetAdmin.id === actor.id && !isActive) {
    throw new Error("Du kan ikke deaktivere din egen administrator-konto.");
  }

  // If deactivating a SUPER_ADMIN, ensure at least one active SUPER_ADMIN remains
  if (!isActive && targetAdmin.role === "SUPER_ADMIN") {
    const activeSuperAdmins = await prisma.admin.count({
      where: { role: "SUPER_ADMIN", isActive: true },
    });
    if (activeSuperAdmins <= 1) {
      throw new Error("Kan ikke deaktivere den eneste aktive SuperAdmin.");
    }
  }

  const updated = await prisma.admin.update({
    where: { id: targetAdminId },
    data: { isActive },
  });

  await prisma.auditLog.create({
    data: {
      actorAdminId: actor.id,
      actionType: isActive ? "ACTIVATE_OPERATOR" : "DEACTIVATE_OPERATOR",
      targetTable: "Admin",
      targetId: updated.id,
      payloadDelta: {
        username: updated.username,
        isActive: updated.isActive,
      },
    },
  });

  revalidatePath("/admin/pos");
  revalidatePath("/admin");

  return { success: true, isActive: updated.isActive };
}

/**
 * Update an operator's role, campus, or lab facility assignment.
 */
export async function updateOperatorAssignment(data: {
  targetAdminId: string;
  role?: Role;
  assignedCampus?: string;
  assignedLabSlug?: string;
}) {
  const actor = await requireAuth(["SUPER_ADMIN"]);

  const targetAdmin = await prisma.admin.findUnique({
    where: { id: data.targetAdminId },
  });

  if (!targetAdmin) {
    throw new Error("Operatøren blev ikke fundet.");
  }

  // If changing role of self away from SUPER_ADMIN, ensure another active SuperAdmin exists
  if (
    targetAdmin.id === actor.id &&
    data.role &&
    data.role !== "SUPER_ADMIN"
  ) {
    const activeSuperAdmins = await prisma.admin.count({
      where: { role: "SUPER_ADMIN", isActive: true },
    });
    if (activeSuperAdmins <= 1) {
      throw new Error("Kan ikke fratage SuperAdmin-rollen fra den eneste aktive SuperAdmin.");
    }
  }

  let assignedLabId: number | null | undefined = undefined;
  if (data.assignedLabSlug !== undefined) {
    if (data.assignedLabSlug === "all" || !data.assignedLabSlug) {
      assignedLabId = null;
    } else {
      const lab = await prisma.lab.findUnique({
        where: { slug: data.assignedLabSlug.trim() },
      });
      if (lab) assignedLabId = lab.id;
    }
  }

  const updated = await prisma.admin.update({
    where: { id: data.targetAdminId },
    data: {
      ...(data.role && { role: data.role }),
      ...(data.assignedCampus && { assignedCampus: data.assignedCampus.trim() }),
      ...(assignedLabId !== undefined && { assignedLabId }),
    },
    include: {
      assignedLab: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorAdminId: actor.id,
      actionType: "UPDATE_OPERATOR_ASSIGNMENT",
      targetTable: "Admin",
      targetId: updated.id,
      payloadDelta: {
        username: updated.username,
        role: updated.role,
        assignedCampus: updated.assignedCampus,
        assignedLabSlug: updated.assignedLab?.slug || null,
      },
    },
  });

  revalidatePath("/admin/pos");
  revalidatePath("/admin");

  return {
    success: true,
    operator: {
      id: updated.id,
      username: updated.username,
      role: updated.role,
      isActive: updated.isActive,
      assignedCampus: updated.assignedCampus,
      assignedLabSlug: updated.assignedLab?.slug || null,
      assignedLabName: updated.assignedLab?.name || null,
    },
  };
}
