## 1. Data Layer & Scalable Tagging Architecture

- [x] 1.1 Extend `CraftItemData` interface in `lib/craft-data.ts` with typed taxonomy properties (`tags: string[]`, `campuses: ("køge" | "roskilde")[]`, `labs: ("makerspace" | "medialab" | "dimselab")[]`, and thumbnail options).
- [x] 1.2 Implement query utility functions in `lib/craft-data.ts` (`getAllCraftItems()`, `getCraftItemsByCampus()`, `getCraftCategories()`).
- [x] 1.3 Expand `CRAFT_CATALOG` with complete entries for primary maker crafts (T-shirt, Kop, Mulepose, 3D Print, Plakat, Laserskæring, Stickers/Folieskæring) utilizing existing local images.

## 2. Catalogue Components & QOL Filtering

- [x] 2.1 Create `components/catalogue/CatalogueCard.tsx` matching Figma frame `144:335` geometry (sharp corners, `#E9E9E9` image frame, Stack Sans typography, and `/craft/[slug]` action affordance).
- [x] 2.2 Create `components/catalogue/CatalogueFilterBar.tsx` featuring the `#383838` instant search box, contextual Lab tabs, Category pills, and active filter counter/reset affordance.
- [x] 2.3 Create `components/catalogue/CatalogueGrid.tsx` uniting filter state, campus scoping via `useCampus()`, zero-match fallback, and responsive grid layout (2 columns on mobile, 3-4 on desktop).

## 3. Page Shell & Routing

- [x] 3.1 Create route `app/katalog/page.tsx` integrating `LandingHeader`, "Katalog" title with `#009FE3` cyan accent rule, `CatalogueGrid`, canonical `<MarqueeRibbon />`, and `LandingFooter`.
- [x] 3.2 Ensure reactive synchronization between `CampusContext` switches and catalogue filtering, resetting incompatible lab choices smoothly.

## 4. Verification & Polish

- [ ] 4.1 Verify catalogue page at `http://localhost:3000/katalog` across mobile and desktop viewports against Figma node `144:335`.
- [ ] 4.2 Test real-time search query filtering, lab tab selection, category pill selection, and filter reset.
- [ ] 4.3 Verify clicking each catalogue item navigates to its corresponding `/craft/[slug]` route.
- [ ] 4.4 Run Next.js production build (`npm run build`) to ensure type safety and error-free compilation.
