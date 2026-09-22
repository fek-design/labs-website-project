## Context

See `proposal.md` for motivation. IKEA's digital web design language balances functional architectural austerity with accessible consumer utility through a rigorous corner radius hierarchy. Prior to this change, components on the landing page used inconsistent border radii (`rounded-xl`, `rounded-2xl`, `rounded-full`, `rounded-md`). This design establishes explicit rules governing when to use square corners, when to use rounded corners, and the exact degree of rounding.

## Goals / Non-Goals

**Goals:**
- Codify a 3-tier geometry standard:
  1. Sharp Architectural (`0px` / `rounded-none`) for primary CTAs and media frames.
  2. Subtle Modular (`6px`–`8px` / `rounded-md` to `rounded-lg`) for product cards, dropdowns, and spotlight containers.
  3. Full Pill (`9999px` / `rounded-full`) for status badges, tags, campus pills, and circular beacon triggers.
- Remove exaggerated `rounded-2xl` and `rounded-3xl` radii from cards, replacing them with crisp 1px hairline Scandinavian outlines.

**Non-Goals:**
- Altering typography, animations, or colors.
- Redesigning desktop POS register layouts.

## Decisions

### Decision 1: Square Corners (`rounded-none` / 0px) for Primary Action CTAs
- **Choice**: The "UDFORSK" button in `HeroSection.tsx` uses `rounded-none` with `px-10 py-3.5 border border-zinc-200 bg-white text-black`.
- **Rationale**: IKEA's primary interactive callouts (such as buy buttons, search boxes, and hero CTAs) utilize crisp rectangular geometry. This grounds the element as an architectural anchor on the page.
- **Alternatives**: Full pill buttons (`rounded-full`), which look generic and dilute the Scandinavian functionalist aesthetic.

### Decision 2: Square Corners (`rounded-none`) for Large Showcase Image Frames
- **Choice**: Feature showcase frames in `HotspotShowcase.tsx` use `rounded-none` (or `rounded-xs` 2px) with `border border-[#DFDFDF]`.
- **Rationale**: Large editorial photographs in IKEA catalogs and websites are treated like framed gallery prints with clean right angles.
- **Alternatives**: `rounded-2xl` / `rounded-3xl`, which look like mobile app widgets rather than clean architectural design.

### Decision 3: Subtle Radius (`rounded-md` / 6px to `rounded-lg` / 8px) for Product Cards and Popovers
- **Choice**: Prototype carousel cards in `PrototypeCarousel.tsx` use `rounded-md` (6px) with `border border-[#DFDFDF]`. Floating campus dropdown in `LandingHeader.tsx` uses `rounded-lg` (8px). Spotlight container in `CampusLabExplorer.tsx` uses `rounded-lg` (8px).
- **Rationale**: 6px–8px provides just enough corner softening to signify an individual touchable or modular card without appearing bubble-like.
- **Alternatives**: `rounded-2xl` (16px+), which feels excessively rounded and un-IKEA.

### Decision 4: Full Pill (`rounded-full` / 9999px) Strictly for Badges and Chips
- **Choice**: Campus switcher trigger pill, step indicator dots, and beacon triggers retain `rounded-full`.
- **Rationale**: Pill geometry is semantically reserved for contextual metadata, tags, and circular hit targets.

## Risks / Trade-offs

- **[Risk] Visual contrast between square CTA and rounded cards** → This tension is intentional in Scandinavian design, creating clear visual hierarchy between actions and content.
