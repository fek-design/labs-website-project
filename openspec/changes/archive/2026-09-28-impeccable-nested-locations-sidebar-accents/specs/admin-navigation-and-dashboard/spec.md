## MODIFIED Requirements

### Requirement: Docked Left-Hand Vertical Icon Navigation
The admin console interface (`/admin/pos`) SHALL feature a fixed, vertical left-hand navigation dock (`width: 80px` collapsed, `width: 256px` expanded) built with the design system dock surface (`#09090b`), right border (`#262626`), a hierarchical location-first lab category selector grouping facilities under their physical campus (e.g. `Køge Campus` → `MediaLab`, `Makerspace`), and category icon triggers whose active accent color tokens exactly match the primary header colors of the respective destination views.

#### Scenario: Rendering docked vertical navigation bar
- **WHEN** an authenticated administrator opens the admin console (`/admin/pos`)
- **THEN** the system SHALL render a fixed vertical left sidebar with the official dock surface (`#09090b`), right border (`#262626`), global lab switcher, and vertically centered icon triggers (40x40px).

#### Scenario: Switching operational views via icon click
- **WHEN** an administrator clicks any category icon in the left navigation dock
- **THEN** the system SHALL switch the active workspace view immediately (e.g. Front Desk, Inventory, Makerspace, Crafts, Audit History, Settings) without full page reloads or losing local session state.

#### Scenario: Active state visual feedback and tooltips
- **WHEN** an administrator hovers or activates a navigation icon
- **THEN** the system SHALL display an unambiguous active accent indicator (border/fill glow) and a crisp floating tooltip identifying the section name.

#### Scenario: Lab switching within navigation drawer and dock
- **WHEN** an administrator selects a lab facility from the global switcher in the navigation dock
- **THEN** the system SHALL update the active lab context across all operational modules (POS, Inventory, Makerspace) without requiring page reload.

#### Scenario: Page-synchronized accent color highlighting
- **WHEN** an administrator activates a navigation tab
- **THEN** the sidebar icon and active glow SHALL display the exact accent color token matching the target page: `#FFED00` (Yellow) for Front Desk (POS), `#009FE3` (Cyan) for Inventory, `#FFED00` (Yellow) for Makerspace, `#E6007E` (Pink) for Crafts, `#009FE3` (Cyan) for History, and `#FFED00` (Yellow) for Settings.

#### Scenario: Hierarchical location-nested lab selection
- **WHEN** an administrator expands the sidebar navigation panel
- **THEN** the facility switcher presents an explicit location hierarchy header ("Køge Campus") containing indented/nested facility category options ("MediaLab (Køge)" and "Makerspace (Køge)") indicating the active selection with real-time synchronized status.
