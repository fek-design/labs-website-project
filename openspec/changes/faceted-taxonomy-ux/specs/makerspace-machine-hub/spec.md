## MODIFIED Requirements

### Requirement: Makerspace Machine Catalog and Manuals
The system SHALL present static machine workstations with authentic user manuals, manual replacement and deletion actions, and clean verified parameters without unconfigurable fake dummy specifications.

#### Scenario: Viewing machine details and documentation
- **WHEN** an administrator or technician opens the Makerspace hub and searches for a machine name or category
- **THEN** the system displays matching static machines with operational status badges, verified specifications, and links or view buttons for attached PDF user manuals

#### Scenario: Uploading and linking a PDF manual to a machine
- **WHEN** a technician uploads a PDF manual file and associates it with a machine
- **THEN** the system stores the PDF locally under `/public/uploads/manuals/`, links the manual URL to the machine record, and provides an immediate preview/download action

#### Scenario: Replacing or deleting an attached user manual
- **WHEN** a technician clicks 'Replace Manual' or 'Delete Manual' on a machine card
- **THEN** the system removes the old PDF reference or replaces it with the newly uploaded document and updates the machine record in MySQL
