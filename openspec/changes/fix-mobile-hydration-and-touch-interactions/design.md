## Context

See `proposal.md` for motivation. On real mobile devices, interactive components were completely unresponsive, elements and text in the lab section remained invisible, and the sticky navbar stayed transparent. This was traced to three interlocked factors:
1. HTML5 phrasing content errors: `<button>` tags containing `<div>` elements, which causes WebKit's HTML parser to re-parent elements and triggers React 19 hydration failure. When hydration fails, client-side event listeners are never attached.
2. Motion SSR initialization: `<motion.ul>` and `<motion.div>` rendered on the server with `initial={{ opacity: 0 }}`. Without client-side hydration, these elements remained stuck at `opacity: 0`.
3. High scroll threshold: A fixed `window.scrollY > 100` threshold that failed to activate during mobile momentum scrolling.

## Goals / Non-Goals

**Goals:**
- Eliminate all HTML phrasing content violations to ensure 100% clean React 19 hydration on mobile WebKit.
- Ensure all text and elements in the lab explorer section render with 100% opacity in server HTML (`initial={false}`).
- Make the navbar scroll listener responsive across all mobile touch devices with a cross-browser scroll position check and 60px threshold.
- Ensure all click and touch interactions (hamburger menu, campus selector, lab tabs, hotspot beacons) execute immediately.
- Enforce high text contrast across all lab spotlight accent cards.

**Non-Goals:**
- Do not disable Motion animations on tab switching or menu opening.
- Do not modify administrative POS checkout or server actions.

## Decisions

### 1. Phrasing Content Normalization
- In `LandingHeader.tsx`: Replace `<div className="w-5 flex flex-col gap-1.5">` inside the hamburger button with `<span className="w-5 flex flex-col gap-1.5">`.
- In `CampusLabExplorer.tsx`: Replace the tab line indicator `<div className="h-1.5 w-full ...">` inside `<button>` with `<span className="block h-1.5 w-full ...">`.
- *Rationale*: `<button>` strictly permits phrasing content (inline elements like `<span>`, `<svg>`). Replacing `<div>` with `<span>` removes DOM parser restructuring and allows React 19 to hydrate without bailing out.

### 2. SSR-Safe Motion Initialization (`initial={false}`)
- In `CampusLabExplorer.tsx`: Change `<motion.ul initial={{ opacity: 0, y: 6 }}>` and `<motion.div initial={{ opacity: 0, scale: 0.98 }}>` to use `initial={false}`.
- *Rationale*: With `initial={false}`, Next.js renders the initial server HTML with full opacity (`opacity: 1`). The content is immediately visible on first paint. When the user taps a different lab tab, `AnimatePresence` and Motion still execute the smooth exit and enter transitions seamlessly.

### 3. Cross-Browser Scroll Telemetry with Lower Threshold
- In `LandingHeader.tsx`: Calculate scroll position via:
  ```ts
  const pos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  setIsScrolled(pos > 60);
  ```
- *Rationale*: Mobile Safari often reports scroll offsets on `documentElement` or `pageYOffset` during touch momentum. A 60px threshold activates the frosted backdrop immediately as the user begins scrolling down from the hero.

### 4. Lab Card Contrast & Visibility
- In `CampusLabExplorer.tsx`: For Cyan (`#009FE3`) and Yellow (`#FFED00`), use `text-zinc-950` dark typography for maximum contrast. For Magenta (`#E6007E`), use `text-white`.

## Risks / Trade-offs

- [Risk: Loss of initial entrance animation on page load] → Mitigation: `initial={false}` only affects initial page paint (preventing blank screen on hydration delay); all subsequent lab tab switches retain full motion and scale animations.
