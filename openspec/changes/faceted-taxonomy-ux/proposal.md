## Why

Flat tag lists fail when multiple admins manage inventory because everyone categorizes at different levels of abstraction (one admin tags `Textile`, another tags `Brother-GTX`, a third tags `T-Shirt`). The solution is not a rigid enum or an open text box, but a **Namespaced Faceted Taxonomy**. Instead of a generic tag list, tags are grouped into three operational dimensions:
- **Discipline** (e.g., `Textile`, `3D Fabrication`, `Rapid Prototyping`, `Medialab & AV`)
- **Process** (e.g., `Direct-to-Garment`, `FDM 3D Printing`, `Laser Cutting`, `Screen Printing`, `Embroidery`, `Soldering`, `Cinema 4K Recording`)
- **Material** (e.g., `Cotton/Polyester`, `PLA/PETG`, `Cast Acrylic`, `Photopolymer Resin`, `Vinyl`, `Solder Wire`)

This allows any admin to add new machinery and gear dynamically without polluting the global taxonomy or breaking search filters.

Furthermore:
- **Manuals Management**: Missing `Replace` and `Delete` actions for uploaded PDF manuals.
- **Machine Specifications**: Specifications are currently unconfigurable/static dummy data and need to be cleaned from dummy machines.
- **Calendar Synchronization**: The loan schedule calendar does not update in real-time when equipment is checked out at the front desk.

## What Changes

### 1. The 3-Tier Faceted Taxonomy Architecture

| Facet / Namespace | Definition | Examples | Admin Constraint |
| :--- | :--- | :--- | :--- |
| **`DISCIPLINE`** | High-level lab domain / workspace zone | Textile, 3D Fabrication, Rapid Prototyping, Medialab | Low frequency changes. Represents the lab zone. |
| **`PROCESS`** | The physical action or technique the hardware executes | Sublimation, FDM Printing, Laser Cutting, Embroidery | Medium frequency. Technical machine capability. |
| **`MATERIAL`** | Consumable or substrate supported by the hardware | Cotton/Polyester, PLA/PETG, Cast Acrylic, Vinyl | High frequency. Dictates safety and compatibility. |

- Dynamic tag addition within any facet directly during item creation or management.
- Multi-dimensional faceted filter dropdowns in the inventory and machine catalog views.

### 2. Manuals Replace/Delete & Dummy Spec Cleanup
- Add explicit **Replace Manual** and **Delete Manual** actions for machine documents.
- Remove fake unconfigurable dummy specifications from static machines, retaining only authentic operational notes and custom fields.

### 3. Real-Time Front Desk Calendar Push
- Automatically synchronize and re-query the calendar schedule when a checkout, return, or loan modification is executed on the front desk.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `inventory-location-management`: 3-tier faceted taxonomy (`DISCIPLINE`, `PROCESS`, `MATERIAL`), multi-faceted search filters, and dynamic tag additions.
- `makerspace-machine-hub`: Manual document replacement and deletion controls, and clean verified machine parameters without dummy specs.
- `equipment-pos-dashboard`: Real-time calendar event synchronization on checkout and return mutations.

## Impact

- **Prisma & Database**: Add `TagFacet` enum (`DISCIPLINE`, `PROCESS`, `MATERIAL`) to `Tag` model, update `prisma/seed.ts`.
- **Server Actions**: `app/actions/inventory.ts` (`createTag`, `getFacetedTags`), `app/actions/upload.ts` (`deleteMachineManual`, `replaceMachineManual`), `app/actions/pos.ts`.
- **UI Components**: `components/inventory/InventoryManager.tsx`, `components/makerspace/MakerspaceMachineHub.tsx`, `components/pos/EquipmentPOS.tsx`, `components/pos/LoanCalendar.tsx`.
