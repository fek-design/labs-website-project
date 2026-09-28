## 1. Navigation Registry & Console View Routing

- [x] 1.1 In `lib/admin-nav.ts`, add `MANUALS` (`#E6007E` Pink) and `CATALOGUE` (`#FF9900` Amber) to `AdminNavTabId` and `ADMIN_NAV_ITEMS`.
- [x] 1.2 In `app/admin/pos/AdminConsoleClient.tsx`, wire `MANUALS` and `CATALOGUE` tab conditions to render `ManualsManager` and `CatalogueAdminManager`.

## 2. Manuals Management View Implementation (Figma Node 86:4076)

- [x] 2.1 Create `components/manuals/ManualsManager.tsx` with canonical header (`LABS Manualer` with pink `#E6007E` accent, admin greeting, and live document/linked hardware KPI counters).
- [x] 2.2 In `ManualsManager.tsx`, build the search & scan toolbar with barcode placeholder and pink `#E6007E` "Tilføj" modal button.
- [x] 2.3 In `ManualsManager.tsx`, implement the filter bar (`Tilgængelige Manualer [Count]`, `LAB` dropdown, and `TYPE` dropdown).
- [x] 2.4 In `ManualsManager.tsx`, construct the responsive 3-column card grid (`Card` `#202021` border `#444444`) with PDF thumbnail preview, Stack Sans Notch title, file size & format metadata, asset tags, description, linked hardware list with "Se" trigger and "x" unlink button, and status pill.
- [x] 2.5 In `ManualsManager.tsx`, integrate PDF upload modal and quick hardware linking dropdown using `app/actions/manuals.ts`.

## 3. Catalogue Admin Panel Implementation

- [x] 3.1 Create `components/catalogue/CatalogueAdminManager.tsx` with canonical admin layout and distinct `#FF9900` amber accent styling.
- [x] 3.2 In `CatalogueAdminManager.tsx`, implement public catalogue item curation, category filters, and showcase toggles (`isFeaturedOnFrontpage`).

## 4. Admin Settings Error Resolution

- [x] 4.1 In `app/actions/settings.ts`, harden `getAdminProfile` to return ISO date strings and safe defaults.
- [x] 4.2 In `app/actions/settings.ts`, fix `updateAdminCredentials` to handle empty password submissions safely without failing validation, guard admin record identification, and wrap cache revalidation in a safe block.
- [x] 4.3 In `components/settings/AdminSettingsView.tsx`, ensure safe state synchronization on profile fetch and smooth feedback on update submission.

## 5. Verification & Validation

- [x] 5.1 Run TypeScript compiler validation (`npx tsc --noEmit`).
- [x] 5.2 Validate OpenSpec change (`openspec validate reskin-manuals-catalogue-admin-and-fix-settings`).
