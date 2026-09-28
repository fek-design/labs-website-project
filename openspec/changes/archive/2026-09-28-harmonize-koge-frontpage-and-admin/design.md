## Context

See `proposal.md` for background and problem motivation. The project currently bridges frontpage landing components with administrative operational dashboards across MySQL and local JSON stores. Active development is focused on the Køge Campus launch (`Makerspace (Køge)` and `MediaLab (Køge)`).

## Goals / Non-Goals

**Goals:**
- Eliminate string-parsing heuristics and ghost lab categorization from the landing page.
- Scope active admin and landing navigation to the two operational facilities in Køge: `Makerspace (Køge)` and `MediaLab (Køge)`.
- Enable administrators in `CraftItemsManager` to toggle and curate up to 5 featured prototypes displayed on the frontpage carousel.
- Connect `MakerspaceMachineHub` to the global admin `activeLab` context.
- Maintain full architecture scalability so new campuses and labs can be added in the future without schema restructuring.

**Non-Goals:**
- Removing the database schema's multi-campus support (`Lab.campus` and `CraftItem.campuses` remain flexible for future expansion).
- Redesigning landing page visual styles, hero layout, or GSAP animations.
- Introducing cloud storage or external API services (strict local zero-cloud architecture preserved).

## Decisions

### 1. Single-Campus Focus with Scalable Structure
- **Decision**: Set the active frontpage campus to `Køge` by default, suppress the legacy `FirstTimeCampusGate` modal, and present a clean "Køge Campus" indicator in `LandingHeader`.
- **Admin Switcher**: Update `LAB_OPTIONS` in `AdminSidebarNav` to provide a dedicated 2-way toggle between `Makerspace (Køge)` (`#009FE3`) and `MediaLab (Køge)` (`#E6007E`).
- **Rationale**: Roskilde is currently out of operational scope. Eliminating placeholder routes avoids admin confusion and user friction while preserving the underlying data model for future campus additions.

### 2. Admin-Curated Frontpage Prototypes (`isFeaturedOnFrontpage`)
- **Decision**: Add `isFeaturedOnFrontpage?: boolean` and `featuredOrder?: number` to `CraftItemData` in `lib/craft-data.ts` and `data/crafts.json`.
- **Admin Control**: In `CraftItemsManager`, add a toggle star/badge on each article row. When an admin selects "Fremhæv på forside", the item is saved and instantly exposed to the frontpage. A maximum of 5 items is enforced.
- **Frontend Integration**: `app/page.tsx` fetches craft articles via `getCraftArticles()`, filters by `isFeaturedOnFrontpage`, and passes them to `PrototypeCarousel`. If fewer than 1 item is marked, the carousel falls back to the top standard catalog items.
- **Alternatives Considered**: Completely static array (no admin control) vs full dynamic database query without curation (risks low-quality or incomplete articles appearing on the marketing frontpage). The 5-card curated model balances admin flexibility with editorial control.

### 3. Direct Relational Telemetry in `app/page.tsx`
- **Decision**: Replace heuristic string matching (`location.includes("dimse")`) and forced `BORROWABLE_GEAR` reassignments with a clean relational query:
  ```ts
  const items = await prisma.inventory.findMany({
    where: {
      lab: { slug: { in: ["makerspace", "medialab"] } },
    },
    include: { lab: true },
  });
  ```
- Items are bucketed strictly by `item.lab.slug`. `MachineTelemetrySection` renders telemetry cards for `makerspace` and `medialab`.

### 4. Dynamic Lab Context for Admin Machine Hub
- **Decision**: Update `components/makerspace/MakerspaceMachineHub.tsx` to accept `{ activeLab }: { activeLab?: string }`.
- When `activeLab` changes in `AdminSidebarNav`, `MakerspaceMachineHub` updates its database query to fetch static machines matching that lab slug, defaulting to `makerspace`.

## Risks / Trade-offs

- **[Risk: Admin attempts to feature more than 5 cards]** → Mitigation: Enforce client and server validation capping featured items at 5. Display a toast notification informing the admin to unfeature an item before adding another.
- **[Risk: Empty state if no items are featured]** → Mitigation: `PrototypeCarousel` implements a default fallback array so the frontpage carousel is never blank.
- **[Risk: Re-enabling Roskilde in the future]** → Mitigation: Keep `Lab.campus` and `CraftLocation.campus` intact; adding a future campus requires only adding a database `Lab` row and updating the UI option list.
