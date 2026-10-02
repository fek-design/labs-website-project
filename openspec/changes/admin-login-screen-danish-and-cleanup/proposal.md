## Why

The administrative login screen (`components/auth/AuthGate.tsx`) currently displays temporary hardcoded demo credentials (`admin` / `pass`) that are now obsolete and misleading following our production security hardening. In addition, the interface contains untranslated English copy ("Staff Console Gate", "Unlock Admin Console →", "Username", "Password") and pre-fills credentials. Translating the entire gate into clear Danish, renaming the submit button to "Log ind", removing temporary demo badges, and clearing pre-filled inputs ensures a polished, production-ready operator entry point.

## What Changes

- **Submit Button Copy**: Change the CTA button text from `"Unlock Admin Console →"` / `"Authenticating..."` to `"Log ind"` / `"Logger ind..."`.
- **Remove Demo Credentials**: Completely remove the "Temporary Demo Credentials" preset helper banner (`admin` / `pass`).
- **Clear Form Defaults**: Initialize `usernameInput` and `passwordInput` to empty strings `""` instead of hardcoded `"admin"` and `"pass"`.
- **Full Danish Translation**:
  - Verification loader: `"Verificerer lokal sikkerhedstoken..."`
  - Screen title: `"Personale Login"` (or `"LABS Adgangsport"`)
  - Subtitle: `"Zealand Labs Offline Administrationsprotokol (Køge)"`
  - Input labels: `"Brugernavn"` and `"Adgangskode"`
  - Error fallback: `"Kunne ikke godkende legitimationsoplysninger."`
- **Design Consistency**: Update input focus borders to neutral styling (`border-[#262626] focus:border-[#555555]`) avoiding harsh yellow rings.

## Capabilities

### New Capabilities
- `admin-auth-gate`: Presentation, Danish localization, clean form defaults, and authentication trigger on the administrative login gate (`components/auth/AuthGate.tsx`).

### Modified Capabilities
<!-- None -->

## Impact

- **UI Components**: `components/auth/AuthGate.tsx`
- **User Flow**: Administrative staff logging into `/admin/pos` and administrative workspaces.
- **Dependencies & Backends**: Zero impact on server action APIs (`loginAdmin` and session management remain unchanged).
