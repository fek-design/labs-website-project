import { prisma } from "@/lib/prisma";
import { getVerifiedSession } from "@/lib/session";
import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: Role;
  assignedCampus: string | null;
  assignedLabId: number | null;
}

/**
 * Validates the caller's session token and database active status,
 * enforcing role-based permissions (RBAC). Throws an Error if unauthorized or forbidden.
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<AuthenticatedUser> {
  const session = await getVerifiedSession();

  if (!session) {
    throw new Error("Unauthorized: Invalid or missing administrative session.");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      assignedCampus: true,
      assignedLabId: true,
    },
  });

  if (!admin || !admin.isActive) {
    throw new Error("Unauthorized: Administrator account is inactive or does not exist.");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(admin.role)) {
      throw new Error(`Forbidden: Role '${admin.role}' lacks permission for this action.`);
    }
  }

  return {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    assignedCampus: admin.assignedCampus,
    assignedLabId: admin.assignedLabId,
  };
}
