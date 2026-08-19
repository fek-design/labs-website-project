## Context

See `proposal.md` for motivation. The Zealand Labs system requires refined domain separation between Medialab (camera/audio equipment loans, 1-month checkouts, loan calendar) and Makerspace (rapid prototyping machines, safety documentation, maintenance logs without user rentals). All operations are strictly administered by staff/technicians without external cloud dependencies.

## Goals / Non-Goals

**Goals:**
- Unify the Front Desk view to present the interactive loan schedule calendar, active checkout scanner, and rapid check-in directly on the front landing view.
- Update default loan duration to 30 days (1 month) with preset buttons (`+1w`, `+2w`, `+1mo`, `+2mo`).
- Add physical location metadata (`location` string, e.g. "Cabinet A2", "Audio Shelf 1") to `Inventory` with faceted filtering by lab, tag, status, and location.
- Remove patron trust status gating (`GOOD_STANDING`, `FLAGGED`, `BLOCKED`) so patrons are identified simply by Student ID and Email.
- Fix patron clearing bug so clicking "Clear" immediately detaches patron state without background re-associations.
- Dedicate the Makerspace interface to machine specifications, safety manuals, and maintenance logs (no student rental checkout).
- Provide CRUD drawers for adding/editing items, updating active loans (extensions), editing patrons, and managing admin credentials.
- Add an Audit Log History tab with filterable events and JSON payload delta inspection.

**Non-Goals:**
- Student accounts / student self-service logins (strictly staff administered).
- Cloud cron tasks or external email/SMS reminders (Zero Cloud Dependency).
- Equipment rentals for Makerspace machines (Makerspace is for static equipment).

## Decisions

### 1. Front Desk Architecture: Unified Calendar & Check-in
- **Decision**: Combine the loan schedule calendar directly onto the front desk view alongside fast barcode scanning and quick check-in actions.
- **Rationale**: Allows technicians at the checkout desk to see the day's upcoming returns and active loans at a glance while scanning student IDs or gear barcodes.

### 2. Location Metadata Schema & Faceted Search
- **Decision**: Add `location String?` to the `Inventory` model in Prisma. Provide dynamic location filter dropdowns in the inventory view, allowing technicians to filter items within the same lab by room, shelf, or cabinet.
- **Rationale**: Enables physical tracking of equipment (e.g. knowing whether a camera kit is in "Cabinet 3, Shelf B" or "Storage Room 102").

### 3. Clear Domain Separation (Medialab vs Makerspace)
- **Decision**: Restrict the checkout POS and calendar to Medialab (`BORROWABLE_GEAR`). Structure the Makerspace view as a machine workbench displaying operating specs (build volume, laser power), safety guidelines, PDF manuals, and maintenance repair logs (`RepairLog`).
- **Rationale**: 3D printers and laser cutters cannot be taken home; they are used in-situ. Separating them prevents UI confusion and ensures technicians only checkout borrowable gear.

### 4. Simplified Patron Model & State Detach Lifecycle
- **Decision**: Remove trust status restrictions from checkout validation. Fix the patron clearing state by maintaining an explicit session state flag `isCleared` and resetting patron search suggestions on clear.
- **Rationale**: Simplifies educational checkout workflows and eliminates annoying UI state resurrection bugs.

### 5. 1-Month Default Rental Duration
- **Decision**: Set the default checkout return date in `CheckoutCart` to 30 days (1 month) from `Date.now()`, while offering quick buttons (`+1w`, `+2w`, `+1mo`, `+2mo`).
- **Rationale**: Matches university semester loan policy where students borrow kits for month-long project blocks.

### 6. Consolidated Admin Domain & Settings
- **Decision**: Remove public lab shell routes (`/labs/[slug]`) and unify all operations under `/admin/pos` and the admin navigation shell with sub-tabs for:
  1. `Front Desk (Scanner & Calendar)`
  2. `Active Loans & Overdue`
  3. `Inventory Management (Add/Edit & Location Filters)`
  4. `Makerspace Machines & Manuals`
  5. `Audit Log History`
  6. `Admin Settings (Login / Password)`
- **Rationale**: Keeps the application strictly administered by authorized staff with full audit trails.

## Risks / Trade-offs

- **[Schema migration for `location`]** → Mitigation: Run `npx prisma db push` to add nullable `location` column to MySQL without dropping data.
- **[Backwards compatibility with existing seeds]** → Mitigation: Update `prisma/seed.ts` to populate realistic room and shelf locations.
