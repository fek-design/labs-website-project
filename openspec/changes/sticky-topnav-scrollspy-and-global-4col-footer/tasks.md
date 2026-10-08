## 1. Primary Sticky Top-Nav Bar

- [ ] 1.1 Implement desktop navigation layout in `components/landing/LandingHeader.tsx` (Left: Brand Logo, Center: Showcase, Maskiner, Guides, Right: prominent Katalog CTA button)
- [ ] 1.2 Implement GSAP/IntersectionObserver scroll spy in `LandingHeader.tsx` for real-time active anchor highlighting
- [ ] 1.3 Implement cross-route anchor navigation handler (smooth-scroll if on `/`, router push to `/#target` if on `/katalog` or `/craft/*`)
- [ ] 1.4 Ensure seamless integration with mobile hamburger menu drawer

## 2. Global 4-Column Utility Belt Footer

- [ ] 2.1 Refactor `components/landing/LandingFooter.tsx` into responsive 4-column layout (`max-w-5xl` container)
- [ ] 2.2 Implement Column 1 (Zealand Labs): campus address, opening hours, and live operational status indicator
- [ ] 2.3 Implement Column 2 (Udforsk): direct links to Udstyrskatalog (`/katalog`), Craft Guides, and Prototype Galleri (`/#prototypes`)
- [ ] 2.4 Implement Column 3 (Support & Pillars): Makerspace Retningslinjer, Medialab Retningslinjer, and Kontakt / Hjælp
- [ ] 2.5 Implement Column 4 (Personale Gateway): Underviser Login trigger and direct link to Admin Dashboard (`/admin`)
- [ ] 2.6 Mount `LandingFooter` globally on `/katalog` and `/craft/[slug]` for public route consistency

## 3. Validation & Testing

- [ ] 3.1 Verify smooth scroll on homepage and cross-route navigation from `/katalog` to `/#showcase` and `/#machines`
- [ ] 3.2 Verify scroll-spy active state visual highlighting during page scrolling
- [ ] 3.3 Verify 4-column footer layout responsiveness on mobile, tablet, and desktop
- [ ] 3.4 Run TypeScript check (`npx tsc --noEmit`) and ESLint on all updated components
