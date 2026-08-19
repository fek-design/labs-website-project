import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { Role, HardwareType, OperationalStatus } from "@prisma/client";

async function main() {
  console.log("🧹 Resetting database & seeding clean mock test data...");

  // Clear existing records in foreign-key dependency order
  await prisma.repairLog.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.inventoryTag.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.patron.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.lab.deleteMany();

  console.log("Database cleared.");

  // 1. Seed Macro Labs
  console.log("Creating Macro Labs...");
  const makerspaceKoge = await prisma.lab.create({
    data: {
      slug: "makerspace",
      name: "Makerspace (Køge)",
      campus: "Køge Campus",
    },
  });

  const medialabKoge = await prisma.lab.create({
    data: {
      slug: "medialab",
      name: "MediaLab (Køge)",
      campus: "Køge Campus",
    },
  });

  const roskildeLab = await prisma.lab.create({
    data: {
      slug: "roskilde",
      name: "Roskilde Lab",
      campus: "Roskilde Campus",
    },
  });

  console.log(`Macro Labs seeded:
  - ${makerspaceKoge.name} [Default]
  - ${medialabKoge.name}
  - ${roskildeLab.name} [Placeholder]`);

  // 2. Seed Admin Accounts (with temporary "pass" password)
  console.log("Creating Admin accounts...");
  const defaultPasswordHash = await bcrypt.hash("pass", 10);

  const superAdmin = await prisma.admin.create({
    data: {
      username: "admin",
      passwordHash: defaultPasswordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  const technician = await prisma.admin.create({
    data: {
      username: "technician",
      passwordHash: defaultPasswordHash,
      role: Role.TECHNICIAN,
      isActive: true,
    },
  });

  console.log(`Admins ready: admin (SUPER_ADMIN / password: pass), technician (TECHNICIAN / password: pass)`);

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
    { name: "General Tools", slug: "general-tools" },
  ];

  const tags: Record<string, any> = {};
  for (const t of tagData) {
    const createdTag = await prisma.tag.create({
      data: { name: t.name, slug: t.slug },
    });
    tags[t.slug] = createdTag;
  }
  console.log(`Taxonomy tags created: ${Object.keys(tags).length}`);

  // 4. Seed Verified Makerspace Static Machines (Authentic Specs)
  console.log("Creating Verified Makerspace Machines...");

  const bambuX1C = await prisma.inventory.create({
    data: {
      assetTag: "MK-3DP-0001",
      name: "Bambu Lab X1-Carbon Combo",
      labId: makerspaceKoge.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/bambu-x1c.webp",
      notes: "0.4mm hardened steel nozzle. AMS automated material system with 4 filament slots.",
      customFields: {
        buildVolume: "256 x 256 x 256 mm",
        manualUrl: "https://wiki.bambulab.com/en/x1",
        manualFileName: "Bambu_X1C_User_Guide.pdf",
        safetyGuide: "Allow heated bed plate to cool before removing models.",
      },
    },
  });

  const laserCutter = await prisma.inventory.create({
    data: {
      assetTag: "MK-LSR-0001",
      name: "Flux Beambox Pro 50W CO2 Laser",
      labId: makerspaceKoge.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/beambox-pro.webp",
      notes: "CO2 glass laser tube with integrated air assist and smart camera alignment.",
      customFields: {
        laserPower: "50W CO2",
        workArea: "600 x 375 mm",
        manualUrl: "https://support.flux3dp.com/hc/en-us/categories/360001717316-Beambox",
        manualFileName: "Flux_Beambox_Pro_Manual.pdf",
        safetyGuide: "Turn on external exhaust blower before laser emission. Never cut PVC or vinyl.",
      },
    },
  });

  const solderingStation = await prisma.inventory.create({
    data: {
      assetTag: "MK-ELC-0001",
      name: "Weller WT1010 Soldering Station & Fume Extractor",
      labId: makerspaceKoge.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/weller-soldering.webp",
      notes: "Digital temperature controlled iron with ESD-safe bench mat and HEPA fume extraction.",
      customFields: {
        power: "90W",
        tempRange: "50°C - 450°C",
        safetyGuide: "Always wear safety goggles and keep fume extraction hood positioned over work.",
      },
    },
  });

  // 5. Seed Verified Medialab Borrowable Gear
  console.log("Creating Verified Medialab Borrowable Gear...");

  const sonyFX30 = await prisma.inventory.create({
    data: {
      assetTag: "ML-CAM-0001",
      name: "Sony FX30 Cinema Line Camera Kit",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/sony-fx30.webp",
      notes: "Includes top handle XLR unit, 2x batteries, dual charger, and 128GB V90 SD card.",
    },
  });

  const rodeWirelessPro = await prisma.inventory.create({
    data: {
      assetTag: "ML-AUD-0001",
      name: "RØDE Wireless PRO Dual Mic Kit",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/rode-wireless-pro.webp",
      notes: "2x Transmitters, 1x Receiver, 2x Lavalier II mics, smart charging case.",
    },
  });

  const aputureAmaran = await prisma.inventory.create({
    data: {
      assetTag: "ML-LGT-0001",
      name: "Aputure Amaran 200d S Daylight LED",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/amaran-200d.webp",
      notes: "Bowens Mount 200W Daylight LED with Hyper Reflector and AC power supply.",
    },
  });

  const metaQuest3 = await prisma.inventory.create({
    data: {
      assetTag: "ML-VRX-0001",
      name: "Meta Quest 3 512GB VR Headset",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/quest3.webp",
      notes: "Includes 2x Touch Plus controllers, silicone facial interface, and charger.",
    },
  });

  // 6. Connect Inventory with Tags
  const tagMappings = [
    { inventoryId: bambuX1C.id, tagId: tags["3d-printing"].id },
    { inventoryId: laserCutter.id, tagId: tags["laser-cutting"].id },
    { inventoryId: solderingStation.id, tagId: tags["electronics"].id },
    { inventoryId: sonyFX30.id, tagId: tags["camera-gear"].id },
    { inventoryId: rodeWirelessPro.id, tagId: tags["audio-equipment"].id },
    { inventoryId: aputureAmaran.id, tagId: tags["lighting"].id },
    { inventoryId: metaQuest3.id, tagId: tags["xr-vr"].id },
  ];

  for (const mapping of tagMappings) {
    await prisma.inventoryTag.create({
      data: mapping,
    });
  }

  // 7. Seed Sample Patrons
  const patron1 = await prisma.patron.create({
    data: {
      studentId: "20240199",
      email: "student20240199@edu.zealand.dk",
    },
  });

  const patron2 = await prisma.patron.create({
    data: {
      studentId: "20240245",
      email: "student20240245@edu.zealand.dk",
    },
  });

  // 8. Seed an Active Loan and a Returned Loan with Check-in Comparison
  const now = new Date();
  const checkoutDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
  const expectedReturnDate = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000); // 20 days in future

  // Active Loan for Camera
  await prisma.loan.create({
    data: {
      inventoryId: sonyFX30.id,
      patronId: patron1.id,
      adminIdCheckout: superAdmin.id,
      status: "ACTIVE",
      checkoutDate,
      expectedReturn: expectedReturnDate,
      notes: "Documentary production course assignment.",
    },
  });

  console.log("Seeded sample active loan for Sony FX30.");
  console.log("✅ Database reset & clean seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
