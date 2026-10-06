## Why

The platform currently relies on a temporary hardcoded login bypass (`admin`/`pass`), plaintext unsigned session cookies, and lacks server-side session and role verification in its mutation actions, exposing the system to broken authentication and IDOR risks (OWASP A01 & A07). Additionally, accumulated dummy inventory items from development testing need to be completely purged to give operators a clean slate, and a dedicated User & Role Management interface styled in lockstep with the canonical dashboard must be established for ongoing administration.

## What Changes

- **Eliminate Hardcoded Credentials (`app/actions/auth.ts`)**: **BREAKING**: Remove the `cleanUsername === "admin" && cleanPassword === "pass"` bypass. All authentications require database lookups with bcrypt-hashed passwords.
- **Cryptographic HMAC-Signed Session Cookies (`lib/session.ts`)**: Replace plaintext string cookies (`admin:super_admin`) with tamper-proof HMAC-SHA256 signed session tokens stored in `httpOnly`, `sameSite: "lax"`, and `secure` cookies.
- **Server Action Auth Guard (`requireAuth(minRole?)`)**: Enforce session and RBAC permission checks across all mutating server actions (`pos.ts`, `inventory.ts`, `manuals.ts`, `settings.ts`) to prevent IDOR and unauthenticated execution.
- **Dedicated SuperAdmin Setup Script (`prisma/setup-superadmin.ts`)**: Provide a dedicated setup utility (`npm run setup:admin`) to provision a verified `SUPER_ADMIN` with a bcrypt-hashed password, safely purging old test accounts.
- **Complete Dummy Data Wipe (`prisma/clean-all-dummy-data.ts`)**: Purge all 58 placeholder/demo inventory items, test tags, and mock bundles from the database to establish a 100% clean operational slate.
- **User & Role Management Interface (`components/settings/AdminUserManagementView.tsx`)**: Deliver a user management workspace styled with the project's canonical design system (dock `#09090b`, containers `#151517`, cards `#202021`, `font-notch` headers, `font-headline` greetings, KPI counters) featuring an operator listing table, user creation form, role assignment (`SUPER_ADMIN`, `TECHNICIAN`, `TEACHER`), campus/lab assignment, and active status toggles.

## Capabilities

### New Capabilities
- `admin-user-and-role-management`: Covers SuperAdmin provisioning via dedicated setup script, cryptographic session signing, server-side RBAC validation guards, and the User & Role Assignment panel interface.

### Modified Capabilities
- `admin-navigation-and-dashboard`: Update administrative navigation and settings to integrate the User & Role Management interface with canonical design tokens and cyclic accent hierarchy.
- `database-setup`: Provide complete purge of accumulated placeholder inventory data, resetting the system to a clean baseline.

## Impact

- **Authentication & Security**: `app/actions/auth.ts`, new `lib/session.ts`, new `lib/auth.ts`.
- **Server Actions**: `app/actions/pos.ts`, `app/actions/inventory.ts`, `app/actions/manuals.ts`, `app/actions/settings.ts` updated to call `requireAuth()`.
- **Database Scripts**: New `prisma/setup-superadmin.ts` and `prisma/clean-all-dummy-data.ts`.
- **UI Components**: `components/settings/AdminSettingsView.tsx`, new `components/settings/AdminUserManagementView.tsx`, `components/admin/AdminSidebarNav.tsx`.
- **Zero Cloud Impact**: Fully self-contained local network execution.
