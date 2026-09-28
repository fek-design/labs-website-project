## MODIFIED Requirements

### Requirement: Admin Credential Settings
The system SHALL provide a basic authentication login wrapper with default administrator credentials (`admin` / `pass`), manage authentication state, allow administrators to update their credentials, and display accurate node profile telemetry adhering to the canonical project design system tokens without stale hardcoded location strings.

#### Scenario: Basic login verification
- **WHEN** an unauthenticated administrator enters `admin` and `pass` on the login screen
- **THEN** the system grants access to the operational console and stores a secure local session.

#### Scenario: Updating admin login credentials
- **WHEN** an administrator submits a new username and password in the Settings view
- **THEN** the system validates complexity, hashes the new password with bcrypt, updates the database, and records an audit log entry.

## ADDED Requirements

### Requirement: Location Context and Multi-Facility Management
The Settings view (`/admin` under Settings) SHALL dynamically display the active campus context (`Køge Campus`), show all accessible campus facilities (`Makerspace (Køge)` and `MediaLab (Køge)`), and provide an interactive session facility switcher enabling administrators managing multiple spaces to switch their active operational workspace.

#### Scenario: Displaying verified campus and facility context
- **WHEN** an administrator opens the Settings tab
- **THEN** the system displays "Køge Campus" with the active session facility badge, omitting unbacked or decommissioned campus references.

#### Scenario: Switching active facility from settings
- **WHEN** an administrator toggles the active facility switcher in Settings between Makerspace and MediaLab
- **THEN** the system updates the global session `activeLab` state immediately, synchronizing operational views (POS, Inventory, Makerspace Hub) across the console.
