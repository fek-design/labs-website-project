## Context

See `proposal.md` for background. This change resolves render-phase state impurity in `EquipmentPOS`, addresses calendar date timezone parsing (-1 day offset), introduces a machine search bar with PDF manual uploads in the Makerspace hub, adds expected vs. actual check-in tracking comparisons, and sets up a base login gate (`admin` / `pass`) with a clean mock database seed.

## Goals / Non-Goals

**Goals:**
- Fix React state setter impurity: remove all `.then()` and async side effects from `setActivePatron` inside `EquipmentPOS.tsx`.
- Fix calendar timezone offset by formatting date keys with local year-month-day rather than UTC `.toISOString()`.
- Add dedicated search bar to Makerspace Machine Hub and remove fake/placeholder specifications.
- Implement local PDF manual upload (`/public/uploads/manuals/`) and link documents to machine profiles.
- Display "checked out" status explicitly and render a comparison timeline between `expectedReturn` and `actualReturn`.
- Provide a basic authentication screen with temporary credentials (`admin` / `pass`).
- Reset and seed a clean dataset in `prisma/seed.ts`.

**Non-Goals:**
- External cloud file hosting (retains strict Zero Cloud Local Storage architecture).

## Decisions

### 1. State Purity and Refresh Refactoring
- **Issue**: `setActivePatron((currentPatron) => { if (currentPatron) getPatronDetails(...).then(...) })` placed an async promise inside a React state updater during render/lifecycle execution.
- **Solution**: Keep an `activePatronId` ref or state. In `refreshData()`, perform all async data fetches ahead of time, then apply pure synchronous state updates:
  ```ts
  const [statsRes, activeRes, overdueRes, gearRes, refreshedPatron] = await Promise.all([
    getPosStats(labSlug),
    getActiveLoans(labSlug),
    getOverdueLoans(labSlug),
    getLabInventory(labSlug),
    activePatronId ? getPatronDetails(activePatronId) : Promise.resolve(null),
  ]);
  setActivePatron(refreshedPatron);
  ```

### 2. Timezone-Safe Calendar Date Comparison
- **Issue**: In `LoanCalendar.tsx`, `new Date(loan.expectedReturn).toISOString().slice(0, 10)` converts local midnight/evening timestamps into UTC, causing Danish local time (UTC+2) to shift back to the previous day (off by 1 day).
- **Solution**: Use a helper `toLocalDateKey(d: Date | string)` that extracts `.getFullYear()`, `.getMonth() + 1`, and `.getDate()` in the user's local timezone.

### 3. Check-in Comparison Timeline
- **Decision**: In `LoanDetailModal.tsx` and calendar inspector, if `loan.actualReturn` exists, calculate:
  ```ts
  const diffDays = Math.round((new Date(loan.actualReturn).getTime() - new Date(loan.expectedReturn).getTime()) / (1000 * 60 * 60 * 24));
  ```
  Render badges: `Returned on time`, `Returned ${Math.abs(diffDays)} day(s) early`, or `Returned ${diffDays} day(s) late`.

### 4. PDF Manual Uploads & Machine Association
- **Decision**: Create `app/actions/upload.ts` using Node.js `fs/promises` to save uploaded PDF buffers to `public/uploads/manuals/[sanitized-name].pdf` and return `/uploads/manuals/[filename].pdf`.
- Save the PDF link into `Inventory.customFields.manualUrl` and display a "View / Download PDF Manual" button in `MakerspaceMachineHub.tsx`.

### 5. Basic Authentication Wrapper & Clean Seed Reset
- **Decision**:
  - Seed default admin with `admin` and `pass` (hashed with bcrypt).
  - Create `app/actions/auth.ts` (`loginAdmin`, `logoutAdmin`, `checkAuthSession`) and a clean `components/auth/AuthGate.tsx` wrapper around the Admin console.
  - Reset and seed clean mock assets in `prisma/seed.ts`.

## Risks / Trade-offs

- **[Upload directory persistence]** → Ensure `public/uploads/manuals` directory is created on server action initialization if it does not already exist.
