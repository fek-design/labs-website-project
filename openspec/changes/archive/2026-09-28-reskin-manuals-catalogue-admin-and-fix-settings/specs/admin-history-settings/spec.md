## MODIFIED Requirements

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
