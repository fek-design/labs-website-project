## Context

The landing page telemetry section (`MachineTelemetrySection.tsx`) currently accepts a static array of machines fetched at the page root, querying only `hardwareType: "STATIC_MACHINE"` globally. It does not react to the user switching campuses (`useCampus().campus`) or selecting different lab tabs (`useCampus().activeLabId`). Furthermore, Roskilde has no dedicated inventory seeded in the database, and the total count displays raw numbers rather than rounded milestones (multiples of 5 or 10, rounded down).

## Goals / Non-Goals

**Goals:**
- Connect `MachineTelemetrySection` to `CampusContext` so it dynamically updates according to `campus` (Køge vs. Roskilde) and `activeLabId` (Makerspace vs. Medialab vs. Dimselab).
- Implement lab-specific semantics:
  - **Makerspace**: Displays machines (`STATIC_MACHINE`), labeled *"Maskiner"*, headline *"Vi har sikkert en maskine til dit formål"*.
  - **Medialab**: Displays gear (`BORROWABLE_GEAR`), labeled *"Udstyrsenheder"*, headline *"Vi har sikkert udstyret til dit formål"*.
  - **Dimselab**: Displays electronics & IoT workstations, labeled *"Hardware"*, headline *"Vi har grejet til dit projekt"*.
- Implement even-out rounding (multiples of 5 and 10, rounded down): `Math.floor(count / 5) * 5`, showing `5+`, `10+`, `15+`, etc. (or exact if < 5).
- Seed dedicated, realistic equipment for Roskilde in `prisma/seed.ts` (3D printers, studio gear, and IoT hardware).
- Deliver telemetry data from the server in `app/page.tsx` as a pre-hydrated catalog to ensure instantaneous, flicker-free client transitions.

**Non-Goals:**
- Modifying Prisma database schemas or altering production table structures.
- Restricting inventory search in the admin POS.

## Decisions

### 1. Server-Prehydrated Campus/Lab Catalog
- **Choice**: In `app/page.tsx`, execute a single optimized `prisma.inventory.findMany` query including `lab`, grouping items into a dictionary:
  ```ts
  type TelemetryCatalog = Record<
    "køge" | "roskilde",
    Record<
      string, // "makerspace" | "medialab" | "dimselab"
      {
        count: number;
        items: MachineItem[];
      }
    >
  >;
  ```
- **Rationale**: Keeps `app/page.tsx` as an async Server Component with fast direct database queries, while enabling `MachineTelemetrySection` to react to `useCampus()` synchronously on the client without API loading states.

### 2. Milestone Number Formatting Helper
- **Choice**:
  ```ts
  export function formatMilestoneCount(count: number): string {
    if (count < 5) return `${count}`;
    const floored = Math.floor(count / 5) * 5;
    return `${floored}+`;
  }
  ```
- **Rationale**: Exactly fulfills "even out at 10s and 5s but round down of course", yielding clean milestones (e.g. 14 → `10+`, 18 → `15+`, 22 → `20+`).

### 3. Dedicated Roskilde Lab Inventory in Database Seed
- **Choice**: In `prisma/seed.ts`, seed authentic Roskilde inventory items:
  - Machines: Ultimaker S5, Prusa MK4, Epilog Zing laser cutter.
  - Gear: Sony A7 IV kit, Shure SM7B podcast setup.
  - Dimselab: Arduino Mega kits, Soldering stations, Fume extractors.
- **Rationale**: Ensures Roskilde has authentic, localized inventory separate from Køge.

## Risks / Trade-offs

- **[Zero items in a freshly created lab]** If a database lab has zero items, the ticker shouldn't crash or render blank space.
  → *Mitigation*: Fall back to realistic default equipment items tailored to that lab domain if database count is 0.
