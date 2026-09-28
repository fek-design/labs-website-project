## MODIFIED Requirements

### Requirement: Equipment Loan Checkout Flow
The system SHALL present an `Aktiv Session` console divided into a student profile card with action toggles on the left and a scanned equipment list with rental duration controls on the right, providing duration preset chips (`1+ Uge`, `2+ Uger`, `+1 Måned`), an optional comment field, a primary `GODKEND` checkout button, and action mode buttons (`UDLEJNING` and `RETUNÉRING`) that both display the brand yellow active style (`#ffd900` / `#FFED00` background with dark text) when selected.

#### Scenario: Mode selection styling
- **WHEN** an administrator selects the `RETUNÉRING` button or `UDLEJNING` button
- **THEN** the active button is highlighted with the brand yellow active fill (`#ffd900`) and dark text, while the inactive button retains its secondary dark outlined appearance

#### Scenario: Successful equipment checkout
- **WHEN** an admin selects `UDLEJNING` mode, sets a rental period, and clicks `GODKEND` with scanned items attached to a student
- **THEN** the system immediately updates UI state optimistically, executes the checkout mutation in the background, logs an `AuditLog` entry, and clears or refreshes the session

#### Scenario: Attempting checkout on broken or already loaned item
- **WHEN** an admin scans an asset tag for an item that is currently in `MAINTENANCE`, `BROKEN`, or already has an `ACTIVE` loan
- **THEN** the system rejects checkout and highlights the conflict

### Requirement: Manual Overdue Tracking Protocol
The system SHALL calculate and display overdue loans and real-time equipment availability in high-contrast header metric counters (`Aktive lån`, `Overskredet Returneringer`, and `Ledigt udstyr`) alongside the dynamic welcome greeting showing the authenticated operator's user name, where the metric numbers exponentially animate up from 0 to their actual database values upon initial render without requiring background cron jobs.

#### Scenario: Viewing overdue loans dashboard
- **WHEN** an admin opens the overdue inspector panel
- **THEN** the system performs real-time queries for all ACTIVE loans where expectedReturn is in the past and renders them sorted by overdue duration

#### Scenario: Mark overdue warning on active loans
- **WHEN** a loan's expected return timestamp is in the past and actual return is null
- **THEN** the system flags the loan record with overdue visual treatment across calendar, POS, and active loan tables

#### Scenario: Exponential counter roll-up on dashboard load
- **WHEN** an administrator accesses the POS dashboard view
- **THEN** the metric numbers for `Aktive lån`, `Overskredet Returneringer`, and `Ledigt udstyr` smoothly animate from 0 up to their respective live count values using an exponential easing curve

#### Scenario: Dynamic authenticated greeting
- **WHEN** an authenticated administrator logs into the system
- **THEN** the dashboard header displays "Velkommen, [Name]" where [Name] corresponds to the authenticated user's actual username or profile name
