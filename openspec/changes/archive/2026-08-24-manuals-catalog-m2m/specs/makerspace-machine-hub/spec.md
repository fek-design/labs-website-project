## MODIFIED Requirements

### Requirement: Makerspace Machine Catalog and Manuals
The system SHALL present static machine workstations with a dedicated machine search bar, direct access to a centralized catalog of authentic PDF user manuals supporting Many-to-Many associations across machines, verified technical specifications without fake placeholder data, and operational readiness, without student loan or rental workflows.

#### Scenario: Viewing machine details and documentation
- **WHEN** an administrator or technician opens the Makerspace hub and searches for a machine name or category
- **THEN** the system displays matching static machines with operational status badges, verified specifications, and list of attached PDF user manuals from the central catalog

#### Scenario: Uploading and linking a PDF manual to a machine
- **WHEN** a technician uploads a PDF manual file and associates it with a machine
- **THEN** the system stores the PDF locally under `/public/uploads/manuals/`, records the document in the centralized `Manual` catalog, links it to the machine, and provides an immediate preview/download action

#### Scenario: Attaching existing catalog manual to multiple machines
- **WHEN** a technician opens the manual picker for a workstation and selects a manual already in the catalog
- **THEN** the system creates a Many-to-Many link between the machine and the manual, making the document accessible from both machines without duplicate file storage

#### Scenario: Unlinking a manual from a machine
- **WHEN** a technician unlinks a manual from a machine
- **THEN** the system removes the association while preserving the manual in the central catalog for other machines
