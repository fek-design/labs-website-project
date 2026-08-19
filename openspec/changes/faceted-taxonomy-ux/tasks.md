## 1. 3-Tier Faceted Taxonomy Schema & Database

- [x] 1.1 Update `prisma/schema.prisma` to add `TagFacet` enum (`DISCIPLINE`, `PROCESS`, `MATERIAL`) to `Tag` model and push schema changes
- [x] 1.2 Update `prisma/seed.ts` with faceted discipline, process, and material taxonomy tags and re-seed database

## 2. Server Actions for Faceted Taxonomy & Manual Document Operations

- [x] 2.1 Update `app/actions/inventory.ts` with `createTag`, `getFacetedTags`, and multi-faceted inventory filtering
- [x] 2.2 Update `app/actions/upload.ts` with `deleteMachineManual` and `replaceMachineManual` actions

## 3. Inventory Manager & Faceted Filtering UI

- [x] 3.1 Update `components/inventory/InventoryManager.tsx` with 3-tier faceted filters (Discipline, Process, Material) and dynamic tag creation interface

## 4. Makerspace Machine Hub & Manual Operations

- [x] 4.1 Update `components/makerspace/MakerspaceMachineHub.tsx` with Replace/Delete manual controls and clean authentic parameter displays

## 5. Live Front Desk Calendar Synchronization & Verification

- [x] 5.1 Update `components/pos/EquipmentPOS.tsx` and `components/pos/LoanCalendar.tsx` to immediately re-sync calendar events upon checkout and return mutations
- [x] 5.2 End-to-end verification of faceted taxonomy, dynamic tags, manual replace/delete, and calendar sync
