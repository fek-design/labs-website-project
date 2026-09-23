"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { CraftItemData, CRAFT_CATALOG, getAllCraftItems } from "@/lib/craft-data";
import { prisma } from "@/lib/prisma";

const CRAFTS_FILE_PATH = path.join(process.cwd(), "data", "crafts.json");

async function ensureDataDirectory() {
  const dir = path.join(process.cwd(), "data");
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getActorAdminId(providedAdminId?: string): Promise<string> {
  if (providedAdminId) {
    try {
      const admin = await prisma.admin.findUnique({ where: { id: providedAdminId } });
      if (admin) return admin.id;
    } catch {
      // ignore
    }
  }
  try {
    const defaultAdmin =
      (await prisma.admin.findFirst({ where: { isActive: true, role: "TECHNICIAN" } })) ||
      (await prisma.admin.findFirst({ where: { isActive: true } }));
    return defaultAdmin?.id || "system";
  } catch {
    return "system";
  }
}

/**
 * Fetch all craft prototype articles
 */
export async function getCraftArticles(): Promise<CraftItemData[]> {
  try {
    await ensureDataDirectory();
    try {
      const raw = await fs.readFile(CRAFTS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // File does not exist or empty, seed from CRAFT_CATALOG
      const seedItems = getAllCraftItems();
      await fs.writeFile(CRAFTS_FILE_PATH, JSON.stringify(seedItems, null, 2), "utf-8");
      return seedItems;
    }
  } catch (error) {
    console.error("Failed to read crafts data file, falling back to static:", error);
  }
  return getAllCraftItems();
}

/**
 * Save or update a craft prototype article
 */
export async function saveCraftArticle(
  item: CraftItemData,
  adminId?: string
): Promise<{ success: boolean; data?: CraftItemData; error?: string }> {
  try {
    if (!item.slug || !item.title) {
      return { success: false, error: "Titel og slug er påkrævet." };
    }

    const items = await getCraftArticles();
    const existingIndex = items.findIndex((i) => i.slug.toLowerCase() === item.slug.toLowerCase());

    const isUpdate = existingIndex >= 0;
    if (isUpdate) {
      items[existingIndex] = { ...items[existingIndex], ...item };
    } else {
      items.push(item);
    }

    await ensureDataDirectory();
    await fs.writeFile(CRAFTS_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");

    // Attempt audit log
    try {
      const actorId = await getActorAdminId(adminId);
      await prisma.auditLog.create({
        data: {
          actorAdminId: actorId,
          actionType: isUpdate ? "UPDATE_CRAFT_ARTICLE" : "CREATE_CRAFT_ARTICLE",
          targetTable: "CraftArticle",
          targetId: item.slug,
          payloadDelta: {
            title: item.title,
            category: item.category,
            campuses: item.campuses,
            labs: item.labs,
          },
        },
      });
    } catch (auditErr) {
      console.warn("Could not write audit log for craft article:", auditErr);
    }

    revalidatePath("/katalog");
    revalidatePath(`/craft/${item.slug}`);
    revalidatePath("/");

    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to save craft article:", error);
    return { success: false, error: error.message || "Kunne ikke gemme artiklen." };
  }
}

/**
 * Delete a craft prototype article
 */
export async function deleteCraftArticle(
  slug: string,
  adminId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const items = await getCraftArticles();
    const filtered = items.filter((i) => i.slug.toLowerCase() !== slug.toLowerCase());

    if (filtered.length === items.length) {
      return { success: false, error: "Artiklen blev ikke fundet." };
    }

    await ensureDataDirectory();
    await fs.writeFile(CRAFTS_FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");

    // Attempt audit log
    try {
      const actorId = await getActorAdminId(adminId);
      await prisma.auditLog.create({
        data: {
          actorAdminId: actorId,
          actionType: "DELETE_CRAFT_ARTICLE",
          targetTable: "CraftArticle",
          targetId: slug,
          payloadDelta: { slug },
        },
      });
    } catch (auditErr) {
      console.warn("Could not write audit log for craft article deletion:", auditErr);
    }

    revalidatePath("/katalog");
    revalidatePath(`/craft/${slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete craft article:", error);
    return { success: false, error: error.message || "Kunne ikke slette artiklen." };
  }
}

export interface CraftAssetItem {
  url: string;
  fileName: string;
  folder: "craft" | "landing";
}

/**
 * Upload an image file directly to public/images/craft/ for zero-cloud local storage
 */
export async function uploadCraftImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Ingen fil modtaget." };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Filen er for stor. Maksimum er 10MB." };
    }

    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return { success: false, error: "Ugyldig filtype. Tilladt: PNG, JPG, WEBP, SVG, GIF." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${baseName}-${Date.now()}${ext}`;

    const targetDir = path.join(process.cwd(), "public", "images", "craft");
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, uniqueName);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/images/craft/${uniqueName}`;

    revalidatePath("/katalog");
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Failed to upload craft image:", error);
    return { success: false, error: error.message || "Kunne ikke uploade billedet." };
  }
}

/**
 * Scan local image library in public/images/craft and public/images/landing
 */
export async function getAvailableCraftAssets(): Promise<CraftAssetItem[]> {
  const assets: CraftAssetItem[] = [];
  const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]);

  const folders: Array<{ dir: string; folder: "craft" | "landing"; publicPrefix: string }> = [
    {
      dir: path.join(process.cwd(), "public", "images", "craft"),
      folder: "craft",
      publicPrefix: "/images/craft/",
    },
    {
      dir: path.join(process.cwd(), "public", "images", "landing"),
      folder: "landing",
      publicPrefix: "/images/landing/",
    },
  ];

  for (const { dir, folder, publicPrefix } of folders) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (allowedExtensions.has(ext)) {
          assets.push({
            url: `${publicPrefix}${file}`,
            fileName: file,
            folder,
          });
        }
      }
    } catch {
      // directory might not exist yet or empty
    }
  }

  return assets;
}

