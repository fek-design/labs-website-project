## Why

The first-phase git push (commit `d9f8cdc`) introduced unauthorized visual alterations: forced yellow highlight borders on focus (`:focus-visible`), bright yellow focus rings on cards and buttons, fabricated UI cards (such as the simulated campus status box in the hero and prototype count badge in the catalogue header), added body copy, and asymmetrical layout shifts. The objective is to remove all visual changes from that commit, restoring the author's original intended design, while strictly adopting Apple.com's clean 12-column responsive layout grid system.

## What Changes

- **Global Highlight Borders (`app/globals.css`)**: Remove the forced yellow `:focus-visible` outline (`#FFED00`).
- **Catalogue Card Focus Ring (`components/catalogue/CatalogueCard.tsx`)**: Revert yellow ring back to the author's original cyan focus ring (`#009FE3`).
- **HeroSection (`components/landing/HeroSection.tsx`)**: Remove yellow focus ring on button, remove the right-side "Køge Campus Status" card, and remove added `<p>` paragraph. Restore the author's original centered layout with the letter-by-letter animated headline and action button within Apple's responsive 12-column container.
- **MachineTelemetrySection (`components/landing/MachineTelemetrySection.tsx`)**: Revert the asymmetrical 35/65 side-by-side restructuring. Restore the original top-to-bottom hierarchy (headline and description on top, stat counter and autoscrolling machine viewport below) aligned to the standard 12-column grid.
- **Catalogue Header (`app/katalog/page.tsx`)**: Remove the fabricated right-side "Total Prototyper" badge card. Restore the author's original clean header structure while maintaining standard column gutters and container alignment.

## Capabilities

### Modified Capabilities
- `public-landing-portal`: Restore original hero and telemetry structure, removing highlight borders, fabricated cards, and extra body copy, while applying Apple's 12-column grid container.
- `catalogue-index-and-filters`: Remove yellow highlight rings and fabricated prototype count badge card, restoring the author's original visual styling.

## Impact

- **UI Components & Styles**: `app/globals.css`, `components/catalogue/CatalogueCard.tsx`, `components/landing/HeroSection.tsx`, `components/landing/MachineTelemetrySection.tsx`, `app/katalog/page.tsx`.
- **Zero Data/DB Impact**: No server actions, database tables, or business logic affected.
