import { MetadataRoute } from "next";
import { getCraftArticles } from "@/app/actions/crafts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/katalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/admin/pos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Dynamic craft prototype routes
  let craftRoutes: MetadataRoute.Sitemap = [];
  try {
    const crafts = await getCraftArticles();
    craftRoutes = crafts.map((craft) => ({
      url: `${baseUrl}/craft/${craft.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.warn("Could not generate dynamic craft routes for sitemap:", err);
  }

  return [...staticRoutes, ...craftRoutes];
}
