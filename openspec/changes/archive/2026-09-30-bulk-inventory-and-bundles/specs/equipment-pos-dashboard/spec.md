## MODIFIED Requirements

### Requirement: Equipment Loan Checkout Flow
The system SHALL allow authenticated lab administrators to scan borrowable gear asset tags (`BORROWABLE_GEAR`) and shared bulk barcodes, adjust line-item quantities for bulk accessories, trigger companion bundle suggestions upon scanning primary equipment, set expected return dates defaulting to one month (30 days), review ongoing loans for the active patron, provide a checkout action button labeled exactly "Confirm checkout", and execute optimistic UI updates with silent background sync and graceful error rollback.

#### Scenario: Mode selection styling
- **WHEN** an administrator selects the `RETUNÉRING` button or `UDLEJNING` button
- **THEN** the active button is highlighted with the brand yellow active fill (`#ffd900`) and dark text, while the inactive button retains its secondary dark outlined appearance

#### Scenario: Successful equipment checkout
- **WHEN** an admin clicks "Confirm checkout" with borrowable items and a student ID
- **THEN** the system immediately updates UI state optimistically, executes the checkout mutation in the background, writes an entry to `AuditLog`, and gracefully reverts state with a toast alert if the API call fails

#### Scenario: Attempting checkout on broken or already loaned item
- **WHEN** an admin scans an asset tag for an item that is currently in `MAINTENANCE`, `BROKEN`, or already has an `ACTIVE` loan
- **THEN** the system rejects checkout and highlights the conflict

#### Scenario: Reviewing multiple ongoing loans during active checkout session
- **WHEN** an administrator attaches a patron who already has active or overdue loans
- **THEN** the system displays a streamlined ongoing loans summary directly inside the active session workspace, indicating loan durations, overdue warnings, and asset tags.

#### Scenario: Companion bundle suggestion on scan
- **WHEN** an administrator scans a serialized asset that has configured bundle presets
- **THEN** the system displays an interactive bundle prompt listing the companion accessories and quantities, allowing the administrator to add all or selected items to the checkout cart in one action

#### Scenario: Quantity adjustment for bulk items in cart
- **WHEN** an administrator adds a bulk item to the cart and clicks the increment or decrement controls
- **THEN** the cart updates the item's checkout quantity, recalculates overall cart item counts, and displays soft stock advisory status if the quantity exceeds available pool stock

### Requirement: Equipment Return and Check-in Flow
The system SHALL support rapid check-in by scanning the asset tag or selecting active loans, presenting an interactive multi-select return checklist where administrators can check off arbitrary subsets of active loans, scan physical asset tags to immediately check items off the manifest with audio/visual feedback, handle partial returns for multi-quantity bulk loans, note damage with `RepairLog` routing, mark individual loans as `RETURNED`, or perform batch returns for all selected loans in a single action while preserving unreturned loans or unreturned quantities as active.

#### Scenario: Activity card selection with patron loan hydration
- **WHEN** an administrator clicks an activity loan card in the calendar schedule
- **THEN** the system queries the full patron record with active loans, loads the student profile into the left column of the Active Session panel with accurate loan counters, switches the session mode to RETUNERING, and expands the selected loan in the right column with full verification details.

#### Scenario: Rendering interactive return manifest for patron
- **WHEN** an administrator views a patron with active loans in the `RETUNÉRING` mode
- **THEN** the system displays all active loans in an interactive checklist manifest showing asset tags, equipment names, expected return dates, and individual selection checkboxes, alongside a "Vælg alle" toggle and dynamic batch action button indicating selected count (e.g. "Returnér valgte (2)").

#### Scenario: Partial return of selected loans
- **WHEN** a patron with 3 active loans returns 2 items and the administrator selects those 2 items and clicks "Returnér valgte (2)"
- **THEN** the system marks the 2 selected loans as `RETURNED`, logs audit entries for each, and leaves the remaining 1 loan as `ACTIVE` with its original return date unchanged.

#### Scenario: Partial return of multi-quantity bulk loan
- **WHEN** a patron has an active loan for 2 bulk accessories and returns only 1
- **THEN** the system records 1 item returned, increments the available inventory pool by 1, and maintains the loan as active with a remaining unreturned quantity of 1

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
