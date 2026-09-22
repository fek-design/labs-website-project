# Visual Toolkits Capability Specification

## Requirements

### Requirement: Agency Motion and Visual Toolkits
The system SHALL provide a centralized visual and motion architecture library (`lib/motion.ts` and `app/globals.css`) exposing standard motion variants, spring configurations, diagonal wave coordinate calculators, and GSAP macro animation helpers for `motion/react` and `gsap`.

#### Scenario: Using deliberate spring transitions
- **WHEN** UI elements animate, enter, or morph
- **THEN** components utilize predefined agency physics presets (`springGentle`, `springSnappy`, `springBouncy`) with consistent damping and stiffness

#### Scenario: Diagonal coordinate wave stagger
- **WHEN** grid or matrix components (such as calendar heatmaps or bento cards) mount
- **THEN** the system provides coordinate-based delay calculation `getDiagonalWaveDelay(row, col, factor)` ensuring smooth 60fps wave transitions

### Requirement: OpenSpec Visual Mockup Reference Directory
The system SHALL maintain a dedicated `openspec/mockups/` folder supporting PDF and image formats (PNG, JPG, WEBP, SVG), and the OpenSpec configuration SHALL reference this directory in global prompts to ensure pixel-accurate UI recreation.

#### Scenario: Referencing mockups during proposals and implementation
- **WHEN** an OpenSpec change is proposed or applied
- **THEN** the AI agent inspects available mockups in `openspec/mockups/` to replicate layouts, typography, and color contracts accurately

### Requirement: IKEA-Inspired Hairline Border System
The system SHALL apply clean, minimalist Scandinavian hairline borders (crisp 1px solid borders in neutral subtle tones such as `#dfdfdf` / `border-zinc-200` on light surfaces and `rgba(255,255,255,0.12)` / `border-white/10` on dark surfaces) across modular cards, showcase frames, carousel slides, and tab dividers, mimicking the architectural border language of IKEA's digital experience without heavy drop shadows.

#### Scenario: Rendering modular cards and carousel items
- **WHEN** cards or showcase items render on the landing page
- **THEN** they display crisp 1px hairline borders (`border-zinc-200` on white surfaces or `border-white/10` on dark surfaces) with minimal elevation, clean outline definition, and high visual clarity

### Requirement: IKEA Corner Geometry Hierarchy (Square vs Rounded Degrees)
The system SHALL strictly enforce a three-tier corner geometry hierarchy derived from Scandinavian functionalist design (IKEA digital design language):
1. **Tier 1: Architectural Sharp / Square (`0px` / `rounded-none`)**:
   - Primary call-to-action buttons (e.g., "UDFORSK" button in HeroSection) SHALL have square corners (`rounded-none` / `border-radius: 0px`) to provide an architectural, bold, functional anchor.
   - Large media showcase containers and image frames (e.g., feature images in `HotspotShowcase.tsx`) SHALL have square corners (`rounded-none` / `border-radius: 0px`) with 1px hairline borders.
2. **Tier 2: Subtle Modular Rounded (`6px`–`8px` / `rounded-md` to `rounded-lg`)**:
   - Standalone product cards (e.g., prototype carousel cards in `PrototypeCarousel.tsx`) SHALL have subtle rounded corners (`rounded-md` / `border-radius: 6px`) with 1px hairline borders (`#DFDFDF`).
   - Floating popover menus and dropdowns (e.g., campus selector in `LandingHeader.tsx`) SHALL have `rounded-lg` (`border-radius: 8px`).
   - Informational spotlight cards (e.g., lab spotlight in `CampusLabExplorer.tsx`) SHALL have `rounded-lg` (`border-radius: 8px`).
3. **Tier 3: Full Pill Organic (`9999px` / `rounded-full`)**:
   - Status chips, campus badge pills, circular icon buttons, and beacon triggers SHALL utilize `rounded-full` (`border-radius: 9999px`).
   - Cards and structural sections SHALL NOT use `rounded-2xl`, `rounded-3xl`, or full pill radius.

#### Scenario: User views hero CTA button
- **WHEN** the primary CTA button in `HeroSection.tsx` renders
- **THEN** it renders with sharp square corners (`rounded-none` / `border-radius: 0px`) and 1px crisp outline

#### Scenario: User views prototype carousel cards
- **WHEN** modular prototype cards render in `PrototypeCarousel.tsx`
- **THEN** they display with subtle `rounded-md` (6px) corners and 1px hairline borders (`#DFDFDF`) without heavy shadows

#### Scenario: User views showcase image frames
- **WHEN** editorial showcase frames render in `HotspotShowcase.tsx`
- **THEN** they display with architectural square corners (`rounded-none`) and crisp 1px hairline borders

#### Scenario: User views campus selection pills and badges
- **WHEN** location status chips, beacon triggers, or campus switcher pills render
- **THEN** they display with full pill geometry (`rounded-full`)

### Requirement: Showcase Section Breathing Room and Unclipped Interactive Overlays
The system SHALL provide generous vertical padding across the editorial showcase section (`#showcase` having `pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24`) to ensure visual separation between the prototype carousel and dark telemetry modules. Parent showcase card containers SHALL NOT apply `overflow-hidden` constraints to interactive popovers, allowing beacon popup cards to render at their exact anchor coordinates without being clipped by card borders.

#### Scenario: User views showcase section spacing
- **WHEN** the showcase section renders on the landing page
- **THEN** it displays with spacious top and bottom vertical padding (`pt-8 sm:pt-12 md:pt-16` and `pb-16 sm:pb-24`), creating clear breathing room between adjacent sections

#### Scenario: User interacts with beacons near container boundaries
- **WHEN** a user activates a beacon located near the top or lateral edges of a showcase card
- **THEN** the popup inspection card renders fully visible at its natural anchor position without clipping by the parent card's boundary

### Requirement: Tactile Spring Physics for Hotspot Popovers
The system SHALL animate hotspot inspection popovers using spring physics from `motion/react` (utilizing `springBouncy` or high-stiffness low-damping spring curves) to deliver a lively, tactile bounce upon mounting and dismounting.

#### Scenario: Hotspot beacon trigger activated
- **WHEN** a user hovers or taps on an interactive hotspot beacon
- **THEN** the popover card scales and translates into view with responsive spring physics settling with a crisp bounce



