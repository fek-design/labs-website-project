## Why

The current inventory barcode label component includes a thermal label roll size toggle (`60×30 mm` vs `50×25 mm`) and a direct browser print trigger (`handlePrintLabel` / "Udskriv label"). Direct browser printing to thermal label printers frequently encounters browser margin, page size, and print driver scaling inconsistencies, whereas administrators export high-resolution vector SVG or PNG assets directly into their dedicated thermal label software (such as Brother P-touch Editor, Dymo, Zebra Designer, or Phomemo). Removing the roll size selector and direct print trigger declutters the barcode label card, standardizes the vector SVG and 300 DPI PNG exports to a single crisp layout, and eliminates redundant printing code and roll-size state management.

## What Changes

- **Remove Size Selector**: Remove the `60×30 mm` and `50×25 mm` toggle buttons and `rollSize` state from `InventoryBarcodeLabel.tsx`.
- **Remove Direct Print Action**: Remove the "Udskriv label" print button and the underlying hidden iframe print handler (`handlePrintLabel`).
- **Standardize Barcode Asset Export**: Standardize the SVG and PNG generation logic to use a single canonical high-fidelity aspect ratio/dimensions, updating download filenames to `label-${assetTag}.svg` and `label-${assetTag}.png`.
- **Streamline Card Controls Bar**: Retain "Kopiér ID", "Hent SVG", and "Hent PNG" in the label action footer with clean alignment and high-contrast styling.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `inventory-location-management`: Update the barcode label export specifications under `Requirement: Streamlined Inventory Item Creation and Editing` to remove the direct print scenario and size selector requirement, standardizing on local vector SVG and high-resolution PNG asset downloads.

## Impact

- **Affected Code**: `components/inventory/InventoryBarcodeLabel.tsx`.
- **APIs / Dependencies**: No external API or dependency changes (JsBarcode remains used for local zero-cloud barcode generation; Phosphor icons `Printer` import can be removed).
- **Specs**: Delta spec for `inventory-location-management` modifying label export behavior.
