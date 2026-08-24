## 1. Schema & Database Updates

- [x] 1.1 Update `TagFacet` enum in `prisma/schema.prisma` to remove `MATERIAL` and push schema changes to MySQL (`npm run db:push`)
- [x] 1.2 Update `prisma/seed.ts` to remove all `MATERIAL` tag definitions and item associations, then re-seed (`npm run db:seed`)

## 2. Server Actions Refactoring

- [x] 2.1 Update `app/actions/inventory.ts` to remove `materialSlug` filtering from `getInventoryWithFilters` and remove `materials` grouping from `getFacetedTags`

## 3. UI Component Updates

- [x] 3.1 Update `components/inventory/InventoryManager.tsx` to remove Material dropdown filter, 3rd-dimension selector from item creation drawer, new Material tag modal prompt, and Material badge styling
- [x] 3.2 Update `components/makerspace/MakerspaceMachineHub.tsx` to remove Material badge rendering and styling

## 4. Verification

- [x] 4.1 Verify inventory multi-faceted filtering, asset creation drawer, and machine hub rendering end-to-end with the clean 2-tier (`DISCIPLINE` & `PROCESS`) taxonomy
