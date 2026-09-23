## Why

Following the animation updates, the prototype carousel on the landing page became permanently invisible due to GSAP ScrollTrigger render state locking on dynamic initial layout, despite remaining clickable. Additionally, the item carousel displays 6 repetitive mock items and lacks a call-to-action to browse the full catalogue. Furthermore, the item/craft detail pages currently host a custom inline marquee ribbon rather than utilizing the unified, dual-track `<MarqueeRibbon />` from the landing page.

## What Changes

- **Marquee Unification on Craft Pages**: Replace the inline ad-hoc marquee ribbon in `app/craft/[slug]/page.tsx` with the canonical, reusable `<MarqueeRibbon />` component used on the landing page, maintaining design and token consistency.
- **Carousel Visibility & Animation Repair**: Fix `PrototypeCarousel.tsx` by replacing brittle sub-element scroll triggers with a robust container-level `fromTo` / `clearProps` reveal or reliable trigger options so cards never stay stuck at `opacity: 0`.
- **Carousel Item Truncation**: Limit prototype items in `PrototypeCarousel.tsx` to exactly 5 distinct items (e.g., T-Shirt, Kop, Mulepose, 3D Print, and Plakat).
- **Catalogue Navigation Tile**: Add a 6th card/button at the end of the carousel that routes to `/katalog` (with no catalogue page created yet, per user instruction) styled with sharp Scandinavian high-contrast aesthetics.

## Capabilities

### New Capabilities
- `landing-and-craft-refinements`: Covers the repair of prototype carousel visibility, item count curation with catalogue routing tile, and unification of craft page marquee ribbons.

### Modified Capabilities
None.

## Impact

- `components/landing/PrototypeCarousel.tsx`: Animation trigger fixes, item count set to 5, addition of catalogue CTA card.
- `app/craft/[slug]/page.tsx`: Import and render `<MarqueeRibbon />` instead of custom inline marquee code.
- No new route files created (catalogue page deferred until explicitly requested).
