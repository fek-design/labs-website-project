# inventory-location-management Specification

## Purpose
Provides inventory asset registration, editing, taxonomy tag filtering, and specific physical location tracking (room, shelf, locker, cabinet) across Zealand Labs facilities.

## Requirements

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

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL auto-generate deterministic, unique asset tags following the taxonomy schema `[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` upon item creation using the 2-tier taxonomy (`DISCIPLINE` and `PROCESS`), disabling manual asset tag text entry, and presenting the item creation and editing interfaces as centered modal cards (`Card - Create` and `Card - Edit`) containing equipment name, serial number, purchase date, lab facility, type, manual attachments, and description.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator selects a macro lab, discipline/process tag, and inputs item name in the creation drawer
- **THEN** the system automatically generates a unique deterministic asset tag (e.g. `MK-3DP-0001` or `ML-CAM-0001`), creates the `Inventory` record, and logs a `CREATE_INVENTORY` audit entry

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, or macro lab facility
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log

#### Scenario: Creating a new inventory item with extended metadata
- **WHEN** an administrator submits the item creation modal with name, macro lab, hardware type, optional serial number, and optional purchase date
- **THEN** the system computes the next sequential deterministic asset tag, creates the `Inventory` record, associates any selected documentation manuals, and logs a `CREATE_INVENTORY` audit entry

#### Scenario: Editing an existing inventory asset with modal card interface
- **WHEN** an administrator updates an item's status, serial number, purchase date, or description from `Card - Edit`
- **THEN** the system persists changes to MySQL, updates local reactive state, and writes an `UPDATE_INVENTORY` audit log

### Requirement: Equipment Manuals Documentation Library Integration
The system SHALL provide a dedicated slide-out documentation browser (`Card - Manual side to edit/create`) accessible from item creation and edit cards, allowing administrators to search, inspect, and link many-to-many PDF manuals and standard operating procedures (SOPs) to equipment assets.

#### Scenario: Attaching manuals to an equipment item
- **WHEN** an administrator opens the manual selection library from the item modal and selects one or more manuals
- **THEN** the selected manuals are linked to the equipment item and previewed as dismissible cards with quick view actions

#### Scenario: Removing an attached manual
- **WHEN** an administrator clicks the remove icon ("x") next to a linked manual in the item card
- **THEN** the manual is unlinked from the item without deleting the underlying manual file from the documentation repository
