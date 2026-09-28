## 1. Database Lab Standardization & Migration

- [x] 1.1 Update `prisma/seed.ts` and execute a database update migration to set lab names to `Makerspace (Køge)` and `MediaLab (Køge)`.
- [x] 1.2 Verify `getLabsList`, `generateAssetTag`, and `getPosStats` return clean data with the disambiguated campus lab names.

## 2. Admin Sidebar & Global Lab Switcher

- [x] 2.1 Update `components/admin/AdminSidebarNav.tsx` surface color from `#121214` to `#09090b` (Dock token) and right border `#262626`.
- [x] 2.2 Implement the prominent global Lab Switcher in `AdminSidebarNav` supporting both expanded and collapsed modes with campus subtext.
- [x] 2.3 Pass `activeLab` and `onSelectLab` from `app/admin/pos/AdminConsoleClient.tsx` into both `EquipmentPOS` and `InventoryManager`.

## 3. Canonical Header Standardization

- [x] 3.1 Refactor `components/inventory/InventoryManager.tsx` page header to match the canonical POS architecture: `LABS Inventar` in `Stack Sans Notch`, admin greeting, and top live KPI metric counters.
- [x] 3.2 Harmonize font classes and responsive wrapping (`flex-col xl:flex-row`) between POS and Inventory headers.

## 4. POS Bulk Checkout & Multi-Loan Streamlining

- [x] 4.1 Implement `returnMultipleLoans` in `app/actions/pos.ts` supporting atomic batch returns with audit logging.
- [x] 4.2 Update `components/pos/ActiveSessionPanel.tsx` to display an ongoing loans overview during checkout sessions and add a "Returnér alle lån" (Bulk Return) button in return mode.

## 5. Styleguide Rules & Final Validation

- [x] 5.1 Document project rules for the 3-tier Stack Sans typography hierarchy (`Notch`, `Headline`, `Text`) and canonical admin page header structure.
- [x] 5.2 Run TypeScript validation (`npx tsc --noEmit`) and OpenSpec validation (`openspec validate streamline-admin-pos-and-inventory`).
