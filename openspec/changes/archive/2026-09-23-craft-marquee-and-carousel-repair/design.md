## Context

See `proposal.md` for background. Following the landing page GSAP animation rollout, `PrototypeCarousel.tsx` cards were rendered invisible because `gsap.from` immediately applied inline `opacity: 0` styling while the sub-element `.gsap-carousel-track` ScrollTrigger failed to reach its start threshold on page load or after gate dismissal. Additionally, the carousel lists repetitive mockup entries without a gateway to a broader catalogue, and `app/craft/[slug]/page.tsx` utilizes an inline single-track marquee rather than the shared `<MarqueeRibbon />`.

## Goals / Non-Goals

**Goals:**
- Guarantee permanent visibility and reliable entrance animation of `PrototypeCarousel` cards, eliminating stuck `opacity: 0` states using `fromTo` and `clearProps`.
- Trim prototype carousel items to 5 items and append a dedicated high-contrast catalogue navigation tile pointing to `/katalog`.
- Replace the inline marquee in `app/craft/[slug]/page.tsx` with `<MarqueeRibbon />`.

**Non-Goals:**
- Creating or generating the `/katalog` page route (explicitly deferred per user instruction).
- Modifying other craft page layout sections.

## Decisions

### 1. Robust GSAP ScrollTrigger Animation for Prototype Carousel
- **Choice**: Scope the trigger to the section container (`trigger: containerRef.current`) rather than child scroll tracks (`.gsap-carousel-track`). Use `fromTo` with explicit final state `{ opacity: 1, y: 0 }` and `clearProps: "opacity,transform"` on completion:
  ```ts
  gsap.fromTo(
    ".gsap-carousel-card",
    { opacity: 0, y: 24 },
    {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "opacity,transform",
    }
  );
  ```
- **Rationale**: `containerRef.current` is in the standard document flow, ensuring ScrollTrigger coordinates calculate accurately regardless of horizontal scroll track geometry or mobile momentum. `clearProps: "opacity,transform"` guarantees cards never remain stuck in an invisible state if page recalculations occur.

### 2. Five-Item Carousel Curation & Catalogue Tile Architecture
- **Choice**: Curate `prototypeItems` to exactly 5 distinct items:
  1. T-Shirt (`/craft/t-shirt`)
  2. Kop (`/craft/kop`)
  3. Mulepose (`/craft/mulepose`)
  4. 3D Print (`/craft/t-shirt`)
  5. Plakat Print (`/craft/kop`)
  Append a terminal tile to the track:
  ```tsx
  <Link
    href="/katalog"
    className="gsap-carousel-card relative flex-shrink-0 w-48 sm:w-60 h-48 sm:h-60 bg-black text-white border border-[#262626] rounded-none p-5 flex flex-col justify-between snap-start hover:border-white/50 transition-all group cursor-pointer"
  >
    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">KATALOG</span>
    <div>
      <h3 className="font-notch text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
        Udforsk hele kataloget
      </h3>
      <p className="font-sans text-xs text-zinc-400 mt-1">Se alle prototyper og udstyr</p>
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
      <span className="text-xs font-semibold uppercase tracking-wider text-white">Gå til oversigt</span>
      <span className="font-bold text-white transition-transform group-hover:translate-x-1">→</span>
    </div>
  </Link>
  ```
- **Rationale**: Provides clear visual affordance for discovering more items without cluttering the landing page horizontal carousel, while honoring the strict instruction to defer creating the destination `/katalog` page.

### 3. Marquee Component Reuse on Craft Detail Pages
- **Choice**: In `app/craft/[slug]/page.tsx`, import `<MarqueeRibbon />` from `@/components/landing/MarqueeRibbon` and replace the ad-hoc static marquee markup.
- **Rationale**: Guarantees identical typography, dual-track reverse scrolling, responsive sizing, and design system tokens across both the landing page and all craft item pages.

## Risks / Trade-offs

- **[404 on Catalogue Click]** Because `/katalog` page is not yet implemented, clicking the tile before the user prompts creation will yield a 404 in development.
  → *Mitigation*: User explicitly commanded: *"you will not make this page yet until prompted to do so"*. The tile will point to `/katalog` as specified.
- **[Horizontal track touch scrolling]** Horizontal scrolling tracks can sometimes compete with GSAP ScrollTrigger on touch devices.
  → *Mitigation*: Binding the trigger to `containerRef.current` ensures ScrollTrigger monitors vertical page scroll only.
