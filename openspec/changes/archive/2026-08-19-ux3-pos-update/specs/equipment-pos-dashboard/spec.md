## MODIFIED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date with status color-coding, computed using local calendar dates without timezone day-offset errors, labeled explicitly as "checked out", and displaying comparative tracking between expected return and final check-in timestamps.

#### Scenario: Monthly loan calendar overview
- **WHEN** an administrator navigates to the POS calendar view
- **THEN** the system displays a monthly grid where expected return dates align precisely with the selected calendar day without a 1-day offset

#### Scenario: Date selection and loan inspector
- **WHEN** an administrator clicks on a calendar day cell or loan event badge
- **THEN** the system displays a detailed inspection modal showing the borrower patron student ID, equipment asset tag, "checked out" status, checkout timestamp, expected return date, actual check-in date comparison if returned, and check-in actions

#### Scenario: Calendar month navigation
- **WHEN** an administrator triggers previous/next month navigation or selects 'Today'
- **THEN** the system queries loan records within the active date range and updates the calendar grid without full page reload

### Requirement: Patron Scan and Verification
The system SHALL provide a search input to look up or register unauthenticated student Patrons by student ID or school email with pure, synchronous state updates avoiding render-phase asynchronous side effects, and provide an explicit clear action that detaches the active patron immediately.

#### Scenario: Lookup existing patron
- **WHEN** an administrator scans or types a valid student ID into the scanner
- **THEN** the system retrieves the patron's record, updates UI state synchronously, and displays their student ID badge and active loans

#### Scenario: Register new patron on scan
- **WHEN** an administrator inputs a new student ID or email not found in the database
- **THEN** the system prompts to create a new Patron record and immediately attaches them to the checkout session
