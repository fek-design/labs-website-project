## 1. Section Spacing & Card Container Overflow

- [x] 1.1 In `components/landing/HotspotShowcase.tsx`, expand section `#showcase` vertical padding to `pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24`
- [x] 1.2 Remove `overflow-hidden` from the outer showcase card containers across all 4 cards in `HotspotShowcase.tsx`
- [x] 1.3 Encapsulate background `<Image>` elements and gradient masks in an inner `absolute inset-0 overflow-hidden pointer-events-none` container so photos stay cleanly framed while interactive beacon popovers are unclipped

## 2. Popover Motion & Natural Positioning

- [x] 2.1 Ensure `HotspotBeacon` popovers display where they are at their natural coordinate anchors without artificial clipping workarounds
- [x] 2.2 Upgrade `HotspotBeacon` popover entrance to tactile spring physics using `motion/react` (`type: "spring", stiffness: 380, damping: 18, mass: 0.7`) for a snappy, lively bounce

## 3. Validation & Quality Checks

- [x] 3.1 Run `npx tsc --noEmit` and `npx eslint components/landing/HotspotShowcase.tsx` to ensure clean type checking and linting
- [x] 3.2 Verify unclipped popover visibility, generous section breathing room, and springy interactive feel
