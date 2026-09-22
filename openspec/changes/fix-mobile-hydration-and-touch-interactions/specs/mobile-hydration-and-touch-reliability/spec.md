## Purpose

Ensures flawless client-side React 19 hydration, semantic HTML5 phrasing content validation, SSR visibility for animated sections, and responsive scroll transitions across real mobile devices.

## ADDED Requirements

### Requirement: Semantic HTML Phrasing Validation for Buttons
All interactive `<button>` elements SHALL contain strictly valid HTML phrasing content (e.g. `<span>`, `<svg>`) and SHALL NOT nest block/flow containers like `<div>`, preventing WebKit DOM re-parenting and React 19 hydration bailing.

#### Scenario: Mobile button hydration without DOM errors
- **WHEN** a mobile browser parses the landing page HTML
- **THEN** all `<button>` elements retain their original child tree structure without parser-induced re-parenting, allowing React 19 hydration to complete without throwing errors

### Requirement: SSR-Visible Motion Components
Animated list items and spotlight cards in `CampusLabExplorer.tsx` SHALL be configured with `initial={false}` so that initial server-rendered HTML is rendered with full opacity (`opacity: 1`), ensuring text and content are immediately visible prior to or during client hydration.

#### Scenario: Viewing lab explorer on initial page load
- **WHEN** user loads the landing page on a mobile device
- **THEN** bullet points and spotlight cards render with 100% visible text immediately without waiting for client-side JavaScript execution or being hidden at opacity 0

### Requirement: Cross-Browser Mobile Scroll Detection
The sticky navbar component SHALL monitor scroll position using cross-browser properties (`window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0`) and SHALL trigger the frosted background state once scroll position exceeds 60px on mobile viewports.

#### Scenario: Scrolling down on a mobile phone
- **WHEN** user scrolls past 60px on a touch screen
- **THEN** the navbar transitions from transparent to the frosted black backdrop (`bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl`) smoothly without lag

### Requirement: High-Contrast Lab Spotlight Typography
The dynamic lab spotlight card SHALL provide high-contrast foreground text across all campus lab color states (including Cyan, Magenta, and Yellow), ensuring legibility in mobile ambient light conditions.

#### Scenario: Inspecting Cyan or Magenta lab cards on mobile
- **WHEN** user views or selects a lab card with a bright CMYK accent background
- **THEN** the text contrast ratio remains compliant and clearly legible against the accent background
