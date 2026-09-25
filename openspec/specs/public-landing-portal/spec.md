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
The system SHALL present a responsive hero section featuring the Zealand Labs header, campus selector, hamburger drawer trigger, and an exploration call-to-action button.

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator (defaulting to Køge), and the `Zealands Kreative hjørne` hero banner with the `UDFORSK` button.

### Requirement: Infinite Lab Marquee
The system SHALL display an infinite running marquee ribbon transitioning across the lab pillars.

#### Scenario: Continuous marquee presentation
- **WHEN** the hero section is in view
- **THEN** the system continuously scrolls the label sequence `DIMSELAB • MAKERSPACE • MEDIALAB •` with seamless looped animation.

### Requirement: Prototype Inspiration Carousel
The system SHALL provide a horizontally scrollable carousel displaying prototype product categories for student inspiration, concluding with a streamlined catalogue navigation card where "Udforsk hele kataloget" serves as the primary header without secondary subtext clutter.

#### Scenario: Browsing prototype categories
- **WHEN** the visitor scrolls to the "Din næste prototype starter her" section
- **THEN** the system displays interactive product category cards (such as Kop, Mulepose, and T-Shirt) that can be horizontally navigated.

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
The system SHALL display the total machine inventory and live workstation cards retrieved from local database records.

#### Scenario: Live machine list rendering
- **WHEN** the hardware availability section loads
- **THEN** the system queries active static machines and displays the verified machine count (`10+ Maskiner`) alongside individual hardware status cards.

### Requirement: Brand Footer and Navigation Directory
The system SHALL render a branded footer with lab index navigation and operating ethos.

#### Scenario: Footer index navigation
- **WHEN** the visitor reaches the bottom of the page
- **THEN** the system renders the cyan footer with `LABS` typography, mission statement, and direct links to Makerspace, Medialab, and Dimselab directories.
