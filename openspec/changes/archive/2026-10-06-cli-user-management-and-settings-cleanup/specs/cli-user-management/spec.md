## Purpose

Provides a secure command-line interface for administrative user management (listing, creating, password resets, and safeguarded deletion) along with comprehensive documentation in README.md and clean Settings interface presentation.

## ADDED Requirements

### Requirement: CLI Operator Management Commands
The system SHALL provide a dedicated command-line utility (`prisma/manage-users.ts` with npm aliases `users:list`, `users:create`, `users:delete`, and `users:password`) enabling administrators to view, provision, update, and remove operators directly from the terminal.

#### Scenario: Listing all registered operators via terminal
- **WHEN** an administrator executes `npm run users:list`
- **THEN** the system prints a formatted table displaying all registered operators with their username, role, active status, campus, assigned lab facility, and creation date.

#### Scenario: Creating an operator via terminal
- **WHEN** an administrator runs `npm run users:create -- <username> <password> <role> [labSlug]`
- **THEN** the system validates parameters, hashes the password with bcrypt (work factor >= 10), records the new administrator in the database, and outputs confirmation.

#### Scenario: Resetting an operator password via terminal
- **WHEN** an administrator runs `npm run users:password -- <username> <newPassword>`
- **THEN** the system hashes the new password with bcrypt and updates the operator's record in the database.

### Requirement: Safeguarded User Deletion
The CLI user deletion command (`npm run users:delete -- <username> [--force]`) SHALL enforce strict safeguards to prevent system lockout and database integrity violations before deleting any operator.

#### Scenario: Attempting to delete the sole active SuperAdmin
- **WHEN** an administrator attempts to delete the only active `SUPER_ADMIN` in the system
- **THEN** the system halts execution with an error explaining that the sole SuperAdmin account cannot be deleted.

#### Scenario: Attempting to delete a user with active loans checked out
- **WHEN** an administrator attempts to delete an operator who is currently recorded as checkout admin for active unreturned loans
- **THEN** the system rejects deletion until loans are returned or handles referential associations safely without cascading corruption.

#### Scenario: Deleting an eligible operator with confirmation
- **WHEN** an administrator runs `npm run users:delete -- <username> --force` on an eligible non-critical account
- **THEN** the system deletes the administrator record from the database, safely clears or cascades associated non-critical foreign keys, and confirms successful deletion.

### Requirement: Settings Interface Decluttering
The Settings view in `components/settings/AdminSettingsView.tsx` SHALL NOT render the static "System & Sikkerhedsarkitektur" card, focusing exclusively on operational session configuration, campus/lab assignment, and administrator credentials.

#### Scenario: Administrator views Settings tab
- **WHEN** an administrator opens the Settings tab (`/admin/pos` -> Indstillinger)
- **THEN** the interface displays Session Switcher, User Location Assignment, and Administrator Credentials, without displaying the static architecture card.

### Requirement: Administrative Documentation in README.md
The project root `README.md` SHALL document all administrative CLI commands, including SuperAdmin provisioning (`npm run setup:admin`), user management commands (`users:list`, `users:create`, `users:delete`, `users:password`), database purge scripts (`npm run db:wipe`), and local MySQL setup instructions.

#### Scenario: Developer or administrator reads README.md
- **WHEN** reading `README.md`
- **THEN** the document clearly details all available CLI user management commands with syntax examples, arguments, and safety considerations.
