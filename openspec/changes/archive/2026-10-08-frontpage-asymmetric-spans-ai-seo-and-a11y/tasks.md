## 1. Top Navigation & Footer Hygiene

- [x] 1.1 Unify `LandingHeader.tsx` to render `LABS` on left, and `KØGE CAMPUS` badge + universal hamburger button on right across all viewports
- [x] 1.2 Remove quicklaunch Katalog CTA and top horizontal links; house all routes in the hamburger drawer
- [x] 1.3 Remove "is currently open" status pill and copyright notice from `LandingFooter.tsx`
- [x] 1.4 Prune non-existent links (`USER_MANUAL.md`, SOP PDF) from `LandingFooter.tsx`

## 2. 8-12-16 Asymmetrical Grid Spans

- [x] 2.1 Refactor `CampusLabExplorer.tsx` to follow an 8-12-16 responsive grid structure
- [x] 2.2 Stack vertically on mobile (`grid-cols-1 gap-8`) and scale as 12-col grid on desktop (`lg:grid-cols-12 gap-8`)
- [x] 2.3 Allocate 5 columns to narrative text and tabs (`lg:col-span-5`) and 7 columns to the CMYK spotlight card (`lg:col-span-7`)
- [x] 2.4 Align all paddings, margins, and heights to 8-divisible rhythm (`p-8`, `gap-8`, `min-h-[224px]`)

## 3. Cross-Device Interactivity & Server Action Permissions

- [x] 3.1 Audit `FirstTimeCampusGate.tsx` and `CampusContext.tsx` to ensure zero hydration mismatches on mobile and external devices
- [x] 3.2 Configure Server Action `allowedOrigins` in `next.config.ts` to permit local IP ranges (`192.168.*`, `10.*`, `localhost:3000`)
- [x] 3.3 Verify database query fallbacks and server action invocations over LAN connections

## 4. Dedicated Lab Portal Pages

- [x] 4.1 Create dedicated Makerspace portal page at `app/makerspace/page.tsx`
- [x] 4.2 Create dedicated Medialab portal page at `app/medialab/page.tsx`
- [x] 4.3 Link both dedicated lab pages from navigation drawer, footer, and campus explorer
- [x] 4.4 Add `/makerspace` and `/medialab` to `app/sitemap.ts` and `app/robots.ts`

## 5. Playwright Testing & Driver Configuration

- [x] 5.1 Investigate and resolve Playwright mac-arm64 browser driver download failure
- [x] 5.2 Configure Playwright runner to use locally installed Google Chrome or offline binary channel
- [x] 5.3 Verify test runners execute cleanly

## 6. Verification & Quality Assurance

- [x] 6.1 Validate OpenSpec change with `npx openspec validate frontpage-asymmetric-spans-ai-seo-and-a11y`
- [x] 6.2 Run automated Vitest test suite (`npm test`)
- [x] 6.3 Execute Next.js production build (`npm run build`)
