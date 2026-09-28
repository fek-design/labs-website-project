## MODIFIED Requirements

### Requirement: Equipment Return and Check-in Flow
The system SHALL support rapid check-in and loan verification directly within the right-hand RETUNÉRING tab of the Active Session panel, maintaining the student patron profile and loan counters on the left, listing active loans, and displaying the full verification card drawer for the selected loan with inline modification, damage reporting, and check-in actions.

#### Scenario: Activity card selection with patron loan hydration
- **WHEN** an administrator clicks an activity loan card in the calendar schedule
- **THEN** the system queries the full patron record with active loans, loads the student profile into the left column of the Active Session panel with accurate loan counters, switches the session mode to RETUNERING, and expands the selected loan in the right column with full verification details

#### Scenario: Clean equipment checkin
- **WHEN** an admin views an expanded active loan in the RETUNERING tab and clicks "Check In Equipment"
- **THEN** the system updates the `Loan` status to `RETURNED`, sets `actualReturn` timestamp, records `adminIdCheckin`, updates UI state optimistically, refreshes patron loans, and creates an `AuditLog` entry

#### Scenario: Damaged equipment return with repair log
- **WHEN** an admin expands "Rapporter Skade" on an active loan in the RETUNERING tab, inputs damage notes, and confirms
- **THEN** the system updates the `Loan` to `DAMAGED`, creates a `RepairLog` record for the item, sets item operational status to `MAINTENANCE`, and refreshes the return list

#### Scenario: Loan extension and modification in active session
- **WHEN** an admin clicks "Forlæng / Rediger" on an active loan in the RETUNERING tab, inputs a revised return date or notes, and saves changes
- **THEN** the system updates the loan record, recalculates overdue status, and logs a `MODIFY_LOAN` audit entry

#### Scenario: Closing or clearing loaded loan from active session
- **WHEN** an admin clicks "Close" or "RYD SESSION" while an inspected loan is loaded in the Active Session panel
- **THEN** the Active Session panel returns to the standard empty checkout/session state

#### Scenario: Switching between multiple active loans in return tab
- **WHEN** an administrator views a student with multiple active loans in the RETUNERING tab
- **THEN** the system renders the list of active loans, allowing the admin to click any loan to expand its verification card drawer and action controls
