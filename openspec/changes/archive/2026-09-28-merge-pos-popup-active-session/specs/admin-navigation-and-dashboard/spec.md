## MODIFIED Requirements

### Requirement: Docked Left-Hand Vertical Icon Navigation
The admin console interface (`/admin` and `/admin/pos`) SHALL feature a fixed, vertical left-hand navigation dock and expandable overlay drawer housing all administrative navigation, operational workspace triggers, active lab switcher, public portal jump, and logout controls, without requiring any persistent topbar header across operational views.

#### Scenario: Rendering docked vertical navigation bar
- **WHEN** an authenticated administrator opens the admin console
- **THEN** the system SHALL render a fixed vertical left sidebar with category icon triggers, lab switcher, public portal link, and logout button, and SHALL NOT render a redundant top sticky header bar across the workspace views.

#### Scenario: Switching operational views via icon click
- **WHEN** an administrator clicks any category icon in the left navigation dock
- **THEN** the system SHALL switch the active workspace view immediately (e.g. Front Desk, Inventory, Makerspace, Crafts, Audit History, Settings) without full page reloads or losing local session state.

#### Scenario: Active state visual feedback and tooltips
- **WHEN** an administrator hovers or activates a navigation icon
- **THEN** the system SHALL display an unambiguous active accent indicator (border/fill glow) and a crisp floating tooltip identifying the section name.

#### Scenario: Lab switching within navigation drawer and dock
- **WHEN** an administrator toggles or selects a lab (Makerspace, Medialab, Dimselab) in the navigation sidebar
- **THEN** the active lab state updates immediately across the active console without requiring a topbar header.
