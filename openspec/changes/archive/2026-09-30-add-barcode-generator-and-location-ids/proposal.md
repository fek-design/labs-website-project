## Why

Technicians and lab managers currently have to manually generate, cross-reference, and print physical barcodes for equipment using external tools, which slows down onboarding and asset labeling. Furthermore, the auto-generated asset tags do not encode the physical campus/facility location (`KG` for Køge, etc.), making it harder to track and audit items across labs at a glance.

Embedding a zero-cloud Code 128 barcode generator directly inside the item creation and edit cards—paired with direct sticker label printing and PNG/SVG download—along with updating the asset tag taxonomy to incorporate physical campus/location (`[LOCATION]-[LAB]-[CATEGORY]-[SEQUENCE]`), completely streamlines the physical onboarding workflow.

## What Changes

- **4-Tier Asset Tag Taxonomy**: Update `generateAssetTag` and `Inventory` tagging to follow `[LOCATION]-[LAB]-[CATEGORY]-[4-DIGIT-SEQUENCE]` (e.g., `KG-MK-3DP-0001`, `KG-ML-CAM-0045`), prepending the location/campus prefix while maintaining full backward compatibility for existing legacy items.
- **Physical Location Selection & Database Persistence**: Add a physical location selector (e.g., `Køge - Makerspace 3D Zone`, `Køge - Medialab Udlån`) to `InventoryItemModal.tsx` and persist the `location` field via `createInventoryItem` and `updateInventoryItem` server actions into the Prisma database.
- **Zero-Cloud Code 128 Barcode Generator**: Implement an offline, client-side Code 128 barcode rendering component that dynamically visualizes the item's asset tag in real-time within both Create and Edit modals.
- **Direct Label Printing & Asset Tag Export**: Provide direct sticker label printing (optimized for 50×25mm and 60×30mm thermal label sheets via CSS `@media print`) including the Zealand Labs brand header, barcode, readable tag, and equipment name, plus instant one-click PNG and SVG asset downloads.

## Capabilities

### New Capabilities
<!-- No brand-new top-level capability needed; builds on inventory-location-management -->

### Modified Capabilities
- `inventory-location-management`: Updates `Requirement: Streamlined Inventory Item Creation and Editing` to adopt the 4-tier location-aware asset tag pattern (`[LOCATION]-[LAB]-[CATEGORY]-[SEQUENCE]`), persist physical location metadata, render real-time Code 128 barcodes, and provide direct sticker printing and graphic download actions.

## Impact

- **Database**: Populates the existing `location` column in `Inventory` model in Prisma.
- **Server Actions**: `app/actions/inventory.ts` (`generateAssetTag`, `createInventoryItem`, `updateInventoryItem`).
- **UI Components**: `components/inventory/InventoryItemModal.tsx`, `components/inventory/InventoryBarcodeLabel.tsx` (new local label generator/print component).
- **Dependencies**: Zero external cloud services; local pure-SVG/canvas Code 128 encoder (`jsbarcode` or lightweight local Code 128 generator).
