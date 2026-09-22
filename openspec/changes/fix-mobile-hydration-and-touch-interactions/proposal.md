## Why

On real mobile devices, interactive components failed to respond to touch/clicks, elements and text in the lab-specific explorer section rendered invisibly, and the sticky navbar background failed to transition to frosted black when scrolling. This was caused by HTML phrasing validation mismatches (nesting `<div>` inside `<button>`), which caused React 19 hydration failure on mobile WebKit engines, coupled with SSR `initial={{ opacity: 0 }}` styles on Motion components that left elements hidden without hydration, and scroll listeners failing to trigger on mobile momentum scrolling.

## What Changes

- **HTML Phrasing Content Validation**: Refactor all button children in `LandingHeader.tsx` and `CampusLabExplorer.tsx` from `<div>` to semantic inline `<span>` elements, resolving React 19 hydration mismatches on mobile browsers.
- **SSR-Safe Motion Initialization**: Configure `initial={false}` on `motion.ul` and `motion.div` in `CampusLabExplorer.tsx` so bullet points and spotlight cards render with 100% opacity directly from SSR HTML, guaranteeing text is never invisible.
- **Cross-Browser Mobile Scroll Listener**: Update the scroll handler in `LandingHeader.tsx` to check `window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0` with a responsive threshold (`pos > 60`), ensuring smooth frosted background transitions on mobile touch scrolling.
- **High-Contrast Lab Card Styling**: Audit and enforce high-contrast typography across all lab accent colors (including Cyan and Magenta) so text is crisp and legible on mobile displays.

## Capabilities

### New Capabilities
- `mobile-hydration-and-touch-reliability`: Resilient React 19 client hydration, valid HTML phrasing structure, SSR-safe Motion rendering, and cross-browser mobile scroll listeners across all landing page components.

### Modified Capabilities
<!-- None -->

## Impact

- `components/landing/LandingHeader.tsx`: Valid HTML phrasing in toggle buttons, cross-browser scroll position listener.
- `components/landing/CampusLabExplorer.tsx`: Valid HTML phrasing in tab buttons, `initial={false}` SSR visibility for bullet points and spotlight card, contrast verification.
- `components/landing/HotspotShowcase.tsx`: Explicit touch and click handling on beacon triggers.
