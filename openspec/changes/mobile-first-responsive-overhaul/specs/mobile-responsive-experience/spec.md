## Purpose

Establishes a robust mobile-first responsive architecture across the public portal and administrative dashboard, ensuring touch ergonomics, adaptive typography, and zero horizontal viewport clipping on mobile devices.

## ADDED Requirements

### Requirement: Mobile Navigation and Touch Drawer
The public navigation header SHALL provide a touch-friendly interface on mobile viewports (< 768px), with minimum 44px by 44px tap targets for toggles, edge-constrained dropdown menus that do not overflow off-screen, and a scrollable mobile drawer menu.

#### Scenario: Mobile menu toggle tap
- **WHEN** user taps the hamburger button on a mobile device
- **THEN** the fullscreen mobile drawer opens with smooth animation, displaying navigation links with safe-area spacing, and allows vertical scrolling without clipping content on short screens

#### Scenario: Campus dropdown positioning on mobile
- **WHEN** user taps the campus selector pill on a mobile device
- **THEN** the dropdown menu opens within viewport boundaries without horizontal scrollbars or clipping off the right edge

### Requirement: Responsive Hero Section
The Hero section SHALL adaptively scale headline typography and minimum vertical heights on small viewports to prevent awkward line breaks, overlapping, or hidden call-to-action buttons.

#### Scenario: Viewing Hero on mobile screen
- **WHEN** user loads the landing page on a mobile device (320px to 430px width)
- **THEN** the headline renders cleanly in proportion (`text-3xl sm:text-5xl md:text-7xl`), and the call-to-action button is visible and fully interactive above the fold

### Requirement: Touch-Ergonomic Prototype Carousel
The Prototype Carousel SHALL support fluid finger-swiping on touch devices, using bleed margins (`-mx-6 px-6`) and scroll snapping so cards extend to the screen edge naturally without container margin clipping.

#### Scenario: Swiping prototypes on mobile
- **WHEN** user swipes horizontally through prototype cards on a mobile viewport
- **THEN** cards snap smoothly into position, touch response is immediate, and no horizontal scrollbar interferes with page scrolling

### Requirement: Scaled Showcase Cards and Boundary-Safe Hotspots
The Hotspot Showcase cards SHALL dynamically scale heights on mobile devices (`h-[380px] sm:h-[540px] md:h-[620px]`), and hotspot beacons SHALL provide at least a 44px hit-box while keeping tooltips within viewport edges when activated near screen boundaries.

#### Scenario: Tapping hotspot near mobile screen edge
- **WHEN** user taps an inspection beacon near the left or right margin of a mobile viewport
- **THEN** the beacon triggers its tooltip and keeps the tooltip text fully visible within the screen boundaries without causing horizontal page overflow

### Requirement: Responsive Lab Explorer and Spotlight Stacking
The Prototyping & Understøttelse lab explorer SHALL stack the spotlight card header on mobile (`flex flex-col sm:flex-row gap-3`) so lab titles and campus tags do not collide, and lab tabs SHALL accommodate mobile touch selection.

#### Scenario: Switching labs on mobile
- **WHEN** user selects a lab tab on a mobile screen
- **THEN** the tab indicator highlights smoothly, the spotlight card updates its CMYK color and content, and titles/tags wrap without truncation or overflow

### Requirement: Mobile Telemetry Stacking and Touch Controls
The Machine Telemetry section SHALL stack stat counters and machine status cards vertically on mobile viewports, wrap machine metadata cleanly, and allow users to pause or inspect autoscrolling machine cards on touch interaction.

#### Scenario: Viewing machines on mobile
- **WHEN** user scrolls to the machine telemetry section on a mobile device
- **THEN** the machine counter displays legibly above the autoscrolling card container, and status badges remain visible without being truncated by long machine names

### Requirement: Mobile Admin Dashboard Header and Bento Grid
The administrative dashboard (`/admin`) SHALL adapt its header into a responsive layout on mobile screens, stacking or shrinking navigation links comfortably, and display bento grid cards in a single touch-friendly column.

#### Scenario: Navigating admin portal on mobile
- **WHEN** an administrator accesses `/admin` from a mobile phone
- **THEN** the header links to "Public Portal" and "Launch POS Desk" remain fully tappable and distinct, and dashboard cards stack in a single column with comfortable margins
