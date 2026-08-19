## Why

The Zealand Labs infrastructure requires a comprehensive UX overhaul, workflow streamlining, and domain separation between Medialab (equipment rentals & checkout calendar) and Makerspace (machines, safety manuals, and maintenance logs without student rentals). Additionally, administrators require physical location tracking (room, shelf, locker), 1-month default rental periods, removal of arbitrary patron trust standing rules, full CRUD modals for inventory/rentals/users, an audit log history tab, and admin login settings.

## What Changes

- **Unified Front Desk Calendar & Rapid Check-in**: Integrate the interactive calendar schedule and quick check-in directly onto the main front desk interface.
- **Remove Patron Standing Rules**: Remove patron trust status (`GOOD_STANDING`, `FLAGGED`, `BLOCKED`) so patrons are cleanly identified by Student ID and Email without loan blockage.
- **Fix Clear Patron Bug**: Ensure clearing the active patron resets all scanner associations and prevents sticky re-population.
- **1-Month Default Loan Period**: Update default loan checkout duration to 30 days (1 month) with preset duration shortcuts (`+1w`, `+2w`, `+1mo`, `+2mo`).
- **Makerspace Machine & Manuals Hub (No Rentals)**: Redesign the Makerspace console into a dedicated Machine Status, Safety Manuals, Documentation, and Maintenance Logging station with no patron rental workflows.
- **Strict Admin Consolidation**: Remove the separate public lab shell and consolidate all operational desks under the authenticated admin domain.
- **Inventory Location & Enhanced Filters**: Add physical location metadata (`location` field: room, cabinet, shelf) to Inventory schema, and provide category, tag, status, and location filters.
- **Streamlined Inventory & Item Management**: Provide streamlined modals/drawers for adding new gear, editing existing items, editing student patrons, and modifying active rental return dates.
- **History & Audit Log Tab**: Add a dedicated Audit Log & Loan History inspection view with filterable actions, timestamps, and payload deltas.
- **Admin Settings & Credential Management**: Add a Settings view allowing administrators to update credentials and system preferences.
- **Visual ID Indicators**: Add distinct visual badge indicators for Student IDs and Asset Tags across tables, cards, and modal views.

## Capabilities

### New Capabilities
- `inventory-location-management`: Inventory creation, editing, physical location tagging (room/shelf/cabinet), taxonomy filters, and equipment specs management.
- `makerspace-machine-hub`: Dedicated non-rental dashboard for Makerspace static machines, operational status, maintenance logs, and safety manuals.
- `admin-history-settings`: Audit log history viewer and admin credential update settings.

### Modified Capabilities
- `equipment-pos-dashboard`: Update checkout default return date to 1 month, remove patron trust status gating, integrate front desk calendar check-in, fix patron clearing, and support loan extensions.

## Impact

- **Database Schema**: Add `location` string field to `Inventory` model in `prisma/schema.prisma`.
- **Server Actions**: Update `app/actions/pos.ts` and create `app/actions/inventory.ts`, `app/actions/makerspace.ts`, `app/actions/admin.ts`.
- **UI Components**: Create and update `components/pos/`, `components/inventory/`, `components/makerspace/`, `components/history/`, `components/settings/`.
- **Routes**: Streamline `app/admin/pos/page.tsx` with dedicated tabs (Checkout & Calendar, Active Loans, Inventory Catalog, Makerspace Machines, History & Audit Logs, Admin Settings), and remove public lab shell routes.
