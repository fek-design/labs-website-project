# catalogue-index-and-filters Specification

## Purpose
Provides a centralized, location-aware catalogue interface for Zealand Labs students and educators to explore, filter, and access all physical fabrication prototypes, machines, and processes across campuses with purposeful quality-of-life filters and scalable tagging taxonomy.

## Requirements

### Requirement: Location-Aware Catalogue Grid
The catalogue page (`/katalog`) SHALL display all prototypes and activities available at the user's active campus context (`køge` or `roskilde`), updating reactively whenever the campus selection changes.

#### Scenario: Initial catalogue load with active campus
- **WHEN** a user navigates to `/katalog` with campus set to "køge"
- **THEN** the system SHALL display items available in Køge (such as Makerspace and Medialab activities) and render the active location indicator "køge" in the header.

#### Scenario: Dynamic campus change updates catalogue display
- **WHEN** the user switches active campus from "køge" to "roskilde" via the navigation header
- **THEN** the catalogue SHALL immediately re-scope the item list and lab filters to reflect Roskilde's facilities (e.g., Dimselab) without requiring a full page reload.

### Requirement: Non-Bloated Quality-of-Life Filtering
The catalogue SHALL provide streamlined, focused filtering consisting of free-text search, contextual lab tags, and category pills, without redundant or bloated input controls.

#### Scenario: Keyword search query filter
- **WHEN** the user enters search text into the search card input (e.g. "print" or "tekstil")
- **THEN** the grid SHALL filter in real time to show only items matching the title, tags, machines, or process descriptions.

#### Scenario: Contextual lab filter toggles
- **WHEN** the user clicks a lab pill (e.g., "Makerspace" or "Medialab")
- **THEN** the catalogue SHALL show only items belonging to that lab at the active campus, highlighting the active pill state.

#### Scenario: Category pill filter
- **WHEN** the user selects a category (e.g., "Beklædning", "3D Print", "Skæring", "Elektronik")
- **THEN** the grid SHALL restrict results to items categorized under that discipline.

#### Scenario: Reset and zero-match state
- **WHEN** active search or filter combinations yield zero matching prototypes
- **THEN** the system SHALL display a clean Scandinavian empty state with a single-click "Nulstil filtre" action that clears all active query parameters.

### Requirement: Future-Proof Tagging and Dynamic Item Routing
Each item in the catalogue SHALL be dynamically populated from the unified craft dataset using an extensible tagging schema and SHALL link directly to its corresponding craft detail page.

#### Scenario: Navigating from catalogue card to craft detail page
- **WHEN** the user clicks on an item card or action button (e.g., "T-Shirt")
- **THEN** the system SHALL navigate to `/craft/[slug]` (e.g., `/craft/t-shirt`) with zero latency.

#### Scenario: Scalable taxonomy metadata rendering
- **WHEN** a new craft item is added to the catalogue dataset with tags, difficulty, estimated time, and machine references
- **THEN** the catalogue index SHALL render the item card with proper tags, thumbnail, and category without requiring modifications to the page layout component.

### Requirement: Visual Fidelity to Figma Frame 144:335
The catalogue page SHALL implement the visual structure of Figma frame `144:335`, including dark base floor `#000000`, sharp card geometry (`rounded-none`), `#383838` search container, `#009FE3` cyan accent line, running marquee ribbon, and branded footer.

#### Scenario: Visual tokens and layout structure
- **WHEN** the `/katalog` page renders on any viewport
- **THEN** the page SHALL present the dark Scandinavian theme with Stack Sans typography, 2-column mobile grid adapting to multi-column desktop, and running `<MarqueeRibbon />` before the footer.
