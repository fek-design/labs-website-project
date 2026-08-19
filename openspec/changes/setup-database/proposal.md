## Why

The platform requires a local MySQL database with schema management, seeding, and ORM client connectivity to support offline-first operations for Zealand Labs (Makerspace and Medialab POS). A robust database setup script and workflow is needed to provision the MySQL container, apply Prisma migrations, and seed initial baseline data (Labs, Admins, Tags, and Sample Inventory).

## What Changes

- Provision local MySQL database environment via Docker Compose configuration and verify environment configuration (`.env`).
- Initialize and push Prisma schema migrations to MySQL.
- Implement comprehensive database seed script (`prisma/seed.ts`) covering initial Labs (e.g. Medialab, Makerspace), Super Admin / Technician accounts, taxonomy Tags, and base Inventory.
- Configure `package.json` with Prisma seed and migration scripts (`db:migrate`, `db:push`, `db:seed`, `db:studio`).
- Ensure singleton Prisma Client is properly exported and validated for Next.js App Router and Server Actions.

## Capabilities

### New Capabilities
- `database-setup`: Configuration and lifecycle management of the local MySQL instance, Prisma schema synchronization, migrations, automated seeding of labs/admins/inventory, and database operational scripts.

### Modified Capabilities
<!-- None -->

## Impact

- Affected Code: `prisma/schema.prisma`, `prisma/seed.ts` (new), `package.json`, `.env` / `.env.example`, `lib/prisma.ts`.
- Dependencies: `prisma`, `@prisma/client`, `tsx` / `ts-node` (for executing TypeScript seed script).
- Systems: Local Docker MySQL service (`zealand_labs_mysql` on port 3306), local network data persistence.
