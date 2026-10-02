import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * Clean All Dummy Data Script
 * Executes Option B: Complete clean-slate purge of all placeholder inventory,
 * equipment, bundle presets, loans, and repairs, establishing a pristine baseline.
 * 
 * Preserves:
 * - Lab facilities (Makerspace & Medialab Køge)
 * - Official taxonomy tags
 * - Centralized documentation manuals
 * - Administrative user accounts (handled by setup-superadmin)
 */
async function main() {
  console.log("🧹 Starting complete blank-slate purge of Zealand Labs dummy data...");

  // 1. Delete all loans and repairs
  const loansDeleted = await prisma.loan.deleteMany({});
  console.log(`✓ Purged ${loansDeleted.count} loan records.`);

  const repairsDeleted = await prisma.repairLog.deleteMany({});
  console.log(`✓ Purged ${repairsDeleted.count} repair log tickets.`);

  // 2. Delete bundle assignments and bundle items
  const bundleAssignmentsDeleted = await prisma.equipmentBundleAssignment.deleteMany({});
  console.log(`✓ Purged ${bundleAssignmentsDeleted.count} bundle assignments.`);

  const bundleItemsDeleted = await prisma.bundleItem.deleteMany({});
  console.log(`✓ Purged ${bundleItemsDeleted.count} bundle items.`);

  const bundlesDeleted = await prisma.bundle.deleteMany({});
  console.log(`✓ Purged ${bundlesDeleted.count} bundle presets.`);

  // 3. Delete inventory manual associations and inventory tags
  const manualAssocDeleted = await prisma.inventoryManual.deleteMany({});
  console.log(`✓ Purged ${manualAssocDeleted.count} inventory manual links.`);

  const inventoryTagsDeleted = await prisma.inventoryTag.deleteMany({});
  console.log(`✓ Purged ${inventoryTagsDeleted.count} inventory tag links.`);

  // 4. Delete all inventory items (complete clean slate)
  const inventoryDeleted = await prisma.inventory.deleteMany({});
  console.log(`✓ Purged ${inventoryDeleted.count} inventory items. Inventory is now a 100% clean blank slate.`);

  // 5. Delete all test patrons
  const patronsDeleted = await prisma.patron.deleteMany({});
  console.log(`✓ Purged ${patronsDeleted.count} patron records.`);

  // 6. Delete test audit logs
  const auditLogsDeleted = await prisma.auditLog.deleteMany({});
  console.log(`✓ Purged ${auditLogsDeleted.count} legacy audit log records.`);

  console.log("✨ All dummy data successfully purged! Clean production baseline established.");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
