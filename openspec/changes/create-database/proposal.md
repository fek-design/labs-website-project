## Why

Zealand Labs has Prisma dependencies installed and a documented data architecture in the core spec, but no actual database schema, migrations, or connection layer. Without a concrete Prisma schema and local MySQL setup, lab modules (EquipmentPOS, CapabilityBento, ManualViewer) cannot load operational data, and admin workflows (loans, inventory, telemetry) have nothing to persist against.

## What Changes

- Add a Prisma schema defining all domain entities: `Lab`, `Inventory`, `Tag`, `InventoryTag`, `Loan`, `Patron`, and admin auth tables
- Define enums: `HardwareType` (`STATIC_MACHINE`, `BORROWABLE_GEAR`), `OperationalStatus` (`AVAILABLE`, `MAINTENANCE`, `BROKEN`)
- Configure Prisma for local MySQL with environment-based connection string
- Generate and apply initial migration
- Add a Prisma client singleton for server-side use
- Add seed script with representative lab, inventory, and tag data for development
- Add npm scripts for database lifecycle (`db:generate`, `db:migrate`, `db:seed`, `db:studio`)

## Capabilities

### New Capabilities

- `database`: Prisma schema, migrations, seed data, and database access conventions for the Zealand Labs domain model

### Modified Capabilities

<!-- No existing capability requirements change; core spec already documents the domain rules at architecture level. This change implements them. -->

## Impact

- **New files:** `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts`, `src/lib/db.ts`, `.env.example`
- **Dependencies:** Already present (`prisma`, `@prisma/client`); no new packages required
- **Infrastructure:** Requires a local MySQL server instance (per core spec "Zero Cloud Dependency" mandate)
- **Downstream:** Unblocks lab slot injection, loan checkout, makerspace telemetry, and admin authentication persistence
