## 1. Database Alignment in Context & Headers

- [x] 1.1 Align `CampusKey` and `CAMPUS_DATA` in `components/landing/CampusContext.tsx` strictly to database locations `"køge" | "roskilde"`, adding fallback validation for legacy stored keys.
- [x] 1.2 Restrict campus selector options in `components/landing/LandingHeader.tsx` to `"køge"` and `"roskilde"`.

## 2. Gate CTA Button & Copy Refinements

- [x] 2.1 Update campus options in `components/landing/FirstTimeCampusGate.tsx` to only render `"køge"` and `"roskilde"`.
- [x] 2.2 Redesign the *"TRÆD IND"* button to use `rounded-none` (square corners) and compact padding (`px-8 py-3 text-sm sm:text-base tracking-wider uppercase font-semibold`).
- [x] 2.3 Update description copy in `FirstTimeCampusGate.tsx` with authentic Danish makerspace copy explaining open prototyping, gear checkout, and machine status.

## 3. Verification & Validation

- [x] 3.1 Verify TypeScript type safety with `npx tsc --noEmit`.
- [x] 3.2 Verify visual appearance of the square button, realistic Danish copy, and 2-location selector.
