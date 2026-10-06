## Context

See `proposal.md` for background and motivation. Operators could previously only be deactivated in the UI, not deleted. Additionally, administrators need CLI scripts to manage accounts directly without browser interaction. When deleting an administrator from MySQL, referential integrity with `AuditLog` and `Loan` (`adminIdCheckout`, `adminIdCheckin`) must be preserved. Furthermore, the Settings interface contains an outdated static architecture display that adds visual clutter.

## Goals / Non-Goals

**Goals:**
- Provide a robust CLI user management script (`prisma/manage-users.ts`) with subcommands: `list`, `create`, `password`, and `delete`.
- Add ergonomic npm script aliases in `package.json` (`users:list`, `users:create`, `users:delete`, `users:password`).
- Implement deletion safeguards:
  - Block deletion of the sole active `SUPER_ADMIN`.
  - Block deletion if the user is attached to active ongoing loans (`status: "ACTIVE"`).
  - Reassign historical completed loans to the primary SuperAdmin to preserve equipment checkout history.
  - Delete or reassign associated audit logs cleanly before removing the user entity.
- Remove the obsolete "System & Sikkerhedsarkitektur" card from `components/settings/AdminSettingsView.tsx`.
- Comprehensively document CLI user management, database reset, and SuperAdmin setup in `README.md`.

**Non-Goals:**
- Providing a destructive full database reset in `manage-users.ts` (already handled by `clean-all-dummy-data.ts`).
- Public API exposure (CLI scripts execute directly via `tsx` on the local server).

## Decisions

### 1. Unified CLI Utility vs Multiple Scripts
- **Choice**: A single unified script `prisma/manage-users.ts` parsing command arguments (`process.argv[2]`).
- **Rationale**: Keeps database connection management, role validation, and security safeguards consolidated in one maintainable file, while exposing intuitive npm aliases (`npm run users:list`, `npm run users:delete -- <username> --force`, etc.).

### 2. Referential Integrity Strategy on Deletion
- **Active Loans**: If user has unreturned active loans, reject deletion with an actionable error.
- **Historical Completed Loans**: Update `adminIdCheckout` and `adminIdCheckin` on completed loans to the primary SuperAdmin (`admin`) so loan history is not severed or lost.
- **Audit Logs**: Delete the user's specific audit entries (`prisma.auditLog.deleteMany({ where: { actorAdminId: user.id } })`) or reassign to avoid MySQL foreign key constraint failures (`RESTRICT`).

### 3. Safety Guard for Sole SuperAdmin
- **Choice**: Count `SUPER_ADMIN` accounts where `isActive: true`. If count is 1 and the target is `SUPER_ADMIN`, reject deletion immediately.

### 4. Settings View Decluttering
- **Choice**: Remove Section 4 ("System & Sikkerhedsarkitektur") entirely from `components/settings/AdminSettingsView.tsx`.
- **Rationale**: The card is static informational copy and redundant with the live node badges already present in the canonical header.

## Risks / Trade-offs

- **[Risk]** Accidental deletion of an administrator.
  → *Mitigation*: CLI requires explicit `--force` flag or prompts confirmation, blocks deleting sole SuperAdmin, and blocks deleting admins with active loans.
