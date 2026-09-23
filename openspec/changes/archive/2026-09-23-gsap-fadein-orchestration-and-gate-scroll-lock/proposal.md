## Why

While individual landing page components possess micro-interactions, the macro user journey currently lacks a unified, deliberate entrance choreography as the user traverses the page. Implementing subtle, human-placed GSAP ScrollTrigger animations across sections creates a cohesive narrative that guides user attention without distraction. Concurrently, the first-time campus selection screen (`FirstTimeCampusGate`) is currently forced on every page reload (`forceShow={true}`) and fails to lock background page scrolling, allowing accidental scrolling underneath the modal.

## What Changes

- **Page-Wide Coordinated GSAP Choreography**:
  - Implement deliberate, human-paced entrance animations across all landing page sections using `gsap`, `@gsap/react` (`useGSAP`), and `ScrollTrigger`:
    - **Hero Section**: Staggered typography and CTA entrance timeline on initial mount.
    - **Prototype Carousel**: Coordinated header reveal and gentle sequential card cascade (`stagger: 0.08`, `ease: "power2.out"`).
    - **Hotspot Showcase**: Smooth opacity and rise reveal of the primary textile feature card and hotspot beacons as they enter the viewport.
    - **Campus Lab Explorer**: Synchronized entrance of section headers, discipline bullet points, and CMYK spotlight card.
    - **Machine Telemetry Section**: Unified entrance of the big metric counter and clipped card viewport with scroll scrub or trigger.
  - Enforce hardware acceleration (`transform` and `opacity` only) and automatic cleanup via `useGSAP()` scoping.
- **First-Time Location Gate True Single-Show Behavior**:
  - Remove forced display (`forceShow={true}`) in `app/page.tsx`, ensuring the gate only appears when no campus selection is found in `localStorage` (`STORAGE_KEY_CAMPUS`).
  - Once "TRÆD IND" is clicked, persist the selection and ensure the gate never interrupts subsequent visits or internal navigations.
- **Background Scroll Locking When Gate Is Active**:
  - While `FirstTimeCampusGate` is displayed, deactivate page scrolling by locking `overflow: hidden` on `document.body` and `document.documentElement` with iOS touch-action handling.
  - Cleanly restore normal scrolling once the campus is confirmed or the component unmounts.

## Capabilities

### New Capabilities
- `landing-motion-choreography`: Coordinated GSAP scroll choreography across landing page sections and background scroll locking during active modal gating.

### Modified Capabilities
<!-- None -->

## Impact

- **Components**:
  - `components/landing/FirstTimeCampusGate.tsx`: Implement body scroll lock when open; check `localStorage` correctly when `forceShow` is omitted.
  - `app/page.tsx`: Remove `forceShow={true}` to allow authentic first-time-only appearance.
  - `components/landing/HeroSection.tsx`: Add GSAP coordinated entrance timeline.
  - `components/landing/PrototypeCarousel.tsx`: Add GSAP ScrollTrigger card stagger.
  - `components/landing/HotspotShowcase.tsx`: Add GSAP ScrollTrigger reveal.
  - `components/landing/CampusLabExplorer.tsx`: Add GSAP ScrollTrigger reveal.
  - `components/landing/MachineTelemetrySection.tsx`: Add GSAP ScrollTrigger reveal for metric counter and ticker viewport.
