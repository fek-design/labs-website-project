## Why

Small accessories and accessories like batteries, chargers, SD cards, and cables are plentiful and impractical to track with individual unique serial numbers. Lab operators need the ability to maintain bulk quantity pools under shared automated barcodes, borrow them flexibly as standalone accessories or as bundled companion kits when checking out primary gear like cameras, and track partial returns cleanly.

## What Changes

- **Bulk Inventory Archetype**: Support `BULK` tracking alongside `SERIALIZED` in the inventory system, with configurable pool stock (`totalQuantity`) and non-limiting stock counters (`availableQuantity`).
- **Automated Shared Barcodes**: Generate deterministic shared barcodes for bulk pools (e.g. `ML-ACC-0001` or `MK-BAT-0001`) that can be scanned using existing barcode scanners or desk cheat-sheets.
- **Default Bundle Presets**: Allow inventory items (such as cameras or audio recorders) to define linked bundle accessories (e.g., 2x batteries + 1x charger) in admin inventory management.
- **POS Bundle Detection & Quick Add**: When scanning a bundled serialized asset at the POS desk, present an intelligent kit prompt allowing operators to add recommended companion accessories in one click or customize quantities.
- **Multi-Quantity Loans & Partial Returns**: Update the loan model and check-in engine to support quantities (`quantity` and `returnedQty`), allowing patrons to return subsets of loaned bulk items while keeping remaining items active.

## Capabilities

### New Capabilities
- `bulk-inventory-and-bundles`: Manages bulk inventory pool definitions, automated shared asset tag generation, quantity stock levels, and parent-accessory kit/bundle relationships.

### Modified Capabilities
- `equipment-pos-dashboard`: Enhances POS checkout and return workflows with multi-quantity cart line items, bundle suggestion prompts upon scanning serialized gear, soft stock level warnings, and quantity-aware check-in/return checklists.

## Impact

- **Database Schema**: Extends `Inventory` with tracking mode (`SERIALIZED` | `BULK`) and stock quantity; adds bundle link relation (`BundleItem`); extends `Loan` with `quantity` and `returnedQty`.
- **Server Actions**: Updates `app/actions/inventory.ts` (bulk item creation, bundle presets) and `app/actions/pos.ts` (checkoutEquipment, returnEquipment with quantity handling, soft stock checks).
- **UI Components**:
  - `components/inventory/*`: Inventory item modal (bulk toggle, stock count, bundle editor) and list/grid indicators.
  - `components/pos/*`: `CheckoutCart` (quantity steppers, bulk badge), `EquipmentPOS` (bundle suggestion prompt), `ActiveSessionPanel` / `ActiveLoansTable` (quantity check-in).
