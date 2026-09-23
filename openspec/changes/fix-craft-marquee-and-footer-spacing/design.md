## Context

See `proposal.md` for background. On the craft item page (`app/craft/[slug]/page.tsx`), `<main>` applied a global Tailwind `space-y-10 sm:space-y-14` across all children. This added large margins above and below `<MarqueeRibbon />`, causing visible black padding gaps around the ticker. In addition, `LandingFooter` featured a hardcoded `mt-8 sm:mt-12` margin that separated the bottom of the white manuals section from the cyan footer, exposing a jarring black strip from the background container.

## Goals / Non-Goals

**Goals:**
- Eliminate the padding/margin space above and below `<MarqueeRibbon />` on `/craft/[slug]`.
- Eliminate the awkward black horizontal gap beneath "Relevante Manualer" so the white section transitions directly into the cyan footer.
- Maintain existing internal spacing among the top hero, prerequisite, and process selector sections.

**Non-Goals:**
- Modifying the internal padding or content of `MarqueeRibbon` itself.
- Changing the layout of the landing page footer.

## Decisions

### 1. Isolated Vertical Spacing for Upper Craft Content
- **Choice**: Remove `space-y-10 sm:space-y-14` from `<main>` in `app/craft/[slug]/page.tsx`. Wrap the upper three sections (`CraftHero`, `CraftPrerequisites`, `CraftProcessSelector`) in a dedicated `div` with `space-y-10 sm:space-y-14`:
  ```tsx
  <main className="flex-1 w-full">
    {/* Upper Content with Flow Spacing */}
    <div className="space-y-10 sm:space-y-14 pb-8 sm:pb-12">
      <CraftHero item={item} />
      <CraftPrerequisites prerequisites={item.prerequisites} />
      <CraftProcessSelector processes={item.processes} />
    </div>

    {/* Flush Full-Bleed Marquee */}
    <MarqueeRibbon />

    {/* Contiguous White Zone */}
    <div className="w-full bg-white text-zinc-950 transition-colors">
      <CraftInspirationGallery items={item.inspiration} />
      <CraftManualsSection manuals={item.manuals} />
    </div>
  </main>
  ```
- **Rationale**: Isolates the flow margins so `<MarqueeRibbon />` and the white section do not inherit unwanted top margins, making the marquee completely flush.

### 2. Configurable Margin on LandingFooter
- **Choice**: Enhance `components/landing/LandingFooter.tsx` with an optional `className` prop defaulting to `"mt-8 sm:mt-12"`:
  ```tsx
  interface LandingFooterProps {
    className?: string;
  }

  export function LandingFooter({ className = "mt-8 sm:mt-12" }: LandingFooterProps) {
    return (
      <footer className={`w-full bg-brand-cyan text-white py-12 sm:py-16 px-4 sm:px-6 ${className}`}>
  ```
  On `app/craft/[slug]/page.tsx`, invoke:
  ```tsx
  <LandingFooter className="mt-0" />
  ```
- **Rationale**: Eliminates the black strip under "Relevante Manualer" on the craft page while maintaining backward compatibility for the landing page.

## Risks / Trade-offs

- **[Visual rhythm without top/bottom marquee gaps]** The marquee connects directly between the dark background of the process selector and the white background of the inspiration gallery.
  → *Mitigation*: The marquee already contains its own internal `py-3.5` bar height and hairline borders (`border-y border-white/10`), creating a crisp architectural transition divider exactly matching the design system.
