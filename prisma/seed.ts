import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { Role, HardwareType, OperationalStatus } from "@prisma/client";

async function main() {
  console.log("🌱 Starting Zealand Labs database seed...");

  // 1. Seed Labs
  console.log("Creating default Labs...");
  const makerspace = await prisma.lab.upsert({
    where: { slug: "makerspace" },
    update: {
      name: "Zealand Makerspace",
      campus: "Roskilde Campus",
    },
    create: {
      slug: "makerspace",
      name: "Zealand Makerspace",
      campus: "Roskilde Campus",
    },
  });

  const medialab = await prisma.lab.upsert({
    where: { slug: "medialab" },
    update: {
      name: "Zealand Medialab",
      campus: "Roskilde Campus",
    },
    create: {
      slug: "medialab",
      name: "Zealand Medialab",
      campus: "Roskilde Campus",
    },
  });

  console.log(`Labs ready: ${makerspace.name} (ID: ${makerspace.id}), ${medialab.name} (ID: ${medialab.id})`);

  // 2. Seed Admin Accounts
  console.log("Creating Admin accounts...");
  const adminPasswordHash = await bcrypt.hash("ZealandAdmin2026!", 10);
  const techPasswordHash = await bcrypt.hash("ZealandTech2026!", 10);

  const superAdmin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      username: "admin",
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  const technician = await prisma.admin.upsert({
    where: { username: "technician" },
    update: {
      passwordHash: techPasswordHash,
      role: Role.TECHNICIAN,
      isActive: true,
    },
    create: {
      username: "technician",
      passwordHash: techPasswordHash,
      role: Role.TECHNICIAN,
      isActive: true,
    },
  });

  console.log(`Admins ready: ${superAdmin.username} (${superAdmin.role}), ${technician.username} (${technician.role})`);

  // 3. Seed Taxonomy Tags
  console.log("Creating Taxonomy Tags...");
  const tagData = [
    { name: "3D Printing", slug: "3d-printing" },
    { name: "Laser Cutting", slug: "laser-cutting" },
    { name: "Electronics", slug: "electronics" },
    { name: "Camera Gear", slug: "camera-gear" },
    { name: "Audio Equipment", slug: "audio-equipment" },
    { name: "Lighting", slug: "lighting" },
    { name: "XR & VR", slug: "xr-vr" },
  ];

  const tags: Record<string, { id: number; name: string; slug: string }> = {};
  for (const t of tagData) {
    const createdTag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: { name: t.name, slug: t.slug },
    });
    tags[t.slug] = createdTag;
  }
  console.log(`Taxonomy tags created: ${Object.keys(tags).length}`);

  // 4. Seed Inventory Assets
  console.log("Creating Sample Inventory Assets...");

  // 4a. Makerspace Machines (STATIC_MACHINE)
  const bambuX1C = await prisma.inventory.upsert({
    where: { assetTag: "MS-3DP-001" },
    update: {
      name: "Bambu Lab X1-Carbon Combo",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/bambu-x1c.webp",
      notes: "0.4mm nozzle installed. Automated Material System (AMS) attached.",
      customFields: { buildVolume: "256x256x256mm", maxTemp: 300 },
    },
    create: {
      assetTag: "MS-3DP-001",
      name: "Bambu Lab X1-Carbon Combo",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/bambu-x1c.webp",
      notes: "0.4mm nozzle installed. Automated Material System (AMS) attached.",
      customFields: { buildVolume: "256x256x256mm", maxTemp: 300 },
    },
  });

  const laserCutter = await prisma.inventory.upsert({
    where: { assetTag: "MS-LC-001" },
    update: {
      name: "Flux Beambox Pro 50W CO2 Laser",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/beambox-pro.webp",
      notes: "Ventilation must be running before starting any job.",
      customFields: { laserPower: "50W", workArea: "600x375mm" },
    },
    create: {
      assetTag: "MS-LC-001",
      name: "Flux Beambox Pro 50W CO2 Laser",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/beambox-pro.webp",
      notes: "Ventilation must be running before starting any job.",
      customFields: { laserPower: "50W", workArea: "600x375mm" },
    },
  });

  // 4b. Medialab Gear (BORROWABLE_GEAR)
  const sonyFX30 = await prisma.inventory.upsert({
    where: { assetTag: "ML-CAM-001" },
    update: {
      name: "Sony FX30 Cinema Line Camera Kit",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/sony-fx30.webp",
      notes: "Includes top handle XLR unit, 2x batteries, charger, and 128GB V90 SD card.",
      customFields: { mount: "Sony E-mount", sensor: "APS-C / Super 35" },
    },
    create: {
      assetTag: "ML-CAM-001",
      name: "Sony FX30 Cinema Line Camera Kit",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/sony-fx30.webp",
      notes: "Includes top handle XLR unit, 2x batteries, charger, and 128GB V90 SD card.",
      customFields: { mount: "Sony E-mount", sensor: "APS-C / Super 35" },
    },
  });

  const rodeWirelessPro = await prisma.inventory.upsert({
    where: { assetTag: "ML-AUD-001" },
    update: {
      name: "RØDE Wireless PRO Dual Kit",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/rode-wireless-pro.webp",
      notes: "2x Transmitters, 1x Receiver, 2x Lavalier II mics, smart charging case.",
      customFields: { recording: "32-bit float on-board" },
    },
    create: {
      assetTag: "ML-AUD-001",
      name: "RØDE Wireless PRO Dual Kit",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/rode-wireless-pro.webp",
      notes: "2x Transmitters, 1x Receiver, 2x Lavalier II mics, smart charging case.",
      customFields: { recording: "32-bit float on-board" },
    },
  });

  // 5. Connect Inventory with Tags
  const tagMappings = [
    { inventoryId: bambuX1C.id, tagId: tags["3d-printing"].id },
    { inventoryId: laserCutter.id, tagId: tags["laser-cutting"].id },
    { inventoryId: sonyFX30.id, tagId: tags["camera-gear"].id },
    { inventoryId: rodeWirelessPro.id, tagId: tags["audio-equipment"].id },
  ];

  for (const mapping of tagMappings) {
    await prisma.inventoryTag.upsert({
      where: {
        inventoryId_tagId: {
          inventoryId: mapping.inventoryId,
          tagId: mapping.tagId,
        },
      },
      update: {},
      create: mapping,
    });
  }

  console.log("Inventory assets and tag associations created.");
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
