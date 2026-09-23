## 1. Campus State and Context Expansion

- [x] 1.1 Expand `CampusKey` in `components/landing/CampusContext.tsx` to include `"køge" | "roskilde" | "næstved" | "holbæk"` and provide lab details in `CAMPUS_DATA`.
- [x] 1.2 Add persistent storage syncing in `CampusContext.tsx` reading and saving to `localStorage` key `zealand_labs_campus_selected`.

## 2. Onboarding Gate Component (Figma Node 144:462)

- [x] 2.1 Create `components/landing/FirstTimeCampusGate.tsx` implementing the full-screen atmospheric overlay matching Figma frame `144:462`.
- [x] 2.2 Implement prominent Zealand Labs branding header with `Stack Sans Notch` typography and dark media backdrop.
- [x] 2.3 Implement the dynamic *"Vælg Campus nærest dig:"* headline and large responsive active campus display.
- [x] 2.4 Implement the horizontal campus selection controls for all 4 campuses with active indicator states and accessibility support.
- [x] 2.5 Implement the *"TRÆD IND"* primary action button with tactile press feedback and exit transition via `motion/react`.

## 3. Integration & Navigation Synchronization

- [x] 3.1 Mount `FirstTimeCampusGate` conditionally in `app/page.tsx` ensuring SSR hydration safety without layout flashing.
- [x] 3.2 Update campus switcher in `components/landing/LandingHeader.tsx` to display all 4 regional campuses and synchronize updates with `localStorage`.

## 4. Verification and Validation

- [x] 4.1 Test first-time visitor experience (empty `localStorage`) to confirm the gate opens reliably with Figma fidelity.
- [x] 4.2 Test selection of each campus and dismissal via *"TRÆD IND"*, verifying smooth exit animation and updated context telemetry.
- [x] 4.3 Test subsequent page reloads to confirm the gate is bypassed and the selected campus preference persists.
