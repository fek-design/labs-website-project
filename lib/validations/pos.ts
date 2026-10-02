import { z } from "zod";

/**
 * Patron Schema: Normalizes and validates student ID and email
 */
export const patronMutationSchema = z.object({
  studentId: z
    .string()
    .trim()
    .min(2, "Studienummer skal være mindst 2 tegn.")
    .max(30, "Studienummer må højst være 30 tegn.")
    .regex(/^[a-zA-Z0-9_\-]+$/, "Studienummer må kun indeholde bogstaver, tal, bindestreger og understregning."),
  email: z
    .string()
    .trim()
    .email("Ugyldig e-mailadresse.")
    .max(100, "E-mail må højst være 100 tegn.")
    .optional()
    .or(z.literal("")),
  adminId: z.string().optional(),
});

export type PatronMutationInput = z.infer<typeof patronMutationSchema>;

/**
 * Search Query Schema: Bounds search length to prevent regex/DOS
 */
export const posSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .max(100, "Søgeforespørgslen er for lang (maks 100 tegn)."),
  labSlug: z.string().trim().default("medialab"),
});

export type PosSearchInput = z.infer<typeof posSearchSchema>;

/**
 * Checkout Schema: Validates loan duration, item arrays, and patron association
 */
export const checkoutEquipmentSchema = z
  .object({
    patronId: z.string().trim().min(1, "Patron ID / Studienummer er påkrævet."),
    assetIds: z.array(z.string().trim().min(1)).optional(),
    inventoryIds: z.array(z.string().trim().min(1)).optional(),
    items: z
      .array(
        z.object({
          inventoryId: z.string().trim().min(1),
          quantity: z.number().int().min(1).default(1).optional(),
        })
      )
      .optional(),
    expectedReturn: z
      .string()
      .or(z.date())
      .optional()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Ugyldig afleveringsdato.")
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const now = new Date();
        return date.getTime() >= now.getTime() - 60 * 60 * 1000;
      }, "Afleveringsdato kan ikke være i fortiden.")
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);
        return date.getTime() <= maxDate.getTime();
      }, "Udlånsperioden kan ikke overstige 90 dage."),
    notes: z.string().trim().max(1000, "Noter må højst være 1000 tegn.").optional().nullable(),
    adminId: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.items && data.items.length > 0) ||
      (data.inventoryIds && data.inventoryIds.length > 0) ||
      (data.assetIds && data.assetIds.length > 0),
    "Vælg mindst ét stykke udstyr til udlån."
  );

export type CheckoutEquipmentInput = z.infer<typeof checkoutEquipmentSchema>;

/**
 * Return Equipment Schema
 */
export const returnEquipmentSchema = z.object({
  loanId: z.string().trim().min(1, "Udlåns-ID er påkrævet."),
  adminId: z.string().optional(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type ReturnEquipmentInput = z.infer<typeof returnEquipmentSchema>;

/**
 * Bulk Return Schema
 */
export const returnMultipleLoansSchema = z.object({
  loanIds: z
    .array(z.string().trim().min(1))
    .min(1, "Vælg mindst ét lån der skal afleveres."),
  adminId: z.string().optional(),
});

export type ReturnMultipleLoansInput = z.infer<typeof returnMultipleLoansSchema>;
