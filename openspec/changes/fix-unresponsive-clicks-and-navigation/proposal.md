## Why

While interactive controls (sticky navbar, campus dropdown, hamburger menu, hero CTA, lab tabs) work flawlessly on desktop Mac browsers (even when resizing down to mobile viewport dimensions), they fail to respond on physical iOS and Android mobile devices (including Safari, iOS Chrome, and Android Chromium). On mobile devices connecting via local Wi-Fi or LAN, Next.js dev server defaults (`localhost` binding), mobile-specific touch event synthesis latency, and synthetic click drop caused by `user-select: none` prevent React hydration and event handlers from executing. Additionally, the user requested that card, showcase, and container borders be refined to mimic the clean, minimal Scandinavian hairline border aesthetic of IKEA's website.

## What Changes

- **Dev Server Network Binding**: Update `package.json` dev script to `next dev -H 0.0.0.0` so mobile devices connecting over Wi-Fi/LAN load all Next.js hydration chunks, bundles, and Fast Refresh WebSockets without stalling.
- **Cross-Platform Mobile Touch & Click Normalization**:
  - Remove `select-none` (`-webkit-user-select: none`) from interactive controls (`LandingHeader.tsx`, `HeroSection.tsx`, `CampusLabExplorer.tsx`, and `HotspotShowcase.tsx`) to prevent WebKit and Chromium synthetic click cancellation.
  - Enforce `touch-action: manipulation` (`touch-manipulation`) globally on buttons, links, and touch targets to eliminate 300ms tap delay and ensure instant response on touch release.
  - Add explicit touchstart listener on document root (`document.addEventListener("touchstart", () => {}, { passive: true })`) to enable immediate `:active` CSS state dispatch in iOS WebKit.
- **IKEA-Inspired Hairline Border System**:
  - Refine borders across the white section (`PrototypeCarousel.tsx`, `HotspotShowcase.tsx`), dark section (`CampusLabExplorer.tsx`, `MachineTelemetrySection.tsx`), and navbar dropdowns to use crisp, clean 1px hairline borders (`border border-zinc-200` / `#dfdfdf` on white surfaces, `border border-white/10` on dark surfaces) with minimal elevation and zero murky drop shadows, matching the Scandinavian aesthetic of IKEA's digital web design.
  - Sync this requirement into the master spec `openspec/specs/visual-toolkits/spec.md`.

## Capabilities

### New Capabilities
- `mobile-interaction-and-touch-responsiveness`: Requirements for cross-browser mobile touch responsiveness (iOS Safari, Android Chromium), zero-delay tap handling, and local network dev server asset delivery.

### Modified Capabilities
- `visual-toolkits`: Added Requirement for IKEA-inspired hairline border system across modular cards, carousel items, showcase frames, and tab dividers.

## Impact

- `package.json`: Dev script updated to `"next dev -H 0.0.0.0"`.
- `app/globals.css`: Base touch-action rule and IKEA border utility tokens.
- `components/landing/LandingHeader.tsx`: Touch target normalization, removal of `select-none`, and crisp IKEA-style border on dropdown menu.
- `components/landing/HeroSection.tsx`: CTA touch responsiveness and border polish.
- `components/landing/PrototypeCarousel.tsx`: IKEA-style clean hairline border styling on product cards (`border-zinc-200`, subtle outline, crisp presentation).
- `components/landing/HotspotShowcase.tsx`: Clean hairline borders on feature image frames and tooltip cards.
- `components/landing/CampusLabExplorer.tsx`: Clean tab dividers and border tuning.
- `openspec/specs/visual-toolkits/spec.md`: Master spec updated with IKEA border system.
