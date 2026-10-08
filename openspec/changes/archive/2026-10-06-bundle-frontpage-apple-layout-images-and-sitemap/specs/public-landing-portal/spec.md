## MODIFIED Requirements

### Requirement: Hero Section and Navigation
The system SHALL present a centered responsive hero section featuring the Zealand Labs header, campus indicator scoped to Køge Campus, hamburger drawer trigger, and an exploration call-to-action button, structured within an Apple-style narrow container column width (max 1024px / `max-w-5xl`) with generous margins. The top navigation bar SHALL automatically hide on scroll down and smoothly reappear on scroll up, while the fullscreen navigation drawer SHALL provide explicit direct pathways for Students and Teachers, including the equipment catalogue (`/katalog`), machine live status (`#machines`), lab overview (`#support-pillars`), and the staff admin portal (`/admin`). The underlying multi-campus architecture SHALL remain intact for future campus expandability.

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator showing "Køge Campus", and the centered `Zealands Kreative hjørne` hero banner with the `UDFORSK` button, arranged within a focused Apple-style narrow layout container without yellow highlight borders, simulated campus status boxes, or extraneous paragraph text.

#### Scenario: User scrolls down the page
- **WHEN** a visitor scrolls downward past the header threshold (60px)
- **THEN** the system smoothly translates the top navigation bar upward out of view (`-translate-y-full`).

#### Scenario: User scrolls up after scrolling down
- **WHEN** a visitor scrolls upward while anywhere down the page
- **THEN** the system immediately and smoothly slides the top navigation bar back into view (`translate-y-0`).

#### Scenario: User opens navigation drawer
- **WHEN** a visitor clicks or taps the hamburger navigation toggle
- **THEN** the drawer displays distinct navigation pathways linking directly to Prototypes (`#prototypes`), Projects & Hotspots (`#showcase`), Labs & Guides (`#support-pillars`), Machines & Status (`#machines`), the Equipment Catalogue (`/katalog`), and the Admin Portal (`/admin`).

### Requirement: Brand Footer and Navigation Directory
The system SHALL render a branded footer styled in brand cyan with a clear, non-repetitive sitemap directory structured within Apple-style narrow column boundaries, providing unambiguous routes for both Student and Teacher personas.

#### Scenario: Footer index navigation
- **WHEN** the visitor reaches the bottom of the page
- **THEN** the system renders the cyan footer with `LABS` typography, mission statement, distinct direct links to the Equipment Catalogue (`/katalog`), Makerspace, Medialab, and Admin Console (`/admin`), without repeating redundant anchor tags.

## ADDED Requirements

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
