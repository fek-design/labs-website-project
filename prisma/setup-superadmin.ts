import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Dedicated SuperAdmin Setup Script
 * Provisions or updates the primary SUPER_ADMIN account using bcrypt hashing.
 * 
 * Usage:
 *   npx tsx prisma/setup-superadmin.ts [username] [password]
 * Or via env:
 *   SUPERADMIN_USER=admin SUPERADMIN_PASSWORD=yourSecurePassword npx tsx prisma/setup-superadmin.ts
 */
async function main() {
  const args = process.argv.slice(2);
  const username = (args[0] || process.env.SUPERADMIN_USER || "superadmin").trim();
  const password = (args[1] || process.env.SUPERADMIN_PASSWORD || "ZealandLabs2026!").trim();

  if (!username || !password) {
    console.error("❌ Username and password are required to setup the SuperAdmin account.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ SuperAdmin password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`🔐 Provisioning SuperAdmin account: '${username}'...`);

  // Salt and hash with bcrypt cost factor 12
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Retrieve default lab
  const defaultLab = await prisma.lab.findFirst({
    where: { campus: "Køge Campus" },
  });

  // Upsert the primary SuperAdmin
  const admin = await prisma.admin.upsert({
    where: { username },
    create: {
      username,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      assignedCampus: "Køge Campus",
      assignedLabId: defaultLab?.id || null,
    },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      assignedCampus: "Køge Campus",
    },
  });

  console.log(`✅ SuperAdmin account '${admin.username}' (${admin.id}) is active with role ${admin.role}.`);

  // Remove old test accounts if they differ from the active SuperAdmin
  const testUsersToDelete = ["admin", "technician"].filter((u) => u !== username);
  if (testUsersToDelete.length > 0) {
    const deleted = await prisma.admin.deleteMany({
      where: {
        username: { in: testUsersToDelete },
      },
    });
    console.log(`✓ Purged ${deleted.count} legacy test accounts (${testUsersToDelete.join(", ")}).`);
  }

  console.log("✨ SuperAdmin setup completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ SuperAdmin setup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
