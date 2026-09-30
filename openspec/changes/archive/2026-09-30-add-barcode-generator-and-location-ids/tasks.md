## 1. 4-Tier Asset Tag & Location Server Actions

- [x] 1.1 Update `generateAssetTag` in `app/actions/inventory.ts` to generate 4-tier asset tags `[LOCATION]-[LAB]-[CATEGORY]-[SEQUENCE]` (e.g. `KG-MK-3DP-0001`), supporting location prefix mapping (Køge $\rightarrow$ `KG`, Roskilde $\rightarrow$ `RO`).
- [x] 1.2 Update `createInventoryItem` and `updateInventoryItem` server actions in `app/actions/inventory.ts` to accept, persist, and audit the physical `location` field in the database.
- [x] 1.3 Ensure inventory queries in `app/actions/inventory.ts` select `location` and maintain full backward compatibility for legacy `MK-` and `ML-` tags.

## 2. Zero-Cloud Code 128 Barcode & Label Engine

- [x] 2.1 Create `components/inventory/InventoryBarcodeLabel.tsx` rendering a high-density, zero-cloud Code 128 barcode matching the active asset tag, equipment title, and location.
- [x] 2.2 Add direct PNG and vector SVG download actions in `InventoryBarcodeLabel.tsx` for sticker design and label printer software.
- [x] 2.3 Implement standard thermal sticker print stylesheet (`@media print`) formatted for standard 50×25mm and 60×30mm label rolls.

## 3. Inventory Modal UI Integration

- [x] 3.1 Add physical location selector (with lab zone presets like 3D Zone, Laser Zone, Udlån, plus custom input) and live barcode preview to `InventoryItemModal.tsx` in Create mode.
- [x] 3.2 Embed `InventoryBarcodeLabel` with "Udskriv label" and "Hent Barcode" triggers in `InventoryItemModal.tsx` in Edit mode.
- [x] 3.3 Align geometry and typography to project design rules (`#202021` card, `#151517` inputs, `Stack Sans Notch` headers, and brand accents).

## 4. Verification & Polish

- [x] 4.1 Run TypeScript typecheck (`npx tsc --noEmit`) to verify zero type regressions.
- [x] 4.2 Verify end-to-end barcode generation, PNG/SVG download, physical print preview, and database persistence in both create and edit flows.
