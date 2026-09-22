## Why

The location picker currently displays placeholder locations from the initial Figma mockup (Næstved and Holbæk) that do not exist in the Zealand Labs database, and uses an oversized rounded pill button that deviates from the project's Tier 1 architectural square geometry. Furthermore, the Danish descriptive copy needs refinement to match authentic university makerspace standards (such as DTU Skylab and ITU FabLab), clearly articulating how campus selection customizes real-time machine telemetry, equipment loans, and open workshop access.

## What Changes

- **Database-Aligned Campuses**: Restrict campus options in `CampusContext.tsx`, `LandingHeader.tsx`, and `FirstTimeCampusGate.tsx` to actual locations configured in the database: **Køge** and **Roskilde**.
- **Architectural CTA Styling (No Border Radius & Compact Footprint)**:
  - Redesign the *"TRÆD IND"* button to have sharp corners (`rounded-none` / `border-radius: 0px`) per the Scandinavian functionalist Tier 1 geometry system.
  - Reduce button footprint to a more compact, balanced scale (`px-8 py-3 text-sm tracking-wider uppercase font-semibold`).
- **Authentic Professional Danish Copy**:
  - Replace generic placeholder text with industry-grade Danish copy communicating Zealand Labs' multidisciplinary mission, explaining that selecting a campus customizes live telemetry, machine availability, and equipment loan catalogs.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `campus-onboarding-gate`: Updates campus selection to strictly match database records (Køge and Roskilde), updates button geometry to sharp square (`rounded-none`), and improves contextual copy.

## Impact

- **Components**:
  - `components/landing/FirstTimeCampusGate.tsx`: Updated button geometry, authentic copy, and campus list.
  - `components/landing/CampusContext.tsx`: Restricted `CampusKey` and `CAMPUS_DATA` to `"køge" | "roskilde"`.
  - `components/landing/LandingHeader.tsx`: Updated campus dropdown items.
- **Database Alignment**: Zero discrepancies between client-side campus selection and backend `Lab` records in Prisma.
