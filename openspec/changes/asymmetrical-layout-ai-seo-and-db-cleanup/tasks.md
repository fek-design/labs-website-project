## 1. Database Test Content Cleanup & Clean Seeding

- [x] 1.1 Create `prisma/clean-test-data.ts` to purge mock loans, dummy repair logs, test patrons, and placeholder inventory records
- [x] 1.2 Add `db:clean` script to `package.json` for reproducible test data purge
- [x] 1.3 Refactor `prisma/seed.ts` to seed an authentic production baseline (Køge Makerspace & Medialab, clean taxonomy tags, verified equipment records, admin user)

## 2. Asymmetrical Span Allocations & Reading Measure Optimization

- [x] 2.1 Refactor `components/landing/HeroSection.tsx` into an asymmetrical 40/60 desktop grid, restricting text measure to `max-w-prose` (45–65 characters) and expanding visual canvas
- [x] 2.2 Refactor `components/landing/MachineTelemetrySection.tsx` into 35/65 spans, pairing compact text descriptions with high-density visual telemetry gauges
- [x] 2.3 Refactor `/katalog` catalogue item cards and filter header into asymmetrical visual-to-metadata hierarchy

## 3. AI-First Semantic SEO (Schema.org JSON-LD)

- [x] 3.1 Create `lib/schema.ts` utility to generate Schema.org JSON-LD graph structures (`EducationalOrganization`, `CreativeWork`, `Hardware`)
- [x] 3.2 Embed lab organization JSON-LD into `app/layout.tsx` and `app/page.tsx` for AI crawler discoverability
- [x] 3.3 Embed catalogue items JSON-LD graph into `app/katalog/page.tsx`

## 4. Accessibility & Disability Support (WCAG 2.2 AA)

- [x] 4.1 Enforce high-visibility keyboard focus indicators (`focus-visible:ring-2 focus-visible:ring-[#FFED00]`) across buttons, inputs, and interactive cards
- [x] 4.2 Add `aria-live="polite"` dynamic region in `/katalog` to announce real-time search match counts to screen readers
- [x] 4.3 Support `prefers-reduced-motion` in marquee ribbon and page transitions, replacing high-frequency motion with instant cross-fades

## 5. Payload Optimization & Route Splitting

- [x] 5.1 Implement `next/dynamic` lazy loading with fallback skeletons for heavy interactive modals (`BundlePresetsModal`, `ManualsCatalogModal`)
- [x] 5.2 Configure explicit dimensions and responsive `sizes` on local `<Image>` components to eliminate Cumulative Layout Shift (CLS < 0.1)

## 6. Verification & Quality Assurance

- [x] 6.1 Execute `npm run db:clean` and verify clean database state without orphaned foreign keys
- [x] 6.2 Test keyboard tab navigation sequence and responsive asymmetrical layouts on mobile, tablet, and desktop viewports
- [x] 6.3 Run `npx tsc --noEmit` to verify clean compilation and zero type regressions
