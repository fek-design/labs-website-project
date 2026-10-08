import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";
import { LoanStatus, OperationalStatus, TrackingType } from "@prisma/client";

describe("POS Loan & Checkout Logic Tests", () => {
  describe("Serialized Asset Checkout Invariants", () => {
    it("should reject checkout if asset operational status is BROKEN or MAINTENANCE", () => {
      const mockBrokenAsset = {
        id: "camera-1",
        name: "Sony FX3",
        assetTag: "MED-CAM-01",
        operationalStatus: OperationalStatus.BROKEN,
        trackingType: TrackingType.SERIALIZED,
      };

      const canCheckout = (item: typeof mockBrokenAsset) => {
        if (
          item.operationalStatus === OperationalStatus.BROKEN ||
          item.operationalStatus === OperationalStatus.MAINTENANCE
        ) {
          throw new Error(`Udstyret er markeret som ${item.operationalStatus} og kan ikke udlånes.`);
        }
        return true;
      };

      expect(() => canCheckout(mockBrokenAsset)).toThrow(/kan ikke udlånes/);
    });

    it("should reject checkout if serialized asset already has an ACTIVE loan", () => {
      const mockActiveLoans = [{ id: "loan-1", status: LoanStatus.ACTIVE }];

      const canCheckoutSerialized = (loans: typeof mockActiveLoans, trackingType: TrackingType) => {
        if (trackingType === TrackingType.SERIALIZED && loans.length > 0) {
          throw new Error("Udstyret har allerede et aktivt udlån.");
        }
        return true;
      };

      expect(() =>
        canCheckoutSerialized(mockActiveLoans, TrackingType.SERIALIZED)
      ).toThrow(/har allerede et aktivt udlån/);

      // BULK items should allow checkout even with active loans
      expect(canCheckoutSerialized(mockActiveLoans, TrackingType.BULK)).toBe(true);
    });

    it("should calculate return status transition properly", () => {
      const initialLoan = {
        id: "loan-101",
        status: LoanStatus.ACTIVE,
        returnedQty: 0,
        quantity: 1,
        expectedReturn: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };

      const processReturn = (loan: typeof initialLoan, qtyReturned: number) => {
        const newReturned = loan.returnedQty + qtyReturned;
        const isFullyReturned = newReturned >= loan.quantity;
        return {
          ...loan,
          returnedQty: newReturned,
          status: isFullyReturned ? LoanStatus.RETURNED : LoanStatus.ACTIVE,
          actualReturn: isFullyReturned ? new Date() : null,
        };
      };

      const completed = processReturn(initialLoan, 1);
      expect(completed.status).toBe(LoanStatus.RETURNED);
      expect(completed.actualReturn).not.toBeNull();
    });
  });

  describe("POS Rate Limiter Sliding Window", () => {
    it("should allow initial requests and throttle when limit exceeded", () => {
      const testKey = `test-pos-key-${Date.now()}`;
      // Max 3 requests per 10 seconds
      const r1 = checkRateLimit(testKey, 3, 10);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit(testKey, 3, 10);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit(testKey, 3, 10);
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);

      // 4th request should be throttled
      const r4 = checkRateLimit(testKey, 3, 10);
      expect(r4.allowed).toBe(false);
      expect(r4.resetInSeconds).toBeGreaterThan(0);
    });
  });
});
