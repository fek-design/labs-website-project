## Context

See `proposal.md` for motivation. The landing page and administrative overview pages were implemented with fixed sizing and desktop flex assumptions, leading to awkward wrapping, oversized photo frames, cramped header navigation, and runaway ticker scrolling on touch devices. Aside from the fixed desktop POS desk (`/admin/pos`), the entire public experience and dashboard overview must adhere to a strict mobile-first architecture.

## Goals / Non-Goals

**Goals:**
- Provide a smooth mobile experience from 320px (iPhone SE) to 430px (Pro Max) and beyond.
- Ensure all interactive elements (buttons, beacons, tabs, navigation links) have minimum 44px by 44px touch targets.
- Scale photo showcase cards proportionally on mobile viewports so they do not dominate multiple full viewports unnecessarily.
- Prevent horizontal viewport blowouts and off-screen tooltip clipping on mobile edges.
- Support touch interactions for the machine telemetry ticker (pause on touch/hold).
- Make `/admin` overview header and bento grid responsive and legible on mobile.

**Non-Goals:**
- Do not modify `/admin/pos` or the POS register checkout workflow.
- Do not change the underlying branding or visual tokens (black base floor, CMYK accents).
- Do not add third-party styling or icon libraries.

## Decisions

### 1. Mobile-First Sizing & Typography
- Headlines use fluid mobile-first scales:
  - Hero headline: `text-3xl sm:text-5xl md:text-7xl`.
  - Prototype section headline: `text-2xl sm:text-4xl md:text-5xl`.
  - Spotlight headline: `text-2xl sm:text-4xl md:text-5xl`.
  - Machine section headline: `text-2xl sm:text-4xl md:text-5xl`.
- Padding on mobile containers uses `px-4 sm:px-6` to maximize screen real estate on 360px viewports without touching bezel edges.

### 2. Header & Mobile Navigation Drawer
- **Campus Selector**: Keep pill compact, ensure dropdown has `right-0 max-w-[calc(100vw-32px)]` so it never forces horizontal scroll on mobile.
- **Hamburger Button**: Wrap in a `w-11 h-11` flex container (44px touch target) for easy thumb tapping.
- **Mobile Menu Drawer**: Add `overflow-y-auto` and `pb-12 pt-20` safe area so navigation items and admin link are accessible on compact device screens.

### 3. Edge-Bleed Horizontal Carousel
- `PrototypeCarousel` cards use `-mx-4 px-4 sm:-mx-6 sm:px-6` margin bleeds so the horizontal scroll feels native to mobile touch without hitting container padding walls.
- Card sizes: `w-32 sm:w-40 h-44 sm:h-52` on mobile, keeping items visible in the viewport with clean swipe snapping.

### 4. Showcase Card Heights & Edge-Aware Hotspot Tooltips
- Responsive card heights:
  - Primary Textile card: `h-[380px] sm:h-[520px] md:h-[620px]`.
  - Poster and Camera cards: `h-[260px] sm:h-[340px] md:h-[380px]`.
  - 3D print card: `h-[240px] sm:h-[320px] md:h-[380px]`.
- **Hotspot Beacons**: Hit area expanded with an invisible `w-11 h-11` touch surface centered on the beacon.
- **Tooltip Anchoring**: Dynamically anchor tooltips based on `x` coordinate (`x > 65` anchors right-aligned, `x < 35` anchors left-aligned, otherwise centered) to ensure tooltips never clip off-screen.

### 5. Campus Lab Explorer Header Stacking
- The spotlight card header wraps on mobile: `flex flex-col sm:flex-row sm:items-center justify-between gap-3`.
- Internal spotlight padding reduced on mobile (`p-5 sm:p-10`) to keep text legible and comfortable.
- Step tabs use flexible wrapping or scrollable indicators with minimum 44px height for touch targets.

### 6. Machine Telemetry Touch Ergonomics
- The telemetry container stacks vertically on mobile (`grid-cols-1`).
- Card layout inside the autoscroll track wraps gracefully with `min-w-0` and truncation protection for status pills.
- Add touch interaction pause (`hover:[animation-play-state:paused] active:[animation-play-state:paused]`) so mobile users can hold to inspect any card.

### 7. Administrative Overview (`/admin`) Mobile Layout
- Header adapts on mobile by stacking the brand mark and action buttons or wrapping them smoothly (`flex-wrap gap-2`).
- Bento grid cards stack neatly into a single column (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

## Risks / Trade-offs

- [Risk: Beacon tooltips clipping off the edge of narrow screens] → Mitigation: Position tooltips conditionally using `x > 65 ? 'right-0' : x < 35 ? 'left-0' : 'left-1/2 -translate-x-1/2'`.
- [Risk: Telemetry ticker moving too fast or unreadable on small screens] → Mitigation: Provide CSS `active:[animation-play-state:paused]` and touch listener to halt animation on finger hold.
- [Risk: Unintended modification to POS desk] → Mitigation: Strict exclusion of `/admin/pos` directory from this overhaul.
