## MODIFIED Requirements

### Requirement: Physical Location Metadata and Filtering
The system SHALL organize inventory metadata using a 2-Tier Namespaced Faceted Taxonomy (`DISCIPLINE` and `PROCESS`), alongside Macro-Lab assignments (`Makerspace (Køge)`, `MediaLab (Køge)`, and `Roskilde` architectural placeholder), providing a dual-mode List/Grid view interface with the canonical POS-harmonized page header architecture (`LABS Inventar` in `Stack Sans Notch`, admin greeting, live KPI counters), high-contrast search, quick view-mode switching, and synchronization with the global admin lab switcher.

#### Scenario: Filtering inventory by physical location
- **WHEN** an administrator selects a macro facility filter (`Makerspace (Køge)`, `MediaLab (Køge)`, or `Roskilde`)
- **THEN** the system returns only inventory assets assigned to that macro lab facility

#### Scenario: Filtering inventory by taxonomy tag and status
- **WHEN** an administrator selects a discipline or process filter and status "AVAILABLE"
- **THEN** the system displays matching items with their operational badges and 2-tier facet tags

#### Scenario: Switching between List and Grid view modes
- **WHEN** an administrator toggles the view switch inside the inventory search toolbar
- **THEN** the system switches the display between a dense single-line List view with status pill clusters and a responsive multi-column Grid card layout with descriptions and action buttons

#### Scenario: Header KPI rendering and global lab synchronization
- **WHEN** an administrator switches the global lab or views the inventory workspace
- **THEN** the system renders the canonical `LABS Inventar` header with live available/total asset KPI counters and updates the inventory filter to the selected lab.
