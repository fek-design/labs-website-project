## Why

Currently, manual documents are managed through a secondary modal inside the Makerspace hub, limiting visibility and making hardware linking cumbersome. Meanwhile, the Figma design system establishes a dedicated "Dashboard - Manualer" interface (`86:4076`) with high-fidelity document cards, inline equipment linking, and search filters. Furthermore, public catalogue administration needs a distinct, dedicated workspace separate from physical stock inventory, and the administrator settings update action encounters runtime errors during credential and location persistence.

## What Changes

- **Dedicated Manuals Management View (`MANUALS`)**: Reskin and promote the manuals catalog into a canonical, top-level admin page matching Figma node `86:4076`:
  - `LABS Manualer` header with `#E6007E` pink accent and live KPI metric summary.
  - Dedicated search and scan toolbar with pink "Tilføj" modal button for PDF uploads.
  - Interactive filter strip with live manual counter, `LAB` selector, and `TYPE` selector.
  - 3-column responsive card grid displaying PDF preview thumbnail, Stack Sans Notch title, file size & format metadata, asset tags, description, linked hardware list with "Se" trigger and "x" unlink button, and readiness status pills.
- **Dedicated Catalogue Admin Panel (`CATALOGUE`)**:
  - Add a dedicated "Katalog" (`CATALOGUE`) view in `ADMIN_NAV_ITEMS` with a distinct brand accent color (`#FF9900` Amber), isolating public catalogue curation and showcase settings from warehouse hardware tracking.
- **Admin Navigation Registry Extension**:
  - Register `MANUALS` (`#E6007E` Pink) and `CATALOGUE` (`#FF9900` Amber) in `lib/admin-nav.ts` with corresponding Phosphor icons and active state glows.
- **Admin Settings Error Resolution**:
  - Fix runtime failure in `updateAdminCredentials` and `getAdminProfile` by ensuring safe admin identification, handling empty password submissions without blowing up validation, standardizing `Date` serialization, and gracefully handling cache revalidation.

## Capabilities

### New Capabilities
- `admin-manuals-management`: Dedicated administrator dashboard for uploading, inspecting, filtering, and linking laboratory PDF manuals and SOPs to physical equipment matching Figma frame 86:4076.
- `admin-catalogue-management`: Dedicated administrator workspace for curating, categorizing, and managing public catalogue showcases with distinct amber accent styling.

### Modified Capabilities
- `admin-navigation-and-dashboard`: Extends `ADMIN_NAV_ITEMS` registry and sidebar dock with `MANUALS` (Pink) and `CATALOGUE` (Amber) top-level navigation tabs.
- `admin-history-settings`: Resolves mutation errors during administrator credential and location setting updates.

## Impact

- `lib/admin-nav.ts`: Extended with `MANUALS` and `CATALOGUE` definitions.
- `app/admin/pos/AdminConsoleClient.tsx`: Renders new `ManualsManager` and `CatalogueAdminManager` views.
- `components/manuals/ManualsManager.tsx`: New component implementing Figma frame 86:4076 layout.
- `components/catalogue/CatalogueAdminManager.tsx`: New component for catalogue administration.
- `app/actions/settings.ts` & `components/settings/AdminSettingsView.tsx`: Hardened against runtime exceptions.
