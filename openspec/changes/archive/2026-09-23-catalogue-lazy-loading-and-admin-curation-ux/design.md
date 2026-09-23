## Context

See `proposal.md` for motivation. On `/katalog`, loading all prototype cards simultaneously hurts rendering performance as inventory increases. In the admin console, free-text inputs for categories create taxonomic bloat, and manual image path typing creates severe usability hurdles for lab staff.

This design introduces client-side progressive scroll loading, a strict category enum, preset tag chips, and a dual-mode asset management system (direct file upload + visual asset library picker).

## Goals / Non-Goals

**Goals:**
- Implement seamless progressive loading in `components/catalogue/CatalogueGrid.tsx` using an `IntersectionObserver` sentinel (initial batch: 8 items, loading in chunks of 4–6).
- Define canonical, non-fluffy lab disciplines in `lib/craft-data.ts` (`CANONICAL_CRAFT_CATEGORIES`) and enforce them via a locked select dropdown in `components/admin/CraftItemsManager.tsx`.
- Provide curated tag quick-picks (`STANDARD_CRAFT_TAGS`) with toggleable badge chips.
- Add an automated local file upload pipeline (`app/actions/crafts.ts` -> `uploadCraftImage`) that saves images to `/public/images/craft/`.
- Provide a visual "Asset Library Picker" popup modal in `CraftItemsManager.tsx` that displays all available local lab photos for instant 1-click selection.

**Non-Goals:**
- External S3/Cloudinary storage (must maintain strict Zero Cloud Dependency).
- Complex multi-page server pagination URLs; progressive chunking on the client provides instant, fluid filtering with no navigation stutter.

## Decisions

### 1. Progressive Scroll Loading Strategy
- **Choice**: In `CatalogueGrid.tsx`, maintain `visibleCount` state (initial: 8). Place an invisible Sentinel element at the bottom of the grid observed by an `IntersectionObserver` with `rootMargin: "300px"`.
- **Rationale**: When the user scrolls within 300px of the grid's bottom, `visibleCount` seamlessly increases by 6. This eliminates initial DOM weight while delivering an uninterrupted infinite-scroll experience.

### 2. Locked Taxonomic Discipline Categories
- **Choice**: Enforce a strict enum in `lib/craft-data.ts`:
  ```typescript
  export const CANONICAL_CRAFT_CATEGORIES = [
    "Tekstil & Beklædning",
    "3D Print & Prototyping",
    "Laserskæring & CNC",
    "Print & Storformat",
    "Vinyl & Skilte",
    "Elektronik & IoT",
    "Keramik & Sublimation",
  ] as const;
  ```
- **Rationale**: Prevents arbitrary synonyms like "beklædning", "t-shirts", "merch", keeping filter tabs clean, predictable, and professional.

### 3. File Upload & Visual Asset Library Picker
- **Choice**:
  1. **Upload Action**: Server action `uploadCraftImage(formData)` validates file type, sanitizes filenames, writes directly to `public/images/craft/`, and returns the local public URL.
  2. **Visual Asset Picker**: A modal displaying local images in `public/images/craft/` and `public/images/landing/`. Lab technicians can click any thumbnail to select it immediately, completely bypassing manual path input.

## Risks / Trade-offs

- **[Risk] Legacy category mismatch in existing data**:
  - **Mitigation**: Update `data/crafts.json` and `lib/craft-data.ts` items to conform to `CANONICAL_CRAFT_CATEGORIES`. Add a normalizer so legacy names map cleanly to canonical counterparts.
- **[Risk] High-resolution image uploads slowing the local disk**:
  - **Mitigation**: Enforce client/server file size limit (e.g. 10MB) and accept standard image formats (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`).
