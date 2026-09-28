## MODIFIED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date with status color-coding, computed using local calendar dates without timezone day-offset errors, labeled explicitly as "checked out", and displaying comparative tracking between expected return and final check-in timestamps. Individual loan cards in the date activity feed SHALL be directly clickable to auto-insert the loan into the Active Session panel.

#### Scenario: Monthly loan calendar overview
- **WHEN** an administrator navigates to the POS calendar view
- **THEN** the system displays a monthly grid where expected return dates align precisely with the selected calendar day without a 1-day offset

#### Scenario: Date selection and loan inspector
- **WHEN** an administrator clicks on a calendar day cell
- **THEN** the system updates the contextual date activity list to show all loans and returns scheduled for that date

#### Scenario: Clickable activity loan card selection
- **WHEN** an administrator clicks on an individual activity card in the date activity schedule
- **THEN** the system automatically loads that loan, its patron, and its equipment asset directly into the Active Session panel for inspection and action without opening a separate floating modal

#### Scenario: Calendar month navigation
- **WHEN** an administrator triggers previous/next month navigation or selects 'Today'
- **THEN** the system queries loan records within the active date range and updates the calendar grid without full page reload

### Requirement: Equipment Return and Check-in Flow
The system SHALL support rapid check-in and loan verification directly within the Active Session panel, allowing administrators to inspect active loan details (equipment asset, patron, dates, notes), note damage with repair log entries, extend or edit return dates, mark loans as returned, or clear/close the active loan view.

#### Scenario: Clean equipment checkin
- **WHEN** an admin loads an active loan into the Active Session panel and clicks "Check In Equipment"
- **THEN** the system updates the `Loan` status to `RETURNED`, sets `actualReturn` timestamp, records `adminIdCheckin`, updates UI state, and creates an `AuditLog` entry

#### Scenario: Damaged equipment return with repair log
- **WHEN** an admin selects "Flag Damage" in the Active Session panel, submits damage notes, and confirms return
- **THEN** the system updates the `Loan` to `DAMAGED`, creates a `RepairLog` record for the item, updates item operational status to `MAINTENANCE`, and logs the action

#### Scenario: Loan extension and modification in active session
- **WHEN** an admin clicks "Extend / Edit" in the Active Session panel, selects a revised return date or updates notes, and saves changes
- **THEN** the system updates the loan record, recalculates overdue status, and logs a `MODIFY_LOAN` audit entry

#### Scenario: Closing or clearing loaded loan from active session
- **WHEN** an admin clicks "Close" or "RYD SESSION" while an inspected loan is loaded in the Active Session panel
- **THEN** the Active Session panel returns to the standard empty checkout/session state
