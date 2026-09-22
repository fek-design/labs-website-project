## Context

See `proposal.md` for motivation. The landing page requires four specific UX and aesthetic refinements:
1. Clarifying and locking the geometry of the "UDFORSK" hero CTA.
2. Turning hotspot beacons into spacious, clickable interactive links.
3. Redesigning prototype carousel items as full-bleed cards with embedded title buttons.
4. Setting up local geometric grotesque font fallbacks (`Space Grotesk` and `Inter`) for `Stack Sans Notch` and `Stack Sans Text`.

## Goals / Non-Goals

**Goals:**
- Provide a bold, functional rectangular shape (`rounded-none` / 0px) for the hero CTA button.
- Expand hotspot popover padding to `p-4 sm:p-5`, enable pointer events, and link directly to `#support-pillars`.
- Transform carousel cards into full photo-bleed containers with an overlaid bottom button.
- Integrate `Space Grotesk` and `Inter` via Next.js self-hosted font loader into the root layout and CSS theme tokens.

**Non-Goals:**
- Loading external fonts at runtime from Google CDN (all font files must be bundled locally by Next.js).
- Redesigning the desktop POS interface.

## Decisions

### Decision 1: Hero CTA Button Geometry
- **Choice**: The "UDFORSK" button uses sharp rectangular geometry (`rounded-none` / 0px) with `px-10 py-3.5 bg-white text-black font-semibold border border-zinc-200 shadow-none`.
- **Rationale**: Scandinavian industrial functionalism uses crisp right angles for primary page anchors, providing contrast against circular badges and soft photography.
- **Alternatives**: Pill button (`rounded-full`), which feels like a generic pill tag rather than an authoritative primary action.

### Decision 2: Clickable Hotspot Popover Cards
- **Choice**: In `HotspotShowcase.tsx`, replace the small tooltip with a spacious interactive card (`p-4 sm:p-5 min-w-[180px] rounded-md border border-[#DFDFDF] bg-white shadow-xl pointer-events-auto`). Wrap the card content in an anchor link targeting `#support-pillars` with a subtle arrow icon (`Se udstyr & projekter →`).
- **Rationale**: When users tap a beacon, they expect to be able to interact with the popup and jump to relevant equipment or prototyping capabilities.
- **Alternatives**: Non-clickable passive tooltips, which frustrate mobile users who tap expecting navigation.

### Decision 3: Full-Bleed Carousel Cards with Bottom Button
- **Choice**: In `PrototypeCarousel.tsx`, make cards taller (`h-64 sm:h-76`) with the product photo filling the card frame (`fill` and `object-contain` or `object-cover` on a clean `bg-[#F8F8F9]`). At the bottom, place an integrated pill or subtly rounded button:
  `<div className="w-full py-2.5 px-3.5 bg-white text-zinc-950 font-sans text-xs sm:text-sm font-semibold border border-zinc-200 rounded-sm flex items-center justify-between shadow-xs"><span>{item.name}</span><span>→</span></div>`.
- **Rationale**: Matches high-end e-commerce and IKEA product carousels where the image dominates the tile and the title is housed in a clean action pill at the bottom.
- **Alternatives**: Small floating images with text sitting below in empty whitespace.

### Decision 4: Self-Hosted Font Architecture
- **Choice**: Use `next/font/google` in `app/layout.tsx` for `Space_Grotesk` (`subsets: ["latin"]`) and `Inter` (`subsets: ["latin"]`), applying their CSS variables (`--font-space-grotesk` and `--font-inter`) to `<html>`. In `app/globals.css`, prepend `Stack Sans Notch` and `Stack Sans Text` with these variables as fallbacks.
- **Rationale**: `next/font/google` downloads and self-hosts fonts locally during build time (zero external requests at runtime), fully satisfying the strict "Zero Cloud Dependency" mandate while providing the closest visual match to Stack Sans.
- **Alternatives**: System fonts only (which look generic and lack geometric character traps).

## Risks / Trade-offs

- **[Risk] Touch target interference on hotspot beacons** → The popup uses `pointer-events-auto` only when active, preventing ghost taps when hidden.
