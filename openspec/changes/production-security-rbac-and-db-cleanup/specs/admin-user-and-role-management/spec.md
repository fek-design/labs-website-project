## Purpose

Provides secure SuperAdmin provisioning, cryptographic HMAC-signed session management, server-side RBAC authorization guards, and an administrative User & Role Management interface for Zealand Labs operators.

## ADDED Requirements

### Requirement: SuperAdmin Setup and Hardened Password Hashing
The system SHALL provide a dedicated SuperAdmin initialization script (`prisma/setup-superadmin.ts`) that provisions the primary SuperAdmin account with bcrypt hashing (salt rounds >= 10), and SHALL reject any hardcoded credentials or bypasses in the authentication flow.

#### Scenario: Running dedicated SuperAdmin setup
- **WHEN** an administrator runs the setup script with valid username and password
- **THEN** the system creates or updates the SuperAdmin account in the database with a secure bcrypt password hash and removes legacy test accounts.

#### Scenario: Attempting authentication with hardcoded credentials
- **WHEN** any user attempts to authenticate using legacy hardcoded credentials (`admin` / `pass`)
- **THEN** the system SHALL reject the login attempt and query the database exclusively.

### Requirement: Cryptographic HMAC Session Integrity
The system SHALL sign all session cookies using HMAC-SHA256 with a server-side secret, and SHALL store session tokens in `httpOnly`, `sameSite: "lax"`, and `secure` cookies.

#### Scenario: Operator signs in with valid credentials
- **WHEN** an active administrator provides valid credentials
- **THEN** the system issues an HMAC-SHA256 signed session cookie containing the operator's ID, role, and expiration timestamp.

#### Scenario: Tampered session cookie detection
- **WHEN** a client submits a modified or forged session cookie
- **THEN** the system invalidates the session immediately and denies access without executing any database actions.

### Requirement: Server-Side RBAC and IDOR Protection
The system SHALL enforce server-side authentication and role-based access control via a reusable `requireAuth(minRole?)` guard on all mutating server actions across POS, Inventory, Manuals, and Settings.

#### Scenario: Unauthenticated invocation of server action
- **WHEN** an unauthenticated request attempts to call a server action (e.g. `checkoutEquipment` or `createInventoryItem`)
- **THEN** the action throws an unauthorized error and blocks execution before accessing or modifying data.

#### Scenario: Insufficient role permissions
- **WHEN** an operator with role `TEACHER` attempts an action requiring `SUPER_ADMIN` or `TECHNICIAN` permissions
- **THEN** the system rejects the operation with a 403 Forbidden response.

### Requirement: User & Role Assignment Management Interface
The system SHALL provide an administrative User & Role Management workspace styled with canonical Zealand Labs design tokens (`#151517` container, `#202021` card, Stack Sans typography) allowing SuperAdmins to view operators, create new users, assign roles (`SUPER_ADMIN`, `TECHNICIAN`, `TEACHER`), assign campus/lab facilities, and toggle active status.

#### Scenario: SuperAdmin creates new operator
- **WHEN** a SuperAdmin submits the user creation form with username, temporary password, role, and facility assignment
- **THEN** the system hashes the password, records the new Admin entity, and refreshes the operator table.

#### Scenario: Deactivating an operator account
- **WHEN** a SuperAdmin toggles an operator's status to inactive
- **THEN** the operator's existing sessions are invalidated and future authentication attempts are blocked.
