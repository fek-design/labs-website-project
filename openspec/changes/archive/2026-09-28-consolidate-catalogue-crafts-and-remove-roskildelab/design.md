# Technical Design: Consolidate Catalogue & Crafts and Remove Roskilde Lab

## Context

See `proposal.md` for motivation. Currently, the administrative workspace (`/admin/pos`) exposes 8 tabs in the sidebar navigation dock. Two tabs (`CATALOGUE` and `CRAFTS`) manage the exact same underlying entity: craft articles and showcase guides (`CraftItemData` / `data/crafts.json` / Prisma crafts). Furthermore, `MAKERSPACE` (`MakerspaceMachineHub`) is redundant because static machines are already managed in `INVENTORY` (`InventoryManager.tsx`), which supports both `STATIC_MACHINE` and `BORROWABLE_GEAR`. Finally, `roskilde` appears in inventory types, filter options, and database seed scripts as an obsolete architectural placeholder, despite Zealand Labs having physical facilities only at Køge Campus (`MediaLab` and `Makerspace`).

## Goals / Non-Goals

**Goals:**
- Provide a single, unified `CATALOGUE` administration interface (`#FF9900` Amber accent) combining public showcase curation with full craft article authoring, step-by-step instructions, media uploads, and tool tagging.
- Streamline the navigation dock in `lib/admin-nav.ts` to exactly 6 canonical operational tabs:
  1. `FRONT_DESK` (`#FFED00` Yellow)
  2. `INVENTORY` (`#009FE3` Cyan)
  3. `CATALOGUE` (`#FF9900` Amber)
  4. `MANUALS` (`#E6007E` Pink)
  5. `HISTORY` (`#009FE3` Cyan)
  6. `SETTINGS` (`#FFED00` Yellow)
- Cleanly excise `MAKERSPACE` from the top-level admin sidebar without losing machine operational data in `InventoryManager`.
- Eliminate all references to `roskilde` in admin inventory filters, asset tag prefix generation, and database seeding scripts.

**Non-Goals:**
- Modifying public consumer routes (`/katalog` or `/katalog/[slug]`) beyond ensuring they continue to consume the consolidated craft data correctly.
- Removing public campus switching on the landing page if public demo content uses regional labels, but ensuring administrative infrastructure is strictly scoped to Køge facilities.

## Decisions

### 1. Merging Crafts Article Management into `CatalogueAdminManager.tsx`
- **Choice**: Enhance `components/catalogue/CatalogueAdminManager.tsx` with the comprehensive article editor modal (title, slug, difficulty, duration, steps with sub-bullets, materials, tools, image upload) from `CraftItemsManager.tsx`, alongside the existing Amber `#FF9900` canonical POS-style header, KPI metric ribbon, category filter strip, and quick showcase toggle (`toggleFeatureOnFrontpage`).
- **Rationale**: Operators get a single command center to author new student/technician guides AND immediately curate which projects appear on the public landing page hero and showcase sections.
- **Alternative Considered**: Keeping `CraftItemsManager` and renaming it to `CatalogueAdminManager`. *Rejected* because `CatalogueAdminManager` already follows the exact canonical POS header standard, Stack Sans typography hierarchy, and Amber `#FF9900` accent token.

### 2. Streamlining Admin Navigation Registry (`lib/admin-nav.ts`)
- **Choice**: Remove `MAKERSPACE` and `CRAFTS` from `AdminNavTabId` and `ADMIN_NAV_ITEMS`.
- **Rationale**: Machine tracking is native to `INVENTORY` (which categorizes `STATIC_MACHINE` vs `BORROWABLE_GEAR`), and crafts are now housed under `CATALOGUE`.
- **Resulting Dock Structure**:
  ```ts
  export type AdminNavTabId =
    | "FRONT_DESK"
    | "INVENTORY"
    | "CATALOGUE"
    | "MANUALS"
    | "HISTORY"
    | "SETTINGS";
  ```

### 3. Complete Removal of `roskilde` from Admin Inventory and Seeding
- **Choice**:
  - In `components/inventory/InventoryManager.tsx`: Update `activeLab` prop and `onSelectLab` types to `"medialab" | "makerspace"`, and remove `"roskilde"` from lab filter buttons and routing.
  - In `app/actions/inventory.ts`: Remove `roskilde: "RK"` from `LAB_PREFIX_MAP`.
  - In `prisma/seed.ts`: Remove `roskildeLab` and its sample static machine inventory, ensuring fresh seeds only generate `medialab` and `makerspace` under `Køge Campus`.
- **Rationale**: Zealand Labs physical operations occur solely in Køge. Retaining a dummy Roskilde lab caused confusion and generated fake inventory records.

## Risks / Trade-offs

- **[Risk] Existing DB records assigned to Roskilde**: If an existing local MySQL database contains items with `labId` pointing to the old Roskilde seed, deleting the seed definition might leave orphaned records.
  - *Mitigation*: Fallback query in `getInventoryWithFilters` already safely queries items by active lab slug, so existing Køge assets are unaffected. In `prisma/seed.ts`, clean migration is guaranteed.
- **[Risk] Code references to removed `AdminNavTabId` values**: If any component expects `MAKERSPACE` or `CRAFTS`, TypeScript could fail.
  - *Mitigation*: Run `npx tsc --noEmit` to verify all components and router branches cleanly conform to the 6-tab union.
