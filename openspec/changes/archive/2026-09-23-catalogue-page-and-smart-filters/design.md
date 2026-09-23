## Context

See `proposal.md` for motivation. Currently, prototype items are showcased in `components/landing/PrototypeCarousel.tsx` and have individual detail pages under `app/craft/[slug]/page.tsx`. However, there is no top-level catalogue route where students can browse all available activities, physical machines, and prototypes.

Figma node `144:335` defines the layout and styling for "Labs - Katalog - SPECIFIC". The page needs to reside at `/katalog`, integrate seamlessly with `CampusContext` (`køge` vs. `roskilde`), feature thoughtful QOL filtering (without UI bloat), and use an extensible, scalable tagging schema in `lib/craft-data.ts`.

## Goals / Non-Goals

**Goals:**
- Deliver a dedicated `/katalog` page at `app/katalog/page.tsx` adhering to Figma frame `144:335`.
- Ensure catalogue contents reactively respect the user's selected campus (`CampusContext`).
- Implement streamlined, purposeful QOL filters: free-text search (`Søg...`), contextual Lab tabs (`Alle`, `Makerspace`, `Medialab`, `Dimselab`), and discipline category pills (`Tekstil`, `3D Print`, `Skæring`, etc.).
- Establish a future-proof, scalable data schema in `lib/craft-data.ts` with typed taxonomy tags, campus availability arrays, and lab associations.
- Support dynamic item discovery: adding new items to `lib/craft-data.ts` automatically updates both the catalogue grid and dynamic route `/craft/[slug]`.
- Maintain strict "Zero Cloud Dependency" by serving all imagery and data locally.

**Non-Goals:**
- Creating a complex multi-facet SQL filter engine; catalogue items are managed cleanly in-memory/static data via `lib/craft-data.ts` with O(1)/O(N) client-side filtering.
- Altering the user authentication boundary (remains admin-only, zero student accounts).
- Modifying the existing detail view logic in `app/craft/[slug]/page.tsx` beyond ensuring compatibility with expanded catalog entries.

## Decisions

### 1. Route Placement & Shell Architecture
- **Choice**: Implement the catalogue route at `app/katalog/page.tsx`.
- **Rationale**: The 6th card in `PrototypeCarousel.tsx` already links to `/katalog`, and "Katalog" is the canonical Danish terminology in the Figma mockups.
- **Component Hierarchy**:
  - `app/katalog/page.tsx`: Page shell with `LandingHeader`, Catalogue hero and search, filter bar, responsive item grid, `<MarqueeRibbon />`, and `LandingFooter`.
  - `components/catalogue/CatalogueGrid.tsx`: Interactive client component handling search queries, active filter state, and item grid rendering.
  - `components/catalogue/CatalogueCard.tsx`: Sharp Scandinavian card component matching frame `144:335` specifications.

### 2. Streamlined QOL Filters (Anti-Bloat Strategy)
- **Choice**: Exactly 3 intuitive filtering dimensions:
  1. **Instant Search Input (`Søg...`)**: Debounced real-time match against item title, category, tags, and processes.
  2. **Campus-Aware Lab Tabs**: `Alle`, `Makerspace`, `Medialab`, and `Dimselab` (automatically showing only labs present at the active campus, or indicating campus exclusivity).
  3. **Category Pill Bar**: Single-select category filter (`Alle`, `Beklædning & Merch`, `3D Print`, `Skæring`, `Print & Grafik`, `Elektronik`).
- **Affordances**:
  - Active item count indicator (e.g. "Viser 5 af 7 projekter").
  - Fast reset button ("Nulstil filtre") that restores the initial campus-wide view.
  - Clean zero-results fallback card with a reset action.

### 3. Future-Proof Tagging & Taxonomy Architecture in `lib/craft-data.ts`
- **Choice**: Extend `CraftItemData` interface with structured taxonomy fields:
  ```typescript
  export interface CraftItemData {
    slug: string;
    title: string;
    category: string;
    tags: string[]; // e.g. ["tekstil", "merch", "folie", "varmeoverførsel"]
    campuses: ("køge" | "roskilde")[];
    labs: ("makerspace" | "medialab" | "dimselab")[];
    heroImage: string;
    thumbnailImage?: string;
    locations: CraftLocation[];
    prerequisites: {
      materials: string;
      estimatedTime: string;
      difficulty: "Begynder" | "Let øvet" | "Avanceret" | string;
    };
    processes: CraftProcess[];
    inspiration: CraftInspirationItem[];
    manuals: CraftManualReference[];
  }
  ```
- **Helper Functions**:
  - `getAllCraftItems(): CraftItemData[]`
  - `getCraftItemsByCampus(campus: "køge" | "roskilde"): CraftItemData[]`
  - `getCraftCategories(): string[]`
- **Catalog Dataset Expansion**:
  - Expand `CRAFT_CATALOG` to include initial maker items:
    - `t-shirt` (Beklædning & Merch - Makerspace Køge & Dimselab Roskilde)
    - `kop` (Keramik & Sublimation - Makerspace Køge & Roskilde)
    - `mulepose` (Tekstil & Serigrafi - Makerspace Køge & Roskilde)
    - `3d-print` (Rapid Prototyping - Makerspace Køge & Roskilde)
    - `plakat` (Stortformat Print - Medialab Køge)
    - `laserskaering` (Træ & Akryl - Makerspace Køge & Roskilde)
    - `stickers-folie` (Vinyl & Klistermærker - Makerspace Køge & Dimselab Roskilde)

### 4. Visual Tokens & Scandinavian Design Fidelity (Figma Frame 144:335)
- **Base Background**: `#000000` (Brand Black).
- **Search Card**: `#383838` background, `#CCCCCC` placeholder, 20px padding, `rounded-none`.
- **Section Title**: "Katalog" in `Stack Sans Notch` 32px regular with cyan accent line `#009FE3` (strokeWeight: 2px).
- **Card Design**:
  - Image frame: `#E9E9E9` background, `border border-[#E7E7E7]` or `border-[#262626]`, `rounded-none`.
  - Footer row: Stack Sans Headline 16px title `#FFFFFF`, bottom action icon/button linking to `/craft/[slug]`.
  - Mobile layout: 2-column grid (`grid-cols-2`), scaling to 3 or 4 columns on desktop viewports.
- **Marquee & Footer**:
  - Canonical `<MarqueeRibbon />` with lab tags ("DIMSELAB • MAKERSPACE • MEDIALAB").
  - Cyan footer matching Figma frame `144:434` or styled `<LandingFooter />`.

## Risks / Trade-offs

- **[Risk] Active Campus Mismatch**: User filters by a lab that doesn't exist on their active campus (e.g. Dimselab while on Køge).
  - **Mitigation**: Lab filters are dynamically computed from the active campus's actual facilities. If a user changes campus, any incompatible lab filter automatically resets to "Alle".
- **[Risk] Slow Filtering on Mobile**: Typing in search causes UI stutter.
  - **Mitigation**: Native React 19 `useMemo` search filtering with debounced query state, processing in <2ms for hundreds of catalog items.
- **[Risk] Missing Images for New Crafts**: Breaking card visuals.
  - **Mitigation**: Use existing local images from `/images/landing/` and `/images/craft/` as primary and fallback assets.
