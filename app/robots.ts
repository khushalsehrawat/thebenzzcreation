import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo-content";
export default function robots(): MetadataRoute.Robots {
  return {
<<<<<<< HEAD
    rules: { userAgent: "*", allow: "/", disallow: "/api/", other: { "Content-Signal": "search=yes, ai-train=no" } },
=======
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
>>>>>>> 9e1490581b4e85378653d92164c448ef1945e3e4
    sitemap: SITE_ORIGIN + "/sitemap.xml",
    host: SITE_ORIGIN,
  };
}
