## Why

The machine telemetry section on the landing page currently queries a global count of static machines, ignoring both the user's selected campus (Køge vs. Roskilde) and the active lab workspace (Makerspace vs. Medialab vs. Dimselab). Additionally, the stat display does not round down to even 5s or 10s milestones, and Roskilde lacks distinct hardware in the database. Tying this section dynamically to the backend ensures authentic live telemetry where Makerspace displays machines, Medialab displays equipment, and Roskilde respects its own distinct inventory.

## What Changes

- **Dynamic Lab & Campus Telemetry Binding**: Connect the telemetry section to `CampusContext` (`campus` and `activeLabId`), dynamically filtering and displaying the corresponding items and counts.
- **Lab-Specific Semantics & Headlines**:
  - **Makerspace**: Displays `STATIC_MACHINE` assets (e.g. 3D printers, laser cutters, textile presses), counter labeled *"Maskiner"* with headline *"Vi har sikkert en maskine til dit formål"*.
  - **Medialab**: Displays `BORROWABLE_GEAR` assets (e.g. cinema cameras, audio kits, studio lighting), counter labeled *"Udstyrsenheder"* with headline *"Vi har sikkert udstyret til dit formål"*.
  - **Dimselab**: Displays electronics & IoT workstations (e.g. soldering setups, microcontrollers), counter labeled *"Hardware"* with headline *"Vi har grejet til dit projekt"*.
- **Even-Out Rounding (Multiples of 5 & 10, Rounded Down)**: Format the total counter by rounding down to the nearest multiple of 5 (e.g. `Math.floor(count / 5) * 5`), rendering milestone numbers like `5+`, `10+`, `15+`, `20+` (or exact count if below 5).
- **Roskilde Backend Content**: Seed dedicated authentic machines and gear for Roskilde Lab in `prisma/seed.ts` so Roskilde reflects its own physical equipment catalog.
- **Pre-Hydrated Campus-Lab Catalog**: Query inventory grouped by campus and lab in `app/page.tsx` on the server and pass as a structured catalog to the client, ensuring instantaneous 60fps switching when navigating campuses or tabs.

## Capabilities

### New Capabilities
- `public-lab-telemetry`: Reactive client-server telemetry presentation connecting landing page machine/gear showcases with backend database inventory, supporting localized campus filtering, lab-specific semantics, and rounded metric formatting.

### Modified Capabilities
<!-- None -->

## Impact

- **Components**:
  - `components/landing/MachineTelemetrySection.tsx`: Convert to reactive client component consuming `CampusContext` and rendering lab-specific titles, counters, and autoscrolling inventory cards.
  - `app/page.tsx`: Update server-side query to fetch inventory grouped by campus and lab slug.
- **Database & Seeding**:
  - `prisma/seed.ts`: Seed authentic inventory items for Roskilde Lab (both static machines and borrowable gear/dimser).
