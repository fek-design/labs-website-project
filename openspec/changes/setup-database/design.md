## Context

See `proposal.md` for motivation. The project requires an offline-capable local MySQL database setup backing Next.js 16 App Router using Prisma ORM. A Docker Compose configuration (`docker-compose.yml`) defines a MySQL 8.0 service, and `prisma/schema.prisma` already defines the domain models (`Admin`, `AuditLog`, `Patron`, `Lab`, `Inventory`, `RepairLog`, `Tag`, `InventoryTag`, `Loan`).

## Goals / Non-Goals

**Goals:**
- Provide reproducible local database initialization workflow with Docker Compose.
- Configure `.env` and `.env.example` targeting the local MySQL container.
- Establish automated database migration and schema synchronization routines in `package.json`.
- Implement an idempotent seed script (`prisma/seed.ts`) populating core Labs (`makerspace`, `medialab`), sample Admin accounts with bcrypt password hashes, standard taxonomy Tags, and initial Inventory items.
- Verify `lib/prisma.ts` singleton behavior across Next.js development hot-reloading.

**Non-Goals:**
- Implementing cloud-hosted databases or third-party database-as-a-service integrations (strictly prohibited by zero-cloud mandate).
- Building frontend POS or dashboard UI screens (covered in separate feature changes).
- Creating patron/student authentication tables (patrons are strictly unauthenticated student IDs).

## Decisions

### 1. Database Runner and Execution Engine
- **Decision**: Use Docker Compose running MySQL 8.0 on `localhost:3306` with persistent volume mount (`zealand_db_volume`).
- **Rationale**: Ensures reproducible environments across developer machines without polluting local OS package managers.
- **Alternatives considered**: Local native MySQL installation (less portable across OS environments).

### 2. TypeScript Seed Runner
- **Decision**: Use `tsx` (TypeScript Execute) in `package.json` under `"prisma": { "seed": "tsx prisma/seed.ts" }` or direct npm script.
- **Rationale**: `tsx` is modern, fast, zero-config for ESM/TypeScript execution compared to heavy `ts-node` setups.
- **Alternatives considered**: `ts-node` (often requires custom tsconfig flags for ESM/Next.js).

### 3. Password Hashing for Seeded Admin Accounts
- **Decision**: Hash default admin credentials in the seed script using standard `bcryptjs` or native hashing to ensure compatibility with NextAuth credentials provider.
- **Rationale**: Plain text passwords in database violate basic security hygiene, even on local networks.
- **Alternatives considered**: Hardcoding plain text hashes (makes updating or changing seed passwords error-prone).

### 4. Idempotent Upsert Strategy for Seed Data
- **Decision**: Use Prisma `upsert` operations keyed by unique slugs/assetTags/usernames in `prisma/seed.ts`.
- **Rationale**: Prevents duplicate key errors when running `npm run db:seed` repeatedly.

## Risks / Trade-offs

- **[Docker Container Startup Delay]** → MySQL takes 5–10 seconds to initialize tables on first boot. Mitigation: Provide clear documentation and healthcheck verification in scripts.
- **[Prisma v7 Generator & Client Configuration]** → Prisma 7 requires compatible node/runtime settings. Mitigation: Validate generated client and schema syntax with `prisma validate`.

## Migration Plan

1. Verify `.env` with connection string: `mysql://zealand_admin:local_admin_secure@localhost:3306/zealand_labs`.
2. Start MySQL via `docker compose up -d`.
3. Run `npx prisma db push` or `npx prisma migrate dev --name init`.
4. Run `npm run db:seed` to populate baseline data.
