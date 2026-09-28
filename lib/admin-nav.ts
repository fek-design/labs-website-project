import React from "react";
import {
  CashRegister,
  Package,
  ClockCounterClockwise,
  SlidersHorizontal,
  Books,
  GridFour,
  Icon,
} from "@phosphor-icons/react";

export type AdminNavTabId =
  | "FRONT_DESK"
  | "INVENTORY"
  | "CATALOGUE"
  | "MANUALS"
  | "HISTORY"
  | "SETTINGS";

export interface AdminNavItem {
  id: AdminNavTabId;
  label: string;
  shortTitle: string;
  description: string;
  icon: Icon;
  accentColor: string; // CMYK / brand color token: #009FE3 (Cyan), #FFED00 (Yellow), #E6007E (Pink), #FF9900 (Amber), #FFFFFF
  badge?: string | number;
}

/**
 * ============================================================================
 * ZEALAND LABS ADMIN NAVIGATION REGISTRY
 * Canonical 6-Module Operational Navigation Architecture
 * ============================================================================
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "FRONT_DESK",
    label: "Front Desk & POS Udlån",
    shortTitle: "POS Desk",
    description: "Stregkodescanner, aktivt udlån og reservationskalender",
    icon: CashRegister,
    accentColor: "#FFED00", // Yellow — matches LABS Dashboard
  },
  {
    id: "INVENTORY",
    label: "Lager & Beholdning",
    shortTitle: "Inventar",
    description: "Fysisk placering, maskiner, hylder, tags og udstyrsstatus",
    icon: Package,
    accentColor: "#009FE3", // Cyan — matches LABS Inventar
  },
  {
    id: "CATALOGUE",
    label: "Offentligt Katalog & Crafts",
    shortTitle: "Katalog",
    description: "Offentlig udstilling, projektguides, materialer og showcase curation",
    icon: GridFour,
    accentColor: "#FF9900", // Amber — distinct from physical inventory
  },
  {
    id: "MANUALS",
    label: "Manualer & Dokumenter",
    shortTitle: "Manualer",
    description: "SOP-dokumenter, PDF-manualer og maskintilknytning",
    icon: Books,
    accentColor: "#E6007E", // Pink — matches Figma LABS Manualer
  },
  {
    id: "HISTORY",
    label: "Revisionslog (Audit)",
    shortTitle: "Historik",
    description: "Handlingslog, admin-aktiviteter og hardwarehistorik",
    icon: ClockCounterClockwise,
    accentColor: "#009FE3", // Cyan — matches Audit Logs
  },
  {
    id: "SETTINGS",
    label: "Systemindstillinger",
    shortTitle: "Opsætning",
    description: "Campusparametre, lokale noder og admin-rettigheder",
    icon: SlidersHorizontal,
    accentColor: "#FFED00", // Yellow — matches LABS Indstillinger
  },
];
