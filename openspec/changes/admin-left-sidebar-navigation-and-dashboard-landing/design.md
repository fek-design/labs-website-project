## Context

See `proposal.md` for motivation. The admin operational workspace (`/admin/pos`) previously presented an inline horizontal pill tab bar in the header. As administrative tools expanded to include Crafts & Blog Management, Audit Logs, and Settings, horizontal space became crowded. Furthermore, the root landing page (`/admin`) needed a fresh coat of paint matching Figma frames `#79:827` and `#79:2063` while keeping the underlying database counting and routing logic identical.

## Goals / Non-Goals

**Goals:**
- Construct a dedicated docked left-hand sidebar navigation (`components/admin/AdminSidebarNav.tsx`) with an 80px fixed width, `#151517` background, and 40x40px Phosphor icon buttons based on Figma frame `#79:835`.
- Establish an extendable, declarative navigation configuration registry (`lib/admin-nav.ts`) enabling simple addition of new operational modules with typed IDs, labels, icons, and accent colors.
- Maintain existing sub-view state mechanics in `AdminConsoleClient.tsx` without regressions.
- Restyle the administrative portal landing (`app/admin/page.tsx`) to match Figma specifications `#79:827` and `#79:2063` while preserving all Prisma stats queries and offline fallback logic.

**Non-Goals:**
- Altering database schema or modifying existing inventory/POS mutation actions.
- Replacing public-facing navbar (`LandingHeader.tsx`) on the public `/` or `/katalog` pages.

## Decisions

### 1. Dedicated Declarative Navigation Registry (`lib/admin-nav.ts`)
- **Choice**: Separate navigation configuration from the presentation component into `lib/admin-nav.ts`:
  ```typescript
  export interface AdminNavItem {
    id: AdminNavTabId;
    label: string;
    shortTitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string; size?: number; weight?: string }>;
    accentColor: string; // CMYK brand token
  }
  ```
- **Rationale**: Direct answer to user requirement: *"make sure this list is also extendable for ux and make it known"*. Developers can simply push a new object into `ADMIN_NAV_ITEMS` to mount a new view without modifying the sidebar layout or CSS flexbox structure.

### 2. Docked Left-Side Navigation Geometry & Aesthetics
- **Choice**: Fixed position `w-20` (`80px`), `h-screen`, `bg-[#151517]`, `border-r border-[#262626]`, `z-50`.
  - Top: Zealand Labs emblem linked to public portal.
  - Middle: Icon stack centered with `gap-6 sm:gap-8`, utilizing Phosphor icons (`@phosphor-icons/react` or tailored Phosphor SVGs).
  - Hover / Active UX: Hover triggers a floating label tooltip positioned to the right (`left-24`), active state displays an accent glow and high-contrast fill.
  - Bottom: Node health status dot and logout trigger.
- **Rationale**: Replicates Figma frame `#79:835` (`designedWidth: 80px`, `padding: 40px`, `justifyContent: space-between`).

### 3. Preserved Admin Landing Page Logic (`/admin`)
- **Choice**: Keep the existing async server component architecture in `app/admin/page.tsx` running `Promise.all` over `prisma.inventory.count` and `prisma.loan.count` with `try/catch` fallback to zero. Update layout tokens, hero hierarchy, and feature cards according to Figma frames `#79:827` and `#79:2063`.
- **Rationale**: Strict adherence to the user directive: *"keep the logic exactly the same as before, this is just a new coat of paint"*.

## Risks / Trade-offs

- **[Risk] Phosphor icons package dependency or bundling weight**:
  - **Mitigation**: Install `@phosphor-icons/react`. Ensure tree-shakable named imports or export lightweight Phosphor SVG wrappers if bundle optimization is needed.
- **[Risk] Content shifting or layout overlap with fixed 80px left dock**:
  - **Mitigation**: Add `pl-20` (80px left padding) to the main console wrapper in `AdminConsoleClient.tsx` to ensure zero overlapping across all display widths.
