# admin-history-settings Specification

## Purpose
Provides historical audit trail inspection, loan transaction logs, and administrative settings for managing login credentials under the zero-cloud architecture.

## Requirements

### Requirement: Audit Log and History Telemetry
The system SHALL provide a filterable audit log viewer (`LABS Logs`) matching Figma node `86:4299` with brand cyan accent (`#009FE3`), displaying a top search and refresh toolbar, main surface container (`#151517` with `#333333` border), subheader with record counter and `TYPE` dropdown filter, segmented horizontal metadata cards (`#202021` with `#444444` border and `#333333` dividers) showing `TIDSPUNKT`, `TYPE`, `AKTØR`, and `TARGET`, and an action toggle (`Se Ændring ▼`) revealing expandable JSON delta changes.

#### Scenario: Inspecting audit logs
- **WHEN** an administrator views the History & Audit tab
- **THEN** the system lists all system mutations sorted chronologically in high-contrast segmented cards matching Figma frame 86:4299 with expandable JSON payload deltas.

#### Scenario: Filtering logs by action type
- **WHEN** an administrator selects an action type from the `TYPE` dropdown filter (e.g. "LOAN_CREATE", "RETURN_LOAN", or "ALLE")
- **THEN** the system immediately updates the displayed log cards to include only matching mutations and synchronizes the total count badge.

#### Scenario: Real-time search query filtering
- **WHEN** an administrator enters a text query in the "Søg logs..." search bar
- **THEN** the system filters audit records across actor names, entity IDs, and action keywords in real time.

#### Scenario: Refreshing log telemetry
- **WHEN** an administrator clicks the "Refresh" action button in the toolbar
- **THEN** the system re-fetches the latest audit log entries and updates the feed with fresh database records.

### Requirement: Admin Credential Settings
The system SHALL provide a basic authentication login wrapper with default administrator credentials (`admin` / `pass`), manage authentication state, allow administrators to update their credentials and location assignments safely without runtime crashes or serialization errors, and display accurate node profile telemetry adhering to the canonical project design system tokens without stale hardcoded location strings.

#### Scenario: Basic login verification
- **WHEN** an unauthenticated administrator enters `admin` and `pass` on the login screen
- **THEN** the system grants access to the operational console and stores a secure local session.

#### Scenario: Updating admin login credentials
- **WHEN** an administrator submits a new username and optional new password in the Settings view
- **THEN** the system validates complexity if a new password is provided, updates credentials and assigned location in the database safely, records an audit log entry, and reports success without throwing unhandled serialization or revalidation exceptions.

#### Scenario: Preserving password on empty input
- **WHEN** an administrator updates their profile with the password field left empty
- **THEN** the system updates other profile fields (username, assigned campus, assigned facility) while leaving the existing password hash intact.

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
