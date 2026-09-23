## Purpose

Enforces flush, gap-free section transitions on craft item pages, removing unwanted padding around the marquee ribbon and eliminating black gap artifacts above the footer.

## ADDED Requirements

### Requirement: Flush Laboratory Marquee Ribbon Integration on Craft Pages
The system SHALL render the laboratory `<MarqueeRibbon />` on `/craft/[slug]` directly flush against surrounding content without external top or bottom padding margins.

#### Scenario: User views craft item page marquee section
- **WHEN** the user views the craft item page at `/craft/[slug]`
- **THEN** the `<MarqueeRibbon />` connects directly between the process selector above and the white showcase zone below with zero intervening black margin or padding gap

### Requirement: Seamless Footer Transition Without Black Strip Below Manuals
The system SHALL transition the white "Relevante Manualer" section directly into `<LandingFooter />` without exposing an intermediate black background gap.

#### Scenario: User scrolls to the bottom of the craft item page
- **WHEN** the user scrolls past the "Relevante Manualer" section to the bottom of `/craft/[slug]`
- **THEN** the white background connects directly to the brand cyan footer without displaying an awkward black horizontal bar or margin
