## 1. Persona Navigation Audit & Route Hygiene

- [x] 1.1 Verify and refine student persona routes in `LandingHeader.tsx` drawer (Udstyrskatalog, Makerspace, Medialab, Prototype guides)
- [x] 1.2 Verify staff/teacher persona gateway in `LandingHeader.tsx` drawer (Admin Launchpad, POS desk)
- [x] 1.3 Audit internal hash anchor scrolling (`#prototypes`, `#showcase`, `#machines`, `#support-pillars`) to ensure smooth jumps without layout shift
- [x] 1.4 Validate footer navigation columns against persona sitemap in `docs/SITEMAP.md`

## 2. Complete Craft Prototype Dataset Synchronization

- [x] 2.1 Synchronize `data/crafts.json` with all prototype guides from `lib/craft-data.ts` (`t-shirt`, `kop`, `mulepose`, `3d-print`, `plakat`)
- [x] 2.2 Verify `generateStaticParams()` in `app/craft/[slug]/page.tsx` builds all 5 dynamic routes
- [x] 2.3 Ensure JSON-LD HowTo schemas render valid data for all 5 craft articles

## 3. Automated Fallback UI Testing

- [x] 3.1 Create Vitest test suite `test/SafeImageBox.test.tsx` using `@testing-library/react`
- [x] 3.2 Test normal image rendering with valid `src`
- [x] 3.3 Test placeholder icon and accessible label rendering when `src` is missing or null
- [x] 3.4 Test simulated `onError` image load failure fallback

## 4. Accessibility (a11y) & WCAG AA Hardening

- [x] 4.1 Add universal "Gå til hovedindhold" skip link in `app/layout.tsx` targeting `#main-content`
- [x] 4.2 Verify `<main id="main-content">` landmark exists across `/`, `/katalog`, `/makerspace`, `/medialab`, `/craft/[slug]`, and `/admin`
- [x] 4.3 Add high-contrast `focus-visible:ring-2 focus-visible:ring-[#009FE3]` styling to interactive buttons, links, and scanner input
- [x] 4.4 Audit contrast ratios on dark surfaces to guarantee minimum 4.5:1 WCAG AA compliance

## 5. Build, Test & OpenSpec Verification

- [x] 5.1 Run `npm test` to verify Vitest test suite (including new `SafeImageBox.test.tsx`)
- [x] 5.2 Run `npx tsc --noEmit` and `npm run build` to verify all static routes compile cleanly
- [x] 5.3 Validate OpenSpec change with `npx openspec validate persona-navigation-audit-a11y-and-craft-sync`
