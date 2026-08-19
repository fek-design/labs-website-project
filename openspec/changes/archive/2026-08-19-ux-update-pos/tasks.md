## 1. Database & Macro-Location Taxonomy

- [x] 1.1 Update `prisma/seed.ts` to configure `Makerspace (Køge)` as global default, `MediaLab (Køge)`, and `Roskilde` architectural placeholder
- [x] 1.2 Deprecate micro-location inputs and update inventory queries to filter strictly by Macro-Lab facility

## 2. Deterministic Automated Asset Tagging

- [x] 2.1 Implement `generateAssetTag` Server Action in `app/actions/inventory.ts` with schema `[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` and database uniqueness guarantee
- [x] 2.2 Update `components/inventory/InventoryManager.tsx` to disable manual asset tag entry and automatically display live generated tags on lab/category selection

## 3. Performance & Polling Elimination

- [x] 3.1 Remove all short-polling intervals and redundant network waterfalls from `components/pos/LoanCalendar.tsx` and `components/pos/EquipmentPOS.tsx`
- [x] 3.2 Ensure loan calendar and POS telemetry query strictly on mount and explicit mutation triggers

## 4. UI/UX Refinements & Optimistic Checkout

- [x] 4.1 Update `components/pos/CheckoutCart.tsx` action button label to exactly `"Confirm checkout"`
- [x] 4.2 Implement optimistic checkout state update with silent background sync, rollback on error, and non-blocking toast notifications
- [x] 4.3 Verify macro-location assignments, auto-generated asset tags, optimistic checkout, and polling elimination end-to-end
