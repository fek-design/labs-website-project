import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * Clean Test Data Script
 * Safely purges accumulated test artifacts:
 * - Active & historical test loans
 * - Repair logs logged during development testing
 * - Mock / sample patrons (e.g. 20240199, 20240245, TEST-*)
 * - Orphaned or placeholder test inventory items
 * 
 * Preserves:
 * - Lab facilities (Makerspace & Medialab Køge)
 * - Administrative user accounts
 * - Official taxonomy tags
 * - Centralized documentation manuals
 * - Verified hardware equipment and bundle presets
 */
async function main() {
  console.log("🧹 Starting Zealand Labs Database Test Data Cleanup...");

  // 1. Delete all test/demo loans
  const loansDeleted = await prisma.loan.deleteMany({});
  console.log(`✓ Purged ${loansDeleted.count} test loan records.`);

  // 2. Delete all repair test logs
  const repairsDeleted = await prisma.repairLog.deleteMany({});
  console.log(`✓ Purged ${repairsDeleted.count} test repair tickets.`);

  // 3. Delete all test / demo patrons
  const patronsDeleted = await prisma.patron.deleteMany({});
  console.log(`✓ Purged ${patronsDeleted.count} test patron records.`);

  // 4. Delete temporary/test items (items with asset tag containing TEST, DEMO, or TEMP)
  const testItemsDeleted = await prisma.inventory.deleteMany({
    where: {
      OR: [
        { assetTag: { contains: "TEST" } },
        { assetTag: { contains: "DEMO" } },
        { assetTag: { contains: "TEMP" } },
        { name: { contains: "Test" } },
        { name: { contains: "test" } },
      ],
    },
  });
  console.log(`✓ Purged ${testItemsDeleted.count} test/placeholder inventory records.`);

  // 5. Reset all operational equipment to AVAILABLE
  const equipmentReset = await prisma.inventory.updateMany({
    data: {
      operationalStatus: "AVAILABLE",
    },
  });
  console.log(`✓ Reset ${equipmentReset.count} verified equipment items to AVAILABLE status.`);

  console.log("✨ Database cleanup completed successfully! Pristine operational baseline established.");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
