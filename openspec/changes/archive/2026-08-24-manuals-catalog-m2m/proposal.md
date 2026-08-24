## Why

Previously, machine user manuals were stored as loose string attributes (`manualUrl`, `manualFileName`) inside an individual inventory item's `customFields` JSON column. This restricted each machine to at most one attached manual and made it impossible to reuse shared operational/safety documents (e.g. "Universal Laser Safety SOP" or "AMS Multi-Material Guide") across multiple workstations.

Isolating manuals into a dedicated, first-class entity with a Many-to-Many (`m:n`) relation allows:
1. Machines to have multiple manuals (e.g., Quickstart Guide, Safety Checklist, Slicer Configuration, and Maintenance Manual).
2. Shared manuals to be uploaded once into a central catalog and linked across multiple machines.
3. Centralized manual management (browse catalog, search documents, upload new PDFs, and assign/unassign to machines).

## What Changes

- **Dedicated `Manual` Model & Join Entity**: Add a first-class `Manual` model in `prisma/schema.prisma` along with an explicit `InventoryManual` join table for many-to-many associations between `Inventory` and `Manual`.
- **Manual Catalog Server Actions**: Create `app/actions/manuals.ts` with operations to upload standalone manuals, list all catalog manuals with assignment metrics, assign/unassign manuals to machines, and delete manuals.
- **Central Manuals Catalog UI**: Add a Manuals Repository tab/modal in the Makerspace hub for managing the shared PDF library.
- **Multi-Manual Machine Cards**: Update `components/makerspace/MakerspaceMachineHub.tsx` to render all associated manuals per machine, with quick-view action pills, "Attach from Catalog" modal picker, and detach controls.
- **Database Seed & Migration**: Update `prisma/seed.ts` to seed real shared PDF manuals (e.g., Bambu User Guide, Flux Beambox Manual, Brother GTX Operation Guide, Universal Safety SOP) linked across the initial machine catalog.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `makerspace-machine-hub`: Upgrades manual handling from single embedded custom fields to a centralized manual catalog with Many-to-Many assignment between machines and PDF manuals.

## Impact

- **Database**: `prisma/schema.prisma` (`Manual` and `InventoryManual` models), `prisma/seed.ts`.
- **Server Actions**: `app/actions/manuals.ts` (new), `app/actions/upload.ts` (refactored/delegated).
- **UI Components**: `components/makerspace/MakerspaceMachineHub.tsx`, `components/makerspace/ManualsCatalogModal.tsx` (new).
