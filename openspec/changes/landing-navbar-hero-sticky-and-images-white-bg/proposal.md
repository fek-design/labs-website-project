## Why

The navigation bar was previously rendered as an independent sticky bar preceding the hero rather than feeling like an integral part of the Hero header on page load. It must sit naturally over the Hero on initial load (fully transparent) and only "unstick" and adopt a non-transparent, frosted backdrop when the user scrolls down past the hero. Furthermore, the images showcase section (`HotspotShowcase.tsx`) is also intended to render on a pure white background alongside the prototype carousel, forming a continuous light showcase zone before returning to the dark floor at *Prototyping & Understøttelse*.

## What Changes

- **Hero-Integrated Scroll Navbar**:
  - Position `LandingHeader.tsx` as an overlay directly over the Hero on initial load (`fixed top-0 inset-x-0 z-50` with `bg-transparent border-transparent`).
  - Add scroll-tracking logic: when within the Hero section, the navbar remains transparent and part of the hero visual layout.
  - When the user scrolls past the Hero (`scrollY > 120px`), the navbar transitions smoothly into a non-transparent frosted backdrop (`bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5`).
- **White Background for Images Section (`HotspotShowcase.tsx`)**:
  - Set the background of `HotspotShowcase.tsx` to pure white (`bg-white text-zinc-950`).
  - Combine `PrototypeCarousel` and `HotspotShowcase` into a unified white showcase band.
  - Style the showcase image cards with subtle borders (`border border-zinc-200/80 shadow-md`) and clean spacing so they stand out crisply on the white background.
- **Section Flow Alignment in `app/page.tsx`**:
  - **Upper Dark Zone**: Hero Section & Infinite Marquee Ribbon (`bg-black text-white`).
  - **Showcase White Zone**: Prototype Carousel & Images Showcase (`bg-white text-zinc-950`).
  - **Lower Dark Zone**: Prototyping & Understøttelse (`CampusLabExplorer`), Machine Telemetry Section, and Footer (`bg-black text-white`).

## Capabilities

### New Capabilities
- `landing-navbar-hero-sticky-and-images-white-bg`: Integrates the navbar over the Hero on load with scroll-triggered frosted unsticking, and establishes the white background for the images showcase section.

### Modified Capabilities
<!-- None -->

## Impact

- `components/landing/LandingHeader.tsx`: Fixed positioning overlay with scroll threshold transition.
- `components/landing/HeroSection.tsx`: Padding/spacing configured so header overlays comfortably on load.
- `components/landing/HotspotShowcase.tsx`: Background set to pure white with light container styling.
- `app/page.tsx`: Layout updated with three clear thematic zones (Hero/Marquee dark, Showcase white, Labs/Telemetry dark).
