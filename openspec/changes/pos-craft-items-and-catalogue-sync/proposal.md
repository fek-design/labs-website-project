## Why

The catalogue page currently suffers from an item-binding mismatch where prototypes fail to display due to a context property disconnect (`campus` vs `activeCampus`). Furthermore, administrators currently have no interface in the Point of Sale / Operational OS (`/admin`) to manage, curate, or create these prototype showcase entries ("blog / craft items") separately from physical loanable hardware inventory. Adding a dedicated "Crafts & Artikler" tab in the PoS allows staff to publish, update, and monitor student prototypes and tutorial articles, while ensuring the catalogue dynamically fetches and renders them across campuses.

## What Changes

- **PoS Craft / Blog Items Manager Tab**:
  - Adds a new master navigation tab `CRAFTS` ("Crafts & Artikler") to `app/admin/pos/AdminConsoleClient.tsx`.
  - Implements `components/admin/CraftItemsManager.tsx` giving lab technicians full CRUD capabilities over craft prototypes (title, slug, category, tags, campus availability, lab facilities, prerequisites, and machinery linkages).
- **Catalogue Grid Campus Reactivity & Fetching Fix**:
  - Fixes the context consumer in `components/catalogue/CatalogueGrid.tsx` to read `campus` correctly from `CampusContext`, ensuring items immediately resolve and render.
  - Connects dynamic loading so that both the public catalogue (`/katalog`) and detail pages (`/craft/[slug]`) dynamically pull from server actions with fallback to `CRAFT_CATALOG`.
- **Dynamic Server Action Layer**:
  - Implements `app/actions/crafts.ts` with secured server actions (`getCraftArticles`, `saveCraftArticle`, `deleteCraftArticle`) and audit logging.

## Capabilities

### New Capabilities
- `pos-craft-blog-management`: Covers administrative creation, editing, and curation of prototype craft items and tutorial articles in the PoS dashboard, and synchronization with the public catalogue.

### Modified Capabilities
<!-- None -->

## Impact

- **Admin Console**: `app/admin/pos/AdminConsoleClient.tsx`, new component `components/admin/CraftItemsManager.tsx`.
- **Server Actions**: New `app/actions/crafts.ts`.
- **Public Catalogue**: `components/catalogue/CatalogueGrid.tsx` and `lib/craft-data.ts`.
- **Database/Persistence**: Server-action file/DB store with seed fallback to `CRAFT_CATALOG`.
