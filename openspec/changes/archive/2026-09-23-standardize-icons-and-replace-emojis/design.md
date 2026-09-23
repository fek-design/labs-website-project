## Context

The Zealand Labs web interface utilizes Next.js App Router, React 19, and Tailwind CSS v4. `@phosphor-icons/react` (^2.1.10) is already installed as a dependency and configured in `lib/admin-nav.ts` and `components/admin/AdminSidebarNav.tsx`. However, several modules developed organically still rely on raw Unicode emojis (⚠️, 🎓, 🏛️, 📚, 🔍, 📕, 📄, 🗑️, ⚡), typographical glyphs (✓, ✕, ✎, +), and inline SVG markup. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Replace 100% of raw Unicode emojis and character glyphs with `@phosphor-icons/react` components.
- Replace ad-hoc inline `<svg>` blocks with clean Phosphor icon imports across POS, Catalogue, and Landing modules.
- Enforce standard icon sizes (`14px`/`16px` for inline/badge, `20px` for buttons/inputs, `24px` for headers, `32px+` for empty states).
- Standardize icon weight usage (`regular`, `bold`, `fill`).
- Guarantee accessible naming: `aria-hidden="true"` on decorative icons; explicit `aria-label` or `title` on icon-only interactive buttons.

**Non-Goals:**
- Introducing alternative icon libraries (such as FontAwesome or Lucide); the project is strictly standardized on Phosphor.
- Changing existing database models, backend API routes, or layout structures.
- Redesigning component hierarchies or altering theme colors.

## Decisions

### Decision 1: Direct Named Imports from `@phosphor-icons/react`
- **Choice**: Import icon components directly from `@phosphor-icons/react` (e.g. `import { Warning, Check, X, Buildings } from "@phosphor-icons/react"`).
- **Rationale**: The project's build bundler (Next.js / Turbopack / Webpack) tree-shakes named ES module imports cleanly. It aligns directly with the established pattern in `lib/admin-nav.ts` and `components/admin/AdminSidebarNav.tsx`.
- **Alternatives Considered**: 
  - *Dynamic icon registry component*: Adds runtime indirection and breaks TypeScript props autocompletion.
  - *Lucide-react*: Adds an extra 100KB dependency while Phosphor is already active and tested in the project.

### Decision 2: Mapping Matrix for Emojis & Character Glyphs

| Emoji / Glyph | Semantic Meaning | Phosphor Component | Default Props & Classes |
| :--- | :--- | :--- | :--- |
| `⚠️` | Warning / Prerequisite | `Warning` | `size={18} weight="bold" className="text-amber-400 shrink-0" aria-hidden="true"` |
| `🎓` | Education / Certification | `GraduationCap` | `size={18} weight="bold" className="text-cyan-400 shrink-0" aria-hidden="true"` |
| `🏛️` | Lab / Campus building | `Buildings` | `size={14} weight="regular" className="shrink-0" aria-hidden="true"` |
| `📚` | Documentation / Library | `Books` | `size={18} weight="regular" className="shrink-0" aria-hidden="true"` |
| `🔍` | Search query | `MagnifyingGlass` | `size={16} weight="bold" className="text-zinc-500 shrink-0" aria-hidden="true"` |
| `📕` | Manual / Attached SOP | `BookBookmark` | `size={16} weight="bold" className="text-rose-400 shrink-0" aria-hidden="true"` |
| `📄` | Document / File | `FileText` | `size={16} weight="regular" className="text-zinc-400 shrink-0" aria-hidden="true"` |
| `🗑️` | Delete / Remove action | `Trash` | `size={16} weight="regular" className="text-zinc-400 hover:text-red-400 shrink-0" aria-hidden="true"` |
| `⚡` | Telemetry / Action | `Lightning` | `size={16} weight="fill" className="text-[#FFED00] shrink-0" aria-hidden="true"` |
| `✓` | Checkmark / Completed | `Check` | `size={14} weight="bold" className="text-emerald-400 shrink-0" aria-hidden="true"` |
| `✕` | Close / Dismiss / Unlink | `X` | `size={14} weight="bold" className="shrink-0" aria-hidden="true"` |
| `✎` | Edit item | `PencilSimple` | `size={14} weight="regular" className="shrink-0" aria-hidden="true"` |
| `+` | Add / Create tag | `Plus` | `size={14} weight="bold" className="shrink-0" aria-hidden="true"` |

### Decision 3: Standardizing Inline SVGs
Components with inline SVG snippets (e.g. `CatalogueCard`, `CatalogueFilterBar`, `ActiveLoansTable`, `CheckoutCart`, `EquipmentPOS`, `ScannerInput`, `LandingHeader`) will be refactored to use standard Phosphor equivalents:
- Search input adornment: `MagnifyingGlass`
- Barcode indicator: `Barcode`
- Expand/collapse indicators: `CaretDown`, `CaretUp`, `CaretLeft`, `CaretRight`
- Shopping cart badge: `ShoppingCart`
- Clear/delete items: `Trash`, `X`

### Decision 4: Accessible Icon Button Pattern
Where a button previously rendered a naked character (such as `<button onClick={onClose}>✕</button>`), it will be updated to:
```tsx
<button
  type="button"
  onClick={onClose}
  aria-label="Luk"
  className="..."
>
  <X size={14} weight="bold" aria-hidden="true" />
</button>
```
This guarantees WCAG 2.1 compliance and avoids confusing screen readers that would otherwise read character glyphs as punctuation.

## Risks / Trade-offs

- **[Risk] Line Height and Text Alignment Shift**: Replacing raw text emojis with inline block SVG icons can cause baseline alignment shifts if rendered inside text blocks.
  - *Mitigation*: Wrap inline icons in flex containers with `inline-flex items-center gap-1.5` or `shrink-0` to maintain vertical optical centering.
- **[Risk] Server vs Client Component Imports**: Phosphor React icons rely on React context for global configuration if used.
  - *Mitigation*: All target interactive components already feature `"use client"`. If any server component needs icons, import from `@phosphor-icons/react/dist/ssr`.

## Migration Plan

1. **Phase 1: POS & Front Desk Components**
   - Audit and replace emojis & character glyphs in `components/pos/` (`ActiveLoansTable`, `CheckoutCart`, `EquipmentPOS`, `LoanDetailModal`, `OverdueInspector`, `PatronCard`, `ScannerInput`).
2. **Phase 2: Makerspace & Craft Components**
   - Replace emojis in `components/makerspace/` (`MakerspaceMachineHub`, `ManualsCatalogModal`) and `components/craft/` (`CraftPrerequisites`).
3. **Phase 3: Inventory & Admin Components**
   - Replace emojis and glyphs in `components/inventory/` (`InventoryManager`), `components/admin/` (`CraftItemsManager`), and `components/settings/` (`NodeTelemetryVisualizer`).
4. **Phase 4: Catalogue & Landing Clean-up**
   - Clean up inline SVGs and ad-hoc icons in `components/catalogue/` and `components/landing/`.
5. **Phase 5: Automated Verification**
   - Run grep check to verify zero raw emojis remain in the application codebase.
   - Run `npm run lint` and `npm run build` to confirm clean compilation and tree shaking.
