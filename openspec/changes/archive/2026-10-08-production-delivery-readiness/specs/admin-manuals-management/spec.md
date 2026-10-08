## MODIFIED Requirements

### Requirement: PDF Document Upload and Metadata Management
The system SHALL provide an upload workflow allowing authenticated administrators to upload PDF documents, strictly verifying PDF magic bytes (`%PDF-`), rejecting non-PDF or executable scripts, enforcing a 20 MB size limit, and associating metadata.

#### Scenario: Uploading a new PDF manual
- **WHEN** an authenticated administrator uploads a file with valid PDF magic bytes (`%PDF-`), filename, title, and description
- **THEN** the system stores the file in designated local storage, registers the database record, and displays the card in the manuals grid.

#### Scenario: Deleting a manual document
- **WHEN** an administrator initiates manual deletion and confirms the action
- **THEN** the system removes the database record and unlinks it from all associated equipment.

## ADDED Requirements

### Requirement: Anti-Executable Upload Rejection
The file upload engine SHALL reject any upload that fails magic bytes inspection or exceeds size limits.

#### Scenario: Rejecting invalid or non-PDF file upload
- **WHEN** an upload is submitted containing executable code, scripts, HTML payloads, or files without `%PDF-` header bytes
- **THEN** the system rejects the upload with a validation error and writes nothing to disk.
