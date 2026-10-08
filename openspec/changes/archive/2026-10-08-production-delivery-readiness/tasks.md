## 1. Clean-Machine & Build Portability

- [x] 1.1 Add `"postinstall": "prisma generate"` to `package.json` scripts to guarantee `@prisma/client` types exist on fresh install
- [x] 1.2 Update `.gitignore` to explicitly whitelist `.env.example` (`!.env.example`) and commit `.env.example` with runtime template keys
- [x] 1.3 Fix dynamic filesystem tracing warning in `app/actions/crafts.ts` by scoping directory reads or adding Turbopack ignore hints
- [x] 1.4 Add `"engines": { "node": ">=20.0.0" }` in `package.json` and create `.nvmrc` for Linux VM runtime consistency

## 2. Security, Anti-Injection & Authorization Lockdown

- [x] 2.1 Implement PDF magic-bytes validation (`%PDF-`), 20 MB size limit, MIME verification, and path-traversal sanitization in `app/actions/manuals.ts` and `upload.ts` to prevent executable code/script injection
- [x] 2.2 Protect `app/actions/history.ts` (`getAuditLogs`, `getDistinctActionTypes`) with `requireAuth(["SUPER_ADMIN", "TECHNICIAN"])`
- [x] 2.3 Protect `app/actions/crafts.ts` (`saveCraftArticle`, `deleteCraftArticle`, `saveCraftImage`, `toggleFeatureOnFrontpage`) with `requireAuth(["SUPER_ADMIN", "TECHNICIAN"])` and remove unauthenticated dummy admin fallback
- [x] 2.4 Protect `app/actions/upload.ts` (`uploadMachineManual`, `deleteMachineManual`, `replaceMachineManual`) with `requireAuth(["SUPER_ADMIN", "TECHNICIAN"])`
- [x] 2.5 Add IP-based rate limiting (5 attempts per 5 minutes) to `loginAdmin` in `app/actions/auth.ts` to prevent brute-force attacks
- [x] 2.6 Enforce mandatory `SESSION_SECRET` in `lib/session.ts` in production mode (`NODE_ENV === "production"`), throwing if missing
- [x] 2.7 Purge hardcoded `admin:pass` and `technician:pass` default accounts from `prisma/seed.ts` and require explicit credentials

## 3. Data Integrity & Anti-Duplication Safeguards

- [x] 3.1 Implement duplicate name prevention in `saveBundlePreset` in `app/actions/inventory.ts`
- [x] 3.2 Add Zod schema validation for craft prototype articles in `lib/validations/` before writing to `data/crafts.json`
- [x] 3.3 Enforce password complexity rules (minimum 8 characters with numbers/symbols) in `app/actions/users.ts` and `settings.ts`

## 4. Automated Testing Suite (Vitest)

- [x] 4.1 Install and configure `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`, adding `npm test` script to `package.json`
- [x] 4.2 Create `test/auth.test.ts` testing HMAC token creation, tamper rejection, bcrypt password verification, and RBAC role gating
- [x] 4.3 Create `test/pos.test.ts` testing checkout transaction invariants, serialized asset single-loan enforcement, bulk item math, and return logic
- [x] 4.4 Create `test/validations.test.ts` testing inventory and POS Zod boundary rules and duplicate debounce logic
- [x] 4.5 Execute `npm test` to verify all tests pass and resolve any uncovered regression errors

## 5. Frontend & Admin UI Refinements

- [x] 5.1 Refactor `app/admin/pos/AdminConsoleClient.tsx` container width from `max-w-7xl` to `max-w-5xl` (1024px) to align with the Apple-inspired design standard
- [x] 5.2 Integrate `SafeImageBox` in `components/catalogue/CatalogueCard.tsx` so items missing thumbnail images render tactile boxes without browser errors
- [x] 5.3 Sync full craft prototype catalogue items into `data/crafts.json` (`t-shirt`, `kop`, `mulepose`, `3d-print`, `plakat`) for complete static generation
- [x] 5.4 Add visible keyboard focus rings (`focus-visible`) and ARIA labels on scanner and modal controls

## 6. Documentation, User Manual & Linux VM Runbook

- [x] 6.1 Create `docs/USER_MANUAL.md`: Bite-sized 3-step scannable user manual in everyday language (TikTok-generation edition) for Student, Teacher, and Operator personas
- [x] 6.2 Create `docs/LINUX_VM_DEPLOYMENT.md`: Complete Linux VM deployment runbook detailing MariaDB 127.0.0.1 bind, TDE encryption, systemd/PM2, Nginx reverse proxy, and daily cron backup scripts
- [x] 6.3 Run `npm run build` and `npm test` to confirm full delivery readiness with clean exit codes
