<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Design System Rules

## 1. Typography Hierarchy (Stack Sans Specification)
- **`Stack Sans Notch` (`font-notch`)**: Top headings (`h1`, `h2`), brand logos (`LABS`), and large metric counter numbers (`AnimatedCounter`).
- **`Stack Sans Headline` (`font-headline`)**: Subheadings, filter labels, tab titles, badges, and operator greetings (`Velkommen, {adminName}`).
- **`Stack Sans Text` (`font-text` / `font-sans`)**: Body copy, descriptions, input fields, dropdowns, and table cell data.

## 2. Canonical Admin Page Header Standard
All administrative pages (`/admin/pos`, Inventory, Makerspace, etc.) must match the canonical layout established by the POS dashboard:
- Responsive header container: `flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2`.
- Left: `LABS` in white + section name in brand accent color (`font-notch`) with admin greeting (`Velkommen, {adminName}` in `font-headline`).
- Right: Horizontal KPI metric cluster showing large numeric counts in `font-notch` with stacked labels in `font-headline text-zinc-400`.

## 3. Surface & Dock Standards
- Navigation Dock: `#09090b` (border `#262626`).
- Containers & Modals: `#151517` (border `#333333`).
- Cards & Tiles: `#202021` (border `#444444`).
- Canvas Floor: `#000000` / `#0e0d0f`.
