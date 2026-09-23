## Why

When students, staff, and visitors first visit Zealand Labs from a new device, they need an immediate, prominent entry point to select the campus closest to them (Køge, Roskilde, Næstved, Holbæk). This personalizes their makerspace and medialab telemetry, equipment catalog, and workshop availability. Basing this experience on the Figma design ("Intro" node `144:462`), this first-time gate establishes the unmistakable Zealand Labs identity upfront with high-contrast typography, brand darkness, and tactile location selection before smoothly entering the main landing portal.

## What Changes

- **First-Time Device Detection**: Implement client-side detection (via `localStorage` and `CampusContext`) to determine if the device has previously chosen a campus or visited the site.
- **Atmospheric Full-Screen Gate ("Intro" Screen)**: Recreate the Figma intro frame (`144:462`) featuring:
  - Prominent **ZEALAND LABS** branding with authentic typographic hierarchy ('Stack Sans Notch' / brand header).
  - Background mood with dark gradient/video/blurred media overlay (`rgba(0,0,0,0.8)` with subtle blur).
  - Focus headline: *"Vælg Campus nærest dig:"* with large dynamic campus readout.
  - Interactive campus picker row: Køge, Roskilde, Næstved, Holbæk with clear active states and seamless selection feedback.
  - Primary entry CTA: *"TRÆD IND"* (Step inside) button with tactile motion.
- **Campus Context Expansion**: Update `CampusContext` to support all regional campuses (Køge, Roskilde, Næstved, Holbæk), storing user selection persistently and allowing subsequent re-selection from the navigation bar.
- **Smooth Transition Animation**: Deliver a cinematic exit animation when clicking *"TRÆD IND"*, gracefully revealing the main landing page.
- **Bypass & Persistence**: Subsequent visits by the device bypass the gate automatically while keeping the preference active in `CampusContext`.

## Capabilities

### New Capabilities
- `campus-onboarding-gate`: Fullscreen first-time onboarding gate that prompts new devices to select their closest Zealand campus, persists their choice locally, and transitions into the customized landing page.

### Modified Capabilities
<!-- No requirement changes to existing capabilities -->

## Impact

- **Components**: New `FirstTimeCampusGate.tsx` component mounted conditionally in `app/page.tsx` or `CampusContext.tsx`.
- **State/Context**: Updates to `components/landing/CampusContext.tsx` to include `localStorage` persistence, initial visit tracking, and support for the full set of Zealand campuses (`køge`, `roskilde`, `næstved`, `holbæk`).
- **Dependencies**: Uses existing `motion/react` and `lib/motion.ts` for entrance and exit transitions; zero new external dependencies required.
- **Zero Cloud Mandate**: Fully maintained locally in the client browser with zero cloud or tracking cookies.
