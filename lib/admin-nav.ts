import React from "react";
import {
  CashRegister,
  Package,
  Cpu,
  Article,
  ClockCounterClockwise,
  SlidersHorizontal,
  Icon,
} from "@phosphor-icons/react";

export type AdminNavTabId =
  | "FRONT_DESK"
  | "INVENTORY"
  | "MAKERSPACE"
  | "CRAFTS"
  | "HISTORY"
  | "SETTINGS";

export interface AdminNavItem {
  id: AdminNavTabId;
  label: string;
  shortTitle: string;
  description: string;
  icon: Icon;
  accentColor: string; // CMYK / brand color token: #009FE3 (Cyan), #FFED00 (Yellow), #E6007E (Pink), #FFFFFF
  badge?: string | number;
}

/**
 * ============================================================================
 * ZEALAND LABS ADMIN NAVIGATION REGISTRY
 * ============================================================================
 * 
 * HOW TO EXTEND THIS LIST FOR UX:
 * 1. Add your new identifier to `AdminNavTabId` (e.g. `| "ANALYTICS"`).
 * 2. Select a Phosphor icon from `@phosphor-icons/react`.
 * 3. Append your new `AdminNavItem` object to `ADMIN_NAV_ITEMS` below:
 *    {
 *      id: "ANALYTICS",
 *      label: "Lab Telemetri & Analyse",
 *      shortTitle: "Telemetri",
 *      description: "Sensorovervågning og maskinudnyttelse",
 *      icon: ChartLineUp,
 *      accentColor: "#009FE3",
 *    }
 * 4. In `AdminConsoleClient.tsx`, render the corresponding view component:
 *    {mainNav === "ANALYTICS" && <AnalyticsView />}
 *
 * The docked vertical sidebar (`AdminSidebarNav.tsx`) will automatically
 * render the new 40x40 icon trigger, hover tooltip, active accent indicator,
 * and view switcher without requiring any manual layout changes.
 * ============================================================================
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "FRONT_DESK",
    label: "Front Desk & POS Udlån",
    shortTitle: "POS Desk",
    description: "Stregkodescanner, aktivt udlån og reservationskalender",
    icon: CashRegister,
    accentColor: "#009FE3", // Cyan
  },
  {
    id: "INVENTORY",
    label: "Lager & Katalog",
    shortTitle: "Lager",
    description: "Fysisk placering, hylder, tags og udstyrskatalog",
    icon: Package,
    accentColor: "#FFED00", // Yellow
  },
  {
    id: "MAKERSPACE",
    label: "Makerspace Maskiner",
    shortTitle: "Maskiner",
    description: "3D-printere, laserskærere, manualer og driftstatus",
    icon: Cpu,
    accentColor: "#FFED00", // Yellow
  },
  {
    id: "CRAFTS",
    label: "Crafts & Artikler",
    shortTitle: "Crafts",
    description: "Offentlige vejledninger, prototyper og blogartikler",
    icon: Article,
    accentColor: "#E6007E", // Pink
  },
  {
    id: "HISTORY",
    label: "Revisionslog (Audit)",
    shortTitle: "Historik",
    description: "Handlingslog, admin-aktiviteter og hardwarehistorik",
    icon: ClockCounterClockwise,
    accentColor: "#E6007E", // Pink
  },
  {
    id: "SETTINGS",
    label: "Systemindstillinger",
    shortTitle: "Opsætning",
    description: "Campusparametre, lokale noder og admin-rettigheder",
    icon: SlidersHorizontal,
    accentColor: "#FFFFFF",
  },
];
