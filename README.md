# Zealand Labs - Hardware POS & Lab Operations Platform

Internal operations infrastructure and Point-of-Sale (POS) management system for Zealand Labs (Makerspace & Medialab).

Operates under a strict **Zero Cloud Dependency** mandate: all database transactions, media files, and logic execute entirely within the local institutional network.

---

## Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom CMYK design tokens (`#FFED00`, `#E6007E`, `#009FE3`, `#000000`)
- **Database & ORM**: MySQL via Prisma ORM (`@prisma/client`, `@prisma/adapter-mariadb`)
- **Authentication**: NextAuth.js Credentials Provider (Admin-only access; zero student accounts)
- **Specification Engine**: [OpenSpec](openspec/) (`spec-driven` schema)

---

## Tri-Stack Motion Architecture

Animations and interactive physics follow a dedicated 3-tier architecture. See [Animation Architecture & Engineering Guide](openspec/core/animation-architecture.md) for the complete decision matrix:

1. **`motion/react`**: Declarative UI micro-interactions, modal/drawer transitions, and agency spring physics (`lib/motion.ts`).
2. **`gsap` + `@gsap/react`**: Macro-level scroll-driven timelines, pinned containers, and long-scroll narrative telemetry.
3. **`anime.js`**: High-performance SVG stroke line drawing (`drawSvgPath`), live numeric counters/metric tickers (`animateCounter`), and character wave staggers (`lib/anime.ts`).

---

## Design Contract: Figma MCP & OpenSpec

UI implementations derive from the project's Figma design file (`Zealand Labs Projekt`).

### Core Workflow Principle: Mockup UI vs. UX Engineering
- **Figma Canvas (Visual UI)**: Source of truth for layout geometry, bento ratios, padding, typography (`Stack Sans`), and color tokens. Inspected via the **Figma MCP Server** (`get_figma_data`, `download_figma_images`).
- **Speckit & Code (Interactive UX)**: Because the Figma file is a static mockup and not an interactive prototype, all UX is engineered in code (hover/tap states, validation feedback, loading skeletons, error toasts, and accessible keyboard navigation).
- **Zero Cloud Mandate**: All Figma assets are downloaded locally into `public/images/` or `openspec/mockups/`. No external cloud CDN image links.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Configure your local database credentials in `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/zealand_labs"
NEXTAUTH_SECRET="your-development-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Migration & Seed
```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Administrator & Operator Management (CLI)

All administrative access operates under strict institutional security with **zero public registration**. Administrative accounts are provisioned and managed directly via terminal CLI scripts:

### 1. Initial SuperAdmin Provisioning
When initializing a fresh environment or recovering administrative access:
```bash
npm run setup:admin -- <username> <password>
```
*Creates or promotes the specified user to `SUPER_ADMIN` with active status.*

### 2. List All Operators
Inspect all registered operators, roles, campus assignments, facilities, and active status:
```bash
npm run users:list
```

### 3. Create a New Operator
Provision a new technician, teacher, or administrator:
```bash
npm run users:create -- <username> <password> <role> [labSlug]
```
- **Roles**: `SUPER_ADMIN`, `TECHNICIAN`, `TEACHER`
- **Lab Slugs** (optional): `makerspace`, `medialab`
- *Example*: `npm run users:create -- jensen secret123 TECHNICIAN makerspace`

### 4. Reset Operator Password
Update credentials for any registered operator:
```bash
npm run users:password -- <username> <newPassword>
```
*Passwords are automatically hashed with bcrypt (salt rounds = 10).*

### 5. Safeguarded Operator Deletion
Permanently delete an operator account with built-in relational integrity safeguards:
```bash
npm run users:delete -- <username> --force
```
**Built-in Safety Protections**:
1. **Sole SuperAdmin Lockout Prevention**: Deletion of the system's last active `SUPER_ADMIN` is strictly forbidden.
2. **Active Loan Shield**: If the operator is currently linked to open, unreturned loans (`ACTIVE`), deletion is blocked until the equipment is checked back in.
3. **Historical Audit Preservation**: Historical completed loans (`RETURNED`) checked out or checked in by the user are automatically preserved and reassigned to the primary SuperAdmin fallback account to maintain relational integrity and audit compliance.
4. **Explicit Confirmation**: Requires the `--force` flag to execute.

---

## Database Maintenance & Baseline Reset

- `npm run db:wipe`: Completely purges all dummy inventory equipment, categories, mock loans, and test records, leaving only core laboratory facilities and active admin operators ready for real production hardware.
- `npm run db:clean`: Cleans active and completed test loan transactions while retaining equipment catalog items.
- `npm run db:seed`: Re-seeds the database with default lab equipment, taxonomies, and initial admin users.
- `npm run db:push`: Synchronizes Prisma schema changes directly with the local MySQL database.
- `npm run db:studio`: Launches Prisma Studio visual database browser at `http://localhost:5555`.

---

## Useful Scripts

- `npm run dev`: Launch local Next.js dev server (`0.0.0.0:3000`)
- `npm run build`: Production bundle compilation & TypeScript check
- `npm run lint`: Run ESLint checks
- `npm run users:list`: List all operator accounts
- `npm run users:create`: Provision a new operator
- `npm run users:password`: Reset operator password
- `npm run users:delete`: Safeguarded operator deletion
- `npm run setup:admin`: Initialize SuperAdmin account
- `npm run db:wipe`: Purge dummy data for clean production rollout

