## 1. Admin Navigation Registry & Cyclic Accents

- [x] 1.1 Update `lib/admin-nav.ts` `ADMIN_NAV_ITEMS` with strictly ordered cyclic accents: Yellow (`#FFED00`), Cyan (`#009FE3`), Magenta (`#E6007E`), and loop (one accent per tab).
- [x] 1.2 Verify `components/admin/AdminSidebarNav.tsx` active tab glow, border, and tooltip behavior using the updated accent tokens.

## 2. Page View Accent Synchronization

- [x] 2.1 Update `components/catalogue/CatalogueAdminManager.tsx` header text, counters, and action triggers to use Magenta (`#E6007E`).
- [x] 2.2 Update `components/manuals/ManualsManager.tsx` header text, document counters, and "Tilføj" trigger to use Yellow (`#FFED00`).
- [x] 2.3 Update `components/settings/AdminSettingsView.tsx` header text and save triggers to use Magenta (`#E6007E`).

## 3. Logs View Reskin (Figma Node 86:4299)

- [x] 3.1 Implement canonical header `LABS Logs` with Cyan (`#009FE3`) accent in `Stack Sans Notch` and operator greeting (`Velkommen, {adminName}`) in `components/history/AuditHistoryView.tsx`.
- [x] 3.2 Build the search input toolbar (`#151517` surface, `#333333` border, rounded-lg) with "Søg logs..." placeholder and "Refresh" action button.
- [x] 3.3 Create the main logs container (`#151517` surface, `#333333` border) with subheader title ("Revisionslog & Transaktion Historik [count]") and `TYPE` dropdown filter.
- [x] 3.4 Construct segmented horizontal log cards (`#202021` card, `#444444` border) with vertical `#333333` dividers for `TIDSPUNKT`, `TYPE`, `AKTØR`, and `TARGET`.
- [x] 3.5 Add interactive `Se Ændring ▼` toggle button and animated expandable JSON delta drawer with monospace syntax formatting.

## 4. Verification & Polish

- [x] 4.1 Validate tab accent switching in the admin console across all 6 tabs ensuring exactly one distinct accent is active per view.
- [x] 4.2 Test log filtering by type, real-time search query filtering, refresh triggering, and JSON drawer expansion.
- [x] 4.3 Validate responsive behavior across desktop and smaller viewports adhering to design system tokens.
