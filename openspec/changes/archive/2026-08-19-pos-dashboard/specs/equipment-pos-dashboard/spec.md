## Purpose

Provides an offline-first Point of Sale (POS) equipment checkout scanner, check-in transaction engine, interactive loan schedule calendar, manual overdue loan inspector, and patron verification dashboard for Zealand Labs Medialab administrators.

## ADDED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date with status color-coding.

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
The system SHALL provide a search input to look up, verify, or register unauthenticated student Patrons by student ID or school email.

#### Scenario: Lookup existing patron
- **WHEN** an administrator scans or types a valid student ID into the scanner
- **THEN** the system retrieves the patron's record, displays their current trust status (`GOOD_STANDING`, `FLAGGED`, `BLOCKED`), and lists their active loans

#### Scenario: Register new patron on scan
- **WHEN** an administrator inputs a new student ID or email not found in the database
- **THEN** the system prompts to create a new Patron record with default trust status `GOOD_STANDING` and immediately attaches them to the checkout session

### Requirement: Equipment Loan Checkout Flow
The system SHALL allow authenticated lab administrators to scan borrowable gear asset tags (`BORROWABLE_GEAR`), select an expected return date, and create an active `Loan` transaction linked to the scanned patron.

#### Scenario: Successful equipment checkout
- **WHEN** an admin scans an `AVAILABLE` borrowable item and confirms checkout with a student ID and return date
- **THEN** the system records an active `Loan`, updates the inventory item's operational status if necessary, and writes an entry to `AuditLog`

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
