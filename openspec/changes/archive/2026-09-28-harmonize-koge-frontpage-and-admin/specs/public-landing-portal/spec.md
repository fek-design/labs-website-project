## MODIFIED Requirements

### Requirement: Hero Section and Navigation
The system SHALL present a responsive hero section featuring the Zealand Labs header, campus indicator scoped to Køge Campus, hamburger drawer trigger, and an exploration call-to-action button, without presenting a blocking first-time campus gate modal.

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator showing "Køge Campus", and the `Zealands Kreative hjørne` hero banner with the `UDFORSK` button, without displaying a campus selection modal.

### Requirement: Prototype Inspiration Carousel
The system SHALL provide a horizontally scrollable carousel displaying prototype product categories for student inspiration populated with admin-curated featured craft items (up to 5 items) linking to `/craft/[slug]`, concluding with a streamlined catalogue navigation card where "Udforsk hele kataloget" serves as the primary header without secondary subtext clutter.

#### Scenario: Browsing prototype categories
- **WHEN** the visitor scrolls to the "Din næste prototype starter her" section
- **THEN** the system displays interactive product category cards dynamically populated from the admin-curated featured craft items (e.g. T-Shirt, Kop, Mulepose, 3D Print, Plakat) that can be horizontally navigated.

#### Scenario: Viewing streamlined catalogue CTA card
- **WHEN** the visitor navigates to the end of the prototype carousel
- **THEN** the catalogue terminal card SHALL display "Udforsk hele kataloget" at the top replacing "Katalog", omit redundant explanatory body subtext, and offer a direct navigation action to `/katalog`.

### Requirement: Live Hardware Availability Status
The system SHALL display the total machine inventory and live workstation cards retrieved directly from local database records partitioned by macro lab facilities (`makerspace` and `medialab`) without heuristic string parsing or unbacked facility categories.

#### Scenario: Live machine list rendering
- **WHEN** the hardware availability section loads
- **THEN** the system queries active static machines and borrowable items by their foreign key `lab.slug` (`makerspace` and `medialab`) and displays verified machine counts alongside individual hardware status cards.
