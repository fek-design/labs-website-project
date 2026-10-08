# Zealand Labs — Sitemap & Information Architecture

> **Dual-Persona Navigation & Route Availability Guide**  
> Mapped for **Student** (borrowing, making, live status) and **Teacher** (class bundles, manuals, admin operations).

---

## 🗺️ Visual Site Hierarchy

```
/ (Root Landing Page)
│
├── 🎓 Studerende Journey
│   ├── #prototypes            ── Prototype Inspiration Carousel (T-Shirt, Kop, 3D Print...)
│   ├── #showcase              ── Interactive Hotspots (Tekstil, Plakat, Kamera, 3D)
│   ├── #machines              ── Live Hardware & Workstation Status (Realtidstelemetri)
│   ├── #support-pillars       ── Makerspace & Medialab Pillars & Support Guides
│   ├── /katalog               ── Hele Udstyrskataloget (Søgning, Filtre, Udlånsstatus)
│   └── /craft/[slug]          ── Dybdegående Craft Guides & Trin-for-trin Maskinmanualer
│       ├── /craft/t-shirt
│       ├── /craft/kop
│       ├── /craft/mulepose
│       ├── /craft/3d-print
│       └── /craft/plakat
│
└── 👩‍🏫 Underviser & Personale Gateway
    ├── /katalog               ── Udstyrsoversigt til Undervisningsforløb & Bundles
    ├── /admin                 ── Staff Launchpad & Administrator Dashboard
    │   ├── POS Udlån (/admin/pos)
    │   ├── Maskinpark & Status
    │   ├── Bruger- & Rolleadministration
    │   └── Logs & Historik
    └── /sitemap.xml           ── Programmatisk Next.js SEO & Crawler Index
```

---

## 👥 Persona Navigation Journeys

### 1. Studerende Persona ("Vil låne grej og bygge prototyper")

| Handling | Mål | Anbefalet Rute |
| :--- | :--- | :--- |
| **Finde & låne udstyr** | Tjekke om kamera, mikrofon eller VR-headset er ledigt | [`/katalog`](/katalog) |
| **Tjekke maskinstatus** | Se om 3D-printer eller laserskærer kører lige nu | [`#machines`](#machines) |
| **Lære at printe / bygge** | Få trin-for-trin guide til tekstiltryk eller 3D-brikker | [`#prototypes`](#prototypes) ➔ [`/craft/[slug]`](/craft/t-shirt) |
| **Udforske værksteder** | Se forskel på Makerspace og Medialab i Køge | [`#support-pillars`](#support-pillars) |

---

### 2. Underviser / Personale Persona ("Planlægger hold, manualer & administration")

| Handling | Mål | Anbefalet Rute |
| :--- | :--- | :--- |
| **Klasse-kits & Bundles** | Gennemgå tilgængeligt udstyr til semesterprojekter | [`/katalog`](/katalog) |
| **Maskinmanualer & Sikkerhed** | Finde tekniske specifikationer og filformater | [`/craft/[slug]`](/craft/3d-print) & [`/admin`](/admin) |
| **Udlån & Aflevering (POS)** | Scanne stregkoder og udlåne til studerende | [`/admin/pos`](/admin/pos) |
| **Systemadministration** | Oprette superbrugere, styre tilladelser og indstillinger | [`/admin`](/admin) |

---

## 🔗 Navigations- & Footer Hyperlink Reference

### Top Navigation Drawer (`LandingHeader`)
- **Studerende & Værksteder:**
  - `Udstyrskatalog & Udlån` ➔ `/katalog`
  - `Prototypes & Inspiration` ➔ `#prototypes`
  - `Projekter & Hotspots` ➔ `#showcase`
  - `Maskiner & Live Status` ➔ `#machines`
  - `Laboratorier & Support` ➔ `#support-pillars`
- **Underviser & Personale:**
  - `Admin Launchpad & Værktøjer` ➔ `/admin`

### Footer Directory (`LandingFooter`)
- `UDSTYRSKATALOG & UDLÅN ↗` ➔ `/katalog`
- `MAKERSPACE & FABRICATION` ➔ `#support-pillars`
- `MEDIALAB & MASKINSTATUS` ➔ `#machines`
- `ADMIN CONSOLE (UNDERVISER) ↗` ➔ `/admin`

---

## ⚡ Programmatisk XML Sitemap

Genereret automatisk via [app/sitemap.ts](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/app/sitemap.ts):
- Tilgængelig på: `http://localhost:3000/sitemap.xml`
- Indeholder alle statiske ruter samt dynamiske `/craft/[slug]` prototyper.
