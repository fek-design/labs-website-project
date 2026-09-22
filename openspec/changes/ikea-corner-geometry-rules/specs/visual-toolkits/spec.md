## ADDED Requirements

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
