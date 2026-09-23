## Why

The current admin navigation relies on an inline top bar that occupies excessive vertical height, constrains category scaling, and lacks the ergonomic, utility-oriented aesthetic of the physical Zealand Labs control systems. Migrating navigation to a docked, vertical left-hand sidebar with Phosphor iconography (matching Figma frame `#79:835`) streamlines screen real estate and aligns the administrative workspace with professional CAD/CAM and lab tooling. Furthermore, the admin landing portal (`/admin`) requires a visual refresh matching Figma frames `#79:827` and `#79:2063` while strictly preserving all existing database counting, authentication, and routing logic.

## What Changes

- **Docked Left-Hand Vertical Navigation**:
  - Replace the top header horizontal pill bar in `AdminConsoleClient.tsx` with a fixed left-side dock (`width: 80px`, background `#151517`, right border `#262626`).
  - Feature 40x40 icon buttons powered by `@phosphor-icons/react` (or tailored Phosphor SVGs) representing operational domains: Front Desk & POS, Inventory & Catalog, Makerspace Machines, Crafts & Blog Articles, Audit Logs, and Settings.
  - Implement an **extendable navigation configuration registry** (`ADMIN_NAV_ITEMS`) where new administrative tools or category tabs can be plugged in trivially with typed identifiers, labels, icons, badge counters, and keyboard shortcuts.
  - Include bottom dock controls for local node health status indicator and exit/logout actions.
- **Admin Dashboard Landing Refresh (`/admin`)**:
  - Update `app/admin/page.tsx` with high-fidelity visual styling derived from Figma frames `#79:827` and `#79:2063` (sleek dark aesthetic, sharp geometric cards, CMYK accent telemetry, and modern typography).
  - Strictly preserve all existing logic: real-time Prisma queries (`prisma.inventory.count`, `prisma.loan.count`), graceful database fallback behavior, and links to public portal and POS desk.

## Capabilities

### New Capabilities
- `admin-navigation-and-dashboard`: Left vertical icon sidebar navigation with extendable category registry and refreshed admin dashboard landing page adhering to Figma visual design specifications.

### Modified Capabilities
<!-- None: Underlying POS business rules, loan mechanics, and inventory mutations remain unchanged -->

## Impact

- **UI Components**:
  - `app/admin/page.tsx`: Redesigned layout and visual styling.
  - `app/admin/pos/AdminConsoleClient.tsx`: Converted to vertical left sidebar layout wrapping the view components.
  - New navigation configuration module `config/admin-nav.ts` (or `lib/admin-nav.ts`) defining the extendable navigation registry.
- **Dependencies**:
  - Install `@phosphor-icons/react` for standardized Phosphor icon set.
- **Zero Cloud Mandate**: Fully maintained; all styling, icons, and server queries operate 100% locally.
