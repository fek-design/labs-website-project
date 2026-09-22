## 1. Navigation & Hero Mobile Optimization

- [x] 1.1 Refactor `LandingHeader.tsx` with minimum 44px hamburger hit targets, edge-safe campus dropdown, and a scrollable mobile drawer menu (`overflow-y-auto pb-12 pt-20`)
- [x] 1.2 Update `HeroSection.tsx` with fluid mobile typography (`text-3xl sm:text-5xl md:text-7xl`), dynamic viewport height (`min-h-[520px] sm:min-h-[600px]`), and touch-friendly CTA

## 2. Prototype Carousel & Hotspot Showcase

- [x] 2.1 Refactor `PrototypeCarousel.tsx` with edge-bleed mobile horizontal scrolling (`-mx-4 px-4 sm:-mx-6 sm:px-6`), responsive card dimensions (`w-32 sm:w-40`), and snap physics
- [x] 2.2 Update `HotspotShowcase.tsx` with scaled responsive card heights, 44px beacon hit targets, and boundary-aware tooltip positioning to prevent off-screen mobile clipping

## 3. Labs Explorer, Telemetry & Footer

- [x] 3.1 Update `CampusLabExplorer.tsx` with mobile spotlight header flex wrapping (`flex flex-col sm:flex-row gap-3`), mobile container padding (`p-5 sm:p-10`), and touch-friendly lab tabs
- [x] 3.2 Update `MachineTelemetrySection.tsx` with responsive vertical stacking of counter and ticker, robust card text wrapping, and touch-to-pause interactivity
- [x] 3.3 Update `LandingFooter.tsx` with touch-spaced link targets and clean mobile stack hierarchy

## 4. Admin Dashboard & Verification

- [x] 4.1 Update `app/admin/page.tsx` with responsive header action buttons and single-column bento grid stacking on mobile viewports
- [x] 4.2 Verify zero horizontal overflow across 320px–430px viewports, run `npx tsc --noEmit` and `npx eslint` to confirm type safety and cleanliness
