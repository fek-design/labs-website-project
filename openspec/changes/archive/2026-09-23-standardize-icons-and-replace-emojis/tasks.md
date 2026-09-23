## 1. POS and Front Desk Components

- [x] 1.1 Replace character glyphs and inline SVGs in `components/pos/ActiveLoansTable.tsx` with `@phosphor-icons/react` (`X`, `CaretDown`).
- [x] 1.2 Replace character glyphs and inline SVGs in `components/pos/CheckoutCart.tsx` with `@phosphor-icons/react` (`Check`, `ShoppingCart`, `Trash`, `X`).
- [x] 1.3 Replace emojis, character glyphs, and inline SVGs in `components/pos/EquipmentPOS.tsx` and `components/pos/LoanDetailModal.tsx` (`Buildings`, `PencilSimple`, `X`).
- [x] 1.4 Replace character glyphs and inline SVGs in `components/pos/OverdueInspector.tsx`, `components/pos/PatronCard.tsx`, and `components/pos/ScannerInput.tsx` (`Check`, `X`, `Barcode`).

## 2. Makerspace and Craft Components

- [x] 2.1 Replace emojis in `components/craft/CraftPrerequisites.tsx` with `@phosphor-icons/react` (`Warning`, `GraduationCap`).
- [x] 2.2 Replace character glyphs in `components/admin/CraftItemsManager.tsx` with `@phosphor-icons/react` (`X`, `Check`, `Plus`).
- [x] 2.3 Replace emojis and character glyphs in `components/makerspace/MakerspaceMachineHub.tsx` (`Books`, `Check`, `MagnifyingGlass`, `Buildings`, `Warning`, `BookBookmark`, `FileText`, `X`).
- [x] 2.4 Replace emojis and character glyphs in `components/makerspace/ManualsCatalogModal.tsx` (`Books`, `FileText`, `BookBookmark`, `Trash`, `X`, `Plus`).

## 3. Inventory and Settings Components

- [x] 3.1 Replace emojis and character glyphs in `components/inventory/InventoryManager.tsx` with `@phosphor-icons/react` (`Buildings`, `Check`, `PencilSimple`, `X`).
- [x] 3.2 Replace emojis and inline SVGs in `components/settings/NodeTelemetryVisualizer.tsx` with `@phosphor-icons/react` (`Lightning`).

## 4. Catalogue and Landing Components

- [x] 4.1 Replace inline SVGs with standard Phosphor icons in `components/catalogue/CatalogueFilterBar.tsx`, `components/catalogue/CatalogueCard.tsx`, and `components/catalogue/CatalogueGrid.tsx` (`MagnifyingGlass`, `CaretDown`, `Funnel`, `Tag`).
- [x] 4.2 Standardize icons in `components/landing/LandingHeader.tsx` and `components/landing/FirstTimeCampusGate.tsx`.

## 5. Verification and Accessibility Audit

- [x] 5.1 Run regex grep across `components/` and `app/` to ensure zero remaining Unicode emojis or naked character glyphs (`⚠️`, `🎓`, `🏛️`, `📚`, `🔍`, `📕`, `📄`, `🗑️`, `⚡`, `✓`, `✕`, `✎`).
- [x] 5.2 Validate that all decorative icons have `aria-hidden="true"` and icon-only buttons include `aria-label`.
- [x] 5.3 Execute `npm run lint` and `npm run build` to verify type safety and bundle integrity.
