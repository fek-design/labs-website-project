## 1. Remove Roll Size Selector and State

- [x] 1.1 Remove `LabelRollSize` type export and `rollSize` state hook from `components/inventory/InventoryBarcodeLabel.tsx`
- [x] 1.2 Remove the roll size switcher pill buttons (`60×30 mm` and `50×25 mm`) from the header bar of `InventoryBarcodeLabel.tsx`

## 2. Remove Direct Print Trigger and Associated Logic

- [x] 2.1 Remove `handlePrintLabel` function, iframe creation, and print stylesheet generation from `components/inventory/InventoryBarcodeLabel.tsx`
- [x] 2.2 Remove the "Udskriv label" button from the action footer
- [x] 2.3 Remove unused `Printer` icon import from `@phosphor-icons/react`

## 3. Standardize Vector SVG & High-Resolution PNG Exports

- [x] 3.1 Update `generateStickerSvgString` to use a constant 600×300 canvas size (2:1 aspect ratio) with fixed typography and positioning
- [x] 3.2 Update `handleDownloadSvg` to save as `label-${assetTag}.svg`
- [x] 3.3 Update `handleDownloadPng` to export at 1200×600 (300 DPI) and save as `label-${assetTag}.png`

## 4. UI Refinement and Verification

- [x] 4.1 Verify layout alignment of the action bar containing "Kopiér ID", "Hent SVG", and "Hent PNG"
- [x] 4.2 Verify component renders without console warnings or compilation errors in `npm run dev`
