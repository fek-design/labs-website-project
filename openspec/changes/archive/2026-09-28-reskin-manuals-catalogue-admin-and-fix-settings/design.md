## Context

See `proposal.md` for background and motivation. The admin workspace uses Next.js App Router, Tailwind CSS v4, Prisma ORM with local MySQL ("Strict Zero Cloud"), and a docked sidebar navigation driven by `ADMIN_NAV_ITEMS`. Figma node `86:4076` defines the canonical layout for `Dashboard - Manualer`.

## Goals / Non-Goals

**Goals:**
- Implement `ManualsManager.tsx` component matching Figma node `86:4076` ("Dashboard - Manualer") with `#E6007E` pink accent, Stack Sans typography, search & scan bar, filter cluster (`LAB`, `TYPE`), 3-column responsive card grid, inline hardware linking, and upload modal.
- Implement `CatalogueAdminManager.tsx` with distinct `#FF9900` amber accent styling, category filters, and public showcase toggle controls.
- Extend `lib/admin-nav.ts` with `MANUALS` (`#E6007E`) and `CATALOGUE` (`#FF9900`) entries.
- Wire new views into `AdminConsoleClient.tsx`.
- Eliminate runtime errors during administrator credentials and location updates in `app/actions/settings.ts` and `components/settings/AdminSettingsView.tsx`.

**Non-Goals:**
- Modifying public consumer-facing routes (`/katalog`, `/craft/[slug]`, or `/`).
- Introducing cloud PDF hosting (PDFs continue to reside in local `public/uploads/manuals/`).
- Database schema changes (the existing `Manual`, `InventoryManual`, and `Admin` models are sufficient).

## Decisions

### 1. Manuals View Architecture (`components/manuals/ManualsManager.tsx`)
- **Structure**:
  - **Header**: Canonical `flex flex-col xl:flex-row ...` header: `LABS` in white + `Manualer` in `#E6007E` (`font-notch`) with admin greeting and top KPI counters (`Tilgængelige manualer`, `Tilknyttet udstyr`).
  - **Toolbar**: Full-width search bar with barcode scan placeholder and `#E6007E` "Tilføj" modal button.
  - **Filter Strip**: `Tilgængelige Manualer [Count]`, with `LAB` (`ALLE`, `MediaLab`, `Makerspace`) and `TYPE` (`ALLE`, `Udstyr`, `Maskine`) dropdowns.
  - **Card Grid**: Responsive 3-column layout matching Figma `86:4076`:
    - Container: `#202021` card, border `#444444`, rounded-lg.
    - Media preview: `#444444` window with document vector icon.
    - Header: `title` in `Stack Sans Notch Bold`, metadata (`filename` • `filesize`) in `Stack Sans Headline Bold text-zinc-400`, asset tag `ML-CAM-045 • Udstyr`, and `description`.
    - Hardware linking: `Links (N)` subheader with `Tilføj +` button, linked items list with yellow `#FFED00` "Se" detail button and "x" unlink trigger.
    - Status pill: "AKTIVITET KLAR TIL UDLEJNING" or operational readiness badge.
- **Backend Action Integration**: Reuses existing robust server actions in `app/actions/manuals.ts` (`getManualsWithFilters`, `uploadManual`, `assignManualToMachine`, `unassignManualFromMachine`, `deleteManual`).

### 2. Catalogue Admin View Architecture (`components/catalogue/CatalogueAdminManager.tsx`)
- **Structure**:
  - Replicates canonical admin card and filter patterns with `#FF9900` amber accent tokens.
  - Allows administrators to curate project articles, toggle frontpage showcase status (`isFeaturedOnFrontpage`), search by tags, and view campus availability.
  - Uses existing actions in `app/actions/crafts.ts` (`getCraftArticles`, `toggleFeatureOnFrontpage`, `saveCraftArticle`, `deleteCraftArticle`).

### 3. Hardening Settings Action (`app/actions/settings.ts`)
- **Fixes**:
  - Guard `adminId`: fallback safely to active admin if `adminId` is falsy or missing.
  - Avoid hashing/updating password if `newPassword` is empty or undefined, preserving existing password hash.
  - Return plain serialized strings for `createdAt` (`admin.createdAt.toISOString()`) to avoid Server Action serialization errors.
  - Wrap `revalidatePath` calls in a try-catch to prevent static generation store invariants from failing server action execution.
  - Ensure updated session state handles username updates gracefully.

## Risks / Trade-offs

- **[Risk] High density of linked hardware on a single manual card.**
  → *Mitigation*: Limit linked hardware preview list to 3 items with scroll or "Vis alle (N)" expansion.
- **[Risk] Large PDF upload sizes over local network.**
  → *Mitigation*: Provide client-side file size validation (max 50MB) and progress feedback.
