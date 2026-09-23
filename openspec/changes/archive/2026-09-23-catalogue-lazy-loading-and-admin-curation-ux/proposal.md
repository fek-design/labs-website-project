## Why

Currently, all catalogue cards on `/katalog` are rendered at once, which degrades performance and scroll fluidity as the inventory grows. Additionally, the admin interface relies on arbitrary free-text inputs for categories and raw filesystem paths for images. Free-text categories lead to fragmentation and administrative bloat (different spelling, duplicates, fluffy names), while manual file path inputs create high friction and failure points for both tech-literate and non-technical staff. A streamlined infinite scroll and a controlled, frictionless curation experience are needed.

## What Changes

- **Progressive / Lazy Loading of Catalogue Cards**:
  - Implements seamless, scroll-driven batch loading (`IntersectionObserver` threshold) in `components/catalogue/CatalogueGrid.tsx`.
  - Initial view renders an optimal first batch (e.g. 6–8 items) and seamlessly appends remaining matching cards as the user scrolls, with zero layout stutter or interruption.
- **Strict, Curated Taxonomy (Anti-Bloat Strategy)**:
  - Replaces free-text category input with a closed, standardized set of Zealand Labs disciplines (`Tekstil & Beklædning`, `3D Print & Prototyping`, `Laserskæring & CNC`, `Print & Storformat`, `Vinyl & Skilte`, `Elektronik & IoT`, `Keramik & Sublimation`).
  - Standardizes tag selection with quick-select preset tag chips and controlled entry to eliminate spelling fragmentation.
- **Frictionless Asset Upload & Visual Asset Picker**:
  - Eliminates manual image path string typing in `components/admin/CraftItemsManager.tsx`.
  - Implements an image upload dropzone via server action (`uploadCraftImage`) that automatically saves local images to `/public/images/craft/` with generated safe filenames.
  - Adds a visual "Asset Library Picker" popup allowing technicians to select from existing repository photos with a single click.

## Capabilities

### New Capabilities
- `catalogue-lazy-loading-and-curation`: Covers seamless scroll-triggered lazy loading on `/katalog`, locked taxonomy controls, and the drag-and-drop / visual asset picker in the PoS.

### Modified Capabilities
<!-- None -->

## Impact

- **Public Catalogue**: `components/catalogue/CatalogueGrid.tsx` (scroll observer, progressive batches).
- **Admin PoS**: `components/admin/CraftItemsManager.tsx` (locked category dropdown, tag pills, file upload / asset picker modal).
- **Server Actions**: `app/actions/crafts.ts` (adds `uploadCraftImage`, `getAvailableCraftAssets`).
- **Data & Types**: `lib/craft-data.ts` (exports `CRAFT_CATEGORIES` and `STANDARD_CRAFT_TAGS`).
