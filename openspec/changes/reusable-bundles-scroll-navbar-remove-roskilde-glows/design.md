# Design: Standalone Reusable Bundles, Directional Scroll Navbar, Extensible Campus Scoping & Glow Elimination

## Context

See `proposal.md` for motivation.
- The inventory system previously coupled bundle accessory relationships directly to individual parent items through `BundleItem(parentInventoryId, accessoryInventoryId)`. When multiple identical machines exist, operators must redundantly re-enter bundle items for each unit.
- The public landing page uses a fixed-position navbar (`LandingHeader.tsx`) that stays permanently visible regardless of scrolling direction, consuming viewport space during reading.
- Zealand Labs operations are currently centralized at Køge Campus (`makerspace` and `medialab`). While other physical locations are not actively operational today, the codebase has established an extensible multi-campus foundation (`CampusContext`, campus models, location prefix mapping). Rather than discarding this architecture, we preserve the extensible foundation while scoping active availability to Køge.
- UI components contain artificial colored glow effects (`drop-shadow`, `shadow-[0_0_...px]`, `shadow-[#...]/20`) that conflict with the clean, high-contrast Scandinavian design principles specified in `AGENTS.md`.

## Goals / Non-Goals

**Goals:**
- Decouple bundles from single machine instances into standalone, named `Bundle` presets that can be created independently and assigned to multiple machines/assets (many-to-many).
- Enable POS scan companion accessory suggestions from all assigned bundle presets of a scanned item.
- Implement directional scroll detection in `LandingHeader.tsx` to hide the navbar on scroll down and reveal it smoothly on scroll up.
- Preserve the extensible multi-campus and location infrastructure for future facility rollouts, while configuring active availability strictly to Køge (`makerspace` and `medialab`) and deactivating/cleaning inactive Roskilde and Dimselab public entries.
- Remove all glow filters and glowing colored drop-shadows across administrative and public components, enforcing crisp hairline borders and authentic neutral surfaces.

**Non-Goals:**
- Removing the `CampusContext` provider or stripping out multi-campus typing abstractions.
- Changing patron loan limits or checkout duration defaults (loans still default to 30 days).
- Redesigning the entire landing page layout.

## Decisions

### 1. Prisma Schema: Standalone `Bundle` and Many-to-Many Assignment
- **Decision**: Model `Bundle` as an independent entity:
  ```prisma
  model Bundle {
    id          String                      @id @default(uuid())
    name        String
    description String?
    createdAt   DateTime                    @default(now())
    updatedAt   DateTime                    @updatedAt

    items       BundleItem[]
    assignments EquipmentBundleAssignment[]
  }

  model BundleItem {
    id                   String    @id @default(uuid())
    bundleId             String
    accessoryInventoryId String
    defaultQuantity      Int       @default(1)
    createdAt            DateTime  @default(now())

    bundle    Bundle    @relation(fields: [bundleId], references: [id], onDelete: Cascade)
    accessory Inventory @relation("BundleAccessory", fields: [accessoryInventoryId], references: [id], onDelete: Cascade)

    @@unique([bundleId, accessoryInventoryId])
  }

  model EquipmentBundleAssignment {
    id          String    @id @default(uuid())
    inventoryId String
    bundleId    String
    assignedAt  DateTime  @default(now())

    inventory Inventory @relation("EquipmentBundles", fields: [inventoryId], references: [id], onDelete: Cascade)
    bundle    Bundle    @relation(fields: [bundleId], references: [id], onDelete: Cascade)

    @@unique([inventoryId, bundleId])
  }
  ```
- **Rationale**: Decoupling `Bundle` from specific machines allows one-time creation of kit definitions (e.g. "Sony A7 Video Kit", "Podcast Mic Pack") and reusable assignment across fleets of identical gear.
- **Alternatives Considered**: Direct array of IDs in a JSON field on `Inventory`. Rejected because relational modeling guarantees referential integrity, automated cascades, and accurate stock queries.

### 2. Directional Smart Scroll Navbar
- **Decision**: In `LandingHeader.tsx`, implement a scroll listener comparing `currentScrollY` with `lastScrollY`:
  - When scrolling down and `currentScrollY > 60px`: apply `-translate-y-full` with `transition-transform duration-300 ease-out`.
  - When scrolling up or when `currentScrollY <= 60px`: apply `translate-y-0`.
  - Keep navbar fully visible whenever the mobile full-screen drawer is active.
- **Rationale**: Directional scroll headers provide a modern, distraction-free reading experience while ensuring instant navigation retrieval on any upward gesture.
- **Alternatives Considered**: IntersectionObserver on top sentinel element. Rejected because directional tracking requires delta comparison rather than simple boundary crossing.

### 3. Extensible Campus Scoping & Active Køge Presentation
- **Decision**:
  - Keep `CampusKey` union (`"køge" | "roskilde"`) and the extensible `CAMPUS_DATA` dictionary in `CampusContext.tsx`.
  - Introduce an `AVAILABLE_CAMPUSES: CampusKey[] = ["køge"]` configuration constant that controls UI visibility and selectors. When new campuses open in the future, adding them to `AVAILABLE_CAMPUSES` activates them across the app without refactoring the context architecture.
  - Retain `resolveLocationPrefix` and location taxonomy logic in `lib/inventory-utils.ts`, while filtering inactive Roskilde options from active operational dropdowns in `InventoryItemModal.tsx`.
  - Clean out Dimselab from active landing presentation (`MachineTelemetrySection.tsx`, `LandingFooter.tsx`, `MarqueeRibbon.tsx`).
- **Rationale**: Honors existing investments in multi-campus modularity so the system is ready to expand, while ensuring visitors and staff only interact with physically operational facilities.

### 4. Elimination of Glow Effects
- **Decision**:
  - In `AdminSidebarNav.tsx`, remove `style={{ filter: isActive ? drop-shadow(...) : undefined }}`. Active state is conveyed cleanly by icon color, high-contrast fill, and crisp 1px active indicator geometry.
  - Remove all `shadow-[0_0_...px]` neon indicators and colored button glow halos (`shadow-[#...]/20`), replacing them with standard neutral elevation (`shadow-md`, `shadow-lg` without saturated color tints) and 1px hairline borders (`border-white/10`, `border-zinc-700`).
- **Rationale**: Aligns strictly with `AGENTS.md` and Scandinavian functionalist aesthetics: crisp lines, authentic materials, and zero AI-cliche glows.

## Risks / Trade-offs

- **[Risk] Schema migration on existing `BundleItem` data** → Update Prisma schema safely with relations and generate client cleanly.
- **[Risk] Rapid scroll bounce on iOS Safari** → Clamp scroll values to `Math.max(0, currentScrollY)` and ignore negative overscroll values when determining direction.
- **[Risk] Multiple bundles assigned to one equipment item might contain the same accessory** → In POS scan aggregation, aggregate default quantities for identical accessories so the prompt displays combined line items.

## Migration Plan

1. Update `prisma/schema.prisma` with `Bundle`, `BundleItem`, and `EquipmentBundleAssignment`. Execute `npx prisma db push`.
2. Add server actions for bundle preset management and assignment in `app/actions/inventory.ts`.
3. Build the Bundle Presets management modal/drawer and integrate bundle selection into `InventoryItemModal.tsx`.
4. Update `EquipmentPOS.tsx` bundle recommendation drawer to query assigned bundles and aggregate accessories.
5. Update `LandingHeader.tsx` with directional scroll reveal logic.
6. Configure `CampusContext.tsx` with `AVAILABLE_CAMPUSES = ["køge"]`, clean active landing copy, footer, and marquee, and filter inactive locations in inventory modal.
7. Strip all glow effects and colored halo shadows.
8. Validate build with `npm run build` and tests.
