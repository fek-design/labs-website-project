import { describe, it, expect } from "vitest";
import { createInventoryItemSchema } from "@/lib/validations/inventory";
import { posSearchSchema, checkoutEquipmentSchema } from "@/lib/validations/pos";
import { craftItemSchema } from "@/lib/validations/crafts";
import { HardwareType, TrackingType, OperationalStatus } from "@prisma/client";

describe("Zod Validation Boundary & Anti-Duplication Tests", () => {
  describe("Inventory Item Schema", () => {
    it("should accept valid inventory data", () => {
      const valid = {
        name: "Sony FX3 Cinema Camera",
        labSlug: "medialab",
        hardwareType: HardwareType.BORROWABLE_GEAR,
        trackingType: TrackingType.SERIALIZED,
        totalQuantity: 1,
        operationalStatus: OperationalStatus.AVAILABLE,
      };

      const result = createInventoryItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject item names that are too short or empty", () => {
      const invalid = {
        name: "A",
        hardwareType: HardwareType.BORROWABLE_GEAR,
      };

      const result = createInventoryItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("mindst 2 tegn");
      }
    });

    it("should reject totalQuantity less than 1", () => {
      const invalid = {
        name: "Prusa MK4",
        hardwareType: HardwareType.STATIC_MACHINE,
        totalQuantity: 0,
      };

      const result = createInventoryItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("POS Input & Search Schemas", () => {
    it("should sanitize and trim search queries", () => {
      const res = posSearchSchema.safeParse({ query: "  MFE394  ", labSlug: "medialab" });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.query).toBe("MFE394");
      }
    });

    it("should validate checkout payload requiring patronId and items", () => {
      const validCheckout = {
        patronId: "patron-uuid-1",
        items: [{ inventoryId: "inv-uuid-1", quantity: 1 }],
      };

      const res = checkoutEquipmentSchema.safeParse(validCheckout);
      expect(res.success).toBe(true);
    });

    it("should reject checkout without patronId", () => {
      const invalid = {
        items: [{ inventoryId: "inv-uuid-1" }],
      };

      const res = checkoutEquipmentSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Craft Article Schema", () => {
    it("should reject craft slugs with invalid characters or spaces", () => {
      const invalid = {
        slug: "Invalid Slug With Spaces!",
        title: "Test Craft",
        category: "Tekstil",
        tags: ["tekstil"],
        campuses: ["køge"],
        labs: ["makerspace"],
        heroImage: "/images/craft/hero.png",
        thumbnailImage: "/images/craft/thumb.png",
        locations: [{ name: "Makerspace", campus: "køge", hours: "14-17", labSlug: "makerspace" }],
        prerequisites: { materials: "Garn", estimatedTime: "10 min", difficulty: "Let" },
        processes: [],
        inspiration: [],
        manuals: [],
      };

      const res = craftItemSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.some((i) => i.path.includes("slug"))).toBe(true);
      }
    });
  });
});
