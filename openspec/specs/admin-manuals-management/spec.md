# admin-manuals-management Specification

## Purpose
Provides a centralized, high-fidelity administrative workspace for managing, uploading, and linking laboratory PDF manuals, user guides, and standard operating procedures (SOPs) to physical hardware matching Figma frame 86:4076.

## Requirements

### Requirement: Centralized Manuals Dashboard
The system SHALL provide a dedicated top-level admin page (`LABS Manualer`) matching Figma frame 86:4076 with brand pink `#E6007E` accent styling, live document counters, search toolbar, and 3-column card grid.

#### Scenario: Viewing manuals dashboard
- **WHEN** an authenticated administrator opens the Manuals tab
- **THEN** the system displays the `LABS Manualer` header, search toolbar, live available manual count, and a responsive grid of document cards.

#### Scenario: Empty state handling
- **WHEN** no manuals match the current search or filter criteria
- **THEN** the system displays an informative zero-data state with a prompt to upload a new manual or clear active filters.

### Requirement: PDF Document Upload and Metadata Management
The system SHALL provide an upload workflow triggered by the pink "Tilføj" button allowing administrators to upload local PDF files, define titles, descriptions, categories, and tags.

#### Scenario: Uploading a new PDF manual
- **WHEN** an administrator clicks "Tilføj", selects a valid PDF file, fills in title and description, and submits
- **THEN** the system stores the file on local disk, registers the database record, and displays the new card in the grid.

#### Scenario: Deleting a manual document
- **WHEN** an administrator initiates manual deletion and confirms the action
- **THEN** the system removes the database record and unlinks it from all associated equipment.

### Requirement: Inline Equipment and Machine Linking
Each manual card SHALL display a "Links (N)" cluster listing linked hardware items with quick "Se" detail triggers and unlinking "x" buttons, plus a "Tilføj +" control to associate new equipment.

#### Scenario: Linking manual to physical equipment
- **WHEN** an administrator selects "Tilføj +" on a manual card and chooses an inventory item or machine
- **THEN** the system creates a relation record and immediately updates the linked hardware count and pills on the card.

#### Scenario: Unlinking manual from equipment
- **WHEN** an administrator clicks the unlinking "x" button on a linked hardware pill
- **THEN** the system disassociates the hardware while keeping the manual document intact in the central repository.

### Requirement: Filter and Search Telemetry
The system SHALL support instant real-time text search across manual titles, filenames, and descriptions, alongside dropdown filters for `LAB` and `TYPE`.

#### Scenario: Filtering manuals by lab facility
- **WHEN** an administrator selects a specific lab from the `LAB` dropdown
- **THEN** the grid updates to show only manuals relevant or linked to hardware within the selected lab facility.
