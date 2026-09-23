## Why

While individual craft prototype detail pages exist (`/craft/[slug]`) and a preview carousel lives on the landing page, users currently lack a dedicated, full-spectrum catalogue index to discover, search, and filter all available prototypes, machines, and fabrication activities. Based on Figma frame `144:335` ("Labs - Katalog - SPECIFIC"), Zealand Labs requires a location-aware, uncluttered, and performant catalogue page at `/katalog` that seamlessly integrates with campus selection, features targeted quality-of-life (QOL) filters without bloat, dynamically sources catalog items, and establishes a future-proof, scalable tagging architecture.

## What Changes

- **Dedicated Location-Aware Catalogue Route (`/katalog`)**:
  - Implements the catalogue page at `app/katalog/page.tsx` adhering to Figma frame `144:335`.
  - Automatically scopes item availability and filter options to the currently active campus (`køge` vs. `roskilde` via `CampusContext`), while allowing seamless location toggling.
- **Thoughtful, Non-Bloated QOL Filters**:
  - High-visibility instant search input (`Søg...`) with quick debounce matching across titles, processes, tags, materials, and machinery.
  - Contextual Lab filter pills/tabs (`Alle`, `Makerspace`, `Medialab`, `Dimselab`), dynamically restricted to labs physically present at the active campus.
  - Scalable category filter pill bar (`KATEGORI`) with one-click toggles and active state styling.
  - Active filter count, clear/reset affordance (`Nulstil filtre`), and intelligent zero-match fallback state.
- **Dynamic Catalogue Data Architecture & Scalable Tagging**:
  - Refactors and enhances `lib/craft-data.ts` to expose standardized query helpers (`getAllCraftItems()`, `getCraftItemsByCampus()`).
  - Extends `CraftItemData` with a robust, forward-compatible tagging taxonomy: normalized tags (`tags: string[]`), primary category, associated labs, campus availability, estimated time, and machine references.
  - Expands catalog items to cover key maker crafts (T-shirt, Kop, Mulepose, 3D Print, Plakat, Laserskæring, Stickers/Folieskæring).
- **Figma Design Fidelity & Responsive Layout**:
  - Top navigation bar with `LABS` branding and active campus badge matching frame `144:337`.
  - Sharp Scandinavian card grid (`rounded-none` geometry, `#E9E9E9` image canvas, `#262626` / `#E7E7E7` borders, Stack Sans typography).
  - Cyan CMYK accent rule (`#009FE3`) beneath the "Katalog" header.
  - Bottom `<MarqueeRibbon />` and footer integration matching the specified Figma layout.

## Capabilities

### New Capabilities
- `catalogue-index-and-filters`: Defines the requirements, state management, location scoping, QOL filtering, and responsive presentation for the Zealand Labs `/katalog` page.

### Modified Capabilities
<!-- None -->

## Impact

- **New Route**: `app/katalog/page.tsx` (and supporting subcomponents in `components/catalogue/`).
- **Data Layer**: `lib/craft-data.ts` schema extensions and additional catalog items.
- **Navigation**: Cross-linking from `components/landing/PrototypeCarousel.tsx` (catalogue CTA card) and header navigation to `/katalog`.
- **Dependencies**: No external dependencies added; uses existing React 19, Next.js App Router, Tailwind CSS v4, and GSAP/Motion architecture.
