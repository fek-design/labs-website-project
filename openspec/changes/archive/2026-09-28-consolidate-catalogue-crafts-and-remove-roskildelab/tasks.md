## 1. Navigation Registry & Console Route Consolidation

- [x] 1.1 In `lib/admin-nav.ts`, update `AdminNavTabId` and `ADMIN_NAV_ITEMS` to remove `MAKERSPACE` and `CRAFTS`, leaving the 6 canonical operational tabs: `FRONT_DESK`, `INVENTORY`, `CATALOGUE`, `MANUALS`, `HISTORY`, and `SETTINGS`.
- [x] 1.2 In `app/admin/pos/AdminConsoleClient.tsx`, remove rendering branches for `MAKERSPACE` and `CRAFTS`, and wire `CATALOGUE` to render the consolidated `CatalogueAdminManager`.

## 2. Consolidate Catalogue & Crafts Administration

- [x] 2.1 In `components/catalogue/CatalogueAdminManager.tsx`, integrate full craft project authoring and editing capabilities (title, slug, difficulty, duration, step-by-step instructions, materials, tools, and media upload).
- [x] 2.2 In `components/catalogue/CatalogueAdminManager.tsx`, retain and harmonize the Amber `#FF9900` canonical POS header, KPI metric ribbon, category and showcase filter strips, and quick front-page showcase toggle (`toggleFeatureOnFrontpage`).

## 3. Excise Roskilde Lab References

- [x] 3.1 In `components/inventory/InventoryManager.tsx`, update `activeLab` and `onSelectLab` types and handlers to strictly support `"medialab" | "makerspace"`, removing all `roskilde` filter branches.
- [x] 3.2 In `app/actions/inventory.ts`, remove `roskilde: "RK"` from `LAB_PREFIX_MAP` to ensure asset tag generation strictly applies to authentic facilities.
- [x] 3.3 In `prisma/seed.ts`, remove `roskildeLab` and its placeholder inventory seed data so only authentic Køge campus facilities are provisioned.

## 4. Verification & Validation

- [x] 4.1 Run TypeScript compiler validation (`npx tsc --noEmit`).
- [x] 4.2 Validate OpenSpec change (`openspec validate consolidate-catalogue-crafts-and-remove-roskildelab`).
