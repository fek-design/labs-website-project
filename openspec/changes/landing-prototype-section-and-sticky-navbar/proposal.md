## Why

The white background was previously applied to the "Prototyping & Understøttelse" section instead of the intended "Din næste prototype starter her" prototype showcase section (matching Figma Frame 25), causing layout contrast issues and unreadable text. Additionally, the navigation bar was statically positioned and did not provide continuous wayfinding or campus switching as the visitor scrolls down the page.

## What Changes

- **Relocate White Background to Prototype Showcase Section**:
  - Set the background of the *"Din næste prototype starter her"* (`PrototypeCarousel.tsx`) section to pure white (`#FFFFFF`).
  - Invert its headline typography to pitch black / dark zinc (`#09090b` / `text-zinc-950`) to guarantee high contrast.
  - Ensure carousel cards have defined subtle surface tints (`bg-zinc-100/90`), crisp borders (`border-zinc-300`), and dark label typography (`text-zinc-900`) so there is zero white-on-white illegibility.
- **Restore Dark Floor for Lower Sections**:
  - Restore *"Prototyping & Understøttelse"* (`CampusLabExplorer.tsx`), Hotspot Showcase, and Machine Telemetry to the authentic dark floor (`bg-black text-white`).
  - Keep the authentic CMYK lab accent mapping (Cyan `#009FE3`, Magenta `#E6007E`, Yellow `#FFED00`) for indicators, tags, and spotlight highlights.
- **Sticky Navigation Bar with Scroll Transition**:
  - Make `LandingHeader.tsx` sticky (`sticky top-0 z-50`).
  - Implement a scroll-detection hook that applies a smooth transition:
    - **Top of page (Hero)**: Transparent background (`bg-transparent border-transparent`).
    - **Scrolled past Hero (> 60px)**: Translucent frosted dark surface (`bg-black/80 backdrop-blur-md border-b border-white/10 shadow-xl`) ensuring continuous legibility and persistent access to the campus switcher and POS/admin links.

## Capabilities

### New Capabilities
- `landing-prototype-white-section-and-sticky-nav`: Relocates the white background to the prototype carousel section, restores dark floor styling with verified high-contrast typography, and introduces a scroll-responsive sticky navbar.

### Modified Capabilities
<!-- None -->

## Impact

- `components/landing/PrototypeCarousel.tsx`: Styled with pure white background, dark notch headline, and high-contrast cards.
- `components/landing/CampusLabExplorer.tsx`: Reverted to dark floor with white text, crisp borders, and CMYK accents.
- `components/landing/LandingHeader.tsx`: Updated with `sticky top-0 z-50` and dynamic scroll state for background and border transitions.
- `app/page.tsx`: Section wrappers updated to reflect the corrected theme flow.
