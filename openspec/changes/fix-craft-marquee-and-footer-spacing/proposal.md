## Why

On the craft item page (`/craft/[slug]`), a global `space-y-10 sm:space-y-14` class on `<main>` inadvertently imposed large vertical black margins directly above and below `<MarqueeRibbon />`, disrupting its intended full-bleed, flush presentation. Furthermore, a hardcoded `mt-8 sm:mt-12` on `<LandingFooter />` exposed an awkward black horizontal gap directly beneath the white "Relevante Manualer" zone.

## What Changes

- **Flush Marquee Presentation on Craft Page**: Restructure `<main>` in `app/craft/[slug]/page.tsx` to confine vertical flow spacing to the upper content sections (`CraftHero`, `CraftPrerequisites`, `CraftProcessSelector`), enabling `<MarqueeRibbon />` to connect seamlessly between the process selector and the white showcase zone without external padding or margins.
- **Elimination of Black Bar Under "Relevante Manualer"**: Add `className` support to `<LandingFooter />` and apply `mt-0` on `app/craft/[slug]/page.tsx`, allowing the white manuals section to transition directly into the brand cyan footer without revealing the black page background.

## Capabilities

### New Capabilities
- `craft-layout-spacing-refinement`: Defines seamless vertical section transitions on craft item pages, eliminating unwanted padding around the marquee ribbon and gaps above the footer.

### Modified Capabilities
None.

## Impact

- `app/craft/[slug]/page.tsx`: Removes global `space-y` from `<main>` and adds `className="mt-0"` to `<LandingFooter />`.
- `components/landing/LandingFooter.tsx`: Accepts optional `className` prop to allow callers to override default top margin.
