# Proposal: Streamline Admin POS, Inventory Cohesion, and Database Lab Standardization

## Why
The administrative workspace currently exhibits visual and operational discrepancies between the POS and Inventory modules:
1. **Header Inconsistency**: The POS dashboard features the canonical brand header architecture (`LABS` in white + colored section name in `Stack Sans Notch`, admin greeting, and live KPI metric counters), whereas the newly styled Inventory page used a disparate header block.
2. **Sidebar Color Token Misalignment**: `AdminSidebarNav` used an ad-hoc `#121214` surface rather than the OpenSpec Design System's designated `#09090b` (Dock) token, muddying the contrast against `#0e0d0f` and `#000000` page surfaces.
3. **Fragmented Lab Switching**: Switching between facilities (Makerspace vs. MediaLab) was isolated to an icon toggle in the sidebar and had no global synchronization with the inventory manager.
4. **Database Campus Disambiguation**: Lab entities in the database must explicitly declare campus locality (`Makerspace (Køge)` and `MediaLab (Køge)`) to avoid collisions with Roskilde and future facility expansions.
5. **POS Multiple Loan UX Friction**: When a student has multiple ongoing loans during a checkout session, inspecting, extending, or returning items required repetitive individual clicks rather than a streamlined bulk flow.

## What Changes
- **Database Lab Standardization**:
  - Ensure macro labs in the database explicitly reflect campus affiliations: `Makerspace (Køge)` and `MediaLab (Køge)`.
  - Maintain clean slug routing (`makerspace` and `medialab`) while ensuring all UI selectors, asset tag computations, and audit logs display the disambiguated names.
- **Canonical Admin Page Header Architecture**:
  - Adopt the POS header structure (`LABS` in white + Section Name in `#FFED00` or `#1da9e4`, admin greeting subtitle, and top metric counters) across both POS and Inventory pages.
  - Document this canonical header standard as a project rule.
- **Admin Sidebar Color Token Fix**:
  - Change `AdminSidebarNav` background from `#121214` to `#09090b` (Dock surface token) with `#262626` right border, creating crisp contrast with page content.
- **Global Lab Switcher**:
  - Place a unified, prominent Lab Switcher at the top of `AdminSidebarNav` (accessible in both expanded and collapsed modes) and pass active lab state down to POS, Inventory, and Makerspace consoles.
- **Streamlined POS Bulk Checkout & Multi-Loan Management**:
  - In `ActiveSessionPanel.tsx`, introduce a streamlined multi-loan inspector that surfaces all ongoing loans for the active patron.
  - Add a one-click "Returner alle valgte lån" (Bulk Return) action alongside individual return options.
  - Provide clear visual indicators for overdue vs. on-time ongoing loans during active checkout.
- **Typography Standard Rule**:
  - Formally enforce the 3-tier font hierarchy: `Stack Sans Notch` (primary headings/brand titles), `Stack Sans Headline` (subheadings, badges, uppercase labels), and `Stack Sans Text` (inputs, table values, body copy).

## Capabilities

### Modified Capabilities
- `admin-navigation-and-dashboard`: Update navigation dock surface tokens (`#09090b`), integrate the global lab switcher, and establish the canonical header requirement.
- `equipment-pos-dashboard`: Streamline patron multi-loan sessions with bulk return actions and active loan inspector.
- `inventory-location-management`: Standardize inventory page header to the canonical POS structure and bind to the global admin lab switcher.

## Impact
- **UI Components**:
  - `components/admin/AdminSidebarNav.tsx`: Surface color fix (`#09090b`), prominent global lab selector.
  - `app/admin/pos/AdminConsoleClient.tsx`: Global lab state distribution to all admin views.
  - `components/inventory/InventoryManager.tsx`: Page header harmonization and KPI counter bar.
  - `components/pos/ActiveSessionPanel.tsx`: Bulk loan returns and multi-loan overview accordion/drawer.
- **Database**:
  - `prisma/seed.ts` and database records: Update lab names to `Makerspace (Køge)` and `MediaLab (Køge)`.
- **OpenSpec & Project Rules**:
  - Record typography and page header guidelines in project rules.
