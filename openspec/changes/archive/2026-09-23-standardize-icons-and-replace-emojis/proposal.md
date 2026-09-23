## Why

The project currently contains an inconsistent mix of visual iconography across modules: raw unicode emojis (such as ⚠️, 🎓, 🏛️, 📚, 🔍, 📕, 📄, 🗑️, ⚡), plain unicode glyphs (such as ✓, ✕, ✎, +), hand-crafted inline SVG snippets with arbitrary viewBoxes/stroke widths, and `@phosphor-icons/react` components. 

Raw emojis render with mismatched vendor-specific glyph styling across macOS, Windows, Linux, iOS, and Android, breaking visual cohesion and accessibility. Furthermore, ad-hoc text glyphs cannot scale with theme colors or inherit typography weights. Standardizing on the project's installed `@phosphor-icons/react` library eliminates emoji rendering discrepancies, enforces crisp accessibility standards (`aria-hidden="true"` on decorative icons, explicit accessible labels on interactive triggers), unifies size tokens, and establishes a single design language across POS, Makerspace, Inventory, Catalogue, and Admin modules.

## What Changes

- **Replace all raw Unicode emojis and ad-hoc glyphs** across all components (`components/craft/`, `components/inventory/`, `components/makerspace/`, `components/pos/`, `components/settings/`, `components/admin/`) with semantic `@phosphor-icons/react` components (e.g. `Warning`, `GraduationCap`, `Bank` / `Buildings`, `Books`, `MagnifyingGlass`, `FileText`, `Trash`, `Lightning`, `Check`, `X`, `PencilSimple`, `Plus`).
- **Replace redundant inline SVGs** in components (`CatalogueCard`, `CatalogueFilterBar`, `ActiveLoansTable`, `CheckoutCart`, `EquipmentPOS`, `ScannerInput`, `FirstTimeCampusGate`, `LandingHeader`) with standardized Phosphor icons.
- **Enforce icon sizing and weighting rules**:
  - Consistent icon sizes: `14px` / `16px` (compact/inline action), `20px` (standard button / list icon), `24px` (prominent feature / tab icon), `32px+` (spotlight / empty state hero icon).
  - Consistent weighting: `regular` for neutral state, `bold` for active/selected or prominent micro-states, and `fill` for active tabs / selected markers where appropriate.
- **Enforce accessibility and color inheritance**:
  - Ensure all decorative icons include `aria-hidden="true"` and inherit color (`currentColor` or semantic Tailwind text colors like `text-emerald-400`, `text-rose-400`, `text-yellow-400`).
  - Ensure icon-only interactive buttons include explicit `aria-label` or `title` attributes.

## Capabilities

### New Capabilities
- `icon-system`: Unified iconography architecture establishing `@phosphor-icons/react` as the single canonical icon source, forbidding raw unicode emojis in UI chrome, defining standard size and weight scales, and ensuring accessibility compliance.

### Modified Capabilities
*(None - existing domain specs remain unchanged)*

## Impact

- **Affected Code**: `components/admin/*`, `components/craft/*`, `components/inventory/*`, `components/makerspace/*`, `components/pos/*`, `components/settings/*`, `components/catalogue/*`, `components/landing/*`.
- **Dependencies**: Uses the already installed `@phosphor-icons/react` (^2.1.10) dependency. No new external dependencies required.
- **APIs / Data**: No database or backend API changes.
