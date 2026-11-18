import type { MetadataRoute } from "next";
import { SITE_ORIGIN, publicPages } from "@/lib/seo-content";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({
    url: SITE_ORIGIN + page.path,
    // Omit lastModified until each page has a reliable editorial revision date.
    changeFrequency: page.path === "/privacy" ? "yearly" : "monthly",
    priority:
      page.path === "/" ? 1 : page.path.startsWith("/services") ? 0.8 : 0.5,
  }));
}
