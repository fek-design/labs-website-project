## 1. CLI User Management Script

- [x] 1.1 Create `prisma/manage-users.ts` with subcommands `list`, `create`, `password`, and `delete`
- [x] 1.2 Implement deletion safeguards in `prisma/manage-users.ts` (sole SuperAdmin check, active loan check, historical loan preservation, and audit log cleanup)
- [x] 1.3 Add npm scripts (`users:list`, `users:create`, `users:delete`, `users:password`) to `package.json`

## 2. Settings View Decluttering

- [x] 2.1 Remove the static "System & Sikkerhedsarkitektur" card from `components/settings/AdminSettingsView.tsx`

## 3. Comprehensive Documentation & Verification

- [x] 3.1 Update `README.md` with complete documentation for CLI user management, database reset, and SuperAdmin setup
- [x] 3.2 Verify CLI commands (`npm run users:list`, create/delete test, password test) and confirm `npx tsc --noEmit` passes
