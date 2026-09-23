## Why

To enhance visual impact and interactivity across the landing page, the user requested four key refinements:
1. Solidify the shape of the hero "UDFORSK" button as a bold architectural rectangle (`rounded-none`).
2. Expand hotspot popups with generous internal padding and transform them into interactive clickable links that navigate to related lab destinations.
3. Redesign the prototype carousel cards to use full-bleed photo backgrounds with an overlaid bottom action button displaying the item name.
4. Properly configure and load `Stack Sans Notch` (display headers) and `Stack Sans Text` (body typography) with the closest high-agency geometric grotesque fallbacks (`Space Grotesk` and `Inter`).

## What Changes

- **Hero "UDFORSK" CTA Button Shape**:
  - Confirmed as sharp architectural rectangular geometry (`rounded-none` / `0px` radius) with generous touch padding (`px-10 py-3.5`), high contrast (`bg-white text-black`), crisp 1px border (`border-zinc-200`), and instant touch-manipulation.
- **Interactive Hotspot Link Popovers**:
  - Redesign hotspot tooltips in `HotspotShowcase.tsx` into spacious clickable cards with large internal padding (`p-4 sm:p-5`), `pointer-events-auto`, routing to `#support-pillars`, and a clear action affordance (`Se muligheder ↗`).
- **Full-Bleed Image Background Carousel Cards**:
  - Refactor `PrototypeCarousel.tsx` cards: the product photo spans the entire card background (`fill`, `object-cover`), with a subtle bottom gradient overlay, and a bottom button displaying the product name (`<button className="...">{item.name} <span>→</span></button>`).
- **Typography Integration (Stack Sans Notch & Stack Sans Text)**:
  - Integrate `Stack Sans Notch` and `Stack Sans Text` into `app/layout.tsx` and `app/globals.css` with the closest matching font fallbacks:
    - Headers (`font-notch`): `'Stack Sans Notch', var(--font-space-grotesk), 'Space Grotesk', system-ui, -apple-system, sans-serif`.
    - Body (`font-sans` / `font-text`): `'Stack Sans Text', var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif`.
  - Configured locally via Next.js self-hosted fonts (`next/font/google` for `Space_Grotesk` and `Inter`), preserving the strict "Zero Cloud Dependency" mandate.

## Capabilities

### Modified Capabilities
- `visual-toolkits`: Updated to specify full-bleed carousel cards, interactive hotspot cards, and the typography stack with geometric grotesque fallbacks.

## Impact

- `app/layout.tsx`: Configures font variables for the closest typographic fallbacks.
- `app/globals.css`: Updates font family theme tokens for `--font-notch` and `--font-sans`.
- `components/landing/HeroSection.tsx`: Locks in architectural rectangular `rounded-none` CTA styling.
- `components/landing/HotspotShowcase.tsx`: Expands hotspot popups with generous padding, clickable link routing, and hover states.
- `components/landing/PrototypeCarousel.tsx`: Overhauls cards to full-bleed image backgrounds with integrated title buttons.
- `openspec/specs/visual-toolkits/spec.md`: Master spec updated with new card and popup patterns.
