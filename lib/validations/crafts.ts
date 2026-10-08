import { z } from "zod";

export const craftLocationSchema = z.object({
  name: z.string().trim().min(1, "Lokationsnavn er påkrævet."),
  campus: z.enum(["køge", "roskilde"]),
  hours: z.string().trim().min(1, "Åbningstider er påkrævet."),
  labSlug: z.enum(["makerspace", "medialab", "dimselab"]),
});

export const craftProcessMachineSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Maskinnavn er påkrævet."),
  model: z.string().trim().min(1),
  image: z.string().trim().min(1),
  maxSize: z.string().trim().min(1),
  fileFormat: z.string().trim().min(1),
  time: z.string().trim().min(1),
  description: z.string().trim().min(1),
  finishDetails: z.string().trim().min(1),
  operationalStatus: z.enum(["AVAILABLE", "MAINTENANCE", "BUSY"]).optional(),
});

export const craftProcessSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Processnavn er påkrævet."),
  subtitle: z.string().trim().min(1),
  iconImage: z.string().trim().optional(),
  machines: z.array(craftProcessMachineSchema).min(1, "Mindst én maskine er påkrævet i processen."),
});

export const craftInspirationItemSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1, "Titel er påkrævet."),
  process: z.string().trim().min(1),
  time: z.string().trim().min(1),
  image: z.string().trim().min(1),
  isLarge: z.boolean().optional(),
});

export const craftManualReferenceSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1, "Manualtitel er påkrævet."),
  model: z.string().trim().min(1),
  tag: z.string().trim().min(1),
  image: z.string().trim().optional(),
  href: z.string().trim().optional(),
});

export const craftItemSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug skal være på mindst 2 tegn.")
    .max(80, "Slug må højst være 80 tegn.")
    .regex(/^[a-z0-9-]+$/, "Slug må kun indeholde små bogstaver, tal og bindestreger."),
  title: z
    .string()
    .trim()
    .min(2, "Titel skal være på mindst 2 tegn.")
    .max(120, "Titel må højst være 120 tegn."),
  category: z.string().trim().min(2, "Kategori er påkrævet."),
  tags: z.array(z.string().trim()).min(1, "Mindst ét tag er påkrævet."),
  campuses: z.array(z.enum(["køge", "roskilde"])).min(1, "Mindst ét campus er påkrævet."),
  labs: z.array(z.enum(["makerspace", "medialab", "dimselab"])).min(1, "Mindst ét laboratorie er påkrævet."),
  heroImage: z.string().trim().min(1, "Hero billede er påkrævet."),
  thumbnailImage: z.string().trim().min(1, "Thumbnail billede er påkrævet."),
  locations: z.array(craftLocationSchema).min(1, "Mindst én lokation er påkrævet."),
  prerequisites: z.object({
    materials: z.string().trim().min(1, "Materialer skal specificeres."),
    estimatedTime: z.string().trim().min(1, "Tidsestimat skal specificeres."),
    difficulty: z.string().trim().min(1, "Sværhedsgrad skal specificeres."),
  }),
  processes: z.array(craftProcessSchema).min(1, "Mindst én proces skal specificeres."),
  inspiration: z.array(craftInspirationItemSchema),
  manuals: z.array(craftManualReferenceSchema),
  isFeaturedOnFrontpage: z.boolean().optional(),
  featuredOrder: z.number().int().positive().optional(),
});

export type CraftItemInput = z.infer<typeof craftItemSchema>;
