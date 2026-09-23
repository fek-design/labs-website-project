## Context

The Zealand Labs public portal currently loads directly to the hero section on all visits, defaulting to "Køge" without giving new students or visitors an explicit, branded choice of regional campus. According to Figma design node `144:462` ("Intro"), first-time visitors must be presented with an atmospheric location gate where they choose their nearest campus (Køge, Roskilde, Næstved, Holbæk) and enter the site via the *"TRÆD IND"* action.

## Goals / Non-Goals

**Goals:**
- Provide an atmospheric, high-fidelity first-time onboarding gate matching Figma node `144:462`.
- Clearly present Zealand Labs identity with prominent typography (`Stack Sans Notch`) and dark cinematic background styling.
- Allow fluid selection between all 4 regional campuses: Køge, Roskilde, Næstved, and Holbæk.
- Persist user preference in `localStorage` under `zealand_labs_campus_selected`.
- Animate gate departure smoothly using `motion/react` with zero layout jump or hydration flashing.
- Keep campus selection synchronised with `CampusContext` and `LandingHeader`.

**Non-Goals:**
- Geo-location IP tracking or automatic browser GPS permissions (violates Zero Cloud Dependency / privacy principles).
- Mandatory re-prompting on every session (it is strictly for first-time visitors or until user clears browser data).

## Decisions

### 1. Client-Side `localStorage` Storage with SSR Hydration Safety
- **Choice**: Store campus preference in `localStorage` under key `zealand_labs_campus_selected`. In `FirstTimeCampusGate.tsx`, wait until after hydration (`useEffect` / `hasMounted`) before evaluating whether to present the gate.
- **Rationale**: Prevents SSR hydration mismatches in Next.js App Router while adhering to Zero Cloud Dependency (no server cookies or edge middlewares required).
- **Alternative considered**: Server cookies and middleware redirect. Rejected because it complicates local offline caching and static export flexibility without added benefit.

### 2. Full Regional Campus Support in `CampusContext`
- **Choice**: Extend `CampusKey` in `CampusContext.tsx` from `"køge" | "roskilde"` to `"køge" | "roskilde" | "næstved" | "holbæk"`. Populate `CAMPUS_DATA` with lab configurations and default spotlight metadata for Næstved and Holbæk as well.
- **Rationale**: Enables any campus selected during the intro gate to seamlessly feed real data into the rest of the landing page (CampusLabExplorer, HeroSection, Header).
- **Alternative considered**: Mapping unconfigured campuses to a fallback. Rejected because having complete data for all 4 campuses prevents runtime errors.

### 3. Visual Layout Structure Derived from Figma Node 144:462
- **Structure**:
  - Container: Fixed full-screen viewport `fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12`.
  - Background Layer: Media backdrop with dark overlay (`rgba(0,0,0,0.81)` + `backdrop-blur-[2px]`).
  - Top Bar: Brand header with `ZEALAND` mark + `LABS` in `Stack Sans Notch`.
  - Center Display: Dynamic headline *"Vælg Campus nærest dig:"* with large 48px–64px animated readout of the active campus name.
  - Bottom Controls: Interactive row of campus labels with horizontal scroll support on small screens, paired with a high-contrast pill CTA *"TRÆD IND"*.
- **Motion**:
  - Campus switching: subtle layout transition or fade.
  - Gate dismissal: `AnimatePresence` with `opacity: 0, scale: 1.04, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }`.

## Risks / Trade-offs

- **[Hydration Flash]** Initial mount check could cause a brief micro-flash before gate opens.
  → *Mitigation*: Mount the gate component with initial hidden state, resolving `showGate` synchronously in `useEffect` and rendering with a smooth fade-in.
- **[Campus without active makerspace]** Some regional campuses may share equipment or have distinct setups.
  → *Mitigation*: Ensure `CAMPUS_DATA` provides valid fallback labs (Makerspace & Medialab) for all 4 campus keys so downstream components never crash.
