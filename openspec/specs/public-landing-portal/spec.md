# public-landing-portal Specification

## Purpose
The Public Landing Portal provides students, educators, and visitors with a high-fidelity visual gateway to Zealand Labs, displaying lab specializations, prototype inspiration, interactive project showcases, and real-time equipment availability, while preserving the staff administration launchpad at a dedicated route.

## Requirements

### Requirement: Preservation of Admin Dashboard at /admin
The system SHALL preserve the staff administration launchpad previously located at `/` by hosting it at the dedicated route `/admin`.

#### Scenario: Staff accesses administrative management console
- **WHEN** an administrator navigates to `/admin`
- **THEN** the system displays the admin console dashboard with active loan statistics, gear counts, overdue counters, and quick links to the POS calendar, machine manuals, and inventory management.

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

### Requirement: Infinite Lab Marquee
The system SHALL display an infinite running marquee ribbon transitioning across the active Køge lab pillars.

#### Scenario: Continuous marquee presentation
- **WHEN** the hero section is in view
- **THEN** the system continuously scrolls the label sequence `MAKERSPACE • MEDIALAB •` with seamless looped animation, omitting any reference to Dimselab.

### Requirement: Prototype Inspiration Carousel
The system SHALL provide a horizontally scrollable carousel displaying prototype product categories for student inspiration populated with admin-curated featured craft items (up to 5 items) linking to `/craft/[slug]`, concluding with a streamlined catalogue navigation card where "Udforsk hele kataloget" serves as the primary header without secondary subtext clutter.

#### Scenario: Browsing prototype categories
- **WHEN** the visitor scrolls to the "Din næste prototype starter her" section
- **THEN** the system displays interactive product category cards dynamically populated from the admin-curated featured craft items (e.g. T-Shirt, Kop, Mulepose, 3D Print, Plakat) that can be horizontally navigated.

#### Scenario: Viewing streamlined catalogue CTA card
- **WHEN** the visitor navigates to the end of the prototype carousel
- **THEN** the catalogue terminal card SHALL display "Udforsk hele kataloget" at the top replacing "Katalog", omit redundant explanatory body subtext, and offer a direct navigation action to `/katalog`.

### Requirement: Interactive Project Hotspots
The system SHALL present showcase cards containing interactive hotspot beacons that reveal specific equipment or process details exclusively upon explicit click or tap interaction, removing passive hover activation.

#### Scenario: Triggering an equipment hotspot
- **WHEN** the visitor clicks or taps on a pulsing hotspot beacon over a project showcase card
- **THEN** an informative popover card is revealed with tactile spring physics, remaining open until toggled off or dismissed.

#### Scenario: Hovering without clicking
- **WHEN** the visitor hovers their pointer over a hotspot beacon without clicking
- **THEN** the popover card SHALL NOT mount or open, preventing accidental obstruction while browsing images.

### Requirement: Prototyping and Guidance Step Indicator
The system SHALL display an educational section explaining the prototyping methodology with structured progress tabs.

#### Scenario: Viewing support capabilities
- **WHEN** the visitor navigates through the "Prototyping & Understøttelse" block
- **THEN** the system presents the key guidance pillars with active indicator bars highlighting each stage.

### Requirement: Featured Lab Highlight Card
The system SHALL present high-contrast featured lab cards displaying detailed lab descriptions in brand cyan styling.

#### Scenario: Reading lab focus description
- **WHEN** the visitor reaches the Makerspace spotlight card
- **THEN** the system presents the high-contrast Cyan (`#009FE3`) surface detailing fabric printing, 3D printing, and laser cutting capabilities.

### Requirement: Live Hardware Availability Status
The system SHALL display the total machine inventory and live workstation cards retrieved directly from local database records partitioned by macro lab facilities (`makerspace` and `medialab`) without heuristic string parsing or unbacked facility categories.

#### Scenario: Live machine list rendering
- **WHEN** the hardware availability section loads
- **THEN** the system queries active static machines and borrowable items by their foreign key `lab.slug` (`makerspace` and `medialab`) and displays verified machine counts alongside individual hardware status cards.

### Requirement: Brand Footer and Navigation Directory
The system SHALL render a persistent 4-column utility belt footer across all public routes (`/`, `/katalog`, `/craft/[slug]`), structured within an Apple-style narrow container (`max-w-5xl`), organized into four distinct operational columns.

#### Scenario: Footer index navigation
- **WHEN** a visitor views the footer on any public route
- **THEN** the system renders a 4-column responsive grid containing:
  - **Column 1 (Zealand Labs)**: Campus physical location, opening hours, and real-time lab operational status indicator (e.g. "Makerspace: Åben").
  - **Column 2 (Udforsk)**: Direct links to Udstyrskatalog (`/katalog`), Craft Guides (`/craft` / `/craft/t-shirt`), and Prototype Galleri (`/#prototypes`).
  - **Column 3 (Support & Pillars)**: Makerspace Retningslinjer (`/#support-pillars`), Medialab Retningslinjer (`/#support-pillars`), and Kontakt / Hjælp.
  - **Column 4 (Personale)**: Underviser Login trigger and direct link to Admin Dashboard (`/admin`) requiring authentication.

### Requirement: Asymmetrical Span Allocations and Human Attention Optimization
The Public Landing Portal SHALL structure core editorial sections (Hero, Machine Telemetry, Prototyping Support) using asymmetrical grid span allocations (such as 35/65 or 40/60) where textual copy is strictly bound to ergonomic reading measures (45–65 characters / `max-w-prose`) and graphic/interactive components occupy the primary visual space.

#### Scenario: Rendering hero section on desktop viewports
- **WHEN** a visitor views the landing page on viewports >= 1024px
- **THEN** text copy and call-to-actions are constrained to a tight left column while interactive visual showcases and telemetry graphics dominate the larger right column.

#### Scenario: Reading comfort on large screens
- **WHEN** long-form descriptions or guidelines are displayed
- **THEN** line lengths SHALL NOT exceed 65 characters, preventing eye fatigue and horizontal head scanning.

### Requirement: AI-First Structured Data and Machine Discoverability
The Public Landing Portal SHALL embed Schema.org JSON-LD graph objects defining the facility, equipment capabilities, and operational taxonomy for AI search agents and semantic web parsers.

#### Scenario: AI crawler parses landing page
- **WHEN** an AI crawler or search engine inspects `/`
- **THEN** a valid `<script type="application/ld+json">` block is present in the DOM containing `EducationalOrganization`, active facility names ("Makerspace", "Medialab"), campus address ("Køge"), and primary public capabilities.

### Requirement: Accessibility and Disability Compliance (WCAG 2.2 AA)
The Public Landing Portal SHALL provide high-visibility keyboard focus indicators, accessible ARIA descriptions, and support for reduced-motion preferences across all interactive elements.

#### Scenario: Navigating with keyboard tab sequence
- **WHEN** a user navigates interactive buttons, links, or drawer triggers using `Tab`
- **THEN** each element displays an unmistakable focus ring (`focus-visible:ring-2 focus-visible:ring-[#FFED00]`) with at least 4.5:1 contrast against adjacent surfaces.

#### Scenario: Reduced motion preference enabled
- **WHEN** a user has system preference `prefers-reduced-motion: reduce` enabled
- **THEN** hero animations, marquee ribbon motion, and parallax transitions are disabled or replaced with immediate non-distracting cross-fades.

### Requirement: Graceful Media and Image Box Fallback
The system SHALL render a resilient physical container box for every media card on the landing page (including Prototype Carousel cards, Project Hotspots, and Machine Telemetry items) when an image URL is missing, null, empty, or fails to load, preventing broken image placeholders and suppressing browser image decoding errors.

#### Scenario: Item with missing or invalid image URL renders fallback
- **WHEN** a prototype card or machine telemetry item lacks a valid image source or encounters a load error
- **THEN** the system maintains the exact layout dimensions of the card and displays a styled dark glassmorphic box (`bg-[#18181b] border border-[#262626]`) with an iconic placeholder, preserving visual consistency without broken image error glyphs or layout shift.

### Requirement: Apple-Style Focused Layout Container
The system SHALL constrain core editorial, carousel, telemetry, and footer sections on the landing page to a maximum content width of 1024px (`max-w-5xl`), providing generous lateral breathing room and ensuring typographical line lengths remain between 45 and 65 characters on wide viewports.

#### Scenario: Viewing landing page on wide desktop display
- **WHEN** a user views `/` on a screen width greater than 1024px
- **THEN** the page content is horizontally centered within a 1024px column container with balanced lateral gutters, avoiding visual sprawl.
