## MODIFIED Requirements

### Requirement: Hero Section and Navigation
The system SHALL present a responsive sticky top navigation bar and hero section structured within an Apple-style narrow container column width (`max-w-5xl`). The sticky top navigation bar SHALL feature the brand logo on the left returning to `/`, centered navigation items for Showcase (`/#showcase`), Maskiner (`/#machines`), and Guides (`/craft` or craft inspiration), and a prominent high-priority CTA button for the Equipment Catalogue (`/katalog`) on the right. The navigation bar SHALL implement a GSAP/IntersectionObserver scroll spy indicating the active section on the frontpage. When an anchor link (`#showcase`, `#machines`) is clicked on `/`, the system SHALL smooth-scroll to the target section; when clicked from other public routes (such as `/katalog` or `/craft/[slug]`), the system SHALL trigger a Next.js router navigation to the corresponding frontpage anchor (`/#<anchor>`). The hamburger drawer trigger SHALL be preserved for mobile viewports.

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator showing "Køge Campus", the centered navigation links, the prominent `/katalog` CTA button, and the centered `Zealands Kreative hjørne` hero banner with the `UDFORSK` button within the `max-w-5xl` column layout.

#### Scenario: User scrolls down the page
- **WHEN** a visitor scrolls downward past the header threshold (60px)
- **THEN** the system smoothly maintains the sticky top navigation bar with active scroll-spy indicators reflecting the currently viewed section.

#### Scenario: User scrolls up after scrolling down
- **WHEN** a visitor scrolls upward while anywhere down the page
- **THEN** the system immediately and smoothly ensures the top navigation bar remains accessible with crisp backdrop styling.

#### Scenario: User clicks anchor link from homepage
- **WHEN** a visitor clicks "Showcase" or "Maskiner" while browsing `/`
- **THEN** the browser smoothly scrolls directly to the corresponding `#showcase` or `#machines` section and updates the active spy indicator.

#### Scenario: User clicks anchor link from another route
- **WHEN** a visitor clicks "Showcase" or "Maskiner" while on `/katalog` or `/craft/[slug]`
- **THEN** the system executes a Next.js router push to `/#showcase` or `/#machines`, redirecting to the homepage and scrolling to the target section.

#### Scenario: User opens navigation drawer
- **WHEN** a visitor clicks or taps the hamburger navigation toggle
- **THEN** the drawer displays distinct navigation pathways linking directly to Prototypes (`#prototypes`), Projects & Hotspots (`#showcase`), Labs & Guides (`#support-pillars`), Machines & Status (`#machines`), the Equipment Catalogue (`/katalog`), and the Admin Portal (`/admin`).

### Requirement: Brand Footer and Navigation Directory
The system SHALL render a persistent 4-column utility belt footer across all public routes (`/`, `/katalog`, `/craft/[slug]`), structured within an Apple-style narrow container (`max-w-5xl`), organized into four distinct operational columns.

#### Scenario: Footer index navigation
- **WHEN** a visitor views the footer on any public route
- **THEN** the system renders a 4-column responsive grid containing:
  - **Column 1 (Zealand Labs)**: Campus physical location, opening hours, and real-time lab operational status indicator (e.g. "Makerspace: Åben").
  - **Column 2 (Udforsk)**: Direct links to Udstyrskatalog (`/katalog`), Craft Guides (`/craft` / `/craft/t-shirt`), and Prototype Galleri (`/#prototypes`).
  - **Column 3 (Support & Pillars)**: Makerspace Retningslinjer (`/#support-pillars`), Medialab Retningslinjer (`/#support-pillars`), and Kontakt / Hjælp.
  - **Column 4 (Personale)**: Underviser Login trigger and direct link to Admin Dashboard (`/admin`) requiring authentication.
