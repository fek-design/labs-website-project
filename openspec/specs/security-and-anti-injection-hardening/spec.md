# security-and-anti-injection-hardening Specification

## Purpose
Protects the application against code and script upload injection, unauthorized data mutations (IDOR), administrative credential brute-forcing, and cryptographic secret leakage.

## Requirements

### Requirement: Anti-Executable and Anti-Script File Upload Defense
The file upload subsystem SHALL reject any file containing executable code, scripts, HTML payloads, or mismatched file signatures to prevent Remote Code Execution (RCE) and code injection.

#### Scenario: Verification of file magic bytes
- **WHEN** a user uploads a manual document
- **THEN** the system verifies the initial file buffer starts with valid PDF magic bytes (`%PDF-`), verifies the MIME type is `application/pdf`, rejects any executable extensions, and validates that the file size is under 20 MB

#### Scenario: Path traversal prevention
- **WHEN** a file upload provides a filename containing relative directory paths (e.g., `../../etc/cron`)
- **THEN** the system sanitizes the filename to alphanumeric characters and underscores, storing it exclusively in the designated public uploads directory

### Requirement: Authorization Enforcement on Data Mutations (Anti-IDOR)
All server actions that create, modify, delete, or link application data SHALL strictly verify that the active session belongs to an authenticated operator with appropriate role permissions.

#### Scenario: Unauthenticated mutation rejection
- **WHEN** an unauthenticated request or script invokes `saveCraftArticle`, `deleteCraftArticle`, `uploadMachineManual`, or `deleteMachineManual`
- **THEN** the server action throws an unauthorized error and terminates immediately without touching disk files or database records

### Requirement: Anti-Brute-Force Rate Limiting on Authentication
The administrative authentication engine SHALL rate-limit login attempts per client IP address.

#### Scenario: Repeated failed login attempts
- **WHEN** more than 5 login attempts occur from a specific client IP address within a 5-minute window
- **THEN** subsequent login attempts are rejected with a 429 rate limit error until the window resets

### Requirement: Elimination of Default and Leaked Secrets
The system SHALL forbid default fallback secrets in production mode and eliminate hardcoded default user passwords from database seeders.

#### Scenario: Production start with missing session secret
- **WHEN** the server starts in `NODE_ENV=production` without an explicitly provided `SESSION_SECRET` environment variable
- **THEN** the application throws a fatal configuration exception during initialization instead of falling back to a hardcoded string
