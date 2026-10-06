## Why

Currently, operators cannot be deleted from the database through the UI or existing helper scripts; they can only be deactivated. For maintenance, account cleanup, and CLI-first administration under the zero-cloud model, administrators require command-line utilities to list, create, reset passwords, and safely delete user accounts. These terminal commands must include strict safety checks to prevent deleting the sole active SuperAdmin or corrupting audit logs/active loans. Additionally, the static "System & Sikkerhedsarkitektur" card in `components/settings/AdminSettingsView.tsx` is obsolete informational clutter and should be removed, and project documentation (`README.md`) must clearly document these administrative CLI tools.

## What Changes

- **CLI User Management Utility (`prisma/manage-users.ts`)**:
  - `list`: Formatted terminal table listing all users, roles, active status, and facility assignments.
  - `create <username> <password> <role> [labSlug]`: Provisions an operator with bcrypt hashing and validation.
  - `delete <username>`: Permanently deletes a user with safeguards:
    - Rejects deletion if the target user is the sole active `SUPER_ADMIN`.
    - Checks for active checked-out loans associated with the user and rejects deletion if unreturned loans exist.
    - Handles or nullifies audit log/historical checkout references safely without foreign key constraint violations.
    - Requires `--force` flag or interactive confirmation.
  - `password <username> <newPassword>`: Updates user credentials directly via CLI with bcrypt hashing.
- **NPM Package Scripts (`package.json`)**:
  - `users:list`: Alias for `npx tsx prisma/manage-users.ts list`
  - `users:create`: Alias for `npx tsx prisma/manage-users.ts create`
  - `users:delete`: Alias for `npx tsx prisma/manage-users.ts delete`
  - `users:password`: Alias for `npx tsx prisma/manage-users.ts password`
- **Settings View Cleanup (`components/settings/AdminSettingsView.tsx`)**:
  - Remove Section 4: "System & Sikkerhedsarkitektur" card.
- **Documentation (`README.md`)**:
  - Document all user management commands, database reset commands, and SuperAdmin initialization in `README.md`.

## Capabilities

### New Capabilities
- `cli-user-management`: Dedicated CLI utility and npm scripts for administrative user listing, creation, credential resets, and safeguarded user deletion, documented in `README.md`.

### Modified Capabilities
<!-- None -->

## Impact

- **CLI / Tooling**: Adds `prisma/manage-users.ts` and script hooks in `package.json`.
- **UI Components**: Removes the "System & Sikkerhedsarkitektur" card from `components/settings/AdminSettingsView.tsx`.
- **Database**: Adds deletion logic respecting foreign key constraints on `Loan` and `AuditLog`.
- **Documentation**: Updates `README.md` with CLI operations guide.
