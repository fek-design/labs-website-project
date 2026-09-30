## Why

Administrators need to record and inspect when physical lab equipment was acquired to track equipment lifecycle, depreciation, and warranty intervals. Additionally, the user interface currently relies on Tailwind CSS v4's default slate-tinted `zinc` neutral palette, which conflicts with Zealand Labs' authentic, curated dark-neutral brand standards (`#09090b` dock, `#151517` containers, `#202021` cards, `#262626`/`#333333`/`#444444` borders). Overriding the neutral scale with authentic brand tokens guarantees cohesive visual aesthetics across all UI components without modifying CMYK accent colors.

## What Changes

- **Item Acquisition Date Metadata**:
  - Expose and formalize the existing `purchaseDate: DateTime?` column in Prisma schema `Inventory` as the canonical Acquisition Date slot.
  - Update `createInventoryItem` and `updateInventoryItem` server actions in `app/actions/inventory.ts` to accept `purchaseDate?: string | Date | null` and persist it directly to the database.
  - Update `InventoryItemModal.tsx` to provide an explicit "Anskaffelsesdato" (Acquisition Date) date picker slot with validation and pre-fill logic when editing.
  - Display formatted acquisition dates in `InventoryListView.tsx` and `InventoryGridView.tsx`.
- **Brand Neutral Color Scheme**:
  - Override Tailwind CSS v4's `--color-zinc-*` variables in `app/globals.css` with Zealand Labs' curated brand dark-neutral scale, mapping `--color-zinc-950` to Dock (`#09090b`), `--color-zinc-900` to Card Base (`#0e0e11`), `--color-zinc-850`/`800` to Container/Card surfaces (`#151517` / `#202021`), `--color-zinc-700`/`600` to structural borders (`#262626` / `#333333` / `#444444`), and higher steps to crisp, warm brand text tones (`#9e9ea3`, `#d1d1d4`, `#f5f5f6`).
  - Preserve all existing CMYK accent tokens (`--color-brand-yellow: #FFED00`, `--color-brand-pink: #E6007E`, `--color-brand-cyan: #009FE3`) completely untouched.

## Capabilities

### Modified Capabilities

- `inventory-location-management`: Update `Streamlined Inventory Item Creation and Editing` to require acquisition date slot input, database persistence, and list/grid view formatting.
- `visual-toolkits`: Update `Agency Motion and Visual Toolkits` to specify the brand neutral scale override in `app/globals.css`, eliminating default Tailwind zinc tints while maintaining CMYK telemetry accents.

## Impact

- **Database**: Reuses existing `purchaseDate DateTime?` in `prisma/schema.prisma` without requiring destructive migrations.
- **Server Actions**: `app/actions/inventory.ts` accepts and returns `purchaseDate`.
- **Frontend Components**:
  - `components/inventory/InventoryItemModal.tsx`
  - `components/inventory/InventoryListView.tsx`
  - `components/inventory/InventoryGridView.tsx`
  - `app/globals.css` (Tailwind CSS v4 `@theme` overrides)
- **Dependencies**: No external library additions.
