## MODIFIED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date with status color-coding, accessible directly on the primary front desk view alongside fast check-in.

#### Scenario: Monthly loan calendar overview
- **WHEN** an administrator navigates to the POS calendar view
- **THEN** the system displays a monthly grid with loan event badges color-coded by status (Cyan for active, Yellow for due today, Pink for overdue, Neutral for returned)

#### Scenario: Date selection and loan inspector
- **WHEN** an administrator clicks on a calendar day cell or loan event badge
- **THEN** the system displays a detailed inspection modal showing the borrower patron student ID, equipment asset tag, checkout timestamp, expected return date, and quick check-in actions

#### Scenario: Calendar month navigation
- **WHEN** an administrator triggers previous/next month navigation or selects 'Today'
- **THEN** the system queries loan records within the active date range and updates the calendar grid without full page reload

### Requirement: Patron Scan and Verification
The system SHALL provide a search input to look up or register unauthenticated student Patrons by student ID or school email, and provide an explicit clear action that detaches the active patron immediately without re-attaching on refresh.

#### Scenario: Lookup existing patron
- **WHEN** an administrator scans or types a valid student ID into the scanner
- **THEN** the system retrieves the patron's record, displays their student ID badge and active loans without trust status restrictions

#### Scenario: Register new patron on scan
- **WHEN** an administrator inputs a new student ID or email not found in the database
- **THEN** the system prompts to create a new Patron record and immediately attaches them to the checkout session

### Requirement: Equipment Loan Checkout Flow
The system SHALL allow authenticated lab administrators to scan borrowable gear asset tags (`BORROWABLE_GEAR`), set expected return dates defaulting to one month (30 days), and create an active `Loan` transaction linked to the scanned patron.

#### Scenario: Successful equipment checkout
- **WHEN** an admin scans an `AVAILABLE` borrowable item and confirms checkout with a student ID
- **THEN** the system records an active `Loan` with an expected return timestamp 30 days from the current date by default, updates inventory availability, and writes an entry to `AuditLog`

#### Scenario: Attempting checkout on broken or already loaned item
- **WHEN** an admin scans an asset tag for an item that is currently in `MAINTENANCE`, `BROKEN`, or already has an `ACTIVE` loan
- **THEN** the system rejects checkout and highlights the conflict

## ADDED Requirements

### Requirement: Loan Extension and Modification
The system SHALL allow administrators to modify active loans, extending the expected return date or updating notes with audit log tracking.

#### Scenario: Extending an active loan return deadline
- **WHEN** an administrator edits an active loan and submits a new expected return date
- **THEN** the system updates the `Loan` record, recalculates overdue status, and logs a `MODIFY_LOAN` audit trail entry
