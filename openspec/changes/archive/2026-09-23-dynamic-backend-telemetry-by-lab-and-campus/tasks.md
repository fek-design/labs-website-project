## 1. Database Seeding for Roskilde Equipment

- [x] 1.1 Seed authentic machines and gear for Roskilde Lab in `prisma/seed.ts` (Prusa 3D printers, laser equipment, camera kits, electronics workstations).
- [x] 1.2 Execute seed script to ensure Roskilde inventory is registered in the database.

## 2. Server-Side Telemetry Catalog Aggregation

- [x] 2.1 Update server query in `app/page.tsx` to aggregate inventory grouped by campus (`køge` vs. `roskilde`) and lab slug (`makerspace`, `medialab`, `dimselab`).
- [x] 2.2 Provide pre-hydrated catalog payload to `MachineTelemetrySection`.

## 3. Dynamic Telemetry Component & Milestone Formatting

- [x] 3.1 Implement `formatMilestoneCount` helper rounding down to nearest multiple of 5 (`Math.floor(count / 5) * 5`).
- [x] 3.2 Update `MachineTelemetrySection.tsx` to consume `useCampus()`, dynamically adapting headlines, counter labels, and autoscrolling inventory cards based on active campus and lab.
- [x] 3.3 Ensure smooth fallback defaults if a lab or campus temporarily has no inventory items.

## 4. Verification and Validation

- [x] 4.1 Verify TypeScript compilation with `npx tsc --noEmit`.
- [x] 4.2 Verify dynamic reactivity when toggling between Køge (Makerspace & Medialab) and Roskilde (its own dedicated content) with rounded milestone counts.
