import "dotenv/config";
import crypto from "crypto";
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
  await prisma.equipmentBundleAssignment.deleteMany();
  await prisma.bundleItem.deleteMany();
  await prisma.bundle.deleteMany();
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

  console.log(`Macro Labs seeded:
  - ${makerspaceKoge.name} [Default]
  - ${medialabKoge.name}`);

  // 2. Seed Admin Accounts (Secure Randomized or Env-Specified Credentials)
  console.log("Creating Admin accounts...");
  const adminUsername = process.env.SEED_ADMIN_USER || "superadmin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || `ZL_${crypto.randomBytes(6).toString("hex")}!`;
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const superAdmin = await prisma.admin.create({
    data: {
      username: adminUsername,
      passwordHash: passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
      assignedCampus: "Køge Campus",
      assignedLabId: medialabKoge.id,
    },
  });

  console.log(`🔐 SuperAdmin provisioned: '${superAdmin.username}' | Password: '${adminPassword}'`);
  console.log(`⚠️  Store these credentials securely. In production, use 'npm run setup:admin' with custom credentials.`);

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

  // 4. Seed Verified Makerspace Static Machines (Køge)
  console.log("Creating Verified Makerspace Machines (Køge)...");

  const bambuX1C = await prisma.inventory.create({
    data: {
      assetTag: "MK-3DP-0001",
      name: "Bambu Lab X1-Carbon Combo",
      labId: makerspaceKoge.id,
      hardwareType: HardwareType.STATIC_MACHINE,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/bambu-x1c.webp",
      notes: "0.4mm hardened steel nozzle. AMS automated material system with 4 filament slots.",
      location: "Køge - Makerspace 3D Zone",
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
      location: "Køge - Laser Zone",
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
      location: "Køge - Tekstil Lab",
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
      location: "Køge - Elektronikbord",
      customFields: {
        safetyGuide: "Always wear safety goggles and keep fume extraction hood positioned over work.",
      },
    },
  });

  const kogeAdditionalMachines = [
    { assetTag: "MK-3DP-0002", name: "Original Prusa MK4 Nextruder", location: "Køge - Makerspace 3D Zone", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-3DP-0003", name: "Prusa XL 5-Toolhead 3D Printer", location: "Køge - Makerspace 3D Zone", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-3DP-0004", name: "Formlabs Form 4 SLA 3D Printer", location: "Køge - Precision Resin Lab", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.MAINTENANCE },
    { assetTag: "MK-3DP-0005", name: "Ultimaker S5 Dual Extruder", location: "Køge - Makerspace 3D Zone", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-LSR-0002", name: "Epilog Zing 24 Laser Cutter 40W", location: "Køge - Laser Zone", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-TEX-0002", name: "Roland TrueVIS SG-300 Vinyl Cutter", location: "Køge - Tekstil Lab", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-RPD-0001", name: "Mayku FormBox Desktop Vacuum Former", location: "Køge - Rapid Prototyping", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-RPD-0002", name: "Shaper Origin Handheld CNC Router", location: "Køge - Træ & Fræs", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "MK-RPD-0003", name: "Graphtec CE7000-60 Cutting Plotter", location: "Køge - Rapid Prototyping", hardwareType: HardwareType.STATIC_MACHINE, operationalStatus: OperationalStatus.AVAILABLE },
  ];

  for (const m of kogeAdditionalMachines) {
    await prisma.inventory.create({
      data: {
        ...m,
        labId: makerspaceKoge.id,
      },
    });
  }

  // 5. Seed Verified Medialab Borrowable Gear (Køge)
  console.log("Creating Verified Medialab Borrowable Gear (Køge)...");

  const sonyFX30 = await prisma.inventory.create({
    data: {
      assetTag: "ML-CAM-0001",
      name: "Sony FX30 Cinema Line Camera Kit",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      operationalStatus: OperationalStatus.AVAILABLE,
      imageUrl: "/uploads/sony-fx30.webp",
      location: "Køge - Medialab Udlån",
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
      location: "Køge - Lydkuffert",
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
      location: "Køge - Lysstudie",
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
      location: "Køge - XR Station",
      notes: "Includes 2x Touch Plus controllers, silicone facial interface, and charger.",
    },
  });

  const kogeAdditionalGear = [
    { assetTag: "ML-CAM-0002", name: "Sony Alpha A7 IV Full-Frame Kit", location: "Køge - Medialab Udlån", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "ML-CAM-0003", name: "Canon EOS R6 Mark II Video Kit", location: "Køge - Medialab Udlån", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "ML-AUD-0002", name: "Shure SM7B Studio Podcast Mic", location: "Køge - Podcast Studio", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "ML-AUD-0003", name: "Blackmagic ATEM Mini Pro Switcher", location: "Køge - Livestream Rack", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "ML-LGT-0002", name: "Nanlite Forza 60B II Bi-color LED", location: "Køge - Lysstudie", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "ML-CAM-0004", name: "DJI Ronin RS 3 Pro Gimbal", location: "Køge - Medialab Udlån", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
    { assetTag: "ML-AUD-0004", name: "Zoom H6 Essential Handy Recorder", location: "Køge - Lydkuffert", hardwareType: HardwareType.BORROWABLE_GEAR, operationalStatus: OperationalStatus.AVAILABLE },
  ];

  for (const g of kogeAdditionalGear) {
    await prisma.inventory.create({
      data: {
        ...g,
        labId: medialabKoge.id,
      },
    });
  }

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

  // 7. Seed Reusable Bundle Preset (Sony FX30 Cinema Kit Accessories)
  console.log("Creating Verified Reusable Bundle Preset...");

  const batteryNPFZ100 = await prisma.inventory.create({
    data: {
      assetTag: "ML-ACC-0001",
      name: "Sony NP-FZ100 Batteri",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      trackingType: "BULK",
      totalQuantity: 12,
      operationalStatus: OperationalStatus.AVAILABLE,
      location: "Køge - Batteristation",
      notes: "Genopladeligt lithium-ion batteri til FX30 og A7 IV.",
    },
  });

  const sdCard128GB = await prisma.inventory.create({
    data: {
      assetTag: "ML-ACC-0002",
      name: "SanDisk Extreme PRO 128GB V90 SD-kort",
      labId: medialabKoge.id,
      hardwareType: HardwareType.BORROWABLE_GEAR,
      trackingType: "BULK",
      totalQuantity: 8,
      operationalStatus: OperationalStatus.AVAILABLE,
      location: "Køge - Medialab Udlån",
      notes: "300MB/s 4K videooptagelse SDXC.",
    },
  });

  const cinemaKitBundle = await prisma.bundle.create({
    data: {
      name: "Sony Cinema Basis Pakke",
      description: "Standard tilbehørspakke med 2x ekstra batterier og 1x 128GB V90 højhastigheds SD-kort.",
      items: {
        create: [
          { accessoryInventoryId: batteryNPFZ100.id, defaultQuantity: 2 },
          { accessoryInventoryId: sdCard128GB.id, defaultQuantity: 1 },
        ],
      },
      assignments: {
        create: [
          { inventoryId: sonyFX30.id },
        ],
      },
    },
  });

  console.log(`Created Bundle Preset: ${cinemaKitBundle.name} assigned to ${sonyFX30.name}.`);
  console.log("✅ Clean production baseline seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
