import { z } from "zod";
import { HardwareType, OperationalStatus, TrackingType } from "@prisma/client";

export const hardwareTypeSchema = z.nativeEnum(HardwareType);
export const trackingTypeSchema = z.nativeEnum(TrackingType);
export const operationalStatusSchema = z.nativeEnum(OperationalStatus);

/**
 * Create Inventory Item Schema
 */
export const createInventoryItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Udstyrsnavn skal være mindst 2 tegn.")
    .max(120, "Udstyrsnavn må højst være 120 tegn."),
  labSlug: z.string().trim().optional(),
  labId: z.number().int().positive().optional(),
  hardwareType: hardwareTypeSchema,
  trackingType: trackingTypeSchema.optional().default(TrackingType.SERIALIZED),
  totalQuantity: z
    .number()
    .int("Antal skal være et helt tal.")
    .min(1, "Antal skal være mindst 1.")
    .max(9999, "Antal kan højst være 9.999.")
    .optional()
    .default(1),
  operationalStatus: operationalStatusSchema.optional().default(OperationalStatus.AVAILABLE),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(1000, "Noter må højst være 1000 tegn.").optional().nullable(),
  location: z.string().trim().max(100, "Placering må højst være 100 tegn.").optional().nullable(),
  purchaseDate: z.string().or(z.date()).optional().nullable(),
  customFields: z.record(z.string(), z.any()).optional().nullable(),
  tagSlugs: z.array(z.string().trim()).optional(),
  bundleIds: z.array(z.string().trim()).optional(),
  adminId: z.string().optional(),
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;

/**
 * Update Inventory Item Schema
 */
export const updateInventoryItemSchema = z.object({
  id: z.string().trim().min(1, "Udstyrs-ID er påkrævet."),
  name: z.string().trim().min(2).max(120).optional(),
  labSlug: z.string().trim().optional(),
  hardwareType: hardwareTypeSchema.optional(),
  trackingType: trackingTypeSchema.optional(),
  totalQuantity: z.number().int().min(1).max(9999).optional(),
  operationalStatus: operationalStatusSchema.optional(),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  location: z.string().trim().max(100).optional().nullable(),
  purchaseDate: z.string().or(z.date()).optional().nullable(),
  customFields: z.record(z.string(), z.any()).optional().nullable(),
  tagSlugs: z.array(z.string().trim()).optional(),
  bundleIds: z.array(z.string().trim()).optional(),
  adminId: z.string().optional(),
});

export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;
