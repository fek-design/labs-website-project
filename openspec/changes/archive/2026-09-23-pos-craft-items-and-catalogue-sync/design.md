## Context

See `proposal.md` for motivation. Currently, the catalogue page at `/katalog` fails to display items due to a context property discrepancy (`activeCampus` vs. `campus` from `useCampus()`). Additionally, prototype items ("blog / craft items") only exist as static definitions in `lib/craft-data.ts`. Lab staff have no administrative dashboard in the PoS console (`/admin`) to create, update, or curate these guides, unlike physical inventory.

The user requested a dedicated tab in the PoS to keep track of these prototype / blog items and ensure the public catalogue dynamically fetches and displays them.

## Goals / Non-Goals

**Goals:**
- Fix the context binding bug in `components/catalogue/CatalogueGrid.tsx` so items immediately resolve and render for both Køge and Roskilde campuses.
- Add a new master navigation tab `CRAFTS` ("Crafts & Artikler") to the Admin PoS console (`app/admin/pos/AdminConsoleClient.tsx`).
- Build `components/admin/CraftItemsManager.tsx` allowing technicians to list, search, create, edit, and delete craft prototype guides.
- Implement server actions in `app/actions/crafts.ts` for craft persistence and audit logging.
- Provide a robust local data store in `data/crafts.json` seeded automatically from `CRAFT_CATALOG` for seamless local network operation with zero cloud dependency.
- Connect dynamic fetching so public pages (`/katalog` and `/craft/[slug]`) receive published updates.

**Non-Goals:**
- Conflating craft prototypes with physical barcode inventory (equipment loans remain isolated on the `INVENTORY` tab).
- Requiring cloud database migrations or external CMS services.

## Decisions

### 1. Dedicated Master Tab in PoS Console
- **Choice**: Add `{ id: "CRAFTS", label: "Crafts & Artikler" }` with Magenta `#E6007E` CMYK badge to `AdminConsoleClient.tsx`.
- **Rationale**: Separates operational equipment checkout (`INVENTORY`) from educational/makerspace tutorial guides (`CRAFTS`), preventing UI clutter and confusion.

### 2. Local Structured Data Store with Auto-Seed Fallback
- **Choice**: Store craft articles in `data/crafts.json` with fallback and auto-seed from `CRAFT_CATALOG` in `lib/craft-data.ts`.
- **Rationale**: Craft prototype articles have rich, nested structures (materials, prerequisites, machine parameters, inspiration items, manual references). A local JSON repository guarantees atomic local read/writes, persists across restarts, requires zero external cloud services, and never fails if the SQL engine is cold.

### 3. Server Actions & Audit Logging
- **Choice**: Implement `getCraftArticles()`, `saveCraftArticle(item)`, and `deleteCraftArticle(slug)` in `app/actions/crafts.ts`.
- **Rationale**: Enforces authentication via existing session/admin tokens and logs technician actions into the `AuditLog` table.

### 4. Catalogue Reactivity & Context Fix
- **Choice**: Update `CatalogueGrid.tsx` to read `const { campus } = useCampus()` and load articles from `getCraftArticles()`.
- **Rationale**: Fixes the blank state immediately while enabling dynamic updates as soon as an admin publishes an item in the PoS.

## Risks / Trade-offs

- **[Risk] Cold start without data file**:
  - **Mitigation**: `getCraftArticles()` verifies the existence of `data/crafts.json`; if missing, it automatically seeds the file with `CRAFT_CATALOG` entries.
- **[Risk] Campus desynchronization**:
  - **Mitigation**: `CatalogueGrid` dynamically filters items based on the active `campus` key from `CampusContext`.
