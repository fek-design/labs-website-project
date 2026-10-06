/**
 * Zealand Labs - Terminal User Management CLI Utility
 *
 * Provides command-line operations to list, create, change passwords, and safely delete
 * operator/admin accounts under the Zero-Cloud MySQL architecture.
 *
 * Usage:
 *   npx tsx prisma/manage-users.ts list
 *   npx tsx prisma/manage-users.ts create <username> <password> <role> [labSlug]
 *   npx tsx prisma/manage-users.ts password <username> <newPassword>
 *   npx tsx prisma/manage-users.ts delete <username> [--force]
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const VALID_ROLES: Role[] = ["SUPER_ADMIN", "TECHNICIAN", "TEACHER"];

async function listUsers() {
  const users = await prisma.admin.findMany({
    include: {
      assignedLab: {
        select: { slug: true, name: true },
      },
    },
    orderBy: [{ role: "asc" }, { username: "asc" }],
  });

  if (users.length === 0) {
    console.log("No registered users found in database.");
    return;
  }

  console.log("\n================================ ZEALAND LABS OPERATORS ================================");
  console.log(
    "USERNAME".padEnd(18) +
      "ROLE".padEnd(16) +
      "STATUS".padEnd(12) +
      "CAMPUS".padEnd(18) +
      "ASSIGNED FACILITY".padEnd(24) +
      "CREATED"
  );
  console.log("-".repeat(96));

  for (const u of users) {
    const status = u.isActive ? "ACTIVE" : "INACTIVE";
    const facility = u.assignedLab?.name || "All Facilities";
    const campus = u.assignedCampus || "Køge Campus";
    const date = u.createdAt.toISOString().slice(0, 10);

    console.log(
      u.username.padEnd(18) +
        u.role.padEnd(16) +
        status.padEnd(12) +
        campus.padEnd(18) +
        facility.padEnd(24) +
        date
    );
  }

  const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN" && u.isActive).length;
  const technicians = users.filter((u) => u.role === "TECHNICIAN" && u.isActive).length;
  const teachers = users.filter((u) => u.role === "TEACHER" && u.isActive).length;

  console.log("-".repeat(96));
  console.log(
    `Total Active: ${users.filter((u) => u.isActive).length} | SuperAdmins: ${superAdmins} | Technicians: ${technicians} | Teachers: ${teachers}\n`
  );
}

async function createUser(args: string[]) {
  const [username, password, roleArg, labSlug] = args;

  if (!username || !password || !roleArg) {
    console.error("❌ Error: Missing required arguments.");
    console.log("Usage: npx tsx prisma/manage-users.ts create <username> <password> <role> [labSlug]");
    console.log("Roles: SUPER_ADMIN | TECHNICIAN | TEACHER");
    console.log("Labs:  medialab | makerspace | all");
    process.exit(1);
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();
  const role = roleArg.toUpperCase().trim() as Role;

  if (cleanUsername.length < 3) {
    console.error("❌ Error: Username must be at least 3 characters.");
    process.exit(1);
  }

  if (cleanPassword.length < 6) {
    console.error("❌ Error: Password must be at least 6 characters.");
    process.exit(1);
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(`❌ Error: Invalid role '${roleArg}'. Must be one of: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({ where: { username: cleanUsername } });
  if (existing) {
    console.error(`❌ Error: A user with username '${cleanUsername}' already exists.`);
    process.exit(1);
  }

  let assignedLabId: number | null = null;
  if (labSlug && labSlug.toLowerCase() !== "all") {
    const lab = await prisma.lab.findUnique({ where: { slug: labSlug.toLowerCase() } });
    if (!lab) {
      console.error(`❌ Error: Lab with slug '${labSlug}' was not found in database.`);
      process.exit(1);
    }
    assignedLabId = lab.id;
  }

  const passwordHash = await bcrypt.hash(cleanPassword, 12);

  const created = await prisma.admin.create({
    data: {
      username: cleanUsername,
      passwordHash,
      role,
      isActive: true,
      assignedCampus: "Køge Campus",
      assignedLabId,
    },
    include: { assignedLab: true },
  });

  console.log(`\n✅ Operator account '${created.username}' created successfully!`);
  console.log(`- ID: ${created.id}`);
  console.log(`- Role: ${created.role}`);
  console.log(`- Facility: ${created.assignedLab?.name || "All Facilities"}`);
  console.log(`- Campus: ${created.assignedCampus}\n`);
}

async function updatePassword(args: string[]) {
  const [username, newPassword] = args;

  if (!username || !newPassword) {
    console.error("❌ Error: Missing required arguments.");
    console.log("Usage: npx tsx prisma/manage-users.ts password <username> <newPassword>");
    process.exit(1);
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = newPassword.trim();

  if (cleanPassword.length < 6) {
    console.error("❌ Error: New password must be at least 6 characters.");
    process.exit(1);
  }

  const user = await prisma.admin.findUnique({ where: { username: cleanUsername } });
  if (!user) {
    console.error(`❌ Error: User '${cleanUsername}' was not found.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(cleanPassword, 12);

  await prisma.admin.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  console.log(`\n✅ Password for user '${user.username}' updated successfully with bcrypt hash (work factor 12)!\n`);
}

async function deleteUser(args: string[]) {
  const [username, forceFlag] = args;

  if (!username) {
    console.error("❌ Error: Missing username to delete.");
    console.log("Usage: npx tsx prisma/manage-users.ts delete <username> [--force]");
    process.exit(1);
  }

  const cleanUsername = username.trim().toLowerCase();
  const user = await prisma.admin.findUnique({ where: { username: cleanUsername } });

  if (!user) {
    console.error(`❌ Error: User '${cleanUsername}' was not found.`);
    process.exit(1);
  }

  // --- SAFEGUARD 1: Sole SuperAdmin Protection ---
  if (user.role === "SUPER_ADMIN") {
    const activeSuperAdmins = await prisma.admin.count({
      where: { role: "SUPER_ADMIN", isActive: true },
    });
    if (activeSuperAdmins <= 1) {
      console.error(
        `\n❌ Security Guard: Cannot delete the sole active SuperAdmin '${user.username}'.\n` +
          "System integrity requires at least one active SuperAdmin account. Provision or promote another SuperAdmin first.\n"
      );
      process.exit(1);
    }
  }

  // --- SAFEGUARD 2: Active Loan Check ---
  const activeLoansCount = await prisma.loan.count({
    where: {
      adminIdCheckout: user.id,
      status: "ACTIVE",
    },
  });

  if (activeLoansCount > 0) {
    console.error(
      `\n❌ Referential Guard: User '${user.username}' has ${activeLoansCount} active ongoing loan(s) checked out.\n` +
        "Check in all equipment loans before deleting this operator account.\n"
    );
    process.exit(1);
  }

  // --- SAFEGUARD 3: Explicit Confirmation Required ---
  if (forceFlag !== "--force") {
    console.log(
      `\n⚠️  WARNING: You are about to permanently delete operator '${user.username}' (${user.role}).\n` +
        "To confirm permanent deletion, add the --force flag:\n\n" +
        `   npm run users:delete -- ${user.username} --force\n`
    );
    process.exit(0);
  }

  // Find another admin (preferably active SuperAdmin) to inherit historical loan records
  const fallbackAdmin =
    (await prisma.admin.findFirst({
      where: { id: { not: user.id }, role: "SUPER_ADMIN", isActive: true },
    })) ||
    (await prisma.admin.findFirst({
      where: { id: { not: user.id }, role: "SUPER_ADMIN" },
    })) ||
    (await prisma.admin.findFirst({
      where: { id: { not: user.id }, isActive: true },
    })) ||
    (await prisma.admin.findFirst({
      where: { id: { not: user.id } },
    }));

  if (fallbackAdmin) {
    // Reassign historical closed loans to avoid MySQL foreign key violation
    await prisma.loan.updateMany({
      where: { adminIdCheckout: user.id },
      data: { adminIdCheckout: fallbackAdmin.id },
    });

    await prisma.loan.updateMany({
      where: { adminIdCheckin: user.id },
      data: { adminIdCheckin: fallbackAdmin.id },
    });
  }

  // Clean up user's audit logs to prevent foreign key errors
  await prisma.auditLog.deleteMany({
    where: { actorAdminId: user.id },
  });

  // Permanently delete user
  await prisma.admin.delete({
    where: { id: user.id },
  });

  console.log(`\n🗑️  Operator '${user.username}' was permanently deleted from the database.`);
  if (fallbackAdmin) {
    console.log(`✓ Historical completed loan transactions preserved under admin '${fallbackAdmin.username}'.`);
  }
  console.log("✓ Audit trail cleaned.\n");
}

async function main() {
  const command = process.argv[2]?.toLowerCase();
  const args = process.argv.slice(3);

  switch (command) {
    case "list":
      await listUsers();
      break;
    case "create":
      await createUser(args);
      break;
    case "password":
      await updatePassword(args);
      break;
    case "delete":
      await deleteUser(args);
      break;
    default:
      console.log("\nZealand Labs - CLI User Management\n");
      console.log("Usage:");
      console.log("  npx tsx prisma/manage-users.ts list");
      console.log("  npx tsx prisma/manage-users.ts create <username> <password> <role> [labSlug]");
      console.log("  npx tsx prisma/manage-users.ts password <username> <newPassword>");
      console.log("  npx tsx prisma/manage-users.ts delete <username> [--force]\n");
      console.log("Roles: SUPER_ADMIN | TECHNICIAN | TEACHER");
      console.log("Labs:  medialab | makerspace | all\n");
      break;
  }
}

main()
  .catch((e) => {
    console.error("CLI Execution Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
