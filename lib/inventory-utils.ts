/**
 * Pure synchronous taxonomy and location utilities for Zealand Labs Inventory.
 * Safe for import in both Server Actions and Client Components.
 */

export const LAB_PREFIX_MAP: Record<string, string> = {
  makerspace: "MK",
  medialab: "ML",
};

export const CATEGORY_CODE_MAP: Record<string, string> = {
  "3d-fabrication": "3DP",
  "3d-printing": "3DP",
  "fdm-3d-printing": "3DP",
  "laser-cutting": "LSR",
  textile: "TEX",
  "direct-to-garment": "DTG",
  "rapid-prototyping": "RPD",
  "camera-gear": "CAM",
  "cinema-4k-recording": "CAM",
  "audio-equipment": "AUD",
  "wireless-audio": "AUD",
  lighting: "LGT",
  "studio-lighting": "LGT",
  "xr-vr": "VRX",
  "vr-spatial-computing": "VRX",
  electronics: "ELC",
  "soldering-smd": "ELC",
  "general-tools": "GEN",
  accessories: "ACC",
  bulk: "ACC",
  batteries: "BAT",
  cables: "CBL",
};

export const LOCATION_PREFIX_MAP: Record<string, string> = {
  køge: "KG",
  koge: "KG",
  kg: "KG",
  roskilde: "RO",
  ro: "RO",
};

/**
 * Maps a location string (e.g. "Køge - Makerspace 3D Zone", "Roskilde - Medialab")
 * or short campus code to its standardized 2-letter uppercase prefix ("KG" or "RO").
 * Defaults to "KG".
 */
export function resolveLocationPrefix(location?: string | null): string {
  if (!location) return "KG";
  const trimmed = location.trim().toLowerCase();
  if (trimmed.includes("roskilde") || trimmed.startsWith("ro")) return "RO";
  if (trimmed.includes("køge") || trimmed.includes("koge") || trimmed.startsWith("kg")) return "KG";
  return "KG";
}
