## Context

See `proposal.md` for motivation. The core spec (`openspec/specs/core/spec.md`) defines domain rules at the architecture level; this change materializes them as a concrete Prisma schema. The project currently has `prisma` and `@prisma/client` in `package.json` but no `prisma/` directory, schema, or database connection layer. The app stack is Vite + React with Express (not yet Next.js App Router), so database access will initially serve an Express API layer until the frontend migrates.

## Goals / Non-Goals

**Goals:**

- Define a complete Prisma schema covering all domain entities and enums from the core spec
- Configure Prisma for local MySQL with environment-based credentials
- Generate initial migration and Prisma client
- Provide a singleton Prisma client module safe for development hot-reload
- Provide seed data for local development and module testing
- Add npm scripts for common database operations

**Non-Goals:**

- Building API routes or UI that consume the database (separate changes)
- Migrating from Vite to Next.js
- Implementing NextAuth session wiring (schema only; auth integration is a follow-up)
- Cloud-hosted database (RDS, PlanetScale, etc.) — local MySQL only per core mandate
- Full production backup/restore automation

## Decisions

### 1. MySQL as the sole database provider

**Decision:** Use `provider = "mysql"` in Prisma schema.

**Rationale:** Core spec mandates "Local MySQL Server accessed exclusively via Prisma ORM." Aligns with institutional zero-cloud-dependency mandate.

**Alternatives considered:** SQLite (simpler local dev, but diverges from spec); PostgreSQL (not specified).

### 2. Prisma schema layout — single file

**Decision:** One `prisma/schema.prisma` file with all models and enums.

**Rationale:** Domain is cohesive and bounded (~8 models). Splitting into multi-file schema adds complexity without benefit at this scale.

### 3. Entity model

```
Lab ──────────────< Inventory >──────── InventoryTag >──── Tag
                      │
                      ├── (STATIC_MACHINE) → OperationalStatus
                      └── (BORROWABLE_GEAR) → Loan >──── Patron

Admin (standalone, for NextAuth Credentials)
```

**Key fields:**

| Model | Key fields |
|-------|-----------|
| `Lab` | `id`, `slug` (unique), `name`, `description`, `module` (enum: `CAPABILITY_BENTO`, `EQUIPMENT_POS`, `MANUAL_VIEWER`) |
| `Inventory` | `id`, `labId`, `assetTag` (unique, scannable), `name`, `hardwareType`, `operationalStatus?`, `isOnLoan` (computed or denormalized flag) |
| `Tag` | `id`, `name` (unique), `category` (enum: `USE_CASE`, `STUDY_PATH`, `MATERIAL`) |
| `InventoryTag` | composite PK `[inventoryId, tagId]` |
| `Loan` | `id`, `inventoryId`, `patronId`, `checkedOutAt`, `returnedAt?` |
| `Patron` | `id`, `studentId` (unique), `name?` |
| `Admin` | `id`, `email` (unique), `passwordHash`, `name?` |

**Decision:** Use `isOnLoan` boolean on `Inventory` denormalized for fast scanner lookups, updated transactionally on checkout/return.

**Rationale:** EquipmentPOS needs instant "is this item out?" checks during barcode scan without joining active loans.

**Alternative:** Derive on-loan status from active loan query only — cleaner but slower at scan time.

### 4. Enum constraints enforced at schema level

**Decision:** Prisma enums for `HardwareType`, `OperationalStatus`, `LabModule`, `TagCategory`.

**Rationale:** Database-level enforcement prevents invalid states regardless of application bugs.

### 5. Prisma client singleton

**Decision:** `src/lib/db.ts` exports a singleton `prisma` instance with global caching in development (standard Prisma + hot-reload pattern).

```typescript
// Pattern: globalThis.prisma in dev, new PrismaClient() in prod
```

### 6. Seed strategy

**Decision:** `prisma/seed.ts` using `tsx`, configured via `prisma.seed` in `package.json`.

**Seed contents:**
- 1 admin (`admin@zealandlabs.local` / dev password, bcrypt hashed)
- 2 labs: `makerspace` (CapabilityBento), `medialab` (EquipmentPOS)
- 4–6 inventory items split across hardware types
- 3–5 tags with associations
- 2 patrons, 1 active loan, 1 returned loan

**Idempotency:** Use `upsert` keyed on unique fields (`slug`, `assetTag`, `studentId`, `email`) so re-running seed is safe.

### 7. Environment configuration

**Decision:** `.env.example` with `DATABASE_URL="mysql://root:password@localhost:3306/zealand_labs"`. Actual `.env` gitignored.

### 8. npm scripts

| Script | Command |
|--------|---------|
| `db:generate` | `prisma generate` |
| `db:migrate` | `prisma migrate dev` |
| `db:push` | `prisma db push` (dev shortcut) |
| `db:seed` | `prisma db seed` |
| `db:studio` | `prisma studio` |

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Developer lacks local MySQL | Document setup in tasks; `.env.example` includes default connection string |
| Denormalized `isOnLoan` drifts from loan records | Enforce updates in a single service function (document in tasks); add DB check constraint or periodic reconciliation script later |
| Prisma 7.x config changes | Pin versions already in package.json; follow Prisma 7 `prisma.config.ts` if required |
| Seed password in repo | Dev-only credentials in seed; production uses env-injected admin |

## Migration Plan

1. Developer installs/starts local MySQL and creates `zealand_labs` database
2. Copy `.env.example` → `.env`, adjust credentials
3. Run `npm run db:migrate` to apply initial migration
4. Run `npm run db:seed` for dev data
5. Verify with `npm run db:studio`

**Rollback:** Drop database and re-run migrations from scratch (no production data yet).

## Open Questions

None — all domain rules are defined in the core spec and this change's delta spec.
