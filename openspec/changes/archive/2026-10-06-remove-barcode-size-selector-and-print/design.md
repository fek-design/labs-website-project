## Context

The inventory barcode generation system (`InventoryBarcodeLabel.tsx`) previously incorporated multiple thermal sticker roll dimensions (`60×30 mm` and `50×25 mm`) through a pill toggle, alongside a direct iframe-based browser print action (`handlePrintLabel`).

In practice, printing directly through browser dialogs to thermal label printers (e.g., Brother, Dymo, Zebra) suffers from platform-specific margins, orientation distortion, and driver DPI scaling artifacts. In contrast, lab technicians and administrators import clean vector SVG or 300 DPI PNG graphics directly into native thermal label design and print utilities.

See `proposal.md` and `specs/inventory-location-management/spec.md`.

## Goals / Non-Goals

**Goals:**
- Eliminate the roll size state (`rollSize`) and size switcher pills from `InventoryBarcodeLabel.tsx`.
- Remove the direct print handler (`handlePrintLabel`), hidden print iframe generation, print stylesheet styles, and "Udskriv label" button.
- Clean up unused imports (e.g., `Printer` icon from `@phosphor-icons/react`, `LabelRollSize` type).
- Standardize vector SVG export (`viewBox="0 0 600 300"`, width 600, height 300) and high-resolution PNG export (300 DPI, 1200×600) to a single crisp layout.
- Clean up export filenames to standard `label-${assetTag}.svg` and `label-${assetTag}.png`.
- Preserve the live zero-cloud Code 128 preview, copyable asset tag ID button, and high-contrast dark card aesthetics.

**Non-Goals:**
- Modifying barcode generation algorithms or replacing `JsBarcode`.
- Modifying deterministic asset tag generation or database schemas.
- Adding third-party external printing drivers or cloud printing integrations.

## Decisions

### Decision 1: Standardize Canvas & Vector Dimensions to 600×300 (2:1 Ratio)
- **Rationale**: 600×300 (or 2:1 aspect ratio) aligns with standard 60×30 mm and 50×25 mm physical sticker proportions. When rendered into an SVG or scaled to 1200×600 in 300 DPI canvas export, it scales down or up losslessly in label software without cropping or distortion.
- **Alternatives Considered**: Keeping a prop-based dimension selector. Rejected because administrators prefer a single canonical high-res export that their printer software scales automatically.

### Decision 2: Pure Asset Export Focus (Remove Browser Print Iframe)
- **Rationale**: Removing `iframe` creation, style injection, and `window.print()` simplifies client code, eliminates cross-browser print styling inconsistencies, and prevents browser focus hijacking.
- **Alternatives Considered**: Attempting WebUSB / ESC/POS thermal printing. Rejected due to security requirements, hardware vendor fragmentation, and strict zero-cloud/zero-native driver footprint.

## Risks / Trade-offs

- **[Risk]** Existing users might look for the "Udskriv label" button in the modal.
  → **Mitigation**: "Hent SVG" and "Hent PNG" remain prominently available as clean cyan/zinc action pills in the action bar, clearly communicating that files can be opened or dragged directly into label printing software.
