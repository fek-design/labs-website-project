## 1. Prototype Carousel Repair & Curation

- [x] 1.1 Fix GSAP ScrollTrigger animation in `components/landing/PrototypeCarousel.tsx` to use container-scoped trigger, `fromTo`, and `clearProps` ensuring cards are never stuck at `opacity: 0`.
- [x] 1.2 Curate `prototypeItems` array in `components/landing/PrototypeCarousel.tsx` to exactly 5 distinct items.
- [x] 1.3 Add 6th catalogue navigation action card to `components/landing/PrototypeCarousel.tsx` linking to `/katalog` with Scandinavian styling (without creating `/katalog` page).

## 2. Craft Detail Page Marquee Unification

- [x] 2.1 Update `app/craft/[slug]/page.tsx` to import and render `<MarqueeRibbon />` from `@/components/landing/MarqueeRibbon`, replacing inline ad-hoc marquee ribbon code.

## 3. Verification & Validation

- [x] 3.1 Verify TypeScript compilation with `npx tsc --noEmit`.
- [x] 3.2 Verify `PrototypeCarousel` cards are visible, interactive, and animate smoothly into view.
- [x] 3.3 Verify craft detail page renders the canonical dual-track `<MarqueeRibbon />`.
