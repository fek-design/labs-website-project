## Context

See `proposal.md` for motivation. Currently, `generateAssetTag` in `app/actions/inventory.ts` computes asset tags using `[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` (`MK-GEN-0001`). The Prisma schema includes a `location String?` field on `Inventory` that is currently not captured in `InventoryItemModal.tsx` or stored by `createInventoryItem` / `updateInventoryItem`. Technicians onboard items without an integrated barcode generator or print mechanism.

## Goals / Non-Goals

**Goals:**
- Update deterministic asset tag generation to a 4-tier schema: `[LOCATION]-[LAB]-[CATEGORY]-[4-DIGIT-SEQUENCE]` (e.g. `KG-MK-3DP-0001`).
- Surface a location zone selector in `InventoryItemModal.tsx` and persist the selected physical location to the database.
- Provide a zero-cloud Code 128 barcode rendering engine using pure SVG/Canvas.
- Embed a live barcode label card directly inside the item creation and edit popups.
- Support direct label printing (via browser print dialog with thermal sticker roll dimensions: 50×25mm and 60×30mm) and high-resolution PNG/SVG asset downloads.
- Ensure 100% backward compatibility for existing legacy asset tags (`MK-3DP-0001`, etc.).

**Non-Goals:**
- Cloud-based print server integrations or proprietary printer drivers (cups/lpr).
- Bulk printing queues across multiple items at once (scoped to single-item create/edit workflows).

## Decisions

### 1. 4-Tier Asset Tag Taxonomy Pattern
- **Decision**: Structure asset tags as `[LOCATION]-[LAB]-[CATEGORY]-[4-DIGIT-SEQUENCE]`.
  - Campus/Location: `køge` $\rightarrow$ `KG`, `roskilde` $\rightarrow$ `RO` (default `KG`).
  - Lab: `makerspace` $\rightarrow$ `MK`, `medialab` $\rightarrow$ `ML`.
  - Category: `3DP`, `LSR`, `TEX`, `CAM`, `AUD`, `LGT`, `VRX`, `ELC`, `GEN`, `ACC`.
  - Sequence: 4 digits (`0001` - `9999`) sequential within the matching prefix.
- **Alternatives Considered**: Keeping 3-tier and storing location only in DB text. Rejected because physical scanners and technicians benefit from having location instantly visible on the hardware tag.

### 2. Zero-Cloud Code 128 Barcode Rendering
- **Decision**: Implement a client-side Code 128 barcode generator (`components/inventory/InventoryBarcodeLabel.tsx`) using pure SVG rendering or a lightweight local library (e.g. `jsbarcode`).
- **Rationale**: Complies strictly with the "Zero Cloud Dependency" mandate. Code 128 is the universal 1D alphanumeric barcode standard supported natively by all handheld laser and 2D area imager scanners in the labs.

### 3. Print Label Layout & CSS Print Media Query
- **Decision**: Format the print output for standard thermal label rolls (50×25mm / 60×30mm) using dedicated CSS `@media print`.
  - Layout includes:
    1. Header: `ZEALAND LABS` + Campus/Lab
    2. Vector Barcode (Code 128)
    3. Human-readable Asset Tag (`KG-MK-3DP-0001`)
    4. Equipment Name & Placement Zone
- **Alternatives Considered**: Opening a separate PDF download. Rejected because direct browser print triggers immediately in one click with zero file management overhead.

### 4. Location Zone Presets with Custom Placement
- **Decision**: Provide standard zone presets based on lab (e.g. `Køge - Makerspace 3D Zone`, `Køge - Medialab Udlån`, `Køge - Laser Zone`) with an optional custom input for specific shelf/locker positioning.
- **Rationale**: Eliminates typos while allowing granular placement tracking.

## Risks / Trade-offs

- **[Risk: Legacy Asset Tag Compatibility]** Existing items in DB use `MK-` or `ML-` prefixes.
  $\rightarrow$ *Mitigation*: Scanner queries and POS search continue matching by exact tag or suffix; sequence counter checks both prefix formats without resetting counters.
- **[Risk: Browser Print Scaling Inconsistencies]** Different label printers have varying margins.
  $\rightarrow$ *Mitigation*: Use strict `mm` sizing (`@page { size: 60mm 30mm; margin: 0; }`) with flexible SVG auto-scaling to avoid truncation.
