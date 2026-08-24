## Context

Previously, manuals were stored as loose string attributes (`manualUrl`, `manualFileName`) inside an individual inventory item's `customFields` JSON column. This restricted each machine to at most one attached manual and prevented reusing shared manuals (e.g., standard safety SOPs or multi-material setup guides) across multiple machines.

This design introduces a first-class `Manual` model and an explicit `InventoryManual` Many-to-Many join table, backed by dedicated server actions and a centralized catalog UI in the Makerspace module.

## Goals / Non-Goals

**Goals:**
- Implement a Many-to-Many relationship between `Inventory` (machines/gear) and `Manual` in Prisma (`Manual`, `InventoryManual`).
- Provide server actions in `app/actions/manuals.ts` for uploading, cataloging, assigning, unassigning, and deleting manuals.
- Support attaching multiple manuals to a single machine (e.g. Quickstart Guide + Maintenance Manual + Safety Protocol).
- Support attaching a single manual to multiple machines without duplicate file storage.
- Create a `ManualsCatalogModal.tsx` for browsing, searching, and managing the central document library.
- Update `MakerspaceMachineHub.tsx` to display multi-manual pills, attachment controls, and quick-access catalog views.
- Update `prisma/seed.ts` with authentic shared manual records.

**Non-Goals:**
- Storing files in external cloud buckets (maintains strict Zero-Cloud local filesystem storage under `/public/uploads/manuals/`).
- Converting PDF manuals to text/OCR in database.

## Decisions

### 1. Explicit Join Model (`InventoryManual`)
- **Decision**: Use an explicit `model InventoryManual` with composite primary key `@@id([inventoryId, manualId])` and `assignedAt DateTime @default(now())`.
- **Rationale**: Explicit join tables in Prisma provide full type safety, support cascading deletions on machine or manual removal, and enable tracking when documents were associated.

### 2. Standalone Manual Entity
- **Decision**: `Manual` records contain `id`, `title`, `fileName`, `fileUrl`, `fileSize`, `mimeType`, and `description`.
- **Rationale**: Separates document metadata (e.g. clean human-readable title "Universal Laser Safety SOP v2") from machine attributes, making the catalog easy to search and audit.

### 3. File System Management on Delete
- **Decision**: Deleting a `Manual` deletes the database record and join rows, and cleans up the local file on disk if it resides under `/public/uploads/manuals/`. Unassigning a manual from a machine only removes the `InventoryManual` join row.
- **Rationale**: Prevents orphaned PDF files while ensuring that removing a manual from one workstation does not break other machines referencing the same document.

### 4. Interactive UI: Dual Access Points
- **Decision**:
  1. **Top-Level Hub Action**: "📚 Manuals Catalog (N)" button in the Makerspace header for global repository management.
  2. **Machine-Level Action**: Multi-manual chip list on each card with "+ Link Manual" opening a catalog picker filtered/focused on that machine.

## Risks / Trade-offs

- [Migration from `customFields.manualUrl`] → Any legacy string references in `customFields` will be superseded by the structured `InventoryManual` relations in `prisma/seed.ts` and UI queries.
