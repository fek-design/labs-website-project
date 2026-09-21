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

## Useful Scripts

- `npm run dev`: Launch local Next.js dev server
- `npm run build`: Production bundle compilation & TypeScript check
- `npm run lint`: Run ESLint checks
- `npm run db:push`: Synchronize Prisma schema with local database
- `npm run db:seed`: Re-seed database with default lab equipment, taxonomies, and admin users
- `npm run db:studio`: Open Prisma Studio UI on `localhost:5555`
