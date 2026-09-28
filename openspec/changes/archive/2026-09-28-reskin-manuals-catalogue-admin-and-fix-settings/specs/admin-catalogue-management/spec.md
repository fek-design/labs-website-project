## Purpose

Provides a dedicated administrator portal (`LABS Katalog`) with distinct amber accent styling for curating, categorizing, and managing public craft projects, guides, and showcase prototypes.

## ADDED Requirements

### Requirement: Dedicated Catalogue Administration Dashboard
The system SHALL provide a dedicated top-level admin page (`LABS Katalog`) featuring a distinctive brand accent color (`#FF9900` Amber), isolating public catalogue content management from physical equipment inventory.

#### Scenario: Navigating to catalogue management
- **WHEN** an administrator clicks the Catalogue icon in the left navigation dock
- **THEN** the system renders the `LABS Katalog` view with amber accent metrics, category filter controls, and project list.

### Requirement: Public Showcase and Category Curation
The system SHALL allow administrators to curate featured items on the public `/katalog` and landing page, toggle showcase status, and update project metadata.

#### Scenario: Toggling showcase curation
- **WHEN** an administrator toggles the showcase status for a catalogue item
- **THEN** the system updates the database flag and synchronizes the public landing page prototype showcase.
