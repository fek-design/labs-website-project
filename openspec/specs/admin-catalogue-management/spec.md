# admin-catalogue-management Specification

## Purpose
Provides a dedicated administrator portal (`LABS Katalog`) with distinct amber accent styling for curating, categorizing, and managing public craft projects, guides, and showcase prototypes.

## Requirements

### Requirement: Dedicated Catalogue Administration Dashboard
The system SHALL provide a unified top-level admin page (`LABS Katalog`) featuring brand magenta accent styling (`#E6007E`) matching its position as Tab 3 in the cyclic navigation scheme, consolidating craft article creation, step-by-step editing, tools/materials management, and public showcase curation into a single cohesive interface.

#### Scenario: Navigating to catalogue management
- **WHEN** an administrator clicks the Catalogue icon in the left navigation dock
- **THEN** the system renders the unified `LABS Katalog` view with magenta accent metrics, category filter controls, project list, and craft creation/editing tools.

### Requirement: Public Showcase and Category Curation
The system SHALL allow administrators to curate featured items on the public `/katalog` and landing page, toggle showcase status, create and edit craft guide articles with steps, tools, and media, and update project metadata.

#### Scenario: Toggling showcase curation
- **WHEN** an administrator toggles the showcase status for a catalogue item
- **THEN** the system updates the database flag and synchronizes the public landing page prototype showcase.

#### Scenario: Creating or editing a craft project from the catalogue view
- **WHEN** an administrator clicks "Nyt Projekt" or edits an existing catalogue item
- **THEN** the system opens the full article editor with title, slug, summary, category selection, step-by-step instructions, required tools, and media uploads.
