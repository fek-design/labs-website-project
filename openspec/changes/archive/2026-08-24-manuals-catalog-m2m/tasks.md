## 1. Schema & Database Models

- [x] 1.1 Add `Manual` and `InventoryManual` models to `prisma/schema.prisma` with Many-to-Many relations and push changes to MySQL (`npm run db:push`)
- [x] 1.2 Update `prisma/seed.ts` to create shared `Manual` records and associate them across makerspace machines, then re-seed (`npm run db:seed`)

## 2. Server Actions for Manuals Catalog

- [x] 2.1 Create `app/actions/manuals.ts` with `uploadManual`, `getManualsCatalog`, `assignManualToMachine`, `unassignManualFromMachine`, and `deleteManual`
- [x] 2.2 Update makerspace machine queries to include `manuals: { include: { manual: true } }`

## 3. Central Catalog & Machine Hub UI

- [x] 3.1 Create `components/makerspace/ManualsCatalogModal.tsx` providing search, file upload, machine assignment matrix, and document preview
- [x] 3.2 Update `components/makerspace/MakerspaceMachineHub.tsx` with multi-manual badge list per machine card and top bar "Manuals Catalog" manager

## 4. Verification & End-to-End Testing

- [x] 4.1 Verify uploading PDF manuals, assigning across multiple machines, unlinking, and catalog management
