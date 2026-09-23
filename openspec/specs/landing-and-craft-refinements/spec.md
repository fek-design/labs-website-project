# landing-and-craft-refinements Specification

## Purpose
Standardizes laboratory ribbon components across craft item pages and ensures reliable visibility, item curation, and catalogue navigation within the landing page prototype carousel.

## Requirements

### Requirement: Landing Prototype Carousel Visibility and Robust Scroll Entrance
The prototype carousel SHALL ensure that all prototype item cards and header elements animate cleanly into view and remain fully visible (`opacity: 1`) after trigger execution without becoming stuck in an invisible state.

#### Scenario: User scrolls to Prototype Carousel on landing page
- **WHEN** the user scrolls down to the Prototype Carousel section
- **THEN** the section header and prototype item cards smoothly reveal and remain fully visible with proper opacity and interaction states

#### Scenario: Page layout or viewport changes
- **WHEN** the page completes initial client hydration or viewport resizing occurs
- **THEN** carousel cards maintain visible styling and do not collapse to hidden or zero-opacity states

### Requirement: Prototype Carousel Item Curation and Catalogue Navigation Tile
The prototype carousel SHALL display exactly 5 curated prototype item cards, followed by a terminal action tile that invites users to explore the full catalogue at `/katalog`.

#### Scenario: User views prototype items in the carousel
- **WHEN** the user inspects the prototype carousel
- **THEN** exactly 5 item cards (T-Shirt, Kop, Mulepose, 3D Print, and Plakat) are displayed with photography and titles

#### Scenario: User inspects the final item in the carousel
- **WHEN** the user scrolls to the end of the carousel track
- **THEN** a dedicated catalogue action card is presented with a link to `/katalog` and distinctive action typography

### Requirement: Unified Marquee Laboratory Ribbon on Craft Item Pages
Craft item pages (`/craft/[slug]`) SHALL render the canonical, dual-track `<MarqueeRibbon />` component to ensure consistent motion, typography, and styling with the landing page.

#### Scenario: User views a craft item detail page
- **WHEN** a user navigates to `/craft/[slug]`
- **THEN** the canonical `<MarqueeRibbon />` component is displayed as the section divider between the process selector and inspiration gallery
