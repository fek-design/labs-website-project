## Context

See `proposal.md` for motivation. The first-phase git push (commit `d9f8cdc`) introduced unauthorized visual changes: forced yellow highlight borders (`:focus-visible`), yellow focus rings on cards and buttons, simulated status boxes, and asymmetrical layout shifts. The user specifically requests removing all these visual changes, restoring the author's original design, and strictly applying Apple's 12-column responsive layout grid system.

## Goals / Non-Goals

**Goals:**
- Remove the forced yellow `:focus-visible` highlight border from `app/globals.css`.
- Remove yellow focus rings and restore original cyan focus treatment in `components/catalogue/CatalogueCard.tsx` and `components/landing/HeroSection.tsx`.
- Completely remove the fabricated right-hand status card and extra paragraph copy from `components/landing/HeroSection.tsx`.
- Restore the author's original centered composition in `HeroSection.tsx`, housing the animated letter-by-letter headline and "UDFORSK" button within Apple's clean 12-column responsive container (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- Restore the original vertical structure of `components/landing/MachineTelemetrySection.tsx` (header on top, stat counter and autoscrolling machine viewport below) aligned to the 12-column grid (`md:col-span-4` and `md:col-span-8`).
- Remove the fabricated right-side prototype count badge from `app/katalog/page.tsx` and restore the author's original header hierarchy.

**Non-Goals:**
- Adding any new copy, cards, telemetry boxes, or secondary widgets.
- Changing database schemas, server actions, or business logic.

## Decisions

### 1. Removal of Highlight Borders & Focus Rings
- In `app/globals.css`, delete the forced `:focus-visible` rule specifying `#FFED00`.
- In `components/catalogue/CatalogueCard.tsx` and `components/landing/HeroSection.tsx`, revert focus styles to match original clean behavior.

### 2. Apple 12-Column Responsive Grid Standard
- Container: Standard Apple-style content containment (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- Gutters & Rhythm: Consistent gap tokens (`gap-6 md:gap-8`) across breakpoint transitions.
- Hero Section: Restored centered container (`max-w-xl mx-auto`) maintaining the original animated headline and single CTA button without intrusive side cards.

### 3. Machine Telemetry Section Restoration
- Top Header: Centered or left-aligned natural flow for headline and description (`max-w-2xl`).
- Grid Allocation: Standard 4/8 column split for stat counter (`md:col-span-4`) and machine cards viewport (`md:col-span-8`).

### 4. Catalogue Header Cleanliness
- Pure headline and category underline with the original concise description text, completely removing the right badge box.

## Risks / Trade-offs

- **[Risk]** Inadvertently altering accessibility while removing highlight borders.
  → *Mitigation*: Restore the pre-phase-1 native/cyan focus treatments from commit `173a659` that already maintained clean keyboard accessibility.
