## 1. Brand Neutral Color Palette Tokens

- [x] 1.1 Define brand neutral `--color-zinc-*` variables in `app/globals.css` under `@theme` matching Zealand Labs dark-neutrals (`#09090b`, `#0e0e11`, `#151517`, `#202021`, `#262626`, `#333333`, `#444444`, and calibrated text tones).
- [x] 1.2 Confirm strict preservation of CMYK telemetry accent tokens (`--color-brand-yellow: #FFED00`, `--color-brand-pink: #E6007E`, `--color-brand-cyan: #009FE3`) and verify visual contrast across all surface layers.

## 2. Server Action & Data Mapping

- [x] 2.1 Update `createInventoryItem` and `updateInventoryItem` in `app/actions/inventory.ts` to accept `purchaseDate` in the item input payload.
- [x] 2.2 Parse `purchaseDate` as a valid Date or null and persist to `prisma.inventory.create` and `prisma.inventory.update`.
- [x] 2.3 Verify `getInventoryItems` queries return `purchaseDate` for catalog consumers.

## 3. Inventory Item Modal Acquisition Date Input

- [x] 3.1 Add `purchaseDate` field to `InventoryItemModal.tsx` form state, initializing from `item.purchaseDate`.
- [x] 3.2 Render labeled "Anskaffelsesdato" input slot in the item metadata/specs grid with date picker formatting and reset button.
- [x] 3.3 Ensure saving the item sends `purchaseDate` directly in the action payload and clears any residual customFields references.

## 4. Inventory List & Grid Views Display

- [x] 4.1 Update `InventoryListView.tsx` to include an "Anskaffet" (Acquisition date) column or metadata badge with Danish locale formatting.
- [x] 4.2 Update `InventoryGridView.tsx` to display acquisition date alongside barcode and category metadata if populated.

## 5. Verification & Typechecking

- [x] 5.1 Run Next.js typecheck (`npx tsc --noEmit`) to verify zero type regressions across actions and components.
- [x] 5.2 Validate UI visual rendering in browser to confirm brand neutral surfaces and acquisition date UX.
