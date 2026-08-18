# Zealand Labs Website

## Database Setup

This project uses **local MySQL** with **Prisma ORM** (see `openspec/specs/core/spec.md`).

### Prerequisites

- Node.js 22+
- MySQL 8+ running locally (or Docker — see below)

### Quick start with Docker

```bash
docker run --name zealand-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=zealand_labs \
  -p 3306:3306 \
  -d mysql:8
```

### Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Adjust `DATABASE_URL` in `.env` if your MySQL credentials differ.

   Default: `mysql://root:password@localhost:3306/zealand_labs`

### Migrate and seed

```bash
npm install
npm run db:migrate    # apply migrations (creates tables)
npm run db:seed       # populate development data
npm run db:studio     # open Prisma Studio to inspect data
```

### Other database commands

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Regenerate Prisma Client after schema changes |
| `npm run db:push` | Push schema directly (dev shortcut, no migration file) |
| `npm run db:migrate` | Create/apply migrations interactively |
| `npm run db:seed` | Run idempotent seed script |
| `npm run db:studio` | Launch Prisma Studio |

### Dev credentials (seed only)

- **Admin:** `admin@zealandlabs.local` / `devpassword`
