# Design Document: Streamline Admin POS, Inventory Cohesion, and Database Lab Standardization

## Context
See `proposal.md` for motivation and background. The administrative workspace currently spans `/admin/pos` with multiple views (`EquipmentPOS`, `InventoryManager`, `MakerspaceMachineHub`). Disparate header styles, conflicting surface color tokens in the sidebar, isolated facility filtering, and manual loan-by-loan return flows impede a cohesive administrator experience.

## Goals / Non-Goals

**Goals:**
- Unify page headers across POS and Inventory using the canonical `LABS [Section]` hierarchy with admin greeting and live KPI counter ribbons.
- Correct `AdminSidebarNav` background token from arbitrary `#121214` to the official `#09090b` (Dock) surface with `#262626` borders.
- Integrate a global Lab Switcher in `AdminSidebarNav` and sync `activeLab` state across `AdminConsoleClient`, `EquipmentPOS`, and `InventoryManager`.
- Standardize database lab records to explicit campus names: `Makerspace (Køge)` and `MediaLab (Køge)`.
- Streamline POS active sessions when a student has multiple ongoing loans with bulk return capabilities.
- Formally document and enforce the 3-tier Stack Sans typography rule.

**Non-Goals:**
- Redesigning student-facing public catalogs or changing patron authentication requirements.

## Decisions

### 1. Canonical Page Header Architecture
- **Decision**: Port the POS header layout as the mandatory template for all administrative modules:
  - Left: Title `LABS <SectionName>` (`text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1.5`, with `LABS` in white and Section Name in accent color: `#FFED00` for POS Dashboard, `#1da9e4` for Inventar).
  - Subtitle: `Velkommen, <AdminName>` or module description in `text-sm font-headline font-bold text-zinc-400 mt-1`.
  - Right: Horizontal KPI metric cluster showing large numeric counts in `font-notch` with stacked labels in `font-headline`.

### 2. Dock Surface Token Fix
- **Decision**: Replace `bg-[#121214]` in `components/admin/AdminSidebarNav.tsx` with `bg-[#09090b]` to align with the design system dock token:
  - Base Floor: `#000000` / `#0e0d0f`
  - Dock: `#09090b`
  - Cards: `#202021`
  - Elevated/Inputs: `#151517`
  - Borders: `#262626` / `#333333`

### 3. Global Lab Switcher in Admin Navigation
- **Decision**: Provide an interactive lab switcher in `AdminSidebarNav` accessible in both expanded and collapsed modes:
  - Expanded: Clean select pill with active color dot, lab name, and campus subtitle.
  - Collapsed: Compact icon toggle with color dot and hover tooltip.
  - State: Lifted to `AdminConsoleClient` so switching labs simultaneously filters `EquipmentPOS` and `InventoryManager`.

### 4. Database Campus Lab Naming
- **Decision**: Update `prisma/seed.ts` and execute a database update server action to set:
  - `Makerspace (Køge)` (slug: `makerspace`)
  - `MediaLab (Køge)` (slug: `medialab`)
  - `Roskilde Lab` (slug: `roskilde`)
- **Rationale**: Prevents asset collision across campuses while preserving stable slug URLs.

### 5. Streamlined Multi-Loan POS Workflow
- **Decision**: In `ActiveSessionPanel.tsx`:
  - Display an ongoing loans alert/accordion in `UDLEJNING` mode when the active patron already has equipment checked out.
  - In `RETUNERING` mode, provide a prominent "Returnér alle lån" (Bulk Return) button with confirmation, invoking a batched server action `returnMultipleLoans` in `app/actions/pos.ts`.

### 6. Typography System Rule
- **Decision**: Formalize typography rules across the codebase:
  - `Stack Sans Notch`: Headers (`h1`, `h2`), brand logos, large metric digits.
  - `Stack Sans Headline`: Category labels, subheaders, badges, table headers.
  - `Stack Sans Text`: Text inputs, descriptions, table cell values, body copy.

## Risks / Trade-offs

- [Bulk returns of multiple loans executing concurrently] → Execute inside a Prisma interactive transaction `$transaction` to ensure atomic updates and consistent audit logs.
- [Mobile responsive header wrapping] → Use responsive flex wrap (`flex-col xl:flex-row`) so KPI ribbons flow cleanly underneath the title on smaller screens.
