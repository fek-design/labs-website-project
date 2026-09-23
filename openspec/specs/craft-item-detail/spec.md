# craft-item-detail Specification

## Purpose
Provides a detailed public craft item view that guides patrons through real-world production processes, machine capabilities, prerequisites, relevant manuals, and community inspiration with responsive motion-driven interactions.

## Requirements

### Requirement: Craft Item Detail Route and Dynamic Content Presentation
The system SHALL provide a dedicated route at `/craft/[slug]` that renders product information, prerequisites, technical equipment, and student inspiration matching the requested craft slug (e.g. `t-shirt`).

#### Scenario: Patron views the T-Shirt craft page
- **WHEN** the patron navigates to `/craft/t-shirt`
- **THEN** the system displays the T-Shirt hero visual, title, campus availability badges, production prerequisites, process options, machine specifications, community gallery, and relevant equipment manuals

#### Scenario: Patron accesses an unrecognized craft slug
- **WHEN** the patron visits `/craft/unknown-item`
- **THEN** the system displays a graceful 404 fallback with a return CTA directing the user back to the prototype carousel or landing page

### Requirement: Location Availability and Opening Hours
The craft item page SHALL display dynamic location availability badges indicating which labs (e.g., Makerspace Køge, Dimselab Roskilde) support the crafting process, along with their open hours.

#### Scenario: Patron views location availability
- **WHEN** viewing a craft item
- **THEN** the page displays distinct lab locations and opening hours where the necessary machinery is accessible

### Requirement: Cyan Prerequisites Callout
The craft item page SHALL render a prominent Cyan (`#009FE3`) alert section labeled "FORUDSÆTNINGER" detailing:
1. Materials the patron must bring (e.g., own cotton/polyester apparel).
2. Estimated production time range (e.g., 15–45 minutes).
3. Skill level / entry barrier (e.g., Begynder-venligt).

#### Scenario: Inspecting prerequisites
- **WHEN** the patron scrolls to the prerequisites block
- **THEN** the required materials, estimated duration, and difficulty level are displayed with high contrast against the Brand Black floor

### Requirement: Interactive Process Type Switcher
The craft item page SHALL provide an interactive process switcher (e.g., `Print` vs. `Broderi`) that dynamically updates the visible machine cards, technical parameters, and guidance without page reload.

#### Scenario: Patron switches process from Print to Broderi
- **WHEN** the patron clicks the `Broderi` tab
- **THEN** the active indicator animates to the new tab using fluid layout transitions, and the machine specification cards update to display embroidery machinery and embroidery parameters

### Requirement: Machine Specifications and Production Guidelines
The craft item page SHALL present detailed machine cards for the active process displaying:
1. Machine name and model.
2. Maximum physical dimensions / work area (`Max Størrelse`).
3. Accepted file formats (`Filformat`, e.g., SVG, PNG, PDF).
4. Run time per unit (`Tid`).
5. Material finish, longevity, and color vibrancy advice.

#### Scenario: Viewing machine specifications
- **WHEN** a process tab is active
- **THEN** the page displays the corresponding machinery cards with formatted technical limits and operation guidance

### Requirement: Community Inspiration Showcase
The craft item page SHALL render an "Andre har lavet" inspiration gallery displaying photographic examples of student-created artifacts tagged with process type and execution duration.

#### Scenario: Browsing community creations
- **WHEN** viewing the inspiration section
- **THEN** image cards display badges indicating the production process (e.g., `Print` or `Broderi`) and required time (e.g., `25 min`, `45 min`)

### Requirement: Relevant Machinery Manuals Integration
The craft item page SHALL display a quick-access "Relevante Manualer" card section linking to standard operating procedure (SOP) manuals and file preparation documentation corresponding to the craft's equipment (e.g., BN-20, GS-24, Varmepresser, Filopretning).

#### Scenario: Accessing machine manual
- **WHEN** the patron clicks a manual card
- **THEN** the system opens the corresponding manual document or guides the user to the documentation repository

### Requirement: Motion and Attention Orchestration
The craft item page SHALL orchestrate attention using `motion/react` physics, including subtle scroll-driven reveals, active tab transitions (`layoutId`), and micro-interactions on interactive cards.

#### Scenario: Patron interacts with craft page elements
- **WHEN** scrolling and hovering across interactive elements
- **THEN** transitions adhere to agency spring physics without jank or layout shift
