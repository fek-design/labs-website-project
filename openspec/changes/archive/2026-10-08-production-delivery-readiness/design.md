## Context

The Zealand Labs platform runs on Next.js 16 (App Router with Turbopack), React 19, and Prisma 7 with a local MariaDB/MySQL database under a strict "Zero Cloud Dependency" mandate. See `proposal.md` for full background.

During clean clone verification on a second PC, the build failed due to `@prisma/client` missing pre-generation in `package.json` and `.env.example` being ignored by Git. A comprehensive security audit also revealed unauthenticated server action endpoints, lack of login brute-force protection, hardcoded fallback session secrets, and vulnerable file upload handlers lacking magic-byte anti-injection checks.

## Goals / Non-Goals

**Goals:**
- Guarantee 100% clean-machine build portability on fresh Git clones (Node 20+, Linux/macOS/Windows).
- Eliminate all OWASP Top 10 security vulnerabilities across administrative endpoints, file uploads, and session tokens.
- Prevent code/script upload injection and remote code execution (RCE) via strict magic-byte validation and path sanitization.
- Implement an automated Vitest unit testing harness with high coverage of authentication and POS loan transactions.
- Deliver an Apple-inspired `max-w-5xl` container width on the administrative console and graceful image fallbacks on catalogue cards.
- Provide a bite-sized, 3-step user manual (`docs/USER_MANUAL.md`) and a production Linux VM runbook (`docs/LINUX_VM_DEPLOYMENT.md`).

**Non-Goals:**
- Rewriting the database layer from MariaDB/MySQL to PostgreSQL (unnecessary migration risk before delivery).
- Introducing cloud-hosted SaaS dependencies (e.g. AWS S3, Auth0, Upstash); all protections remain 100% offline and local.

## Decisions

### Decision 1: Build Portability via `postinstall` & Whitelisted `.env.example`
- **Choice:** Add `"postinstall": "prisma generate"` to `package.json` scripts and update `.gitignore` from `.env*` to `.env` with explicit whitelist `!.env.example`.
- **Rationale:** Prisma 7 does not automatically generate TypeScript types in `@prisma/client` upon `npm install`. By hooking into `postinstall`, any fresh clone or CI runner generates client bindings before `next build` runs `tsc --noEmit`. Whitelisting `.env.example` ensures new developers have an immediate configuration template.
- **Alternatives Considered:** Adding `prisma generate && next build` to the `build` script. Rejected as incomplete because development environments (`npm run dev`) or IDE type-checkers would still fail prior to the first build.

### Decision 2: Anti-Injection & Executable Defense on File Uploads
- **Choice:** Validate PDF magic bytes (`Buffer.from(bytes.slice(0, 5)).toString() === "%PDF-"`) alongside MIME type `application/pdf` and filename extension `.pdf`. Enforce a 20 MB file size limit and strip all non-alphanumeric characters from filenames (preserving only timestamps, dashes, and underscores).
- **Rationale:** File extensions alone are trivial to spoof (e.g. `malicious.php.pdf` or polyglot files containing PHP/shell code). Verifying `%PDF-` magic bytes guarantees that only genuine PDF documents can be saved to disk. Sanitizing filenames stops directory traversal attacks (`../../`).
- **Alternatives Considered:** Running an external antivirus daemon (ClamAV). Rejected due to zero-cloud/low-footprint Linux VM constraints; magic-byte + strict extension validation provides robust defense for static document hosting.

### Decision 3: Zero-Trust IDOR Protection on Server Actions
- **Choice:** Audit every server action file (`history.ts`, `crafts.ts`, `upload.ts`, `settings.ts`, `pos.ts`, `inventory.ts`) and enforce `await requireAuth(["SUPER_ADMIN", "TECHNICIAN"])` at the top of every query and mutation touching disk or database records.
- **Rationale:** Next.js Server Actions are exposed as public HTTP POST endpoints. Without `requireAuth()`, anyone inspecting network traffic can invoke actions directly with arbitrary parameters (IDOR).
- **Alternatives Considered:** Middleware-only route protection. Rejected because Next.js server actions can be invoked via RPC requests regardless of page-level route matching. Enforcing auth directly within the action functions ensures defense-in-depth.

### Decision 4: In-Memory Sliding-Window Login Brute-Force Rate Limiting
- **Choice:** Apply `checkRateLimit("login:" + clientIp, 5, 300)` from `lib/rate-limit.ts` in `app/actions/auth.ts`.
- **Rationale:** 5 attempts per 5 minutes prevents automated credential stuffing while providing instant reset for legitimate operators. Utilizes the existing zero-cloud in-memory token bucket.
- **Alternatives Considered:** External Redis store. Redis adds operational overhead on a single-node Linux VM; the in-memory token bucket with automated garbage collection is self-contained and fast.

### Decision 5: Production Secret Guardrails & Seed Hygiene
- **Choice:** In `lib/session.ts`, check `if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) throw new Error(...)`. In `prisma/seed.ts`, remove hardcoded `admin:pass` and `technician:pass`.
- **Rationale:** Prevents catastrophic security leakage where a production server boots with a publicly known secret. Purging default credentials prevents attackers from exploiting unconfigured test accounts.

### Decision 6: Automated Testing Harness with Vitest
- **Choice:** Install `vitest`, `@testing-library/react`, and `jsdom`. Create focused unit test suites covering:
  - `auth.test.ts`: HMAC signature verification, tampering detection, bcrypt hashing, and role verification.
  - `pos.test.ts`: Checkout state machine, serialized asset single-active-loan invariant, bulk count math, and return logic.
  - `validations.test.ts`: Zod schemas for inventory, pos, and bundle presets.
- **Rationale:** Vitest integrates natively with TypeScript and ESM without heavy Jest Babel configuration, running sub-second unit tests.

### Decision 7: Container Width & Safe Image Box Standardization
- **Choice:** Align `AdminConsoleClient.tsx` from `max-w-7xl` to `max-w-5xl`, matching the frontpage standard. Update `CatalogueCard.tsx` to use `SafeImageBox`.
- **Rationale:** Unifies the design system across the entire application, eliminates eye strain from 1280px line spans, and prevents broken image icons on catalogue items.

## Risks / Trade-offs

- **[Risk]** In-memory rate limits reset if the Next.js process restarts on the Linux VM.  
  → **Mitigation:** The rate limiter window is only 5 minutes; process restarts during deployments do not create a meaningful brute-force vulnerability window.
- **[Risk]** Disallowing missing `SESSION_SECRET` in production will halt boots on misconfigured servers.  
  → **Mitigation:** Documented prominently in `.env.example` and `docs/LINUX_VM_DEPLOYMENT.md`. Failing fast is far safer than running with a leaked default secret.

## Migration & Deployment Plan

1. **Local Hardening & Build Validation**: Implement Phase 0 through Phase 4 and run `npm test && npm run build` to verify zero errors.
2. **Git Push**: Push clean commits to `origin/main`.
3. **Linux VM Deployment**:
   - Install Node 20+, MariaDB 10.11+.
   - Clone repo, copy `.env.example` to `.env`, set strong `DATABASE_URL` and `SESSION_SECRET`.
   - Run `npm install` (triggers `postinstall: prisma generate`).
   - Run `npm run setup:admin` with secure credentials.
   - Run `npm run build && pm2 start npm --name "zealand-labs" -- start`.
