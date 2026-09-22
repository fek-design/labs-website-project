## 1. Phrasing Content Normalization & Hydration Fixes

- [x] 1.1 Replace `<div>` with `<span>` inside the hamburger button in `LandingHeader.tsx` to satisfy HTML5 phrasing content rules and prevent hydration failure
- [x] 1.2 Replace `<div>` with `<span>` in the lab indicator tab buttons in `CampusLabExplorer.tsx` to ensure valid button content and seamless React 19 hydration

## 2. SSR Visibility & Scroll Transitions

- [x] 2.1 Set `initial={false}` on `motion.ul` and `motion.div` in `CampusLabExplorer.tsx` so lab bullets and spotlight card render with 100% opacity directly from SSR HTML
- [x] 2.2 Update `LandingHeader.tsx` with cross-browser scroll position check (`window.scrollY || window.pageYOffset || document.documentElement.scrollTop`) and lower threshold to 60px for immediate mobile scroll response
- [x] 2.3 Optimize spotlight card foreground typography in `CampusLabExplorer.tsx` for Cyan and Yellow backgrounds (`text-zinc-950`) to guarantee high contrast and legibility

## 3. Verification & Validation

- [x] 3.1 Run `npx tsc --noEmit` and `npx eslint` to verify code correctness and type safety
- [x] 3.2 Verify click interactivity, element visibility, and scroll background transition on mobile
