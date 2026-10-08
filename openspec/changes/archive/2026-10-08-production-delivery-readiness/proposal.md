# Change Proposal: Production Delivery Readiness & Security Hardening

## Why

The Zealand Labs project is transitioning from the testing/MVP stage to production delivery on a self-hosted Linux VM server. Recent testing revealed that a fresh repository clone fails critically during clean build due to ungenerated Prisma client artifacts and untracked environment templates. Furthermore, several server actions lack strict authorization checks (IDOR vulnerabilities), file uploads lack magic-byte validation and anti-executable injection defenses, the admin login lacks brute-force rate-limiting, and zero automated unit tests exist. 

This change systematically executes all 16 items on the pre-delivery readiness checklist, eliminates all build and security blockers, ensures code injection defenses across all upload and mutation vectors, introduces a robust Vitest test suite, and provides bite-sized user documentation and VM runbooks.

## What Changes

- **Clean Build Portability**:
  - Add `"postinstall": "prisma generate"` to `package.json` so fresh clones automatically generate `@prisma/client` types before compilation.
  - Whitelist and commit `.env.example` in `.gitignore` with production-ready environment variable templates.
  - Eliminate the Turbopack dynamic filesystem tracing warning in `app/actions/crafts.ts`.
  - Enforce Node.js `>=20.0.0` engine in `package.json` and provide `.nvmrc`.

- **Anti-Injection & Security Lockdown**:
  - **Code & Executable Upload Injection Defense**: Harden manual uploads against code injection and RCE by verifying magic bytes (`%PDF-`), strictly validating MIME types, enforcing a 20 MB size limit, sanitizing filenames against path traversal (`../`), and ensuring uploaded assets cannot be executed as scripts.
  - **Unauthorized Mutation Protection (IDOR Defense)**: Protect all unauthenticated server actions (`history.ts` audit logs, `crafts.ts` article mutations, `upload.ts` manual attachments) with strict `requireAuth(["SUPER_ADMIN", "TECHNICIAN"])` checks.
  - **Brute-Force Rate Limiting**: Apply token-bucket rate limiting (5 attempts per 5 minutes per IP) to administrative login in `app/actions/auth.ts`.
  - **Secret Hygiene & Seed Purge**: Enforce mandatory `SESSION_SECRET` in production (`lib/session.ts`), and eliminate hardcoded default passwords (`admin:pass`) from `prisma/seed.ts`.
  - **Database Anti-Duplication**: Add duplicate checking for bundle presets in `inventory.ts`.

- **Automated Testing Suite (Vitest)**:
  - Install and configure Vitest and React Testing Library.
  - Implement comprehensive unit test sheets for authentication/RBAC, POS transaction logic (checkout/return/stock limits), validation schemas, and UI error fallbacks.

- **Design System & UI Polish**:
  - Refactor the administrative console (`AdminConsoleClient.tsx`) to the Apple-inspired narrow container width (`max-w-5xl` / 1024px).
  - Wrap catalogue item images in `CatalogueCard.tsx` with `SafeImageBox` to prevent broken image errors.
  - Ensure all craft prototype articles are seeded in `data/crafts.json` so dynamic static generation builds all student/teacher craft pages.

- **Documentation & User Manuals**:
  - Create `docs/USER_MANUAL.md`: Bite-sized, 3-step scannable user guide written in accessible everyday language (TikTok-generation edition) for Student, Teacher, and Operator personas.
  - Create `docs/LINUX_VM_DEPLOYMENT.md`: Step-by-step production runbook covering Linux daemon setup, MariaDB hardening (127.0.0.1 bind, TDE encryption), PM2/systemd, Nginx SSL reverse proxy, and automated cron backups.

## Capabilities

### New Capabilities
- `production-deployment-and-build-portability`: Covers fresh-machine build reproducibility, environment templates, and Linux VM operational runbooks.
- `security-and-anti-injection-hardening`: Covers strict file upload validation (magic bytes, anti-RCE, path traversal), server-side mutation authorization (IDOR defense), brute-force rate-limiting, and secret enforcement.
- `testing-and-quality-assurance`: Covers Vitest unit testing harness, RBAC security verification, POS transaction integrity, and schema boundary testing.
- `user-onboarding-and-documentation`: Covers the bite-sized 3-step user manual for students, teachers, and admins.

### Modified Capabilities
- `admin-auth-gate`: Enforces brute-force rate limiting on login attempts and eliminates insecure hardcoded session secret fallbacks.
- `admin-history-settings`: Restricts audit log querying to authenticated SuperAdmin and Technician operators.
- `admin-manuals-management`: Mandates magic-byte validation and authentication on all manual uploads and unlinking operations.
- `equipment-pos-dashboard`: Aligns container layout to Apple-style `max-w-5xl` bounds and enforces strict transaction test coverage.
- `catalogue-index-and-filters`: Integrates `SafeImageBox` fallback containers for catalogue items without images.

## Impact

- **Build System**: `package.json` gets `postinstall`, `test`, `test:watch` scripts; Vitest devDependencies added.
- **Security**: No unauthenticated client can read internal audit logs, modify craft prototypes, upload executable scripts, or brute-force administrative credentials.
- **Runtime**: Clean clones on Windows, macOS, or Linux run `npm install && npm run build` seamlessly without missing type errors.
