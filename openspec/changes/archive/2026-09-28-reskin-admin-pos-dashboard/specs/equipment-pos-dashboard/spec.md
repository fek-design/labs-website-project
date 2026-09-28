## MODIFIED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date, paired side-by-side with a contextual activity feed panel that displays loan items for the selected day, status badges, and quick-action loan extensions.

#### Scenario: Monthly loan calendar overview
- **WHEN** an administrator views the POS front panel
- **THEN** the system displays a monthly grid with category filter tabs (`ALLE`, `UDLÅNT`, `RETURNERINGER`, `AFLEVERET`) where loan events align precisely with the selected calendar day without timezone day-offset errors.

#### Scenario: Date selection and loan inspector
- **WHEN** an administrator clicks on a calendar day cell
- **THEN** the adjacent Activity panel (`Aktivitet [Dato]`) updates immediately to list loans scheduled for that date with equipment name, student tag (`[studentId]`), status badge (`UDLÅNT`), checkout/return dates, and a quick-action button (`Forlæng leje periode +`).

#### Scenario: Calendar month navigation
- **WHEN** an administrator navigates previous/next months via the `< MÅNED ÅR >` header toggle
- **THEN** the system queries loan records within the active month range and refreshes the calendar grid and activity feed without a full page reload.

### Requirement: Patron Scan and Verification
The system SHALL provide a unified full-width search and barcode scanning input bar equipped with mode switcher pills (`AUTO`, `STUDENT`, `UDSTYR`), allowing administrators to search or scan student IDs, emails, or equipment asset tags.

#### Scenario: Lookup existing patron
- **WHEN** an administrator scans or types a valid student ID into the scanner
- **THEN** the system retrieves the patron's record synchronously and binds them to the active session card, displaying their avatar initial, student ID (`MFE394`), email, and loan history counts.

#### Scenario: Register new patron on scan
- **WHEN** an administrator inputs a new student ID or email not found in the database
- **THEN** the system prompts to create a new Patron record and immediately attaches them to the checkout session.

### Requirement: Equipment Loan Checkout Flow
The system SHALL present an `Aktiv Session` console divided into a student profile card with action toggles on the left and a scanned equipment list with rental duration controls on the right, providing duration preset chips (`1+ Uge`, `2+ Uger`, `+1 Måned`), an optional comment field, and a primary `GODKEND` checkout button.

#### Scenario: Successful equipment checkout
- **WHEN** an admin selects `UDLEJNING` mode, sets a rental period, and clicks `GODKEND` with scanned items attached to a student
- **THEN** the system immediately updates UI state optimistically, executes the checkout mutation in the background, logs an `AuditLog` entry, and clears or refreshes the session.

#### Scenario: Attempting checkout on broken or already loaned item
- **WHEN** an admin scans an asset tag for an item that is currently in `MAINTENANCE`, `BROKEN`, or already has an `ACTIVE` loan
- **THEN** the system rejects checkout and highlights the conflict.

### Requirement: Manual Overdue Tracking Protocol
The system SHALL calculate and display overdue loans and real-time equipment availability in high-contrast header metric counters (`Aktive lån`, `Overskredet Returneringer`, and `Ledigt udstyr`) alongside the `LABS Dashboard` welcome greeting.

#### Scenario: Viewing overdue loans dashboard
- **WHEN** an administrator accesses the POS front panel
- **THEN** the system immediately displays live KPI counts for active loans, overdue returns, and available equipment without requiring background cron workers.

#### Scenario: Mark overdue warning on active loans
- **WHEN** a loan's expected return timestamp is in the past and actual return is null
- **THEN** the system marks the loan with overdue visual indicators and increments the overdue metric counter.
