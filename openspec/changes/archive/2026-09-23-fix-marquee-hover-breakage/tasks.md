## 1. CSS Animation & Hover Pause Refinement

- [x] 1.1 Update `app/globals.css` to remove `.animate-marquee-track:hover` and add container-scoped hover pause rules for synchronized dual-track freezing.
- [x] 1.2 Add `will-change: transform` to `.animate-marquee-track` in `app/globals.css` for GPU layer promotion and smooth subpixel rendering.

## 2. Marquee Component Structure & Interaction Shielding

- [x] 2.1 Update `components/landing/MarqueeRibbon.tsx` to add `group marquee-container`, `cursor-default`, and `touch-pan-y` to the outer container.
- [x] 2.2 Add `pointer-events-none` to moving track contents in `components/landing/MarqueeRibbon.tsx` to eliminate sub-element hit-testing flutter.

## 3. Verification & Testing

- [x] 3.1 Verify TypeScript compilation with `npx tsc --noEmit`.
- [x] 3.2 Verify that hovering over any part of the marquee pauses both tracks in lockstep without jitter, collision, or desynchronization.
