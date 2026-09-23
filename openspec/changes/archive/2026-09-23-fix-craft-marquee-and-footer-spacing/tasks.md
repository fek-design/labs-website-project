## 1. Craft Page Layout & Spacing Restructuring

- [x] 1.1 Update `app/craft/[slug]/page.tsx` to remove global `space-y-10 sm:space-y-14` from `<main>` and isolate flow spacing to upper sections, making `<MarqueeRibbon />` completely flush.
- [x] 1.2 Update `components/landing/LandingFooter.tsx` to accept an optional `className` prop defaulting to `"mt-8 sm:mt-12"`.
- [x] 1.3 Update `app/craft/[slug]/page.tsx` to pass `className="mt-0"` to `<LandingFooter />`, eliminating the black gap below "Relevante Manualer".

## 2. Verification & Validation

- [x] 2.1 Verify TypeScript compilation with `npx tsc --noEmit`.
- [x] 2.2 Verify that the craft item page renders the marquee without external padding gaps and the white manuals section seamlessly transitions directly into the cyan footer.
