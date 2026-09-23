## Why

The current public landing page and admin portal were primarily tuned for desktop viewports, causing multiple critical issues on mobile devices: oversized hero headlines and image cards, cramped header navigation and dropdown clipping, beacon tooltip overflow, step indicator tab text collisions, lack of touch-friendly hit targets, and continuous telemetry ticker scroll without touch controls. Aside from the fixed desktop POS desk, the system must follow a strict mobile-first architecture to provide an optimal experience for students browsing on phones.

## What Changes

- **Landing Header & Navigation**: Mobile-first header with safe-area spacing, touch-accessible campus switcher (preventing off-screen dropdown overflow), touch-friendly hamburger icon (minimum 44x44px target), and a scrollable mobile drawer menu with proper safe-area bottom clearance.
- **Hero Section**: Responsive typography (`text-3xl sm:text-5xl md:text-7xl`) preventing title collision, dynamic viewport height (`min-h-[520px] sm:min-h-[600px]`), and comfortable vertical alignment.
- **Prototype Carousel**: Mobile edge-bleed horizontal scrolling with scroll padding (`-mx-6 px-6`) and touch ergonomics on cards.
- **Showcase Gallery & Hotspots**: Responsive card heights (`h-[380px] sm:h-[540px] md:h-[620px]`), expanded touch targets for hotspots (44px hit-area), and boundary-aware tooltip positioning to prevent off-screen horizontal clipping on mobile edges.
- **Campus Lab Explorer**: Responsive flex-wrap on spotlight header (`flex flex-col sm:flex-row gap-3`) so lab titles and campus tags never crush, optimized tab labels and padding on mobile screens.
- **Machine Telemetry**: Responsive telemetry stat layout, touch-to-pause interaction on vertical autoscroller, and responsive card wrapping.
- **Landing Footer**: Mobile-friendly link touch targets (`py-1.5` / `gap-3`) and clean stack order.
- **Admin Dashboard**: Mobile-first header and hero stack, making navigation between Public Portal and POS desk seamless on mobile phones without squishing.
- **Viewport & Overflow Containment**: Ensure no accidental horizontal scrollbars or element clipping across 320px–430px mobile screen widths.

## Capabilities

### New Capabilities
- `mobile-responsive-experience`: Mobile-first responsiveness, adaptive typography, touch target ergonomics, boundary-safe tooltips, and horizontal overflow protection across the public portal and admin dashboard.

### Modified Capabilities
<!-- None -->

## Impact

- `components/landing/LandingHeader.tsx`: Touch target sizes, dropdown positioning, mobile drawer menu scrolling.
- `components/landing/HeroSection.tsx`: Responsive typography, dynamic viewport height.
- `components/landing/PrototypeCarousel.tsx`: Mobile bleed horizontal scrolling.
- `components/landing/HotspotShowcase.tsx`: Responsive card heights, touch targets, edge-safe tooltips.
- `components/landing/CampusLabExplorer.tsx`: Spotlight responsive flex layout, mobile padding.
- `components/landing/MachineTelemetrySection.tsx`: Mobile layout stacking, touch interaction.
- `components/landing/LandingFooter.tsx`: Touch ergonomics on links.
- `app/admin/page.tsx`: Responsive admin dashboard navigation and bento grid layout.
- `app/layout.tsx` & `app/globals.css`: Viewport settings and mobile overflow safety.
