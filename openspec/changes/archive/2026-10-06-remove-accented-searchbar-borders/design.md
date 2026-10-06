## Context

See `proposal.md` for motivation. Various search bars across the platform have retained legacy colored focus borders or rings (`#FFED00` yellow, `#009FE3` cyan, `#E6007E` magenta). The user explicitly requested removing all yellow and accented colored borders from all searchbars across the app, ensuring inputs use clean, neutral borders and rings consistent with Apple-style Scandinavian minimalism.

## Goals / Non-Goals

**Goals:**
- Replace colored focus borders (`#FFED00`, `#009FE3`, `#E6007E`) on search and filter inputs with neutral borders (`border-[#333333]`, `focus:border-[#555555]` or `focus-within:border-[#555555]`).
- Remove colored focus rings (`focus:ring-1 focus:ring-[#...]`) from search inputs across public and admin pages.
- Retain scan event feedback in `ScannerInput.tsx` for transient scan success/error events (`scanFeedback === 'SUCCESS' | 'WARN'`), while ensuring the idle and focused input state is neutral (`focus-within:border-[#555555]`).

**Non-Goals:**
- Modifying search algorithms, debouncing, or server action filtering.
- Changing non-input accent colors (such as active tab indicators, brand headers, or operational status badges).

## Decisions

### 1. Standardized Neutral Searchbar Focus Tokens
- **Container/Input Base Border**: `border-[#333333]` or `border-zinc-800` / `border-white/10`.
- **Focused State**: `focus-within:border-[#555555]` or `focus:border-[#555555]` with `outline-none` and zero colored rings.
- *Alternatives Considered*:
  - Completely borderless (`focus:border-transparent`): Fails WCAG keyboard visual focus boundaries.
  - White border (`focus:border-white`): Too high contrast and jarring on dark mode surfaces.
  - Selected `#555555` neutral gray: Subtle, elegant, matches Apple's dark interface standards.

### 2. Component Target Specifications
1. `components/catalogue/CatalogueFilterBar.tsx`:
   - Change `focus-within:border-[#009FE3]/60 focus-within:ring-1 focus-within:ring-[#009FE3]/40` → `focus-within:border-[#555555]`.
2. `components/pos/ScannerInput.tsx`:
   - Change fallback branch from `"border-[#333333] focus-within:border-[#FFED00]"` → `"border-[#333333] focus-within:border-[#555555]"`.
3. `components/pos/EquipmentPOS.tsx`:
   - Change `focus:border-[#FFED00]` → `focus:border-[#555555]`.
4. `components/makerspace/MakerspaceMachineHub.tsx`:
   - Change `focus:border-[#FFED00]` → `focus:border-[#555555]`.
5. `components/manuals/ManualsManager.tsx`:
   - Change `focus:border-[#FFED00] focus:ring-1 focus:ring-[#FFED00]` → `focus:border-[#555555]`.
6. `components/catalogue/CatalogueAdminManager.tsx`:
   - Change `focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E]` → `focus:border-[#555555]`.
7. `components/pos/ActiveLoansTable.tsx`:
   - Change `focus:border-[#009FE3]` → `focus:border-[#555555]`.
8. `components/makerspace/ManualsCatalogModal.tsx`:
   - Change `focus:border-[#009FE3]` → `focus:border-[#555555]`.
9. `components/admin/CraftItemsManager.tsx`:
   - Change `focus:border-[#009FE3]` → `focus:border-[#555555]`.

## Risks / Trade-offs

- **[Risk]** Loss of clear indication when scanner has focus.
  → *Mitigation*: `#555555` provides clear contrast against `#151517` / `#0D0D0D` backgrounds while eliminating abrasive bright yellow/cyan hues.
