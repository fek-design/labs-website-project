## 1. Environment & Dependencies Setup

- [x] 1.1 Create `.env.example` and ensure `.env` contains the local MySQL `DATABASE_URL`
- [x] 1.2 Install `tsx` and `bcryptjs` (plus `@types/bcryptjs`) as development/runtime dependencies for executing seed scripts and hashing admin credentials
- [x] 1.3 Add Prisma workflow scripts (`db:push`, `db:migrate`, `db:seed`, `db:studio`) and prisma config to `package.json`

## 2. Container & Schema Initialization

- [x] 2.1 Start and verify local MySQL service container via `docker compose up -d`
- [x] 2.2 Validate and synchronize Prisma schema with MySQL database (`npx prisma db push` / `npx prisma migrate dev`)
- [x] 2.3 Generate Prisma client bindings (`npx prisma generate`) and verify `lib/prisma.ts` singleton

## 3. Database Seeding Implementation

- [x] 3.1 Create `prisma/seed.ts` with idempotent upsert routines for default Labs (`makerspace`, `medialab`)
- [x] 3.2 Add initial Super Admin and Technician accounts with securely hashed passwords in `prisma/seed.ts`
- [x] 3.3 Add default taxonomy Tags (e.g., 3D Printing, Laser Cutting, Audio, Camera Gear) in `prisma/seed.ts`
- [x] 3.4 Add sample baseline Inventory assets (Makerspace static machines and Medialab borrowable gear) in `prisma/seed.ts`
- [x] 3.5 Execute seed script and verify database records via Prisma Client / CLI
