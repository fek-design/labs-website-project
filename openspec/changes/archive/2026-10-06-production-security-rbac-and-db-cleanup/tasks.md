## 1. Database Dummy Data Wipe

- [x] 1.1 Create `prisma/clean-all-dummy-data.ts` to purge all placeholder inventory items, test tags, bundle items, and test loans
- [x] 1.2 Run cleanup script and verify database achieves a pristine blank slate

## 2. Dedicated SuperAdmin Setup & Credential Hardening

- [x] 2.1 Create `prisma/setup-superadmin.ts` to provision the primary SuperAdmin with bcrypt hashing and purge legacy test accounts
- [x] 2.2 Add `setup:admin` script to `package.json`
- [x] 2.3 Execute setup script to provision verified SuperAdmin account in the local database
- [x] 2.4 Remove hardcoded `admin`/`pass` check and unsigned cookie logic from `app/actions/auth.ts`

## 3. Cryptographic Session Management & Server Action Guards

- [x] 3.1 Create `lib/session.ts` with HMAC-SHA256 signed session cookie encoding, decoding, and verification
- [x] 3.2 Create `lib/auth.ts` exporting `requireAuth(allowedRoles?)` for server-side RBAC validation
- [x] 3.3 Apply `requireAuth()` guard across all mutating server actions in `pos.ts`, `inventory.ts`, `manuals.ts`, and `settings.ts`

## 4. User & Role Management Server Actions & UI

- [x] 4.1 Create `app/actions/users.ts` supporting operator listing, user creation with hashed passwords, role assignment, and status toggles
- [x] 4.2 Build `components/settings/AdminUserManagementView.tsx` matching canonical design tokens (`#151517`, `#202021`, `font-notch`, KPI metrics, neutral inputs)
- [x] 4.3 Integrate User & Role Management into `components/settings/AdminSettingsView.tsx`

## 5. Verification & Clean Compilation

- [x] 5.1 Run `npx tsc --noEmit` and confirm zero compilation errors
- [x] 5.2 Verify login, HMAC session signature validation, user management, and unauthorized request rejection
