## ADDED Requirements

### Requirement: Login Brute-Force Rate Limiting
The login endpoint SHALL throttle repeated failed login attempts from any single client IP address.

#### Scenario: Excess authentication attempts
- **WHEN** a client submits 5 consecutive failed login requests within 5 minutes
- **THEN** the server action rejects further login requests with an error notifying the user to wait before attempting again

### Requirement: Mandatory Production Session Secret
The session encryption engine SHALL fail if the production session secret is missing.

#### Scenario: Session token creation in production without secret
- **WHEN** the authentication service issues or verifies a session in production mode without `SESSION_SECRET` configured
- **THEN** an explicit error is thrown and no default test secret is used
