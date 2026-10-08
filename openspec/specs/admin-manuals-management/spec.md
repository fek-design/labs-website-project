# admin-manuals-management Specification

## Purpose
Provides a centralized, high-fidelity administrative workspace for managing, uploading, and linking laboratory PDF manuals, user guides, and standard operating procedures (SOPs) to physical hardware matching Figma frame 86:4076.

## Requirements

### Requirement: Centralized Manuals Dashboard
The system SHALL provide a dedicated top-level admin page (`LABS Manualer`) matching Figma frame 86:4076 with brand yellow `#FFED00` accent styling corresponding to Tab 4 in the cyclic navigation scheme, live document counters, search toolbar featuring neutral focus border styling without yellow rings, and 3-column card grid.

#### Scenario: Viewing manuals dashboard
- **WHEN** an authenticated administrator opens the Manuals tab
- **THEN** the system displays the `LABS Manualer` header with yellow accent styling, search toolbar with neutral focus borders, live available manual count, and a responsive grid of document cards.

#### Scenario: Empty state handling
- **WHEN** no manuals match the current search or filter criteria
- **THEN** the system displays an informative zero-data state with a prompt to upload a new manual or clear active filters.

### Requirement: PDF Document Upload and Metadata Management
The system SHALL provide an upload workflow allowing authenticated administrators to upload PDF documents, strictly verifying PDF magic bytes (`%PDF-`), rejecting non-PDF or executable scripts, enforcing a 20 MB size limit, and associating metadata.

#### Scenario: Uploading a new PDF manual
- **WHEN** an authenticated administrator uploads a file with valid PDF magic bytes (`%PDF-`), filename, title, and description
- **THEN** the system stores the file in designated local storage, registers the database record, and displays the card in the manuals grid.

#### Scenario: Deleting a manual document
- **WHEN** an administrator initiates manual deletion and confirms the action
- **THEN** the system removes the database record and unlinks it from all associated equipment.

### Requirement: Inline Equipment and Machine Linking
Each manual card and manual edit popup SHALL display a "Links (N)" cluster listing linked hardware items with quick "Se" detail triggers and unlinking "x" buttons, plus a "Tilføj +" control to open the equipment linking side drawer (`Card - Links side to edit/create` node `87:6513`).

#### Scenario: Linking manual to physical equipment via side drawer
- **WHEN** an administrator selects "Tilføj +" on a manual card or within `MANUALS - Card Edit`
- **THEN** the system displays the `LINKS Many-to-Many documentation library` drawer (node `87:6513`) with live search and 2-column machine selection cards to link equipment.

#### Scenario: Unlinking manual from equipment
- **WHEN** an administrator clicks the unlinking "x" button on a linked hardware pill
- **THEN** the system disassociates the hardware while keeping the manual document intact in the central repository.

### Requirement: Dedicated Manual Edit Card Popup
The system SHALL provide a dedicated `MANUALS - Card Edit` modal popup (Figma node `89:7194` / `209:2`) matching `#202021` card surface with 1px `#444444` border, document thumbnail preview frame, manual title, filename & size subtitle, white `#ffffff` "Læs Online" action button, editable "Beskrivelse" textarea in `#151517` / `#333333`, "Links (N)" list with yellow `#ffd900` "Se" pill buttons, and pink `#e51d87` "Slet" action button.

#### Scenario: Opening manual edit card from manuals manager
- **WHEN** an administrator clicks on a manual card or its edit action in the manuals manager
- **THEN** the system opens the `MANUALS - Card Edit` popup presenting manual metadata, "Læs Online" link, editable description, linked hardware list, and delete action.

#### Scenario: Reading manual online
- **WHEN** an administrator clicks the white "Læs Online" button in `MANUALS - Card Edit`
- **THEN** the system opens the target PDF document in a new browser tab or inline viewer.

### Requirement: Filter and Search Telemetry
The system SHALL support instant real-time text search across manual titles, filenames, and descriptions, alongside dropdown filters for `LAB` and `TYPE`.

#### Scenario: Filtering manuals by lab facility
- **WHEN** an administrator selects a specific lab from the `LAB` dropdown
- **THEN** the grid updates to show only manuals relevant or linked to hardware within the selected lab facility.

### Requirement: Anti-Executable Upload Rejection
The file upload engine SHALL reject any upload that fails magic bytes inspection or exceeds size limits.

#### Scenario: Rejecting invalid or non-PDF file upload
- **WHEN** an upload is submitted containing executable code, scripts, HTML payloads, or files without `%PDF-` header bytes
- **THEN** the system rejects the upload with a validation error and writes nothing to disk.
