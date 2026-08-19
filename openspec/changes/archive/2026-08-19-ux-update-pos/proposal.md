## Why

The POS and inventory systems require database query optimization, elimination of blocking loading waterfalls, replacement of calendar short-polling with targeted event invalidation, deprecation of manual micro-locations in favor of macro-lab assignments with Køge defaults and Roskilde placeholder, and automated deterministic asset tagging (`[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]`).

## What Changes

- **Macro-Location Taxonomy**: Deprecate micro-locations (lockers/cabinets/shelves). Items are tracked strictly by Macro-Lab assignment:
  - **Makerspace (Køge)** — Global default facility.
  - **MediaLab (Køge)** — Audio/visual and rental gear facility.
  - **Roskilde** — Architectural placeholder for multi-campus rollout.
- **Automated Deterministic Asset Tagging**: Disable manual asset tag input in item creation. Implement auto-generation schema (`[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]`, e.g. `MK-3DP-0001`, `ML-CAM-0001`, `RK-AUD-0001`) with database-level uniqueness.
- **Performance & Short-Polling Elimination**: Eliminate redundant data-fetching loops and remove 1-second calendar polling. Fetch only on component mount and explicit mutation triggers.
- **Optimistic Checkout Flow & UI Fixes**: Rename checkout button to exactly **"Confirm checkout"**. Implement immediate optimistic cart clearing and state update with silent background sync, graceful rollback, and non-blocking toast notifications on error.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `inventory-location-management`: Macro-lab tracking (`Makerspace (Køge)`, `MediaLab (Køge)`, `Roskilde`), removal of micro-location inputs, and deterministic auto-generated asset tagging.
- `equipment-pos-dashboard`: "Confirm checkout" button label, elimination of short-polling loops, and optimistic checkout with error rollback.

## Impact

- **Database & Schema**: Update Labs to include `Makerspace (Køge)`, `MediaLab (Køge)`, and `Roskilde`.
- **Server Actions**: `app/actions/inventory.ts` (deterministic tag generator, macro-lab queries) and `app/actions/pos.ts` (optimistic transaction endpoints).
- **UI Components**: `components/pos/CheckoutCart.tsx`, `components/pos/EquipmentPOS.tsx`, `components/pos/LoanCalendar.tsx`, `components/inventory/InventoryManager.tsx`.
