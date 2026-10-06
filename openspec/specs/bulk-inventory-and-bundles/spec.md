# bulk-inventory-and-bundles Specification

## Purpose

Enables tracking of high-volume gear and accessories through quantity-based inventory pools with shared automated barcodes, alongside configuration of parent-companion bundle presets.

## Requirements

### Requirement: Bulk Inventory Pool Definition
The system SHALL support a `trackingType` attribute on inventory items (`SERIALIZED` vs `BULK`). When set to `BULK`, the item SHALL require a total quantity pool (`totalQuantity`), maintain an automatically generated shared asset barcode, and dynamically calculate available stock as `totalQuantity` minus active unreturned loans.

#### Scenario: Creating a bulk accessory pool
- **WHEN** an administrator creates an inventory item with `trackingType` set to `BULK` and a `totalQuantity` of 20
- **THEN** the system generates an automated shared barcode tag (e.g. `ML-ACC-0001`), initializes the pool, and computes `availableQuantity` as 20

#### Scenario: Soft stock limit warning during checkout
- **WHEN** a bulk item has an `availableQuantity` of 0 or less and an administrator adds it to the checkout cart
- **THEN** the system displays a non-blocking visual warning indicating zero recorded stock while permitting the administrator to proceed with checkout

### Requirement: Automated Shared Barcode Generation
The system SHALL generate deterministic, human-readable asset barcodes for bulk pools following the lab and category prefix pattern (`[LAB]-[CATEGORY]-[SEQUENCE]`), and allow printing or displaying bin labels that can be scanned identically to serialized barcodes.

#### Scenario: Barcode scan resolution for bulk items
- **WHEN** an administrator scans a shared bulk barcode at the POS terminal
- **THEN** the system resolves the barcode to the single bulk inventory definition and appends it to the active cart with an initial quantity of 1

### Requirement: Companion Bundle Presets
The system SHALL support creating standalone Bundle Presets independently of any single inventory item, containing reusable configurations of companion bulk or serialized accessories with default checkout quantities. The system SHALL allow associating one or more Bundle Presets with multiple parent equipment/machines via a many-to-many relationship, removing repeated bundle configurations across identical or similar machines.

#### Scenario: Defining bundle presets in inventory editor
- **WHEN** an administrator accesses the bundle presets manager
- **THEN** the system allows creating or editing a named bundle preset (e.g. "Sony A7 Video Kit" with 2x NP-FZ100 batteries and 1x Dual Charger) independent of any specific machine

#### Scenario: Assigning a bundle preset to multiple machines
- **WHEN** an administrator edits an equipment item (e.g. Sony A7 IV #1 or Sony A7 IV #2)
- **THEN** the system allows selecting and associating the existing "Sony A7 Video Kit" bundle preset to the machine without re-specifying individual accessory items

#### Scenario: Scanning gear with assigned bundle preset in POS
- **WHEN** an administrator scans an equipment item associated with one or more bundle presets
- **THEN** the system displays the companion bundle recommendation prompt containing the aggregated accessories and quantities from all assigned presets

#### Scenario: Standalone borrowing of bundle items
- **WHEN** a patron requests to borrow only an accessory that is configured in a bundle preset without borrowing the parent item
- **THEN** the system permits checking out the accessory as an independent loan without requiring the parent item to be present in the cart
