## 1. Top Navigation & Hamburger Drawer

- [x] 1.1 Remove the desktop-only Katalog CTA button from `LandingHeader.tsx`
- [x] 1.2 Remove the desktop center horizontal links from `LandingHeader.tsx`
- [x] 1.3 Ensure the location badge (`KØGE CAMPUS`) is rendered alongside the `LABS` brand on all viewports
- [x] 1.4 Make the hamburger menu toggle button universally active across all viewports (`flex` instead of `md:hidden`)
- [x] 1.5 Verify hamburger drawer navigation links and smooth anchor scrolling functionality

## 2. Footer Pruning & Link Hygiene

- [x] 2.1 Remove the "is currently open" status pill from `LandingFooter.tsx`
- [x] 2.2 Remove the copyright notice line from the bottom utility bar of `LandingFooter.tsx`
- [x] 2.3 Prune all dead/unrouted links (`USER_MANUAL.md`, PDF manual placeholder) from `LandingFooter.tsx`
- [x] 2.4 Verify all remaining footer links point to live, functional routes and anchors

## 3. Asymmetrical 8-12-16 Grid Spans

- [x] 3.1 Refactor `CampusLabExplorer.tsx` to use an 8-12-16 responsive grid structure
- [x] 3.2 Ensure vertical stacking on mobile (`grid-cols-1 gap-8`) and asymmetrical 12-column scaling on desktop (`lg:grid-cols-12 gap-8`)
- [x] 3.3 Allocate 5 columns (`lg:col-span-5`) to narrative copy and step indicators, and 7 columns (`lg:col-span-7`) to the graphical spotlight card
- [x] 3.4 Ensure all spacings, heights, and margins conform to 8-divisible rhythm (`p-8`, `gap-8`, `min-h-[224px]`)

## 4. AI-First Semantic SEO & Crawler Directives

- [x] 4.1 Implement `generateHowToSchema` in `lib/schema.ts`
- [x] 4.2 Inject Schema.org `HowTo` JSON-LD structured script into `app/craft/[slug]/page.tsx`
- [x] 4.3 Create `app/robots.ts` with crawler directives allowing public discovery routes and disallowing `/admin/` and `/api/`
- [x] 4.4 Sanitize `app/sitemap.ts` by removing private `/admin` and `/admin/pos` entries

## 5. Accessibility & Payload Optimization

- [x] 5.1 Add keyboard-accessible skip-to-content link in `app/layout.tsx` pointing to `#main-content`
- [x] 5.2 Ensure main content landmarks on `/`, `/katalog`, and `/craft/[slug]` have `id="main-content"`
- [x] 5.3 Configure `next.config.ts` for AVIF and WebP image formats with server compression enabled

## 6. Verification & Validation

- [x] 6.1 Run test suite (`npm test`) to ensure zero regressions
- [x] 6.2 Validate OpenSpec change status with `npx openspec validate frontpage-asymmetric-spans-ai-seo-and-a11y`
- [x] 6.3 Test production build with `npm run build`
