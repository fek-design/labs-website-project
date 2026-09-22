## Why

The current home page (`/`) serves as a basic internal admin launchpad rather than a public-facing portal. A high-fidelity mobile landing page design has been created in Figma (`frame 144:78`) showcasing Zealand Labs' facilities, student prototype inspiration, interactive project hotspots, and live machine availability. 

The existing admin dashboard remains an essential tool for staff managing gear, machines, and loans. Therefore, the admin dashboard will be preserved and relocated to its dedicated route at `/admin`, while the public-facing landing page takes over `/`.

## What Changes

- **Relocate Admin Dashboard to `/admin`**: Move the existing admin launchpad from `app/page.tsx` to `app/admin/page.tsx` (`/admin`), maintaining full access to loan counters, machine metrics, inventory links, and POS launch actions.
- **New Public Landing Portal at `/`**: Deploy the student- and visitor-facing Zealand Labs landing page aligned with Figma frame `144:78` on the root route.
- **Hero & Navigation**: Implement top brand navigation (`LABS`, campus location selector e.g. `køge`, hamburger navigation) and full-height visual hero with `Zealands Kreative hjørne` typography and `UDFORSK` CTA.
- **Marquee Ticker**: Infinite horizontal running ticker celebrating `DIMSELAB • MAKERSPACE • MEDIALAB`.
- **Prototype Filter Carousel**: "Din næste prototype starter her" carousel showcasing equipment products (`Kop`, `Mulepose`, `T-Shirt`).
- **Interactive Hotspot Showcase**: Gallery cards featuring student work with clickable hotspot beacons revealing equipment details (e.g., "Print på T-Shirt ↳").
- **Prototyping & Understøttelse Overview**: Value proposition section with stepped progress tabs.
- **Featured Lab Highlight**: High-contrast brand cyan (`#009FE3`) focal card highlighting Makerspace offerings.
- **Live Hardware Telemetry**: "Vi har sikkert en maskine til dit formål" section with machine counts (`10+ Maskiner`) and live status cards queried directly from Prisma.
- **Brand Cyan Footer**: Responsive footer displaying brand mission statement and lab directory links (`MAKERSPACE`, `MEDIALAB`, `DIMSELAB`).

## Capabilities

### New Capabilities
- `public-landing-portal`: The public-facing Zealand Labs landing page experience, including hero, prototype carousel, interactive project hotspots, lab spotlights, machine availability, and campus navigation.

### Modified Capabilities

## Impact

- **UI / Routes**: 
  - `app/admin/page.tsx` [NEW]: Houses the migrated admin launchpad previously on `/`.
  - `app/page.tsx` [MODIFIED]: Hosts the new public landing page experience.
  - `components/landing/` [NEW]: Modular landing components (Hero, Marquee, HotspotShowcase, PrototypeCarousel, Telemetry, Footer).
- **Database / Queries**: Connects machine status cards to existing Prisma `inventory` records (`hardwareType: "STATIC_MACHINE"`).
- **Design Tokens & Fonts**: Utilizes Zealand Labs typography (`Stack Sans Notch`, `Stack Sans Text`) and CMYK brand accents (`#009FE3`, `#000000`, `#FFFFFF`).
- **Motion & Interactions**: Incorporates micro-interactions via `motion/react` (tooltips, smooth carousel scrolling, hotspot pulse beacons).
