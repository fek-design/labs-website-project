## Context

See `proposal.md` for motivation. The inventory module currently uses a 3-tier taxonomy (`DISCIPLINE`, `PROCESS`, `MATERIAL`). Removing `MATERIAL` requires removing the enum value from Prisma schema, pruning the mock database seed, updating the inventory server actions, and removing all Material-related filter dropdowns and tag inputs from the UI.

## Goals / Non-Goals

**Goals:**
- Transition the taxonomy cleanly from 3 tiers to 2 tiers (`DISCIPLINE` and `PROCESS`).
- Remove `MATERIAL` from the `TagFacet` enum in `prisma/schema.prisma` and push database changes.
- Update `app/actions/inventory.ts` to eliminate `materialSlug` filter logic and `materials` tag groupings.
- Clean up `components/inventory/InventoryManager.tsx` to remove Material dropdown filters, creation inputs, and badge styles.
- Clean up `components/makerspace/MakerspaceMachineHub.tsx` to remove Material badge rendering.
- Update `prisma/seed.ts` to remove mock Material tags and associated item tags.

**Non-Goals:**
- Changing `DISCIPLINE` or `PROCESS` taxonomy tags or their deterministic asset tag generation.
- Changing `HardwareType` or `OperationalStatus` enums.
- Modifying POS checkout, loan scheduling, or audit logging logic.

## Decisions

### 1. 2-Tier Faceted Taxonomy (`DISCIPLINE` + `PROCESS`)
- **Decision**: Restrict `TagFacet` enum strictly to `DISCIPLINE` (zone/macro field) and `PROCESS` (manufacturing or media technique).
- **Rationale**: Equipment in makerspaces and medialabs is best categorized by domain and workflow mechanism. Consumable materials fluctuate and do not define the static asset itself.
- **Alternatives Considered**: Keeping `MATERIAL` in database schema but hiding from UI — rejected because it leaves dead database paths and confusing taxonomy types.

### 2. Grid Layout & Filter Optimization
- **Decision**: Update `InventoryManager` filter strip from 6 columns to 5 columns (`Lab`, `Hardware Type`, `Status`, `Discipline`, `Process`).
- **Rationale**: Keeps responsive grid clean and eliminates empty space previously occupied by the Material dropdown.

### 3. Visual Badge Consolidation
- **Decision**: In `InventoryManager` and `MakerspaceMachineHub`, keep Yellow `#FFED00` for Discipline badges and Cyan `#009FE3` for Process badges, removing Pink `#E6007E` Material badges.
- **Rationale**: Matches the CMYK OpenSpec visual contract where Pink remains reserved for Overdue/Broken/Damage alerts and delete actions.

## Risks / Trade-offs

- [Database Migration / Push] → Updating `enum TagFacet` in MySQL requires deleting existing `MATERIAL` tag records before or during schema sync (`npm run db:seed` will repopulate cleanly).
