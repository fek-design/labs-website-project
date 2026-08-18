## 1. Environment & Prisma Setup

- [ ] 1.1 Create `.env.example` with `DATABASE_URL` pointing to local MySQL (`mysql://root:password@localhost:3306/zealand_labs`)
- [ ] 1.2 Ensure `.env` is listed in `.gitignore` (add if missing)
- [ ] 1.3 Initialize `prisma/schema.prisma` with `provider = "mysql"`, `url = env("DATABASE_URL")`, and generator for `@prisma/client`

## 2. Schema Definition

- [ ] 2.1 Define enums: `HardwareType`, `OperationalStatus`, `LabModule`, `TagCategory`
- [ ] 2.2 Create `Lab` model (`slug` unique, `name`, `description`, `module`)
- [ ] 2.3 Create `Inventory` model (`labId` FK, `assetTag` unique, `name`, `hardwareType`, optional `operationalStatus`, `isOnLoan` boolean default false)
- [ ] 2.4 Create `Tag` model (`name` unique, `category`) and `InventoryTag` junction with composite PK
- [ ] 2.5 Create `Patron` model (`studentId` unique, optional `name`)
- [ ] 2.6 Create `Loan` model (`inventoryId`, `patronId`, `checkedOutAt`, optional `returnedAt`) with FK constraints
- [ ] 2.7 Create `Admin` model (`email` unique, `passwordHash`, optional `name`)
- [ ] 2.8 Add indexes on frequently queried fields (`Inventory.assetTag`, `Patron.studentId`, `Lab.slug`)

## 3. Migration & Client Generation

- [ ] 3.1 Run `prisma migrate dev --name init` to create and apply initial migration
- [ ] 3.2 Verify migration SQL creates all tables, enums, and foreign keys
- [ ] 3.3 Run `prisma generate` and confirm `@prisma/client` types are available

## 4. Prisma Client Singleton

- [ ] 4.1 Create `src/lib/db.ts` with singleton pattern (global cache in dev, fresh instance in prod)
- [ ] 4.2 Export typed `prisma` client for use by future API routes

## 5. Seed Data

- [ ] 5.1 Add `bcryptjs` (or use built-in crypto) for admin password hashing in seed
- [ ] 5.2 Create `prisma/seed.ts` with upsert-based idempotent seeding
- [ ] 5.3 Seed 1 admin account, 2 labs (makerspace + medialab), 4–6 inventory items, 3–5 tags with associations, 2 patrons, 1 active loan + 1 returned loan
- [ ] 5.4 Configure `prisma.seed` in `package.json` pointing to `tsx prisma/seed.ts`
- [ ] 5.5 Run seed and verify data in Prisma Studio

## 6. npm Scripts & Documentation

- [ ] 6.1 Add scripts to `package.json`: `db:generate`, `db:migrate`, `db:push`, `db:seed`, `db:studio`
- [ ] 6.2 Add brief database setup instructions to README (MySQL install, `.env` copy, migrate + seed commands)

## 7. Verification

- [ ] 7.1 Confirm fresh setup works end-to-end: migrate → seed → studio shows all entities
- [ ] 7.2 Confirm re-running seed is idempotent (no duplicate key errors)
- [ ] 7.3 Run `openspec validate create-database --strict` and resolve any issues
