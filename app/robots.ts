import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo-content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: ["*", "Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"].map(userAgent => ({ userAgent, allow: "/", disallow: ["/api/", "/mcp"] })),
    sitemap: SITE_ORIGIN + "/sitemap.xml",
    host: SITE_ORIGIN,
  };
}
