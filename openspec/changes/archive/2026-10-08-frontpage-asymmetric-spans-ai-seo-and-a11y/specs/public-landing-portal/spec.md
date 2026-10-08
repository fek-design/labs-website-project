## MODIFIED Requirements

### Requirement: Hero Section and Navigation
The system SHALL present a responsive sticky top navigation bar featuring the brand logo on the left returning to `/`, the campus location indicator badge, and a universal hamburger navigation toggle on the right across all viewports (mobile, tablet, and desktop). The desktop quicklaunch "Katalog" CTA button SHALL be removed. Desktop navigation SHALL NOT display standalone center anchor links in the top bar; instead, all navigation destinations SHALL be accessible via the universal hamburger drawer. When an anchor link (`#showcase`, `#machines`, `#support-pillars`, `#prototypes`) is clicked on `/`, the system SHALL smooth-scroll to the target section; when clicked from other public routes (such as `/katalog` or `/craft/[slug]`), the system SHALL trigger a Next.js router navigation to the corresponding frontpage anchor (`/#<anchor>`).

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator showing "Køge Campus", the universal hamburger menu toggle on the right, and no standalone quicklaunch CTA button.

#### Scenario: User scrolls down the page
- **WHEN** a visitor scrolls downward past the header threshold (60px)
- **THEN** the system smoothly maintains the sticky top navigation bar or hides gracefully while keeping the drawer accessible.

#### Scenario: User scrolls up after scrolling down
- **WHEN** a visitor scrolls upward while anywhere down the page
- **THEN** the system immediately and smoothly ensures the top navigation bar remains accessible with crisp backdrop styling.

#### Scenario: User clicks anchor link from homepage
- **WHEN** a visitor clicks "Showcase" or "Maskiner" from the navigation drawer while browsing `/`
- **THEN** the browser smoothly scrolls directly to the corresponding `#showcase` or `#machines` section and closes the drawer.

#### Scenario: User clicks anchor link from another route
- **WHEN** a visitor clicks "Showcase" or "Maskiner" while on `/katalog` or `/craft/[slug]`
- **THEN** the system executes a Next.js router push to `/#showcase` or `/#machines`, redirecting to the homepage and scrolling to the target section.

#### Scenario: User opens navigation drawer
- **WHEN** a visitor clicks or taps the hamburger navigation toggle on any viewport
- **THEN** the drawer displays distinct navigation pathways linking directly to Prototypes & Guides (`#prototypes`), Projects & Hotspots (`#showcase`), Labs & Guides (`#support-pillars`), Machines & Status (`#machines`), the Equipment Catalogue (`/katalog`), and the Admin Portal (`/admin`).

### Requirement: Brand Footer and Navigation Directory
The system SHALL render a persistent 4-column utility belt footer across all public routes (`/`, `/katalog`, `/craft/[slug]`), structured within an Apple-style narrow container (`max-w-5xl`), organized into four distinct operational columns. The system SHALL NOT display the "is currently open" status pill and SHALL NOT display any copyright notice at the bottom. All hyperlinks in the footer SHALL link exclusively to valid, functioning application routes and verified anchors, removing all links to unrouted files, placeholders, or blank pages.

#### Scenario: Footer index navigation
- **WHEN** a visitor views the footer on any public route
- **THEN** the system renders a 4-column responsive grid containing:
  - **Column 1 (Zealand Labs)**: Campus physical location and operating hours, with no "is currently open" status pill.
  - **Column 2 (Udforsk)**: Direct links to Udstyrskatalog (`/katalog`), Craft Guides (`/craft/t-shirt`), Projekter & Hotspots (`/#showcase`), Maskintelemetri (`/#machines`), and Prototype Galleri (`/#prototypes`).
  - **Column 3 (Support & Pillars)**: Makerspace Retningslinjer (`/#support-pillars`) and MediaLab & Udlånsregler (`/#support-pillars`), with zero links to unrouted manual files or placeholder PDFs.
  - **Column 4 (Personale)**: Direct links to Admin Portal (`/admin`) and POS Udlånsskranke (`/admin/pos`).
  - **Bottom Utility Bar**: Identity and offline status bar without any copyright notices.

### Requirement: Asymmetrical Span Allocations and Human Attention Optimization
The Public Landing Portal SHALL structure core editorial sections (Hero, Machine Telemetry, Prototyping Support) using asymmetrical grid span allocations (such as 35/65 or 40/60) where textual copy is strictly bound to ergonomic reading measures (45–65 characters / `max-w-prose`) and graphic/interactive components occupy the primary visual space. In `CampusLabExplorer.tsx`, the layout SHALL follow an 8-12-16 responsive grid structure with all spacings and dimensional rhythm divisible by 8: stacked on mobile (`grid-cols-1 gap-8`) and scaled as an asymmetrical 12-column grid (`lg:grid-cols-12 gap-8`) on desktop allocating 5 columns (`lg:col-span-5`) to narrative copy and step indicators, and 7 columns (`lg:col-span-7`) to the visual CMYK spotlight card.

#### Scenario: Rendering hero section on desktop viewports
- **WHEN** a visitor views the landing page on viewports >= 1024px
- **THEN** text copy and call-to-actions are constrained to a tight left column while interactive visual showcases and telemetry graphics dominate the larger right column.

#### Scenario: Reading comfort on large screens
- **WHEN** long-form descriptions or guidelines are displayed
- **THEN** line lengths SHALL NOT exceed 65 characters, preventing eye fatigue and horizontal head scanning.

#### Scenario: Asymmetrical desktop layout for lab explorer
- **WHEN** a visitor views the Prototyping & Understøttelse section on a viewport >= 1024px
- **THEN** the system renders a 12-column grid where the left text narrative and step tabs occupy 5 columns and the right spotlight card occupies 7 columns, sharing the horizontal row.

#### Scenario: Mobile stacked layout for lab explorer
- **WHEN** a visitor views the Prototyping & Understøttelse section on a viewport < 1024px
- **THEN** the system renders a stacked 1-column layout with vertical gap divisible by 8 (`gap-8` / 32px).
