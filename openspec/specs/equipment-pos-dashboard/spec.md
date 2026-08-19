# equipment-pos-dashboard Specification

## Purpose
Provides an offline-first Point of Sale (POS) equipment checkout scanner, check-in transaction engine, interactive loan schedule calendar, manual overdue loan inspector, and patron verification dashboard for Zealand Labs Medialab administrators.

## Requirements

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

### Requirement: Equipment Loan Checkout Flow
The system SHALL allow authenticated lab administrators to scan borrowable gear asset tags (`BORROWABLE_GEAR`), set expected return dates defaulting to one month (30 days), provide a checkout action button labeled exactly "Confirm checkout", and execute optimistic UI updates with silent background sync and graceful error rollback.

#### Scenario: Successful equipment checkout
- **WHEN** an admin clicks "Confirm checkout" with borrowable items and a student ID
- **THEN** the system immediately updates UI state optimistically, executes the checkout mutation in the background, writes an entry to `AuditLog`, and gracefully reverts state with a toast alert if the API call fails

#### Scenario: Attempting checkout on broken or already loaned item
- **WHEN** an admin scans an asset tag for an item that is currently in `MAINTENANCE`, `BROKEN`, or already has an `ACTIVE` loan
- **THEN** the system rejects checkout and highlights the conflict

### Requirement: Equipment Return and Check-in Flow
The system SHALL support rapid check-in by scanning the asset tag or selecting an active loan, allowing admins to inspect returned items, note damage, record `RepairLog` entries if broken, and mark the loan as `RETURNED`.

#### Scenario: Clean equipment checkin
- **WHEN** an admin scans an active loan asset tag and marks it returned in good condition
- **THEN** the system updates the `Loan` status to `RETURNED`, sets `actualReturn` timestamp, records `adminIdCheckin`, and creates an `AuditLog` entry

#### Scenario: Damaged equipment return with repair log
- **WHEN** an admin marks a return with damage notes and flags repair needed
- **THEN** the system updates the `Loan` to `DAMAGED`, creates a `RepairLog` record for the item, updates item operational status to `MAINTENANCE`, and logs the action

### Requirement: Manual Overdue Tracking Protocol
The system SHALL compute and display overdue loans on demand via native timestamp queries without background cron jobs.

#### Scenario: Viewing overdue loans dashboard
- **WHEN** an admin opens the overdue inspector panel
- **THEN** the system queries all `Loan` records where `status = ACTIVE` and `expectedReturn < NOW()`, displaying elapsed overdue time, patron student ID, and item details

### Requirement: Loan Extension and Modification
The system SHALL allow administrators to modify active loans, extending the expected return date or updating notes with audit log tracking.

#### Scenario: Extending an active loan return deadline
- **WHEN** an administrator edits an active loan and submits a new expected return date
- **THEN** the system updates the `Loan` record, recalculates overdue status, and logs a `MODIFY_LOAN` audit trail entry
