## MODIFIED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date with status color-coding, fetched strictly on mount or explicit mutation without continuous short-polling intervals.

#### Scenario: Monthly loan calendar overview
- **WHEN** an administrator navigates to the POS calendar view
- **THEN** the system displays a monthly grid with loan event badges without periodic interval polling

#### Scenario: Date selection and loan inspector
- **WHEN** an administrator clicks on a calendar day cell or loan event badge
- **THEN** the system displays a detailed inspection modal showing the borrower patron student ID, equipment asset tag, checkout timestamp, expected return date, and quick check-in actions

#### Scenario: Calendar month navigation
- **WHEN** an administrator triggers previous/next month navigation or selects 'Today'
- **THEN** the system queries loan records within the active date range and updates the calendar grid without full page reload

### Requirement: Equipment Loan Checkout Flow
The system SHALL allow authenticated lab administrators to scan borrowable gear asset tags (`BORROWABLE_GEAR`), set expected return dates defaulting to one month (30 days), provide a checkout action button labeled exactly "Confirm checkout", and execute optimistic UI updates with silent background sync and graceful error rollback.

#### Scenario: Successful equipment checkout
- **WHEN** an admin clicks "Confirm checkout" with borrowable items and a student ID
- **THEN** the system immediately updates UI state optimistically, executes the checkout mutation in the background, writes an entry to `AuditLog`, and gracefully reverts state with a toast alert if the API call fails

#### Scenario: Attempting checkout on broken or already loaned item
- **WHEN** an admin scans an asset tag for an item that is currently in `MAINTENANCE`, `BROKEN`, or already has an `ACTIVE` loan
- **THEN** the system rejects checkout and highlights the conflict
