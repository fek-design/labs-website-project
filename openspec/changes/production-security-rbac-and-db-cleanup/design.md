## Context

See `proposal.md` for motivation. The platform currently has hardcoded credentials (`admin`/`pass`), plaintext unsigned session cookies, unauthenticated server action endpoints vulnerable to IDOR, 58 accumulated placeholder inventory items, and lacks a user management interface. This design establishes a hardened production security layer, complete database clean-slate purge, and a dedicated User & Role Management workspace.

## Goals / Non-Goals

**Goals:**
- Eliminate the hardcoded credential bypass in `app/actions/auth.ts`.
- Implement HMAC-SHA256 cryptographically signed session tokens in `lib/session.ts`.
- Guard all administrative server actions with `requireAuth(allowedRoles?)` to seal IDOR and unauthorized execution.
- Create a dedicated SuperAdmin setup CLI utility (`prisma/setup-superadmin.ts`) with bcrypt hashing.
- Execute a complete purge of dummy/placeholder inventory data (`prisma/clean-all-dummy-data.ts`).
- Deliver a dedicated User & Role Management workspace adhering to the canonical Zealand Labs design system.

**Non-Goals:**
- Third-party OAuth or cloud identity providers (system operates under strict zero-cloud mandate).
- Student/patron self-registration (patrons are strictly students looked up by studentId at the POS).

## Decisions

### 1. Dedicated SuperAdmin Setup & Credential Hardening
- **Setup Script (`prisma/setup-superadmin.ts`)**:
  - Accepts `SUPERADMIN_USER` and `SUPERADMIN_PASSWORD` from `.env` or CLI arguments.
  - Hashes passwords using `bcryptjs` with work factor 12.
  - Upserts the SuperAdmin account (`role: SUPER_ADMIN`, `isActive: true`).
  - Purges legacy test accounts (`admin` with default password, `technician`).
- **Auth Action Hardening (`app/actions/auth.ts`)**:
  - Completely remove the `cleanUsername === "admin" && cleanPassword === "pass"` block.
  - Require database lookups for all authentication attempts.

### 2. Cryptographic Session Management (`lib/session.ts`)
- **Token Format**: `${adminId}.${role}.${timestamp}.${signature}`
- **Signing**: HMAC-SHA256 utilizing a server-side secret (`SESSION_SECRET` in `.env`).
- **Validation**:
  1. Parse token and verify HMAC signature.
  2. Assert `Date.now() < timestamp + 7 days`.
  3. Query database to confirm `Admin.isActive === true` and role matches token.
- **Cookie Security**: `httpOnly: true`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`, `path: "/"`.

### 3. Server Action Authorization Guard (`lib/auth.ts`)
- Export `requireAuth(allowedRoles?: Role[])`:
  ```ts
  export async function requireAuth(allowedRoles?: Role[]) {
    const session = await getSession();
    if (!session || !session.isAuthenticated || !session.user) {
      throw new Error("Unauthorized: Invalid or missing administrative session.");
    }
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      throw new Error(`Forbidden: Role '${session.user.role}' lacks permission for this action.`);
    }
    return session.user;
  }
  ```
- Protect:
  - `app/actions/pos.ts` (`checkoutEquipment`, `checkinLoan`)
  - `app/actions/inventory.ts` (`createInventoryItem`, `updateInventoryItem`, `deleteInventoryItem`)
  - `app/actions/manuals.ts` (`uploadManual`, `deleteManual`, `assignManualToMachine`)
  - `app/actions/settings.ts` (`getAdminProfile`, `updateAdminCredentials`)
  - `app/actions/users.ts` (new actions for creating and managing admins)

### 4. Database Blank Slate Purge (`prisma/clean-all-dummy-data.ts`)
- Purge all 58 placeholder/demo inventory items, test tags, bundle presets, test repairs, and loans.
- Retain only:
  - Labs: Køge Makerspace & Køge Medialab
  - Taxonomy tags: Standard process and discipline tags
  - Real PDF manuals: Prusa, Shure, Glowforge, Universal Laser
  - Official SuperAdmin account

### 5. User & Role Management Workspace (`components/settings/AdminUserManagementView.tsx`)
- Integrated into the Settings tab or accessible as a dedicated sub-view matching canonical design rules:
  - **Surface & Dock**: Dock `#09090b` with `#E6007E` Magenta active token, Container `#151517` (`border-[#333333]`), Cards `#202021` (`border-[#444444]`).
  - **Header Layout**: Left `LABS BRUGERE` in `font-notch` + admin greeting; Right KPI cluster showing counts of SuperAdmins, Technicians, and Teachers in `font-notch`.
  - **Operator Management Form**: Username, initial password, Role dropdown (`SUPER_ADMIN`, `TECHNICIAN`, `TEACHER`), Campus selection (`Køge Campus`), and Lab facility assignment (`MediaLab`, `Makerspace`, `Begge`).
  - **Status & Control**: Table listing active users with instant toggle for account activation/deactivation.
  - **Neutral Input Styling**: All inputs use neutral focus borders (`border-[#333333] focus:border-[#555555]`) without colored accent rings.

## Risks / Trade-offs

- **[Risk]** Locking existing operators out when removing hardcoded credentials.
  → *Mitigation*: Run `setup-superadmin.ts` prior to deploying the code change so a valid SuperAdmin is already in place.
- **[Risk]** Data loss from the complete inventory wipe.
  → *Mitigation*: User explicitly requested Option B (blank slate) so real hardware can be entered cleanly through the production POS and Inventory UI.
