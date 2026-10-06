## Context

See `proposal.md` for background and motivation. `components/auth/AuthGate.tsx` acts as the client-side gate checking the HMAC-signed cookie session before mounting the administrative console (`/admin/pos`, etc.). Now that hardcoded credentials have been replaced with real database bcrypt validation, the login screen requires translation to Danish, clean empty form inputs, and the removal of the demo credentials badge.

## Goals / Non-Goals

**Goals:**
- Update the submit button to display `"Log ind"` (and `"Logger ind..."` while submitting).
- Completely remove the temporary demo credentials box (`admin` / `pass`).
- Initialize username and password inputs to empty strings (`""`).
- Translate all copy on the login screen to Danish (`Personale Login`, `Brugernavn`, `Adgangskode`, etc.).
- Update input focus rings to neutral borders (`border-[#262626] focus:border-[#555555]`).

**Non-Goals:**
- Altering the server action authentication flow in `app/actions/auth.ts` (already completed and secured).
- Changing student/patron interactions (patrons do not authenticate through this screen).

## Decisions

### 1. Clear Form Initial States
- **Choice**: Set `useState("")` for both `usernameInput` and `passwordInput`.
- **Rationale**: Prevents auto-submitting obsolete credentials, enforcing explicit entry of authorized operator credentials.

### 2. Button Label Simplification
- **Choice**: Display `"Log ind"` on the primary button, transitioning to `"Logger ind..."` with a spinner while `isSubmitting` is true.
- **Alternatives Considered**: `"Lås op"`, `"Godkend"`. `"Log ind"` is the universally recognized Danish standard for system authentication.

### 3. Complete Removal of Demo Credentials Banner
- **Choice**: Strip the `Temporary Demo Credentials` card entirely from the JSX.
- **Rationale**: Leaving test credentials on a hardened production system causes confusion and leaks legacy placeholders.

### 4. Input Focus Styling Standardization
- **Choice**: Transition input focus to `focus:border-[#555555]` and `focus:ring-0`.
- **Rationale**: Aligns with project-wide neutral input guidelines prohibiting yellow/magenta focus borders on text inputs.

## Risks / Trade-offs

- **[Risk]** Users who relied on pre-filled `admin` / `pass` will need their real credentials.
  → *Mitigation*: The SuperAdmin account (`superadmin`) was already provisioned via `npm run setup:admin`, and additional operators can be created in the User Management view.
