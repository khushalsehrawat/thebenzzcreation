import type { MetadataRoute } from "next";
import { CONTENT_UPDATED, publicPages, SITE_ORIGIN } from "@/lib/seo-content";
import { insights } from "@/lib/resources";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map(page => ({
    url: SITE_ORIGIN + page.path,
    lastModified: insights.find(article => page.path === `/blog/${article.slug}`)?.updated || CONTENT_UPDATED,
  }));
}
