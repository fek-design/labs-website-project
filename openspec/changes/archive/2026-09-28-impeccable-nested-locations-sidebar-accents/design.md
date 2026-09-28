## Context

See `proposal.md` for background and motivation. The system operates on Next.js 16 (App Router), React 19, Tailwind CSS v4, and Prisma ORM against a local MySQL database under a strict Zero Cloud constraint.

Currently:
- `lib/admin-nav.ts` defines navigation items with arbitrary accent colors that conflict with the actual header titles of the pages they open.
- `AdminSidebarNav.tsx` treats labs as a flat list (`makerspace`, `medialab`) without an explicit location hierarchy (Campus → Facilities).
- The `Admin` database model does not store assigned campuses or default facilities for administrator accounts.
- The project lacks the `impeccable` design skill to guide front-end craft and anti-pattern prevention.

## Goals / Non-Goals

**Goals:**
- Deploy the `impeccable` skill into `.agent/skills/impeccable/SKILL.md` and `.agents/skills/impeccable/SKILL.md`.
- Synchronize all sidebar icon and active glow colors in `lib/admin-nav.ts` to exactly match their destination page header tokens.
- Restructure the admin sidebar and settings lab selectors into a nested tree: Location (`Køge Campus`) → Facilities (`MediaLab (Køge)`, `Makerspace (Køge)`).
- Extend `Admin` in `prisma/schema.prisma` with `assignedCampus` and `assignedLabId` / `assignedLab` relation.
- Enable administrators to view and configure user location and default facility in `AdminSettingsView.tsx` and persist changes via `app/actions/settings.ts`.
- Hydrate the admin session in `AdminConsoleClient.tsx` so the workspace defaults to the administrator's assigned facility.
- Perform a systematic UX/UI audit and polish pass across the project using Impeccable craft guidelines.

**Non-Goals:**
- No multi-tenant cloud auth or external identity providers (strict local MySQL credentials only).
- No modifications to the POS loan state machines or return business logic.

## Decisions

### 1. Hierarchical Location-First Data Structure
Instead of a flat array of labs, declare a structured hierarchy:
```ts
export interface CampusLocation {
  id: string;
  name: string; // e.g. "Køge Campus"
  isPrimary?: boolean;
  facilities: Array<{
    slug: "medialab" | "makerspace";
    name: string;
    description: string;
    accentColor: string;
  }>;
}
```
In `AdminSidebarNav.tsx`, render the campus name as an uppercase section header with indented facility items, retaining a 1-click switcher in collapsed mode and full tree selection in expanded mode.

### 2. Backward-Compatible Prisma Schema Extension
Extend the `Admin` model in `prisma/schema.prisma`:
```prisma
model Admin {
  id             String    @id @default(uuid())
  username       String    @unique
  passwordHash   String
  role           Role
  isActive       Boolean   @default(true)
  assignedCampus String?   @default("Køge Campus")
  assignedLabId  Int?
  assignedLab    Lab?      @relation(fields: [assignedLabId], references: [id])
  createdAt      DateTime  @default(now())
  ...
}
```
All new fields are optional (`?`) with safe defaults, ensuring existing databases migrate non-destructively via `npx prisma db push` without losing user or loan data.

### 3. Exact Canonical Accent Color Mapping
Align navigation colors in `lib/admin-nav.ts` to mirror page headers:
- `FRONT_DESK`: `#FFED00` (Yellow) — matches `LABS Dashboard`
- `INVENTORY`: `#009FE3` (Cyan) — matches `LABS Inventar`
- `MAKERSPACE`: `#FFED00` (Yellow) — matches `Makerspace Machine Hub`
- `CRAFTS`: `#E6007E` (Pink) — matches `Crafts & Prototype Artikler`
- `HISTORY`: `#009FE3` (Cyan) — matches `Audit Logs & Transaction History`
- `SETTINGS`: `#FFED00` (Yellow) — matches `LABS Indstillinger`

### 4. Impeccable Design Quality Enforcement
Adopt the Impeccable design system rules:
- Contrast floors: 4.5:1 for body and placeholders, 3.0:1 for large text.
- Spacing rhythm: 1.5x to 2x more space above section headings than below.
- Ban AI visual cliches: no generic purple gradients, no pill overdose, no robotic microcopy.
- Custom styled form controls matching `#151517` container and `#202021` card tokens.

## Risks / Trade-offs

- **[Risk]** Updating Prisma schema on a live local database might require database client re-generation.  
  → **Mitigation**: Run `npx prisma db push` followed immediately by `npx prisma generate` and verify `tsc --noEmit`.
- **[Risk]** Existing admins in local database might have `assignedLabId: null`.  
  → **Mitigation**: Fallback gracefully to the default active lab (`"medialab"` or `"makerspace"`) if `assignedLabId` is unassigned.
