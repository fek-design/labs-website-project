## ADDED Requirements

### Requirement: Complete Craft Guides Static Generation
The system SHALL ensure that `data/crafts.json` contains full datasets for all active prototype craft items (`t-shirt`, `kop`, `mulepose`, `3d-print`, `plakat`) synchronized with `lib/craft-data.ts` so that `generateStaticParams()` pre-renders every craft route during build.

#### Scenario: Production build executes static generation
- **WHEN** `next build` processes `/craft/[slug]`
- **THEN** all 5 designated craft routes are built as static pages (`● /craft/t-shirt`, `● /craft/kop`, `● /craft/mulepose`, `● /craft/3d-print`, `● /craft/plakat`) with zero missing parameter warnings
