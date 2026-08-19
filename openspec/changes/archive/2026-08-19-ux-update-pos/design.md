## Context

See `proposal.md` for motivation. The application currently experiences performance bottlenecks caused by redundant network waterfalls and calendar short-polling. Furthermore, granular micro-location tracking (individual lockers/cabinets) adds unnecessary data entry overhead. Administrators require deterministic automated asset tagging, macro-lab location tracking (Køge default & Roskilde rollout), and an optimistic, non-blocking checkout flow.

## Goals / Non-Goals

**Goals:**
- Eliminate short-polling (remove continuous interval fetching in `LoanCalendar` and `EquipmentPOS`). Fetch data on component mount and explicit user mutation triggers only.
- Simplify location taxonomy to Macro-Labs:
  - `makerspace`: Makerspace (Køge) — Global default.
  - `medialab`: MediaLab (Køge).
  - `roskilde`: Roskilde — Architectural placeholder.
- Implement deterministic automated asset tagging (`[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]`, e.g. `MK-3DP-0001`, `ML-CAM-0001`, `RK-AUD-0001`) with database uniqueness.
- Rename the checkout button to exactly: **"Confirm checkout"**.
- Implement optimistic checkout with instant UI state updates and silent background syncing. Gracefully rollback state and display toast alerts on network/API failure.

**Non-Goals:**
- Micro-location spatial coordinate tracking (deprecated).
- External push notification servers (Zero Cloud Dependency).

## Decisions

### 1. Macro-Location Facility Taxonomy
- **Decision**: Remove micro-location text fields in favor of standard Macro-Lab assignment. Seed and maintain default labs:
  - `makerspace`: Makerspace (Køge) [Default]
  - `medialab`: MediaLab (Køge)
  - `roskilde`: Roskilde (Multi-Campus Rollout Placeholder)
- **Rationale**: Reduces technician input friction and provides cleaner facility-level filtering across all tabs.

### 2. Deterministic Automated Asset Tag Generator
- **Decision**: Create a Server Action / utility `generateAssetTag({ labSlug, tagSlug })` that maps:
  - Lab prefix: `makerspace` → `MK`, `medialab` → `ML`, `roskilde` → `RK`.
  - Tag category code: `3d-printing` → `3DP`, `laser-cutting` → `LSR`, `camera-gear` → `CAM`, `audio-equipment` → `AUD`, `lighting` → `LGT`, `xr-vr` → `VRX`, `electronics` → `ELC`, fallback → `GEN`.
  - Sequential index: query maximum existing sequence for that prefix and pad to 4 digits (e.g. `0001`, `0002`).
  - Disable manual typing in item creation.
- **Rationale**: Guarantees clean, barcode-scannable, uniform asset tags without technician typos or collision errors.

### 3. Network Waterfall & Polling Elimination
- **Decision**: Remove `setInterval` and redundant useEffect cascading from `LoanCalendar` and `EquipmentPOS`. Fetch initial data via Server Component or mount effect, and trigger refetches only when an explicit mutation occurs (`checkoutEquipment`, `returnEquipment`, `modifyLoan`, `createInventoryItem`).
- **Rationale**: Eliminates unnecessary continuous CPU and database query overhead on the local server.

### 4. Optimistic Checkout Flow & Toast Error Handling
- **Decision**: When the user clicks "Confirm checkout", immediately:
  1. Store snapshot of current state (cart items, active loans).
  2. Clear cart and optimistically add items to active loans in local state.
  3. Dispatch `checkoutEquipment` in the background.
  4. If the promise fails, revert state snapshot and display a red error toast notification.
- **Rationale**: Prevents UI freeze/infinite spinners and delivers instantaneous feedback at the checkout desk.

## Risks / Trade-offs

- **[Tag Generation Concurrency]** → Mitigation: Enforce `@unique` on `assetTag` in Prisma and use retry logic if a sequence collision is detected during transaction commit.
