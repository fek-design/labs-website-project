## MODIFIED Requirements

### Requirement: Location Context and Multi-Facility Management
The Settings view (`/admin` under Settings) SHALL dynamically display the active campus context (`Køge Campus`), show all accessible campus facilities (`Makerspace (Køge)` and `MediaLab (Køge)`), provide an interactive session facility switcher, and allow administrators to view, assign, and persist user-level default operational locations and facility permissions.

#### Scenario: Displaying verified campus and facility context
- **WHEN** an administrator opens the Settings tab
- **THEN** the system displays "Køge Campus" with the active session facility badge, omitting unbacked or decommissioned campus references.

#### Scenario: Switching active facility from settings
- **WHEN** an administrator toggles the active facility switcher in Settings between Makerspace and MediaLab
- **THEN** the system updates the global session `activeLab` state immediately, synchronizing operational views (POS, Inventory, Makerspace Hub) across the console.

#### Scenario: Assigning default location and facility to user
- **WHEN** an administrator updates user profile settings and selects an assigned campus and default facility
- **THEN** the system persists `assignedCampus` and `assignedLabId` on the `Admin` record and records an audit log entry.

#### Scenario: User session hydration from assigned location
- **WHEN** an administrator logs in with an assigned location and facility
- **THEN** the administrative workspace session initializes with the user's assigned facility automatically selected as the default operational workspace.
