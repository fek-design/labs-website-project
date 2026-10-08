## MODIFIED Requirements

### Requirement: Admin Credential Settings
The system SHALL manage administrative authentication state, enforce cryptographic password hashing, allow administrators to update their credentials and location assignments safely without runtime crashes or serialization errors, eliminate insecure default credentials (`admin` / `pass`), and display accurate profile telemetry adhering to canonical design system tokens.

#### Scenario: Basic login verification
- **WHEN** an administrator enters their valid username and password on the login screen
- **THEN** the system verifies credentials using bcrypt hash comparison, issues an HMAC session, and grants access to the operational console.

#### Scenario: Updating admin login credentials
- **WHEN** an administrator submits a new username and optional new password in the Settings view
- **THEN** the system validates complexity if a new password is provided, updates credentials and assigned location in the database safely, records an audit log entry, and reports success without throwing unhandled serialization or revalidation exceptions.

#### Scenario: Preserving password on empty input
- **WHEN** an administrator updates their profile with the password field left empty
- **THEN** the system updates other profile fields (username, assigned campus, assigned facility) while leaving the existing password hash intact.

## ADDED Requirements

### Requirement: Audit Log Access Control
The audit log retrieval endpoint SHALL strictly require an authenticated session with an authorized administrative role (`SUPER_ADMIN` or `TECHNICIAN`).

#### Scenario: Unauthenticated audit log access attempt
- **WHEN** an unauthenticated request attempts to call `getAuditLogs`
- **THEN** the system denies access with an unauthorized error and returns no sensitive audit records
