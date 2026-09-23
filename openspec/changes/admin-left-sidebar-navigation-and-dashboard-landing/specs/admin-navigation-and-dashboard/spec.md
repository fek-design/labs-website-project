## Purpose

Provides a docked, vertical left-hand icon navigation architecture for the admin operational workspace and delivers a refreshed, high-contrast dashboard landing page adhering to Zealand Labs visual design tokens.

## ADDED Requirements

### Requirement: Docked Left-Hand Vertical Icon Navigation
The admin console interface (`/admin/pos`) SHALL feature a fixed, vertical left-hand navigation dock (`width: 80px`) that houses category icon triggers for all administrative operational workspaces.

#### Scenario: Rendering docked vertical navigation bar
- **WHEN** an authenticated administrator opens the admin console (`/admin/pos`)
- **THEN** the system SHALL render a fixed vertical left sidebar with a dark background (`#151517`), right border (`#262626`), and vertically centered icon triggers (40x40px).

#### Scenario: Switching operational views via icon click
- **WHEN** an administrator clicks any category icon in the left navigation dock
- **THEN** the system SHALL switch the active workspace view immediately (e.g. Front Desk, Inventory, Makerspace, Crafts, Audit History, Settings) without full page reloads or losing local session state.

#### Scenario: Active state visual feedback and tooltips
- **WHEN** an administrator hovers or activates a navigation icon
- **THEN** the system SHALL display an unambiguous active accent indicator (border/fill glow) and a crisp floating tooltip identifying the section name.

### Requirement: Extendable Administrative Navigation Registry
The navigation dock SHALL be driven by a centralized, typed declarative registry (`ADMIN_NAV_ITEMS`) that allows adding, reordering, or removing admin categories without modifying low-level layout code.

#### Scenario: Rendering navigation items from configuration
- **WHEN** the navigation bar mounts
- **THEN** the system SHALL iterate through the declarative registry to generate each icon button, tooltip, active styling, and route/view mapping.

#### Scenario: Extending the navigation system with a new tool
- **WHEN** a developer adds a new item configuration to the navigation registry
- **THEN** the navigation bar SHALL automatically render the new icon, tooltip, and view switcher in the correct position without layout regressions.

### Requirement: Refreshed Admin Dashboard Landing Page
The administrative root landing portal (`/admin`) SHALL display a modernized, high-contrast visual interface matching Figma design specifications while strictly preserving database statistics logic and zero-cloud execution.

#### Scenario: Viewing dashboard statistics cards
- **WHEN** an administrator visits `/admin`
- **THEN** the system SHALL execute server-side count queries for borrowable gear, machines, and active loans, rendering the metrics inside high-contrast feature cards.

#### Scenario: Graceful fallback when database is disconnected
- **WHEN** the local database is offline or encountering connectivity issues
- **THEN** the `/admin` landing page SHALL render safely with zero-count fallbacks without crashing or displaying raw database errors.

#### Scenario: One-click launching into POS desk
- **WHEN** an administrator clicks "Launch POS Desk" or any feature module card on `/admin`
- **THEN** the system SHALL route the user directly to the corresponding admin console view.
