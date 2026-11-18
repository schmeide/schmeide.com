import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content";
import { listedPages } from "./pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    ...listedPages.map(({ href }) => ({
      url: `${SITE_URL}${href}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
