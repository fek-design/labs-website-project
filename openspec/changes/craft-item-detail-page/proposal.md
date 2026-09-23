## Why

Students and patrons discovering Zealand Labs see prototypes and finished products (such as custom apparel, tote bags, and mugs) on the landing page, but lack a clear, actionable guide explaining how each item is made, which labs and machines to use, prerequisites (what materials to bring, estimated time, skill level), and relevant equipment manuals. Creating a dedicated craft item detail page based on Figma frame `144:203` bridges this gap, orchestrating and maintaining user attention with fluid `motion/react` animations to guide students from curiosity to hands-on making.

## What Changes

- **Dedicated Craft Item Detail Route (`/craft/[slug]`)**: Implement dynamic item pages for showcase items starting with `t-shirt` (and extensible to other carousel items), retaining Zealand Labs design system tokens (Brand Black floor `#000000`, CMYK accents `#009FE3`, Stack Sans typography, sharp geometric cards).
- **Hero & Location Header**: High-impact visual header with full-bleed product photography, large typography, and dynamic lab availability badges (Makerspace Køge & Dimselab Roskilde) with opening hours.
- **Prerequisites Block ("FORUDSÆTNINGER")**: Signature Cyan (`#009FE3`) alert section detailing material requirements (e.g., bring your own cotton/poly), estimated time (15–45 min), and difficulty level (Begynder-venligt).
- **Interactive Process / Type Selector ("Type")**: Tabbed interface allowing users to switch between execution processes (e.g., `Print` vs. `Broderi`) with smooth `layoutId` indicator animations and reactive content updates.
- **Machine & Technical Specifications Showcase**: Card display of machines used for each process (e.g., Roland BN-20, Brother GTX, embroidery stations), detailing maximum printable dimensions, required file formats, run times, and material recommendations.
- **Marquee Laboratory Divider**: Infinite running text ribbon (`DIMSELAB • MAKERSPACE • MEDIALAB`) connecting sections.
- **Community Inspiration Showcase ("Andre har lavet")**: Curated visual gallery of real student creations with execution time badges and process tags.
- **Relevant Manuals Section ("Relevante Manualer")**: Quick-reference card grid linking directly to verified machinery SOPs and file preparation guides (e.g., BN-20, GS-24, Varmepresser, Filopretning).
- **Motion.js Attention Orchestration**: Implement purposeful micro-interactions and scroll-driven attention cues using `motion/react` (staggered section entrances, interactive tab transitions, subtle pulse indicators on prerequisites).
- **Landing Page Prototype Carousel Integration**: Wire up `PrototypeCarousel.tsx` cards to navigate seamlessly to the corresponding `/craft/[slug]` page.

## Capabilities

### New Capabilities
- `craft-item-detail`: Detailed public craft item showcase detailing step-by-step production methods, machine specifications, prerequisite requirements, relevant manuals, and community inspiration with motion-driven UX.

### Modified Capabilities
<!-- None -->

## Impact

- **Routes**:
  - `app/craft/[slug]/page.tsx`: Dynamic route for craft item detail view.
- **Components**:
  - `components/craft/CraftItemView.tsx`: Core interactive item page orchestrator.
  - `components/craft/CraftHero.tsx`: Hero visual and location availability badges.
  - `components/craft/CraftPrerequisites.tsx`: Cyan high-contrast prerequisites card.
  - `components/craft/CraftProcessSelector.tsx`: Interactive process switcher (`Print` vs. `Broderi`) with machine specs.
  - `components/craft/CraftInspirationGallery.tsx`: Visual community creations showcase.
  - `components/craft/CraftManualsSection.tsx`: Machine SOP manual links.
  - `components/landing/PrototypeCarousel.tsx`: Convert cards into clickable links to `/craft/[slug]`.
- **Data**:
  - `lib/craft-data.ts`: Structured catalog of craft items, processes, machines, specifications, inspiration images, and linked manual references.
