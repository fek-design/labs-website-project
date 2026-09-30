## MODIFIED Requirements

### Requirement: Agency Motion and Visual Toolkits
The system SHALL provide a centralized visual and motion architecture library (`lib/motion.ts` and `app/globals.css`) exposing standard motion variants, spring configurations, diagonal wave coordinate calculators, GSAP macro animation helpers strictly using `motion/react` and `gsap`, and a customized Tailwind CSS v4 neutral theme override that replaces default zinc grays with Zealand Labs authentic dark-neutral brand tokens (`#09090b` dock, `#151517` containers, `#202021` cards, `#262626`/`#333333`/`#444444` borders) while preserving CMYK telemetry accents (`#FFED00`, `#E6007E`, `#009FE3`). The system SHALL NOT depend on or include `anime.js` in the client runtime or build bundle.

#### Scenario: Using deliberate spring transitions
- **WHEN** UI elements animate, enter, or morph
- **THEN** components utilize predefined agency physics presets (`springGentle`, `springSnappy`, `springBouncy`) from `motion/react` with consistent damping and stiffness

#### Scenario: Diagonal coordinate wave stagger
- **WHEN** grid or matrix components (such as calendar heatmaps or bento cards) mount
- **THEN** the system provides coordinate-based delay calculation `getDiagonalWaveDelay(row, col, factor)` ensuring smooth 60fps wave transitions

#### Scenario: Exclusion of Anime.js
- **WHEN** inspecting client imports, component trees, and runtime dependencies
- **THEN** no module or component imports from `animejs`, `@types/animejs`, or legacy `lib/anime.ts`

#### Scenario: Brand neutral palette override in Tailwind theme
- **WHEN** components use Tailwind neutral or zinc utility classes (`text-zinc-400`, `bg-zinc-800`, `border-zinc-700`, `bg-zinc-900`)
- **THEN** styles render using Zealand Labs' custom brand dark-neutral scale defined in `@theme` in `app/globals.css` rather than Tailwind default slate-tinted zinc values, while preserving all CMYK telemetry accents (`brand-yellow`, `brand-pink`, `brand-cyan`).
