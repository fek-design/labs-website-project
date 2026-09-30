## MODIFIED Requirements

### Requirement: Centralized Manuals Dashboard
The system SHALL provide a dedicated top-level admin page (`LABS Manualer`) matching Figma frame 86:4076 with brand yellow `#FFED00` accent styling corresponding to Tab 4 in the cyclic navigation scheme, live document counters, search toolbar, and 3-column card grid.

#### Scenario: Viewing manuals dashboard
- **WHEN** an authenticated administrator opens the Manuals tab
- **THEN** the system displays the `LABS Manualer` header with yellow accent styling, search toolbar, live available manual count, and a responsive grid of document cards.

#### Scenario: Empty state handling
- **WHEN** no manuals match the current search or filter criteria
- **THEN** the system displays an informative zero-data state with a prompt to upload a new manual or clear active filters.

### Requirement: PDF Document Upload and Metadata Management
The system SHALL provide an upload workflow triggered by the yellow (`#FFED00`) "Tilføj" button allowing administrators to upload local PDF files, define titles, descriptions, categories, and tags.

#### Scenario: Uploading a new PDF manual
- **WHEN** an administrator clicks "Tilføj", selects a valid PDF file, fills in title and description, and submits
- **THEN** the system stores the file on local disk, registers the database record, and displays the new card in the grid.

#### Scenario: Deleting a manual document
- **WHEN** an administrator initiates manual deletion and confirms the action
- **THEN** the system removes the database record and unlinks it from all associated equipment.
