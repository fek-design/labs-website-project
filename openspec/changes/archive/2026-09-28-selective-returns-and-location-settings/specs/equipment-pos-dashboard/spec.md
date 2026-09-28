## MODIFIED Requirements

### Requirement: Equipment Return and Check-in Flow
The system SHALL support rapid check-in by scanning the asset tag or selecting active loans, presenting an interactive multi-select return checklist where administrators can check off arbitrary subsets of active loans, scan physical asset tags to immediately check items off the manifest with audio/visual feedback, note damage with `RepairLog` routing, mark individual loans as `RETURNED`, or perform batch returns for all selected loans in a single action while preserving unreturned loans as active.

#### Scenario: Activity card selection with patron loan hydration
- **WHEN** an administrator clicks an activity loan card in the calendar schedule
- **THEN** the system queries the full patron record with active loans, loads the student profile into the left column of the Active Session panel with accurate loan counters, switches the session mode to RETUNERING, and expands the selected loan in the right column with full verification details.

#### Scenario: Rendering interactive return manifest for patron
- **WHEN** an administrator views a patron with active loans in the `RETUNÉRING` mode
- **THEN** the system displays all active loans in an interactive checklist manifest showing asset tags, equipment names, expected return dates, and individual selection checkboxes, alongside a "Vælg alle" toggle and dynamic batch action button indicating selected count (e.g. "Returnér valgte (2)").

#### Scenario: Partial return of selected loans
- **WHEN** a patron with 3 active loans returns 2 items and the administrator selects those 2 items and clicks "Returnér valgte (2)"
- **THEN** the system marks the 2 selected loans as `RETURNED`, logs audit entries for each, and leaves the remaining 1 loan as `ACTIVE` with its original return date unchanged.

#### Scenario: Barcode scanner check-off in return mode
- **WHEN** an administrator scans a physical equipment asset tag while a patron's return session is open and the scanned item belongs to that patron's active loans
- **THEN** the system automatically marks that item as checked in the return manifest and emits positive visual feedback.

#### Scenario: Clean equipment checkin
- **WHEN** an admin scans an active loan asset tag and marks it returned in good condition
- **THEN** the system updates the `Loan` status to `RETURNED`, sets `actualReturn` timestamp, records `adminIdCheckin`, and creates an `AuditLog` entry.

#### Scenario: Damaged equipment return with repair log
- **WHEN** an admin marks a return with damage notes and flags repair needed
- **THEN** the system updates the `Loan` to `DAMAGED`, creates a `RepairLog` record for the item, updates item operational status to `MAINTENANCE`, and logs the action.

#### Scenario: Loan extension and modification in active session
- **WHEN** an admin clicks "Forlæng / Rediger" on an active loan in the RETUNERING tab, inputs a revised return date or notes, and saves changes
- **THEN** the system updates the loan record, recalculates overdue status, and logs a `MODIFY_LOAN` audit entry.

#### Scenario: Closing or clearing loaded loan from active session
- **WHEN** an admin clicks "Close" or "RYD SESSION" while an inspected loan is loaded in the Active Session panel
- **THEN** the Active Session panel returns to the standard empty checkout/session state.

#### Scenario: Switching between multiple active loans in return tab
- **WHEN** an administrator views a student with multiple active loans in the RETUNERING tab
- **THEN** the system renders the list of active loans, allowing the admin to click any loan to expand its verification card drawer and action controls.

#### Scenario: Bulk return of multiple ongoing loans
- **WHEN** an administrator clicks "Returner alle lån" or selects multiple ongoing loans in the active session panel
- **THEN** the system batches the return mutation for all selected loans, marks them `RETURNED`, refreshes patron active loan count, and records audit logs for each returned asset.
