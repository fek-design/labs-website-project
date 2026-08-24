import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { Role, HardwareType, OperationalStatus, TagFacet } from "@prisma/client";

async function main() {
  console.log("🧹 Resetting database & seeding 3-tier faceted taxonomy mock test data...");

  // Clear existing records in foreign-key dependency order
  await prisma.repairLog.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.inventoryTag.deleteMany();
  await prisma.inventoryManual.deleteMany();
  await prisma.manual.deleteMany();
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

  // 3. Seed 3-Tier Faceted Taxonomy Tags
  console.log("Creating 3-Tier Faceted Taxonomy Tags...");
  const facetedTagsData = [
    // DISCIPLINE (Lab domain / workspace zone)
    { name: "Textile", slug: "textile", facet: TagFacet.DISCIPLINE },
    { name: "3D Fabrication", slug: "3d-fabrication", facet: TagFacet.DISCIPLINE },
    { name: "Rapid Prototyping", slug: "rapid-prototyping", facet: TagFacet.DISCIPLINE },
    { name: "Medialab & AV", slug: "medialab-av", facet: TagFacet.DISCIPLINE },
    { name: "Electronics", slug: "electronics", facet: TagFacet.DISCIPLINE },

    // PROCESS (Hardware execution technique)
    { name: "Direct-to-Garment", slug: "direct-to-garment", facet: TagFacet.PROCESS },
    { name: "Sublimation", slug: "sublimation", facet: TagFacet.PROCESS },
    { name: "FDM 3D Printing", slug: "fdm-3d-printing", facet: TagFacet.PROCESS },
    { name: "Resin SLA Printing", slug: "resin-sla-printing", facet: TagFacet.PROCESS },
    { name: "Laser Cutting", slug: "laser-cutting", facet: TagFacet.PROCESS },
    { name: "Screen Printing", slug: "screen-printing", facet: TagFacet.PROCESS },
    { name: "Embroidery", slug: "embroidery", facet: TagFacet.PROCESS },
    { name: "Soldering & SMD", slug: "soldering-smd", facet: TagFacet.PROCESS },
    { name: "Cinema 4K Recording", slug: "cinema-4k-recording", facet: TagFacet.PROCESS },
    { name: "Wireless Audio", slug: "wireless-audio", facet: TagFacet.PROCESS },
    { name: "Studio Lighting", slug: "studio-lighting", facet: TagFacet.PROCESS },
    { name: "VR & Spatial Computing", slug: "vr-spatial-computing", facet: TagFacet.PROCESS },
  ];

  const tags: Record<string, any> = {};
  for (const t of facetedTagsData) {
    const createdTag = await prisma.tag.create({
      data: { name: t.name, slug: t.slug, facet: t.facet },
    });
    tags[t.slug] = createdTag;
  }
  console.log(`Faceted taxonomy tags created: ${Object.keys(tags).length}`);

  // 4. Seed Verified Makerspace Static Machines (Clean Authentic Specs)
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
        manualUrl: "https://support.flux3dp.com/hc/en-us/categories/360001717316-Beambox",
        manualFileName: "Flux_Beambox_Pro_Manual.pdf",
        safetyGuide: "Turn on external exhaust blower before laser emission. Never cut PVC or vinyl.",
      },
    },
  });

  const brotherGTX = await prisma.inventory.create({
    data: {
      assetTag: "MK-TEX-0001",
      name: "Brother GTX Pro Direct-to-Garment Printer",
      labId: makerspaceKoge.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/brother-gtx.webp",
      notes: "Industrial DTG printer for organic cotton textiles and polyester blends with Innobella textile inks.",
      customFields: {
        manualUrl: "https://www.brother-ism.com",
        manualFileName: "Brother_GTX_Pro_Operation_Manual.pdf",
        safetyGuide: "Always wear safety gloves when handling pretreatment liquid and ink cartridges.",
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

  // 6. Connect Inventory with 2-Tier Faceted Tags
  const tagMappings = [
    // Bambu Lab X1C
    { inventoryId: bambuX1C.id, tagId: tags["3d-fabrication"].id },
    { inventoryId: bambuX1C.id, tagId: tags["fdm-3d-printing"].id },

    // Laser Cutter
    { inventoryId: laserCutter.id, tagId: tags["rapid-prototyping"].id },
    { inventoryId: laserCutter.id, tagId: tags["laser-cutting"].id },

    // Brother GTX Pro Textile
    { inventoryId: brotherGTX.id, tagId: tags["textile"].id },
    { inventoryId: brotherGTX.id, tagId: tags["direct-to-garment"].id },

    // Weller Soldering
    { inventoryId: solderingStation.id, tagId: tags["electronics"].id },
    { inventoryId: solderingStation.id, tagId: tags["soldering-smd"].id },

    // Sony FX30
    { inventoryId: sonyFX30.id, tagId: tags["medialab-av"].id },
    { inventoryId: sonyFX30.id, tagId: tags["cinema-4k-recording"].id },

    // RØDE Wireless PRO
    { inventoryId: rodeWirelessPro.id, tagId: tags["medialab-av"].id },
    { inventoryId: rodeWirelessPro.id, tagId: tags["wireless-audio"].id },

    // Aputure Amaran
    { inventoryId: aputureAmaran.id, tagId: tags["medialab-av"].id },
    { inventoryId: aputureAmaran.id, tagId: tags["studio-lighting"].id },

    // Meta Quest 3
    { inventoryId: metaQuest3.id, tagId: tags["medialab-av"].id },
    { inventoryId: metaQuest3.id, tagId: tags["vr-spatial-computing"].id },
  ];

  for (const mapping of tagMappings) {
    await prisma.inventoryTag.create({
      data: mapping,
    });
  }

  // 7. Seed Centralized Manuals Catalog & Many-to-Many Machine Links
  console.log("Creating Centralized Manuals Catalog...");

  const bambuManual = await prisma.manual.create({
    data: {
      title: "Bambu Lab X1-Carbon Operation & Maintenance Guide",
      fileName: "Bambu_X1C_User_Guide.pdf",
      fileUrl: "https://wiki.bambulab.com/en/x1",
      fileSize: 4194304,
      description: "Official Bambu Lab hardware calibration, AMS multi-color setup, and preventative maintenance.",
    },
  });

  const laserManual = await prisma.manual.create({
    data: {
      title: "Flux Beambox Pro 50W Laser Cutter Technical Manual",
      fileName: "Flux_Beambox_Pro_Manual.pdf",
      fileUrl: "https://support.flux3dp.com/hc/en-us/categories/360001717316-Beambox",
      fileSize: 6291456,
      description: "Mirror alignment, focal distance calculation, rotary attachment usage, and Beam Studio workflows.",
    },
  });

  const brotherManual = await prisma.manual.create({
    data: {
      title: "Brother GTX Pro Direct-to-Garment Operation Manual",
      fileName: "Brother_GTX_Pro_Operation_Manual.pdf",
      fileUrl: "https://www.brother-ism.com",
      fileSize: 5242880,
      description: "Innobella ink maintenance routines, pretreatment spray techniques, and platen height calibration.",
    },
  });

  const safetySop = await prisma.manual.create({
    data: {
      title: "Zealand Makerspace Universal Safety SOP & Emergency Protocol v2.4",
      fileName: "Makerspace_Universal_Safety_SOP_v2.pdf",
      fileUrl: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      fileSize: 1572864,
      description: "Mandatory PPE guidelines, emergency stop switches, ventilation protocols, and thermal hazard procedures.",
    },
  });

  const orcaSlicerPresets = await prisma.manual.create({
    data: {
      title: "Zealand Lab OrcaSlicer & Bambu Studio Verified Presets",
      fileName: "OrcaSlicer_Zealand_Presets.pdf",
      fileUrl: "https://github.com/SoftFever/OrcaSlicer/wiki",
      fileSize: 2097152,
      description: "Optimal print profiles, flow calibrations, support interfaces, and infill settings for PLA & PETG.",
    },
  });

  // Link Many-to-Many Manuals across machines
  const manualMappings = [
    // Bambu X1-Carbon has 3 manuals (User guide + Shared Safety SOP + Slicer Presets)
    { inventoryId: bambuX1C.id, manualId: bambuManual.id },
    { inventoryId: bambuX1C.id, manualId: safetySop.id },
    { inventoryId: bambuX1C.id, manualId: orcaSlicerPresets.id },

    // Laser Cutter has 2 manuals (Beambox manual + Shared Safety SOP)
    { inventoryId: laserCutter.id, manualId: laserManual.id },
    { inventoryId: laserCutter.id, manualId: safetySop.id },

    // Brother GTX Pro has 2 manuals (Brother manual + Shared Safety SOP)
    { inventoryId: brotherGTX.id, manualId: brotherManual.id },
    { inventoryId: brotherGTX.id, manualId: safetySop.id },

    // Soldering Station has Shared Safety SOP
    { inventoryId: solderingStation.id, manualId: safetySop.id },
  ];

  for (const m of manualMappings) {
    await prisma.inventoryManual.create({
      data: m,
    });
  }

  console.log("Centralized manuals and Many-to-Many machine links seeded.");

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

  // 8. Seed an Active Loan
  const now = new Date();
  const checkoutDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const expectedReturnDate = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);

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
  console.log("✅ 2-Tier Faceted Taxonomy seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
