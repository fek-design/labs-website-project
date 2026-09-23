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

export interface CraftItemData {
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  locations: CraftLocation[];
  prerequisites: {
    materials: string;
    estimatedTime: string;
    difficulty: string;
  };
  processes: CraftProcess[];
  inspiration: CraftInspirationItem[];
  manuals: CraftManualReference[];
}

export const CRAFT_CATALOG: Record<string, CraftItemData> = {
  "t-shirt": {
    slug: "t-shirt",
    title: "T-SHIRT",
    category: "Beklædning & Merch",
    heroImage: "/images/craft/hero-tshirts.png",
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
    heroImage: "/images/landing/carousel-kop.png",
    locations: [
      {
        name: "Makerspace (Køge)",
        campus: "køge",
        hours: "Åbent Onsdag 14-17",
        labSlug: "makerspace",
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
    category: "Tekstil & Bæredygtighed",
    heroImage: "/images/landing/carousel-mulepose.png",
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
};

export function getCraftItem(slug: string): CraftItemData | null {
  return CRAFT_CATALOG[slug.toLowerCase()] || null;
}

export function getAllCraftSlugs(): string[] {
  return Object.keys(CRAFT_CATALOG);
}
