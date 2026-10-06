## 1. Highlight Borders & Global Styling Removal

- [x] 1.1 Remove forced yellow `:focus-visible` outline from `app/globals.css`
- [x] 1.2 Revert yellow focus ring to original cyan focus style in `components/catalogue/CatalogueCard.tsx`
- [x] 1.3 Remove yellow focus ring from "UDFORSK" button in `components/landing/HeroSection.tsx`

## 2. HeroSection Restoration & Apple Column Grid

- [x] 2.1 Remove the right-hand campus status box card and extra `<p>` paragraph from `components/landing/HeroSection.tsx`
- [x] 2.2 Restore the author's original centered composition (headline and UDFORSK button) aligned to Apple's 12-column responsive grid container

## 3. MachineTelemetrySection Restoration

- [x] 3.1 Revert the asymmetrical 35/65 side-by-side restructuring in `components/landing/MachineTelemetrySection.tsx`
- [x] 3.2 Restore the original vertical hierarchy (header on top, stat counter and autoscrolling machine viewport below) in the 12-column grid

## 4. Catalogue Header Restoration

- [x] 4.1 Remove the fabricated "Total Prototyper" badge card from `app/katalog/page.tsx`
- [x] 4.2 Restore the clean original catalogue header layout with Apple-standard column container

## 5. Verification & Clean Compilation

- [x] 5.1 Run `npx tsc --noEmit` and confirm zero compilation errors
- [x] 5.2 Verify layout visuals and responsiveness across mobile, tablet, and desktop viewports
