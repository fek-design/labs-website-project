## Why

Currently, significant differentials exist between the backend data model and the user interfaces:
1. The landing page implements heuristic string-parsing to split Roskilde items into an artificial three-lab structure (including an unbacked "Dimselab") and forcibly reassigns borrowable gear from Makerspace to MediaLab.
2. Roskilde is currently out of development scope, creating maintenance overhead and confusing dual-campus selection flows for a single-campus launch.
3. The frontpage prototype showcase and hardware telemetry rely on static hardcoded items and fallback arrays rather than leveraging the rich database content curated by administrators.
4. The admin Machine Hub is hardcoded to Makerspace and detached from the global lab switcher.

Harmonizing the workspace strictly around the Køge campus (`Makerspace (Køge)` and `MediaLab (Køge)`) while providing an admin-curated frontpage showcase creates a unified, reliable user experience and a clean architecture that scales effortlessly when additional campuses launch in the future.

## What Changes

- **Decommission Roskilde Scope**: Focus active development, navigation, and landing UI strictly on Køge Campus (`Makerspace (Køge)` and `MediaLab (Køge)`), disabling the redundant first-time campus selection gate and simplifying the landing header location pill.
- **Admin-Curated Frontpage Prototypes**: Extend the craft prototyping model with an `isFeaturedOnFrontpage` flag (capped at 4–5 cards), allowing administrators in `CraftItemsManager` to toggle and curate which prototype projects are highlighted on the frontpage carousel.
- **Clean Database Hardware Telemetry**: Eliminate heuristic string matching (`location.includes("dimse")`) and forced hardware type reassignments in `app/page.tsx`. Hardware counts and machine listings will query the database directly by `lab.slug` (`makerspace` and `medialab`).
- **Admin Machine Hub Active Lab Synchronization**: Update `MakerspaceMachineHub` to accept `activeLab` context from `AdminConsoleClient`, allowing administrators to view and manage machines across facilities.
- **Admin Sidebar Streamlining**: Update `LAB_OPTIONS` in `AdminSidebarNav` to focus cleanly on the two operational facilities: `Makerspace (Køge)` and `MediaLab (Køge)`.

## Capabilities

### New Capabilities
<!-- None: all capabilities exist in the project -->

### Modified Capabilities
- `public-landing-portal`: Focus landing portal on Køge Campus, remove legacy multi-campus modal blocker, populate prototype carousel with admin-curated featured craft items, and query live hardware telemetry directly by macro lab foreign keys.
- `admin-navigation-and-dashboard`: Scope navigation dock lab switcher to Køge operational facilities (`Makerspace (Køge)` and `MediaLab (Køge)`).
- `pos-craft-blog-management`: Enable administrators in the Craft Items Manager to toggle and limit frontpage featured prototypes (max 5 cards) with immediate status feedback.
- `makerspace-machine-hub`: Synchronize Machine Hub equipment filtering with the active lab selection passed from the admin console.

## Impact

- **Affected Code**:
  - `app/page.tsx`: Replaced heuristic classification with direct `lab.slug` grouping; fetch featured craft articles.
  - `components/landing/LandingHeader.tsx`: Location indicator defaults to Køge Campus without popup switcher.
  - `components/landing/FirstTimeCampusGate.tsx`: Suppressed/bypassed for single-campus flow.
  - `components/landing/CampusContext.tsx`: Simplified default to Køge with Makerspace and MediaLab.
  - `components/landing/PrototypeCarousel.tsx`: Receives dynamic admin-curated featured craft cards with fallback.
  - `components/landing/MachineTelemetrySection.tsx`: Displays clean live telemetry for Makerspace and MediaLab.
  - `lib/craft-data.ts` & `data/crafts.json`: Added `isFeaturedOnFrontpage` and `featuredOrder` fields.
  - `components/admin/CraftItemsManager.tsx`: Added frontpage feature toggle with 5-item cap.
  - `components/admin/AdminSidebarNav.tsx`: Clean 2-way switcher between Makerspace and MediaLab.
  - `components/makerspace/MakerspaceMachineHub.tsx`: Accept `activeLab` prop and query dynamically.
- **Zero Cloud Impact**: Fully local MySQL and local JSON persistence; no third-party cloud dependencies.
