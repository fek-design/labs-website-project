"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { CraftItemData, CRAFT_CATALOG, getAllCraftItems } from "@/lib/craft-data";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

import { craftItemSchema } from "@/lib/validations/crafts";

const CRAFTS_FILE_PATH = path.join(process.cwd(), "data", "crafts.json");

async function ensureDataDirectory() {
  const dir = path.join(process.cwd(), "data");
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Fetch all craft prototype articles (Public read)
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
 * Save or update a craft prototype article (Protected: SuperAdmin / Technician)
 */
export async function saveCraftArticle(
  item: CraftItemData
): Promise<{ success: boolean; data?: CraftItemData; error?: string }> {
  try {
    const user = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);

    const parsed = craftItemSchema.safeParse(item);
    if (!parsed.success) {
      return {
        success: false,
        error: `Valideringsfejl: ${parsed.error.issues[0]?.message || "Ugyldige data for prototype."}`,
      };
    }

    const validatedItem = parsed.data as CraftItemData;

    const items = await getCraftArticles();
    const existingIndex = items.findIndex((i) => i.slug.toLowerCase() === validatedItem.slug.toLowerCase());

    const isUpdate = existingIndex >= 0;
    if (isUpdate) {
      items[existingIndex] = { ...items[existingIndex], ...validatedItem };
    } else {
      items.push(validatedItem);
    }

    await ensureDataDirectory();
    await fs.writeFile(CRAFTS_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");

    // Attempt audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorAdminId: user.id,
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
 * Delete a craft prototype article (Protected: SuperAdmin / Technician)
 */
export async function deleteCraftArticle(
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);

    const items = await getCraftArticles();
    const filtered = items.filter((i) => i.slug.toLowerCase() !== slug.toLowerCase());

    if (filtered.length === items.length) {
      return { success: false, error: "Artiklen blev ikke fundet." };
    }

    await ensureDataDirectory();
    await fs.writeFile(CRAFTS_FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");

    // Attempt audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorAdminId: user.id,
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
 * Upload an image file directly to public/images/craft/ for zero-cloud local storage (Protected)
 */
export async function uploadCraftImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);

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
      const files = await fs.readdir(/*turbopackIgnore: true*/ dir);
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

/**
 * Toggle whether a craft prototype is featured on the public frontpage carousel (cap: 5)
 */
export async function toggleFeatureOnFrontpage(
  slug: string
): Promise<{ success: boolean; isFeatured?: boolean; count?: number; error?: string }> {
  try {
    const user = await requireAuth(["SUPER_ADMIN", "TECHNICIAN"]);

    const items = await getCraftArticles();
    const itemIndex = items.findIndex((i) => i.slug.toLowerCase() === slug.toLowerCase());

    if (itemIndex === -1) {
      return { success: false, error: "Prototypen blev ikke fundet." };
    }

    const currentItem = items[itemIndex];
    const willBeFeatured = !currentItem.isFeaturedOnFrontpage;

    const currentlyFeatured = items.filter((i) => i.isFeaturedOnFrontpage);

    if (willBeFeatured && currentlyFeatured.length >= 5) {
      return {
        success: false,
        error: "Der kan maksimalt vises 5 prototyper på forsiden. Fjern venligst en anden først.",
      };
    }

    currentItem.isFeaturedOnFrontpage = willBeFeatured;
    if (willBeFeatured) {
      currentItem.featuredOrder = currentlyFeatured.length + 1;
    } else {
      delete currentItem.featuredOrder;
    }

    items[itemIndex] = currentItem;

    await ensureDataDirectory();
    await fs.writeFile(CRAFTS_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorAdminId: user.id,
          actionType: "UPDATE_CRAFT_ARTICLE",
          targetTable: "CraftArticle",
          targetId: slug,
          payloadDelta: {
            isFeaturedOnFrontpage: willBeFeatured,
            featuredOrder: currentItem.featuredOrder ?? null,
          },
        },
      });
    } catch (auditErr) {
      console.warn("Could not write audit log for frontpage feature toggle:", auditErr);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/pos");
    revalidatePath("/katalog");

    const newFeaturedCount = items.filter((i) => i.isFeaturedOnFrontpage).length;
    return { success: true, isFeatured: willBeFeatured, count: newFeaturedCount };
  } catch (error: any) {
    console.error("Failed to toggle frontpage feature status:", error);
    return { success: false, error: error.message || "Kunne ikke opdatere forside-status." };
  }
}
