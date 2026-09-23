## 1. First-Time Location Gate & Background Scroll Lock

- [x] 1.1 Implement background scroll lock in `components/landing/FirstTimeCampusGate.tsx` disabling body/html scroll and touchmove while modal is open.
- [x] 1.2 Update `FirstTimeCampusGate.tsx` to default `forceShow={false}` and check `localStorage` so it only opens once on initial visit.
- [x] 1.3 Remove `forceShow={true}` prop from `<FirstTimeCampusGate />` in `app/page.tsx`.

## 2. Coordinated GSAP Scroll Choreography

- [x] 2.1 Implement deliberate entrance timeline in `components/landing/HeroSection.tsx` using `useGSAP` for headline, description, and action triggers.
- [x] 2.2 Implement GSAP ScrollTrigger fade-in and card cascade in `components/landing/PrototypeCarousel.tsx`.
- [x] 2.3 Implement GSAP ScrollTrigger reveal in `components/landing/HotspotShowcase.tsx` for primary showcase feature and beacons.
- [x] 2.4 Implement GSAP ScrollTrigger reveal in `components/landing/CampusLabExplorer.tsx` for section header, discipline bullets, and spotlight card.
- [x] 2.5 Implement GSAP ScrollTrigger reveal in `components/landing/MachineTelemetrySection.tsx` for stat counter block and machine card viewport.

## 3. Verification & Polish

- [x] 3.1 Verify TypeScript compilation with `npx tsc --noEmit`.
- [x] 3.2 Verify that the campus gate locks background scrolling, remembers selection, and does not re-open on refresh.
- [x] 3.3 Verify smooth, harmonious GSAP scroll entrance reveals across all sections on desktop and mobile.
