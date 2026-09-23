## 1. Craft Data Catalog & Visual Assets

- [x] 1.1 Create `lib/craft-data.ts` with typed definitions for craft items, production processes (Print vs. Broderi), machine specifications, prerequisites, inspiration showcases, and relevant manuals.
- [x] 1.2 Set up image assets for craft products, process types, machines, and student creations in `public/images/craft/`.

## 2. Interactive Craft View Components

- [x] 2.1 Implement `components/craft/CraftHero.tsx` with product photography banner, title, and location opening hours badges.
- [x] 2.2 Implement `components/craft/CraftPrerequisites.tsx` featuring the high-contrast Cyan (`#009FE3`) prerequisites block with subtle attention animations.
- [x] 2.3 Implement `components/craft/CraftProcessSelector.tsx` featuring `motion/react` `layoutId` process switcher (`Print` vs. `Broderi`) and responsive machine specification cards.
- [x] 2.4 Implement `components/craft/CraftInspirationGallery.tsx` displaying the "Andre har lavet" community creations grid with process and duration badges.
- [x] 2.5 Implement `components/craft/CraftManualsSection.tsx` with equipment SOP guide cards.

## 3. Route Integration & Landing Page Linking

- [x] 3.1 Create dynamic route `app/craft/[slug]/page.tsx` combining all craft view components with `LandingHeader` and `LandingFooter` wrapped in `CampusProvider`.
- [x] 3.2 Update `components/landing/PrototypeCarousel.tsx` cards to navigate to `/craft/[slug]`.

## 4. Verification & Polish

- [x] 4.1 Verify TypeScript compilation with `npx tsc --noEmit`.
- [x] 4.2 Verify interactive process switching, layoutId transitions, and responsive presentation across mobile and desktop.
