## Context

See `proposal.md` for background. The inventory taxonomy requires moving from a flat tag list to a structured 3-tier namespaced faceted architecture (`DISCIPLINE`, `PROCESS`, `MATERIAL`). Additionally, user manuals on static machines require replace and delete capabilities, fake dummy specs must be cleaned out, and the front desk loan schedule calendar must update in real-time when equipment checkout or check-in mutations occur.

## Goals / Non-Goals

**Goals:**
- Implement 3-Tier Faceted Taxonomy in Prisma (`enum TagFacet { DISCIPLINE, PROCESS, MATERIAL }`) and seed real-world categories.
- Provide faceted multi-dimensional filtering (Discipline, Process, Material) in `InventoryManager.tsx` and `MakerspaceMachineHub.tsx`.
- Enable dynamic creation of new tags categorized by facet.
- Add "Replace Manual" and "Delete Manual" server actions and UI controls in `MakerspaceMachineHub.tsx`.
- Remove unconfigurable fake dummy machine specifications.
- Wire checkout and check-in transactions directly into `LoanCalendar` refresh hooks for instant calendar schedule synchronization.

**Non-Goals:**
- Cloud-hosted file storage (retains strict Zero-Cloud local file system storage).

## Decisions

### 1. 3-Tier Faceted Taxonomy Architecture
- **Schema**: Add `enum TagFacet { DISCIPLINE, PROCESS, MATERIAL }` to `prisma/schema.prisma` and add `facet TagFacet @default(DISCIPLINE)` on `model Tag`.
- **Faceted Dimensions**:
  - `DISCIPLINE`: High-level lab domain (e.g. *Textile*, *3D Fabrication*, *Rapid Prototyping*, *Medialab & AV*, *Electronics*).
  - `PROCESS`: Physical execution technique (e.g. *Direct-to-Garment*, *Sublimation*, *FDM 3D Printing*, *Laser Cutting*, *Embroidery*, *Soldering*, *Cinema Recording*).
  - `MATERIAL`: Consumable substrate / compatibility (e.g. *Cotton/Polyester*, *PLA/PETG*, *Cast Acrylic*, *Resin*, *Vinyl*, *Solder Wire*).
- **Dynamic Tag Addition**: Admins can type and save a new tag under any of the 3 facets directly in the item registration modal via `createTag({ name, facet })`.

### 2. Manual Replacement & Deletion Actions
- **Server Action**: Add `deleteMachineManual(machineId: string)` in `app/actions/upload.ts` to remove the uploaded file from disk (via `fs.unlink`) and clear `manualUrl` / `manualFileName` from `Inventory.customFields`.
- **UI**: In `MakerspaceMachineHub.tsx`, when a manual exists, render:
  - `[📄 View PDF Manual]`
  - `[🔄 Replace Manual]`
  - `[🗑 Delete Manual]`

### 3. Machine Dummy Specification Cleanup
- Remove hardcoded unconfigurable dummy parameters. Render verified operational parameters from `notes`, `customFields`, and safety guidelines.

### 4. Real-time Calendar Push on Checkout
- In `EquipmentPOS.tsx`, maintain a `calendarRefreshTrigger` counter/callback.
- When `CheckoutCart` executes checkout or `LoanDetailModal` checks in equipment, invoke `setCalendarRefreshTrigger(prev => prev + 1)`.
- `LoanCalendar` receives `refreshKey={calendarRefreshTrigger}` and immediately refetches month loan records.

## Risks / Trade-offs

- **[Tag Schema Migration]** → Execute `npx prisma db push` and update `prisma/seed.ts` with faceted tags to guarantee full backward compatibility.
