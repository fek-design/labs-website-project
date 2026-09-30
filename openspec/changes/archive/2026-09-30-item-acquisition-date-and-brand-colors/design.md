## Context

See [proposal.md](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/openspec/changes/item-acquisition-date-and-brand-colors/proposal.md) for background and motivation.

The project currently uses Tailwind CSS v4 with default `zinc` color scales, which introduce cool/blue-gray undertones contrasting with the Zealand Labs brand guide. The design system prescribes deep blacks, obsidian surfaces, and neutral dark grays (`#000000`, `#09090b`, `#0e0e11`, `#151517`, `#202021`, `#262626`, `#333333`, `#444444`) alongside telemetry CMYK accents (`#FFED00`, `#E6007E`, `#009FE3`).

On the data layer, `prisma/schema.prisma` already defines an optional `purchaseDate DateTime?` column on the `Inventory` model. However, the UI previously either dumped `purchaseDate` into a generic string inside `customFields.purchaseDate` or lacked a dedicated, formatted date input and display slot in `InventoryItemModal.tsx`, `InventoryListView.tsx`, and `InventoryGridView.tsx`.

## Goals / Non-Goals

**Goals:**
- Centralize brand neutral colors in `app/globals.css` by overriding `--color-zinc-*` variables under Tailwind v4's `@theme` directive, instantly realigning the entire application UI with Zealand Labs brand tokens without touching hundreds of individual component classnames.
- Maintain 100% fidelity of existing CMYK accent tokens (`--color-brand-yellow: #FFED00`, `--color-brand-pink: #E6007E`, `--color-brand-cyan: #009FE3`).
- Connect the existing `purchaseDate` column on `Inventory` in `prisma/schema.prisma` end-to-end:
  - Acceptance of optional ISO date strings or Date instances in `createInventoryItem` and `updateInventoryItem` (`app/actions/inventory.ts`).
  - Clear "Anskaffelsesdato" date input in `InventoryItemModal.tsx` with date picker and reset capability.
  - Formatted localized date badge/column in both table list view (`InventoryListView.tsx`) and card grid view (`InventoryGridView.tsx`).

**Non-Goals:**
- Modifying MySQL schema migrations (the database column already exists and is non-breaking).
- Altering CMYK telemetry accent colors, accent assignments, or role badges.
- Renaming Tailwind utility classes from `zinc` to custom brand prefixes (e.g. `bg-brand-neutral-900`) across all codebase files when token remapping achieves the desired visual outcome cleanly.

## Decisions

### Decision 1: Override Tailwind v4 `--color-zinc-*` via `@theme` vs Global Find-and-Replace

- **Chosen Approach**: Define custom `--color-zinc-*` values inside the `@theme` block in `app/globals.css` that correspond directly to the brand specification:
  - Canvas / Floor: `#000000` / `#0e0d0f`
  - Dock / Base: `--color-zinc-950: #09090b`
  - Deep Surface / Card Base: `--color-zinc-900: #0e0e11`
  - Container / Modal Surface: `--color-zinc-850: #151517`
  - Tile / Card: `--color-zinc-800: #202021`
  - Hairline / Muted Borders: `--color-zinc-750: #262626`
  - Interactive / Panel Borders: `--color-zinc-700: #333333`
  - High Contrast Borders: `--color-zinc-650: #444444`
  - Neutral Text hierarchy: `--color-zinc-600: #52525a`, `--color-zinc-500: #717178`, `--color-zinc-400: #9e9ea3`, `--color-zinc-300: #d1d1d4`, `--color-zinc-200: #e4e4e7`, `--color-zinc-100: #f5f5f6`, `--color-zinc-50: #fafafa`
- **Rationale**: The codebase already leverages `zinc` utility classes (`bg-zinc-900`, `border-zinc-800`, `text-zinc-400`) extensively in hundreds of components. Remapping the zinc scale under `@theme` immediately achieves consistent dark-neutral brand styling across all existing and new components without risk of missing stray utility classes or introducing merge churn.
- **Alternatives Considered**: 
  - *Introducing custom token prefixes (e.g., `bg-surface-floor`, `text-brand-text`)*: While clean in theory, refactoring dozens of complex components risks regressions and breaks standard Tailwind conventions.
  - *Hardcoding inline hex values*: Violates maintainability and design token hierarchy.

### Decision 2: First-Class `purchaseDate` on Server Action Payload vs `customFields` JSON

- **Chosen Approach**: Pass `purchaseDate` explicitly in `createInventoryItem` and `updateInventoryItem` server actions and save directly to `prisma.inventory.create({ data: { ..., purchaseDate } })` as a native `Date` object or `null`.
- **Rationale**: The MySQL schema already features `purchaseDate DateTime?`. Storing it natively enables database-level indexing, sorting, filtering by age, and reporting, rather than querying JSON inside `customFields`.
- **Alternatives Considered**:
  - *Keep storing in `customFields.purchaseDate`*: Degrades query performance, prevents native date sorting, and leaves the existing Prisma column unused.

### Decision 3: Acquisition Date UI Display Pattern

- **Chosen Approach**: 
  - In `InventoryItemModal.tsx`, add a labeled input `"Anskaffelsesdato"` in the metadata / specs grid, using standard HTML5 `type="date"` styled with brand surfaces (`bg-[#151517]` / `border-[#333333]`), with clear placeholder and reset button.
  - In `InventoryListView.tsx`, render the acquisition date formatted with `Intl.DateTimeFormat('da-DK', { dateStyle: 'medium' })` or a subtle dash (`—`) when null.
  - In `InventoryGridView.tsx`, display an acquisition date tag or micro-detail alongside barcode and category metadata if populated.
- **Rationale**: Danish locale (`da-DK`) aligns with the Zealand Labs Danish admin interface standards (`"Velkommen, {adminName}"`, `"Lagerstyring"`).

## Risks / Trade-offs

- **Risk**: Overriding `--color-zinc-*` might slightly darken or shift existing text contrast if light zinc values are not calibrated properly.
  - *Mitigation*: Ensure `--color-zinc-400`, `--color-zinc-300`, and `--color-zinc-100` maintain high WCAG AA/AAA contrast ratios against `#000000`, `#09090b`, and `#151517` surfaces.
- **Risk**: Date timezone offset shifting `YYYY-MM-DD` when converted to UTC `DateTime` in Prisma.
  - *Mitigation*: Store acquisition dates either at midnight UTC (`new Date(dateString + 'T00:00:00Z')`) or parse ISO date strings carefully so the displayed calendar day never shifts backwards.

## Migration Plan

1. **Step 1**: Update `app/globals.css` with the brand neutral `--color-zinc-*` tokens. Verify visual rendering across POS, Inventory, and Logs pages.
2. **Step 2**: Update `app/actions/inventory.ts` to accept `purchaseDate` and persist to Prisma.
3. **Step 3**: Update `components/catalogue/InventoryItemModal.tsx` state and form handlers.
4. **Step 4**: Update `InventoryListView.tsx` and `InventoryGridView.tsx` display rendering.
5. **Step 5**: Run Next.js typecheck (`npm run build` or `npx tsc --noEmit`) to verify zero type regressions.
