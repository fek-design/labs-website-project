# Proposal: Consolidate Catalogue & Crafts Admin and Remove Roskilde Lab

## Why

The administrative console currently contains duplicate and redundant navigation sections:
1. A separate "Katalog" (`CATALOGUE`) view and "Håndværk" (`CRAFTS`) view exist independently when they represent the same underlying domain entity (craft articles and public showcase curation).
2. A legacy "Makerspace Maskiner" (`MAKERSPACE`) tab remains in the navigation dock even though static machine tracking has already been consolidated into the unified hardware inventory (`INVENTORY`).
3. An obsolete, non-existent `roskilde` lab placeholder persists in inventory filters, asset tagging logic, and database seeding, confusing campus operators since Zealand Labs facilities exist exclusively at Køge Campus (`medialab` and `makerspace`).

Consolidating these sections streamlines the administrative navigation dock, eliminates redundant editors, and ensures strict adherence to the real-world Zealand Labs facility footprint.

## What Changes

- **Consolidate Catalogue & Crafts**: Merge `CraftItemsManager` and `CatalogueAdminManager` into a single, unified admin panel (e.g. `CatalogueAdminManager` / `CraftItemsManager`) under the `CATALOGUE` tab (`#FF9900` Amber accent). This gives operators a single interface to create/edit craft guides, manage steps/materials, and curate showcase visibility on the public front page.
- **Remove Redundant "Maskiner" Navigation**: Remove `MAKERSPACE` (`MakerspaceMachineHub`) as a standalone top-level sidebar tab in `lib/admin-nav.ts` and `app/admin/pos/AdminConsoleClient.tsx`. All machine status tracking is already unified within `INVENTORY`.
- **Remove Non-Existent `roskilde` Lab**:
  - Remove `roskilde` from inventory lab filter selections and lab routing in `components/inventory/InventoryManager.tsx`.
  - Remove `roskilde: "RK"` prefix mapping and reference in `app/actions/inventory.ts`.
  - Clean up `roskildeLab` placeholder from `prisma/seed.ts` and any seed scripts so only authentic Køge facilities (`medialab`, `makerspace`) are provisioned.
- **Update Navigation Registry**: Clean up `ADMIN_NAV_ITEMS` in `lib/admin-nav.ts` to reflect the streamlined set of active tabs (`FRONT_DESK`, `INVENTORY`, `CATALOGUE`, `MANUALS`, `HISTORY`, `SETTINGS`).

## Capabilities

### Modified Capabilities
- `admin-catalogue-management`: Consolidate the crafts article editor, step workflow, and media management with public showcase curation and featured toggles into a single unified catalogue administration screen.
- `admin-navigation-and-dashboard`: Remove the redundant `MAKERSPACE` tab and merge `CRAFTS` into `CATALOGUE`, providing a focused 6-tab navigation dock.
- `inventory-location-management`: Remove `roskilde` lab options and asset prefix mappings, limiting inventory operations strictly to Køge Campus facilities (`MediaLab` and `Makerspace`).

## Impact

- **UI Components**:
  - `lib/admin-nav.ts`: Update `AdminNavTabId` and `ADMIN_NAV_ITEMS` (remove `MAKERSPACE` and `CRAFTS`; maintain `CATALOGUE` with `#FF9900` Amber).
  - `app/admin/pos/AdminConsoleClient.tsx`: Remove redundant tab conditionals for `MAKERSPACE` and `CRAFTS`.
  - `components/catalogue/CatalogueAdminManager.tsx`: Absorb the full craft authoring, step-by-step editing, and media upload features from `CraftItemsManager.tsx`.
  - `components/inventory/InventoryManager.tsx`: Remove `roskilde` from lab type unions and tab switchers.
- **Server Actions & Database**:
  - `app/actions/inventory.ts`: Remove `roskilde` from `LAB_PREFIX_MAP`.
  - `prisma/seed.ts`: Remove `roskildeLab` seed placeholder.
