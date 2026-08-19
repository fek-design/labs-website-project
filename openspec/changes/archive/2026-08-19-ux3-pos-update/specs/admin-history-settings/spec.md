## MODIFIED Requirements

### Requirement: Admin Credential Settings
The system SHALL provide a basic authentication login wrapper with default administrator credentials (`admin` / `pass`), manage authentication state, allow administrators to update their credentials, and support database reset with clean mock test data.

#### Scenario: Basic login verification
- **WHEN** an unauthenticated administrator enters `admin` and `pass` on the login screen
- **THEN** the system grants access to the operational console and stores a secure local session

#### Scenario: Updating admin login credentials
- **WHEN** an administrator submits a new username and password in the Settings view
- **THEN** the system validates complexity, hashes the new password with bcrypt, updates the database, and records an audit log entry
