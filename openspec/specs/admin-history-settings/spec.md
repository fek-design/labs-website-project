# admin-history-settings Specification

## Purpose
Provides historical audit trail inspection, loan transaction logs, and administrative settings for managing login credentials under the zero-cloud architecture.

## Requirements

### Requirement: Audit Log and History Telemetry
The system SHALL provide a filterable audit log viewer displaying actor admin, action type, target entity, timestamp, and JSON delta changes.

#### Scenario: Inspecting audit logs
- **WHEN** an administrator views the History & Audit tab
- **THEN** the system lists all system mutations sorted chronologically with expandable JSON payload deltas

### Requirement: Admin Credential Settings
The system SHALL provide a basic authentication login wrapper with default administrator credentials (`admin` / `pass`), manage authentication state, allow administrators to update their credentials, and support database reset with clean mock test data.

#### Scenario: Basic login verification
- **WHEN** an unauthenticated administrator enters `admin` and `pass` on the login screen
- **THEN** the system grants access to the operational console and stores a secure local session

#### Scenario: Updating admin login credentials
- **WHEN** an administrator submits a new username and password in the Settings view
- **THEN** the system validates complexity, hashes the new password with bcrypt, updates the database, and records an audit log entry
