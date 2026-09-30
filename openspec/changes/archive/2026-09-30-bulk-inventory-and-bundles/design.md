## Context

The Zealand Labs equipment checkout system currently operates under a 1-to-1 paradigm: every physical asset has a unique serialized barcode tag and exactly one active `Loan` record at a time. High-turnover small accessories (camera batteries, chargers, SD cards, USB-C cords) cannot be managed under individual tags without operational overhead. Additionally, primary equipment checkouts (such as cameras) routinely require companion accessories. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Provide a first-class `BULK` tracking mode for inventory pools alongside `SERIALIZED` equipment.
- Automatically generate standardized shared barcodes for bulk bins/drawers that scan seamlessly via existing barcode hardware.
- Model companion bundle presets linking parent equipment to bulk accessories with default quantities.
- Trigger non-intrusive bundle suggestion prompts in the POS when scanning primary gear.
- Support multi-quantity cart adjustments (+ / -) and soft stock level warnings without blocking checkouts.
- Allow clean partial returns for bulk loans (returning N of M units).

**Non-Goals:**
- Consumable write-offs: Bulk items in this scope are strictly returnable assets, not consumable materials like filament or tape.
- Student-facing self-service reservation carts: Loaning remains an admin POS workflow operated by lab staff.

## Decisions

### 1. Schema Representation for Tracking Types and Pools
Extend the Prisma `Inventory` model with:
- `trackingType`: Enum `TrackingType { SERIALIZED, BULK }` (default `SERIALIZED`).
- `totalQuantity`: Integer (default 1 for serialized, configurable for bulk).

*Rationale:* Rather than creating a separate table for bulk goods, keeping them within `Inventory` allows unified taxonomy tags, lab scoping, manuals, and search filters across all lab equipment.

### 2. Companion Bundles via `BundleItem` Join Model
Create a join table:
```prisma
model BundleItem {
  id                  String    @id @default(uuid())
  parentInventoryId   String
  accessoryInventoryId String
  defaultQuantity     Int       @default(1)

  parent    Inventory @relation("BundleParent", fields: [parentInventoryId], references: [id], onDelete: Cascade)
  accessory Inventory @relation("BundleAccessory", fields: [accessoryInventoryId], references: [id], onDelete: Cascade)

  @@unique([parentInventoryId, accessoryInventoryId])
}
```
*Rationale:* Explicit parent-accessory relations provide fine-grained default quantities per equipment model and cascade cleanly if an item is retired.

### 3. Loan Multi-Quantity and Partial Check-In
Extend `Loan` with:
- `quantity`: `Int @default(1)`
- `returnedQty`: `Int @default(0)`

*Rationale:* When a patron borrows 2 batteries, a single `Loan` record holds `quantity = 2`. When 1 battery is returned, `returnedQty` becomes 1 and status remains `ACTIVE` (or becomes `RETURNED` once `returnedQty == quantity`). Available inventory pool is dynamically calculated as:
$$\text{availableQuantity} = \text{totalQuantity} - \sum (\text{quantity} - \text{returnedQty})$$

### 4. Deterministic Automated Shared Barcode Generation
Re-use `generateAssetTag({ labSlug, tagSlug })` with an `ACC` or category code (e.g. `ML-ACC-0001` or `MK-ELC-0001`). All physical units of that accessory share this exact barcode printed on their storage bin or drawer.

### 5. POS UX: Bundle Trigger and Quantity Controls
- When a serialized item is scanned, the scanner checks if `bundleItems` are configured.
- If found, an animated recommendation drawer/banner slides into view offering "Add Kit (2x Battery, 1x Charger)" in a single tap.
- The cart item component detects `trackingType === "BULK"` and displays `[-] [Qty] [+]` steppers instead of a static quantity of 1.
- Scanning the same bulk barcode multiple times increments the cart quantity automatically.

## Risks / Trade-offs

- **[Risk] Existing Loan and Inventory records without quantity fields**
  → *Mitigation:* Safe database default values (`SERIALIZED`, `quantity: 1`, `returnedQty: 0`) ensure backward compatibility with all historical loans.
- **[Risk] Stock count drift due to human error at the desk**
  → *Mitigation:* Soft stock enforcement prevents the POS from blocking an admin if physical stock exists, and displays clear warning indicators when stock is at or below zero.
- **[Risk] Accidental double-scanning of bulk barcodes**
  → *Mitigation:* Scanning an already present bulk item increments quantity by 1 with a toast notification rather than creating duplicate error rows.
