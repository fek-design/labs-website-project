import {
  HardwareType,
  LabModule,
  OperationalStatus,
  PrismaClient,
  TagCategory,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("devpassword", 10);

  await prisma.admin.upsert({
    where: { email: "admin@zealandlabs.local" },
    update: {},
    create: {
      email: "admin@zealandlabs.local",
      passwordHash: adminPasswordHash,
      name: "Lab Admin",
    },
  });

  const makerspace = await prisma.lab.upsert({
    where: { slug: "makerspace" },
    update: {},
    create: {
      slug: "makerspace",
      name: "Makerspace",
      description: "Walk-in fabrication lab with live machine telemetry.",
      module: LabModule.CAPABILITY_BENTO,
    },
  });

  const medialab = await prisma.lab.upsert({
    where: { slug: "medialab" },
    update: {},
    create: {
      slug: "medialab",
      name: "Medialab",
      description: "Equipment checkout and loan management for borrowable gear.",
      module: LabModule.EQUIPMENT_POS,
    },
  });

  const tagDefinitions = [
    { name: "Prototyping", category: TagCategory.USE_CASE },
    { name: "Multimedia Design", category: TagCategory.STUDY_PATH },
    { name: "PLA Filament", category: TagCategory.MATERIAL },
    { name: "Video Production", category: TagCategory.USE_CASE },
    { name: "Interaction Design", category: TagCategory.STUDY_PATH },
  ] as const;

  const tags = await Promise.all(
    tagDefinitions.map((tag) =>
      prisma.tag.upsert({
        where: { name: tag.name },
        update: { category: tag.category },
        create: tag,
      }),
    ),
  );

  const tagByName = Object.fromEntries(tags.map((tag) => [tag.name, tag]));

  const inventoryDefinitions = [
    {
      assetTag: "MK-PRUSA-01",
      name: "Prusa MK4",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      isOnLoan: false,
      tagNames: ["Prototyping", "PLA Filament"],
    },
    {
      assetTag: "MK-LASER-01",
      name: "Epilog Laser Cutter",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.MAINTENANCE,
      isOnLoan: false,
      tagNames: ["Prototyping"],
    },
    {
      assetTag: "MK-CNC-01",
      name: "ShopBot Desktop CNC",
      labId: makerspace.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      isOnLoan: false,
      tagNames: ["Prototyping", "Interaction Design"],
    },
    {
      assetTag: "ML-CAM-A7IV",
      name: "Sony A7 IV Camera Kit",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: null,
      isOnLoan: true,
      tagNames: ["Video Production", "Multimedia Design"],
    },
    {
      assetTag: "ML-MIC-RODE",
      name: "Rode Wireless GO II",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: null,
      isOnLoan: false,
      tagNames: ["Video Production"],
    },
    {
      assetTag: "ML-TRIPOD-01",
      name: "Manfrotto Video Tripod",
      labId: medialab.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: null,
      isOnLoan: false,
      tagNames: ["Video Production", "Multimedia Design"],
    },
  ] as const;

  const inventoryItems = await Promise.all(
    inventoryDefinitions.map((item) =>
      prisma.inventory.upsert({
        where: { assetTag: item.assetTag },
        update: {
          name: item.name,
          labId: item.labId,
          hardwareType: item.hardwareType,
          operationalStatus: item.operationalStatus,
          isOnLoan: item.isOnLoan,
        },
        create: {
          assetTag: item.assetTag,
          name: item.name,
          labId: item.labId,
          hardwareType: item.hardwareType,
          operationalStatus: item.operationalStatus,
          isOnLoan: item.isOnLoan,
        },
      }),
    ),
  );

  const inventoryByTag = Object.fromEntries(
    inventoryItems.map((item, index) => [item.assetTag, inventoryDefinitions[index]]),
  );

  for (const item of inventoryItems) {
    const definition = inventoryByTag[item.assetTag];
    for (const tagName of definition.tagNames) {
      const tag = tagByName[tagName];
      await prisma.inventoryTag.upsert({
        where: {
          inventoryId_tagId: {
            inventoryId: item.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          inventoryId: item.id,
          tagId: tag.id,
        },
      });
    }
  }

  const patronAlice = await prisma.patron.upsert({
    where: { studentId: "S123456" },
    update: { name: "Alice Jensen" },
    create: {
      studentId: "S123456",
      name: "Alice Jensen",
    },
  });

  const patronBob = await prisma.patron.upsert({
    where: { studentId: "S789012" },
    update: { name: "Bob Nielsen" },
    create: {
      studentId: "S789012",
      name: "Bob Nielsen",
    },
  });

  const camera = inventoryItems.find((item) => item.assetTag === "ML-CAM-A7IV");
  const tripod = inventoryItems.find((item) => item.assetTag === "ML-TRIPOD-01");

  if (!camera || !tripod) {
    throw new Error("Expected seeded inventory items were not found.");
  }

  const activeLoan = await prisma.loan.findFirst({
    where: {
      inventoryId: camera.id,
      patronId: patronAlice.id,
      returnedAt: null,
    },
  });

  if (!activeLoan) {
    await prisma.loan.create({
      data: {
        inventoryId: camera.id,
        patronId: patronAlice.id,
        checkedOutAt: new Date("2026-08-10T09:00:00.000Z"),
      },
    });
  }

  const returnedLoan = await prisma.loan.findFirst({
    where: {
      inventoryId: tripod.id,
      patronId: patronBob.id,
      returnedAt: { not: null },
    },
  });

  if (!returnedLoan) {
    await prisma.loan.create({
      data: {
        inventoryId: tripod.id,
        patronId: patronBob.id,
        checkedOutAt: new Date("2026-07-01T10:00:00.000Z"),
        returnedAt: new Date("2026-07-08T16:30:00.000Z"),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
