## 1. CMYK Lab Identity & Theme Tokens

- [x] 1.1 Define CMYK color tokens and lab mappings in `CampusContext.tsx` (Makerspace: Cyan `#009FE3`, Medialab: Magenta/Pink `#E6007E`, Dimselab: Yellow `#FFED00`)
- [x] 1.2 Define semantic color tokens and vertical autoscroll animation utilities in `app/globals.css`

## 2. White Background Transition & Inverted Section Styling

- [x] 2.1 Halt and remove the temporary SVG pixel transition in `HotspotShowcase.tsx`
- [x] 2.2 Update `CampusLabExplorer.tsx` with white background (`bg-white`), dark typography, inverted cards, and dynamic CMYK indicator lines
- [x] 2.3 Update `HotspotShowcase.tsx` with light theme card surfaces, high-contrast text, and synchronized CMYK spotlight highlights
- [x] 2.4 Update `app/page.tsx` and the footer layout to provide a seamless light transition from *Prototyping & Understøttelse* downward

## 3. Autoscrolling Clipped 3-Card Machine Telemetry

- [x] 3.1 Refactor `MachineTelemetrySection.tsx` to a fixed ~3-card height viewport with `overflow-hidden` (content clipping, zero scrollbars)
- [x] 3.2 Implement a continuous dual-track vertical auto-scroll ticker with pause-on-hover interaction
- [x] 3.3 Style telemetry cards for the light section context (`bg-zinc-50`, `border-zinc-200`, dark labels, live status indicators)

## 4. Verification & Validation

- [x] 4.1 Run `npx tsc --noEmit` and `npx eslint` to verify complete type safety and code cleanliness
- [x] 4.2 Verify autoscroll smoothness, content clipping, and CMYK lab switching across Køge and Roskilde
