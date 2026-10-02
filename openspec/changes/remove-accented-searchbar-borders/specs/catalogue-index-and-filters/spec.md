## MODIFIED Requirements

### Requirement: Non-Bloated Quality-of-Life Filtering
The catalogue SHALL provide streamlined, focused filtering consisting of free-text search, contextual lab tags, and category pills, without redundant or bloated input controls. The search input container SHALL use clean neutral border styling (`#555555`) upon focus without cyan or colored highlight rings.

#### Scenario: Keyword search query filter
- **WHEN** the user enters search text into the search card input (e.g. "print" or "tekstil")
- **THEN** the grid SHALL filter in real time to show only items matching the title, tags, machines, or process descriptions, while the search input maintains a neutral border without colored accent rings.

#### Scenario: Contextual lab filter toggles
- **WHEN** the user clicks a lab pill (e.g., "Makerspace" or "Medialab")
- **THEN** the catalogue SHALL show only items belonging to that lab at the active campus, highlighting the active pill state.

#### Scenario: Category pill filter
- **WHEN** the user selects a category (e.g., "Beklædning", "3D Print", "Skæring", "Elektronik")
- **THEN** the grid SHALL restrict results to items categorized under that discipline.

#### Scenario: Reset and zero-match state
- **WHEN** active search or filter combinations yield zero matching prototypes
- **THEN** the system SHALL display a clean Scandinavian empty state with a single-click "Nulstil filtre" action that clears all active query parameters.
