## Why

The administrative console currently exhibits three design and architectural gaps:
1. **Accent Color Mismatches**: Sidebar navigation item accent colors conflict with the canonical color tokens of the pages they open (e.g. Front Desk POS displays `#FFED00` Yellow on its dashboard header while its sidebar icon is styled in Cyan `#009FE3`; Inventory uses Cyan `#009FE3` on its page header while the sidebar is Yellow `#FFED00`).
2. **Flat Facility Selector & Missing User Location Assignment**: Facilities are presented as a flat two-item list without a location hierarchy (Campus → Labs/Facilities), and administrator profiles lack persisted location/facility assignment, preventing administrators from being designated to specific physical spaces.
3. **Impeccable Design Quality Standards**: The project requires the installation of the `impeccable` design skill to systematically eliminate AI design cliches, resolve UI inconsistencies, refine contrast and spacing rhythm, and uphold production-grade craft across both administrative and public interfaces.

## What Changes

- **Install Impeccable Design Skill**: Deploy the official `impeccable` design quality and craft guidelines into `.agent/skills/impeccable/SKILL.md` and `.agents/skills/impeccable/SKILL.md`, providing an actionable reference for contrast floors, typographic hierarchy, shadow depths, and the elimination of AI cliches.
- **Hierarchical Location-First Lab Categories Selector**:
  - Restructure the facility switcher in `AdminSidebarNav.tsx` (and related administrative views) into a clean, collapsible or grouped tree where facilities (`MediaLab`, `Makerspace`) are explicitly nested under their parent Location (`Køge Campus`).
  - Provide an extensible structure that accommodates additional campuses and facilities without requiring layout redesign.
- **Administrator User Location Assignment**:
  - Extend the Prisma `Admin` model with `assignedCampus` (e.g. `"Køge Campus"`) and `assignedLabId` / `assignedLab` relation.
  - Update `getAdminProfile` and `updateAdminCredentials` in `app/actions/settings.ts` to allow viewing and assigning location/facility defaults to user accounts.
  - Update the admin login and session hydration flow to default the active workspace to the administrator's assigned facility.
  - In `AdminSettingsView.tsx`, provide an administrative management control to assign and update location and default workspace for users.
- **Synchronize Sidebar Accent Colors with Target Pages**:
  - In `lib/admin-nav.ts` and `components/admin/AdminSidebarNav.tsx`, align all icon and glow accent colors with the exact brand tokens used by each page's canonical header:
    - **Front Desk (POS Dashboard)**: `#FFED00` (Yellow) — matches `LABS Dashboard` yellow branding.
    - **Lager & Katalog (Inventory)**: `#009FE3` (Cyan) — matches `LABS Inventar` cyan branding.
    - **Makerspace Maskiner**: `#FFED00` (Yellow) — matches `Makerspace Hub` header tokens.
    - **Crafts & Artikler**: `#E6007E` (Pink) — matches `Crafts` pink branding badge.
    - **Revisionslog (Audit History)**: `#009FE3` (Cyan) — matches `Audit Logs` telemetry badge.
    - **Systemindstillinger (Settings)**: `#FFED00` (Yellow) — matches `LABS Indstillinger` header.
- **Project-Wide Impeccable Craft & Polish Pass**:
  - Audit and fix UI micro-interactions, focus rings, border contrast, typography balance, and input padding across the entire admin dashboard and public landing pages.

## Capabilities

### Modified Capabilities
- `admin-navigation-and-dashboard`: Update docked navigation requirements to mandate page-synchronized accent colors and hierarchical location-first facility selection.
- `admin-history-settings`: Update requirements to support persisted user location and facility assignment with session hydration and management controls.

## Impact

- **Database**: Add `assignedCampus` and `assignedLabId` fields to `Admin` model in `prisma/schema.prisma`.
- **Navigation Registry**: Update `lib/admin-nav.ts` and `components/admin/AdminSidebarNav.tsx` with synced accent tokens and nested location-facility selection.
- **Settings & Auth**: Update `app/actions/settings.ts`, `app/actions/auth.ts`, `components/settings/AdminSettingsView.tsx`, and `app/admin/pos/AdminConsoleClient.tsx`.
- **Skills**: Add `.agent/skills/impeccable/SKILL.md`.
