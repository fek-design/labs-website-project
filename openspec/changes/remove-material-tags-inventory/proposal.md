## Why

The 3-tier taxonomy included `MATERIAL` (consumables/substrates like PLA, vinyl, acrylic) alongside `DISCIPLINE` and `PROCESS`. In practice, tracking consumable material compatibility directly on reusable equipment and static machines introduced unnecessary clutter and maintenance overhead in the inventory management flow. Removing the `MATERIAL` tag facet streamlines the taxonomy to a clear 2-tier model (`DISCIPLINE` and `PROCESS`), simplifying item registration, search filtering, and machine hub badges.

## What Changes

- **Taxonomy Simplification**: Remove the `MATERIAL` facet from the taxonomy model and UI. Retain a clean 2-tier hierarchy (`DISCIPLINE` for facility zone/domain and `PROCESS` for hardware technique).
- **Prisma Schema & Database**: Update `TagFacet` enum in `prisma/schema.prisma` to remove `MATERIAL` and update `prisma/seed.ts` to purge all material tag definitions and associations.
- **Server Actions**: Update `app/actions/inventory.ts` to remove `materialSlug` parameter from `getInventoryWithFilters` and remove `materials` from `getFacetedTags`.
- **Inventory UI**: Remove the Material filter dropdown, Material creation selector, and Material tag pills from `components/inventory/InventoryManager.tsx`.
- **Machine Hub UI**: Remove Material badge rendering from `components/makerspace/MakerspaceMachineHub.tsx`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `inventory-location-management`: Streamlines the faceted taxonomy from 3-tier (`DISCIPLINE`, `PROCESS`, `MATERIAL`) to 2-tier (`DISCIPLINE`, `PROCESS`), removing material-based filtering and item assignment.

## Impact

- **Database**: `prisma/schema.prisma` (`TagFacet` enum), `prisma/seed.ts`.
- **Server Actions**: `app/actions/inventory.ts` (`getInventoryWithFilters`, `getFacetedTags`).
- **UI Components**: `components/inventory/InventoryManager.tsx`, `components/makerspace/MakerspaceMachineHub.tsx`.
