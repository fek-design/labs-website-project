export interface CraftProcessMachine {
  id: string;
  name: string;
  model: string;
  image: string;
  maxSize: string;
  fileFormat: string;
  time: string;
  description: string;
  finishDetails: string;
  operationalStatus?: "AVAILABLE" | "MAINTENANCE" | "BUSY";
}

export interface CraftProcess {
  id: string;
  name: string;
  subtitle: string;
  iconImage?: string;
  machines: CraftProcessMachine[];
}

export interface CraftInspirationItem {
  id: string;
  title: string;
  process: string;
  time: string;
  image: string;
  isLarge?: boolean;
}

export interface CraftManualReference {
  id: string;
  title: string;
  model: string;
  tag: string;
  image?: string;
  href?: string;
}

export interface CraftLocation {
  name: string;
  campus: "køge" | "roskilde";
  hours: string;
  labSlug: "makerspace" | "medialab" | "dimselab";
}

export type CampusKey = "køge" | "roskilde";
export type LabSlug = "makerspace" | "medialab" | "dimselab";

export const CANONICAL_CRAFT_CATEGORIES = [
  "Tekstil & Beklædning",
  "3D Print & Prototyping",
  "Laserskæring & CNC",
  "Print & Storformat",
  "Vinyl & Skilte",
  "Elektronik & IoT",
  "Keramik & Sublimation",
] as const;

export type CanonicalCraftCategory = (typeof CANONICAL_CRAFT_CATEGORIES)[number];

export const STANDARD_CRAFT_TAGS = [
  "tekstil",
  "merch",
  "folie",
  "dtg",
  "varmeoverførsel",
  "broderi",
  "3d print",
  "pla",
  "prusa",
  "prototype",
  "cad",
  "laser",
  "akryl",
  "træ",
  "gravering",
  "print",
  "stortformat",
  "plakat",
  "vinyl",
  "stickers",
  "keramik",
  "sublimation",
  "iot",
  "sensor",
  "arduino",
] as const;

export interface CraftItemData {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  campuses: CampusKey[];
  labs: LabSlug[];
  heroImage: string;
  thumbnailImage?: string;
  locations: CraftLocation[];
  prerequisites: {
    materials: string;
    estimatedTime: string;
    difficulty: "Begynder-venligt" | "Let øvet" | "Avanceret" | string;
  };
  processes: CraftProcess[];
  inspiration: CraftInspirationItem[];
  manuals: CraftManualReference[];
}

export const CRAFT_CATALOG: Record<string, CraftItemData> = {
  "t-shirt": {
    slug: "t-shirt",
    title: "T-SHIRT",
    category: "Tekstil & Beklædning",
    tags: ["tekstil", "merch", "folie", "dtg", "varmeoverførsel", "broderi"],
    campuses: ["køge", "roskilde"],
    labs: ["makerspace", "dimselab"],
    heroImage: "/images/craft/hero-tshirts.png",
    thumbnailImage: "/images/landing/carousel-tshirt.png",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
      },
      {
        name: "Dimselab (Roskilde)",
        campus: "roskilde",
        hours: "Åbent Onsdag 14-17",
        labSlug: "dimselab",
      },
    ],
    prerequisites: {
      materials: "Medbring evt. egen bomuld/polyester",
      estimatedTime: "Estimeret tid: 15-45 minutter",
      difficulty: "Begynder-venligt",
    },
    processes: [
      {
        id: "print",
        name: "Print",
        subtitle: "Tekstilprint & Transfer",
        iconImage: "/images/landing/carousel-tshirt.png",
        machines: [
          {
            id: "bn-20",
            name: "Roland VersaSTUDIO BN-20",
            model: "BN-20",
            image: "/images/craft/machine-bn20.png",
            maxSize: "480 mm rullebredde",
            fileFormat: ".svg, .png, .pdf",
            time: "5-15 min",
            description:
              "Best for high-detail prints with a soft, integrated fabric feel. Ideel til flerfarvede vector illustrationer, typografi og fotoprint på transferfolie.",
            finishDetails: "Soft print finish · Long-lasting · Medium color vibrancy",
            operationalStatus: "AVAILABLE",
          },
          {
            id: "brother-gtx",
            name: "Brother GTX Pro DTG",
            model: "GTX Pro",
            image: "/images/craft/machine-bn20.png",
            maxSize: "406 x 533 mm",
            fileFormat: ".png (300 DPI, transparent baggrund)",
            time: "2-5 min",
            description:
              "Industriel direkte-på-tekstil printer til 100% bomuld og bomuldsblandinger med miljøvenlige vandbaserede Innobella tekstilblæk.",
            finishDetails: "Åndbar blød finish · Maskinvaskbar ved 40°C · Zero hand-feel",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
      {
        id: "broderi",
        name: "Broderi",
        subtitle: "Digital Maskinbroderi",
        iconImage: "/images/landing/carousel-tshirt.png",
        machines: [
          {
            id: "skitch-pp1",
            name: "Brother Skitch Single-Needle",
            model: "Skitch PP1",
            image: "/images/craft/machine-bn20.png",
            maxSize: "100 x 100 mm",
            fileFormat: ".pes, .dst",
            time: "15-35 min",
            description:
              "Præcisionsmaskine til logoer, patches og navne på caps, tasker og t-shirts styret direkte fra mobil og tablet via Artspira.",
            finishDetails: "Taktil trådstruktur · Ekstrem slidstyrke · Industrielt look",
            operationalStatus: "AVAILABLE",
          },
          {
            id: "brother-pr680w",
            name: "Brother PR680W 6-Needle",
            model: "PR680W",
            image: "/images/craft/machine-bn20.png",
            maxSize: "200 x 300 mm",
            fileFormat: ".pes, .dst",
            time: "10-25 min",
            description:
              "Avanceret 6-nåls semi-industriel broderimaskine til flerfarvede designs uden manuelt trådskift og med indbygget laserpointer til præcis centrering.",
            finishDetails: "Hurtig flerfarve-afvikling · 1.000 sting/min · Slidstærk polyestertråd",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-1",
        title: "Third Wave Coffee Sweatshirt",
        process: "Print",
        time: "25 min",
        image: "/images/craft/insp-print-sweatshirt.png",
        isLarge: false,
      },
      {
        id: "insp-2",
        title: "Essential Lens Gear Patch",
        process: "Broderi",
        time: "45 min",
        image: "/images/craft/insp-broderi-camera.png",
        isLarge: false,
      },
      {
        id: "insp-3",
        title: "Graphic Arts Oversized Tee",
        process: "Broderi",
        time: "45 min",
        image: "/images/craft/insp-broderi-model.png",
        isLarge: true,
      },
    ],
    manuals: [
      {
        id: "man-1",
        title: "Roland BN-20 Tekstilguide",
        model: "BN-20",
        tag: "Tekstilprint",
        href: "https://support.flux3dp.com",
      },
      {
        id: "man-2",
        title: "Roland GS-24 Skæreplotter",
        model: "GS-24",
        tag: "Vinylfolie",
        href: "https://support.flux3dp.com",
      },
      {
        id: "man-3",
        title: "Secabo Varmepresser SOP",
        model: "Varmepresser",
        tag: "Termisk Fiksering",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
      {
        id: "man-4",
        title: "Vektor & Filopretning Guide",
        model: "Filopretning",
        tag: "Design Klargøring",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },

  kop: {
    slug: "kop",
    title: "KOP",
    category: "Keramik & Sublimation",
    tags: ["keramik", "sublimation", "krus", "varme", "merch"],
    campuses: ["køge", "roskilde"],
    labs: ["makerspace", "dimselab"],
    heroImage: "/images/landing/carousel-kop.png",
    thumbnailImage: "/images/landing/carousel-kop.png",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
      },
      {
        name: "Dimselab (Roskilde)",
        campus: "roskilde",
        hours: "Åbent Onsdag 14-17",
        labSlug: "dimselab",
      },
    ],
    prerequisites: {
      materials: "Keramikkrus med sublimeringscoating (kan købes i lab)",
      estimatedTime: "Estimeret tid: 10-20 minutter",
      difficulty: "Begynder-venligt",
    },
    processes: [
      {
        id: "sublimation",
        name: "Sublimation",
        subtitle: "Termisk gasfaseprint",
        iconImage: "/images/landing/carousel-kop.png",
        machines: [
          {
            id: "mug-press",
            name: "Secabo TM1 Kop Varmepresser",
            model: "TM1",
            image: "/images/craft/machine-bn20.png",
            maxSize: "Diameter 75-90 mm",
            fileFormat: ".png, .pdf (300 DPI)",
            time: "3-4 min",
            description:
              "Termisk koppresser til sublimeringsprint i fotokvalitet på keramiske krus og termokopper.",
            finishDetails: "Tåler opvaskemaskine · Ridsefast · Fuldfarve fotokvalitet",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-kop-1",
        title: "Typografisk Keramikkop",
        process: "Sublimation",
        time: "15 min",
        image: "/images/landing/carousel-kop.png",
        isLarge: false,
      },
    ],
    manuals: [
      {
        id: "man-kop-1",
        title: "Sublimation Koppresser Guide",
        model: "Secabo TM1",
        tag: "Krusprint",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },

  mulepose: {
    slug: "mulepose",
    title: "MULEPOSE",
    category: "Tekstil & Beklædning",
    tags: ["tekstil", "canvas", "tote", "serigrafi", "print", "merch"],
    campuses: ["køge", "roskilde"],
    labs: ["makerspace", "dimselab"],
    heroImage: "/images/landing/carousel-mulepose.png",
    thumbnailImage: "/images/landing/carousel-mulepose.png",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
      },
      {
        name: "Dimselab (Roskilde)",
        campus: "roskilde",
        hours: "Åbent Onsdag 14-17",
        labSlug: "dimselab",
      },
    ],
    prerequisites: {
      materials: "Kraftig bomuld/canvas mulepose",
      estimatedTime: "Estimeret tid: 15-30 minutter",
      difficulty: "Begynder-venligt",
    },
    processes: [
      {
        id: "print",
        name: "Print",
        subtitle: "DTG & Flexprint",
        iconImage: "/images/landing/carousel-mulepose.png",
        machines: [
          {
            id: "brother-gtx-tote",
            name: "Brother GTX Pro DTG",
            model: "GTX Pro",
            image: "/images/craft/machine-bn20.png",
            maxSize: "355 x 406 mm",
            fileFormat: ".png, .svg",
            time: "3-5 min",
            description:
              "Hurtig print direkte på rå ubleget bomuld eller indfarvet lærred uden skærefolie.",
            finishDetails: "Øko-tex certificeret blæk · Langtidsholdbar",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-tote-1",
        title: "Zealand Labs Canvas Tote",
        process: "Print",
        time: "20 min",
        image: "/images/landing/carousel-mulepose.png",
        isLarge: false,
      },
    ],
    manuals: [
      {
        id: "man-tote-1",
        title: "Mulepose Print Setup",
        model: "GTX Pro",
        tag: "Tekstilprint",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },

  "3d-print": {
    slug: "3d-print",
    title: "3D PRINT",
    category: "3D Print & Prototyping",
    tags: ["3d print", "pla", "prusa", "fdm", "prototype", "cad", "plast"],
    campuses: ["køge", "roskilde"],
    labs: ["makerspace", "dimselab"],
    heroImage: "/images/landing/showcase-3dprint.jpg",
    thumbnailImage: "/images/landing/showcase-3dprint.jpg",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
      },
      {
        name: "Dimselab (Roskilde)",
        campus: "roskilde",
        hours: "Åbent Onsdag 14-17",
        labSlug: "dimselab",
      },
    ],
    prerequisites: {
      materials: "PLA/PETG stilles til rådighed eller medbring eget filament",
      estimatedTime: "Estimeret tid: 30 min - 4 timer",
      difficulty: "Begynder-venligt",
    },
    processes: [
      {
        id: "fdm-print",
        name: "FDM 3D Print",
        subtitle: "Termoplast ekstrudering",
        iconImage: "/images/landing/machine-prusa.png",
        machines: [
          {
            id: "prusa-mk4",
            name: "Original Prusa MK4",
            model: "MK4",
            image: "/images/landing/machine-prusa.png",
            maxSize: "250 x 210 x 220 mm",
            fileFormat: ".stl, .step, .3mf",
            time: "30-240 min",
            description:
              "Højhastigheds 3D printer med automatisk kalibrering og Input Shaping til præcise mekaniske prototyper og designmodeller.",
            finishDetails: "0.15mm laghøjde · Høj præcision · Hård PLA finish",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-3d-1",
        title: "Ergonomisk Værktøjsgreb",
        process: "FDM Print",
        time: "1 time 15 min",
        image: "/images/landing/showcase-3dprint.jpg",
        isLarge: false,
      },
    ],
    manuals: [
      {
        id: "man-3d-1",
        title: "PrusaSlicer Quickstart",
        model: "Prusa MK4",
        tag: "3D Print",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },

  plakat: {
    slug: "plakat",
    title: "PLAKAT",
    category: "Print & Storformat",
    tags: ["stortformat", "print", "papir", "grafik", "fotoprint", "plakat"],
    campuses: ["køge"],
    labs: ["medialab"],
    heroImage: "/images/landing/showcase-poster.jpg",
    thumbnailImage: "/images/landing/showcase-poster.jpg",
    locations: [
      {
        name: "Medialab (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "medialab",
      },
    ],
    prerequisites: {
      materials: "Satin og mat fotopapir ruller er inkluderet",
      estimatedTime: "Estimeret tid: 10-25 minutter",
      difficulty: "Begynder-venligt",
    },
    processes: [
      {
        id: "wide-format",
        name: "Stortformat Print",
        subtitle: "12-farvet pigmentprint",
        iconImage: "/images/landing/showcase-poster.jpg",
        machines: [
          {
            id: "canon-pro",
            name: "Canon imagePROGRAF PRO",
            model: "PRO-4000",
            image: "/images/craft/machine-bn20.png",
            maxSize: "Op til 1118 mm bredde (B0/A0)",
            fileFormat: ".pdf, .tiff, .png (300 DPI)",
            time: "8-15 min",
            description:
              "Professionel storformatprinter til galleritryk, grafisk design, udstillingsplakater og portrætter med ekstrem farvedybde.",
            finishDetails: "Gallerikvalitet · UV-bestandig Lucia PRO blæk · 2400 x 1200 dpi",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-plakat-1",
        title: "Typografisk Udstillingsplakat A1",
        process: "Stortformat Print",
        time: "15 min",
        image: "/images/landing/showcase-poster.jpg",
        isLarge: false,
      },
    ],
    manuals: [
      {
        id: "man-plakat-1",
        title: "Canon Storformat Printguide",
        model: "PRO-4000",
        tag: "Plakatprint",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },

  laserskaering: {
    slug: "laserskaering",
    title: "LASERSKÆRING",
    category: "Laserskæring & CNC",
    tags: ["laser", "akryl", "træ", "gravering", "krydsfiner", "vektor", "snit"],
    campuses: ["køge", "roskilde"],
    labs: ["makerspace", "dimselab"],
    heroImage: "/images/landing/showcase-textile.jpg",
    thumbnailImage: "/images/landing/showcase-textile.jpg",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
      },
      {
        name: "Dimselab (Roskilde)",
        campus: "roskilde",
        hours: "Åbent Onsdag 14-17",
        labSlug: "dimselab",
      },
    ],
    prerequisites: {
      materials: "Krydsfiner, MDF (3-6mm) eller akrylplader",
      estimatedTime: "Estimeret tid: 15-40 minutter",
      difficulty: "Let øvet",
    },
    processes: [
      {
        id: "laser-cutting",
        name: "CO2 Laserskæring",
        subtitle: "Vektorsnit og rastergravering",
        iconImage: "/images/landing/showcase-textile.jpg",
        machines: [
          {
            id: "flux-beambox",
            name: "FLUX Beambox Pro",
            model: "Beambox Pro 50W",
            image: "/images/craft/machine-bn20.png",
            maxSize: "600 x 375 x 80 mm",
            fileFormat: ".svg, .dxf",
            time: "10-25 min",
            description:
              "Højpræcisions CO2 laserskærer og gravør til akryl, træ, læder og pap med indbygget HD-kamera til nem justering over emnet.",
            finishDetails: "Knivskarpe snitflader · Vektorgravering · Poleret akrylkant",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-laser-1",
        title: "Arkitektonisk Facademodel",
        process: "Laserskæring",
        time: "20 min",
        image: "/images/landing/showcase-textile.jpg",
        isLarge: false,
      },
    ],
    manuals: [
      {
        id: "man-laser-1",
        title: "FLUX Beambox SOP & Sikkerhed",
        model: "Beambox Pro",
        tag: "Laserskæring",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },

  "stickers-folie": {
    slug: "stickers-folie",
    title: "STICKERS & FOLIE",
    category: "Vinyl & Skilte",
    tags: ["stickers", "folie", "vinyl", "klistermærker", "plotter", "konturskæring", "skilte"],
    campuses: ["køge", "roskilde"],
    labs: ["makerspace", "medialab", "dimselab"],
    heroImage: "/images/craft/machine-bn20.png",
    thumbnailImage: "/images/craft/machine-bn20.png",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
      },
      {
        name: "Dimselab (Roskilde)",
        campus: "roskilde",
        hours: "Åbent Onsdag 14-17",
        labSlug: "dimselab",
      },
    ],
    prerequisites: {
      materials: "Selvklæbende vinyl og applikationstape stilles til rådighed",
      estimatedTime: "Estimeret tid: 10-20 minutter",
      difficulty: "Begynder-venligt",
    },
    processes: [
      {
        id: "vinyl-cutting",
        name: "Konturskæring",
        subtitle: "Print & Cut vinylklistermærker",
        iconImage: "/images/craft/machine-bn20.png",
        machines: [
          {
            id: "roland-gs24",
            name: "Roland CAMM-1 GS-24",
            model: "GS-24",
            image: "/images/craft/machine-bn20.png",
            maxSize: "584 mm skærebredde",
            fileFormat: ".svg, .eps, .pdf (vektor)",
            time: "5-15 min",
            description:
              "Robust desktop-skæreplotter til præcisionsudskæring af skiltefolie, logoer og wallstickers med op til 350 grams knivtryk.",
            finishDetails: "Vandfast vinylfinish · UV-bestandig · Præcist kontursnit",
            operationalStatus: "AVAILABLE",
          },
        ],
      },
    ],
    inspiration: [
      {
        id: "insp-sticker-1",
        title: "Zealand Labs Laptop Vinyls",
        process: "Konturskæring",
        time: "10 min",
        image: "/images/craft/machine-bn20.png",
        isLarge: false,
      },
    ],
    manuals: [
      {
        id: "man-sticker-1",
        title: "Roland GS-24 Skæreplotter SOP",
        model: "GS-24",
        tag: "Folie",
        href: "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf",
      },
    ],
  },
};

export function getCraftItem(slug: string): CraftItemData | null {
  return CRAFT_CATALOG[slug.toLowerCase()] || null;
}

export function getAllCraftSlugs(): string[] {
  return Object.keys(CRAFT_CATALOG);
}

export function getAllCraftItems(): CraftItemData[] {
  return Object.values(CRAFT_CATALOG);
}

export function getCraftItemsByCampus(campus: CampusKey): CraftItemData[] {
  return Object.values(CRAFT_CATALOG).filter(
    (item) => item.campuses.includes(campus) || item.locations.some((loc) => loc.campus === campus)
  );
}

export function getCraftCategories(): string[] {
  const set = new Set<string>();
  Object.values(CRAFT_CATALOG).forEach((item) => set.add(item.category));
  return Array.from(set);
}
