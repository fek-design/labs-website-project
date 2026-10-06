## MODIFIED Requirements

### Requirement: Patron Scan and Verification
The system SHALL provide a unified full-width search and barcode scanning input bar equipped with mode switcher pills (`AUTO`, `STUDENT`, `UDSTYR`), allowing administrators to search or scan student IDs, emails, or equipment asset tags. In its default and focused state, the search and scan input container SHALL maintain neutral border styling (`#555555`) without yellow or colored accent borders.

#### Scenario: Lookup existing patron
- **WHEN** an administrator scans or types a valid student ID into the scanner
- **THEN** the system retrieves the patron's record synchronously and binds them to the active session card, displaying their avatar initial, student ID (`MFE394`), email, and loan history counts, with the input maintaining neutral focus borders.

#### Scenario: Register new patron on scan
- **WHEN** an administrator inputs a new student ID or email not found in the database
- **THEN** the system prompts to create a new Patron record and immediately attaches them to the checkout session.
