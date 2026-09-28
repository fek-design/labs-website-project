## 1. Scope Realignment & Decommissioning Roskilde in UI

- [x] 1.1 In `components/landing/LandingHeader.tsx`, display `Køge Campus` as a steady location badge and remove the Roskilde option from the dropdown.
- [x] 1.2 In `components/landing/FirstTimeCampusGate.tsx`, suppress/bypass the first-time modal gate so visitors immediately enter the Køge landing view.
- [x] 1.3 In `components/landing/CampusContext.tsx`, simplify default campus to `køge` with `makerspace` and `medialab`.
- [x] 1.4 In `components/admin/AdminSidebarNav.tsx`, update `LAB_OPTIONS` to exclusively feature `Makerspace (Køge)` and `MediaLab (Køge)`.

## 2. Admin-Curated Frontpage Prototypes

- [x] 2.1 Update `CraftItemData` interface in `lib/craft-data.ts` and `data/crafts.json` to include `isFeaturedOnFrontpage?: boolean` and `featuredOrder?: number`.
- [x] 2.2 Add frontpage feature toggle controls in `components/admin/CraftItemsManager.tsx` with a strict 5-card maximum validation cap and instant toast feedback.
- [x] 2.3 Update `app/actions/crafts.ts` with a `toggleFeatureOnFrontpage` server action ensuring atomic persistence to `data/crafts.json`.

## 3. Frontpage Dynamic Prototype Showcase Integration

- [x] 3.1 Update `app/page.tsx` to fetch featured craft articles via `getCraftArticles()` and pass them to `PrototypeCarousel`.
- [x] 3.2 Update `components/landing/PrototypeCarousel.tsx` to render the dynamic curated cards linking to `/craft/[slug]`, with a graceful fallback to top catalog items if none are marked.

## 4. Relational Hardware Telemetry & Machine Hub Synchronization

- [x] 4.1 Refactor inventory queries in `app/page.tsx` to eliminate `item.location` heuristic string parsing and forced `BORROWABLE_GEAR` reassignments, partitioning cleanly by `lab.slug` (`makerspace` and `medialab`).
- [x] 4.2 Update `components/landing/MachineTelemetrySection.tsx` to render telemetry cards for Makerspace and MediaLab.
- [x] 4.3 Update `components/makerspace/MakerspaceMachineHub.tsx` to accept `activeLab` as a prop and dynamically query machines matching the active lab context.

## 5. Validation & Verification

- [x] 5.1 Run TypeScript compilation validation (`npx tsc --noEmit`).
- [x] 5.2 Validate OpenSpec change (`openspec validate harmonize-koge-frontpage-and-admin`).
