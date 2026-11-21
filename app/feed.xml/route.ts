import { insights } from "@/lib/resources";
import { BUSINESS, SITE_ORIGIN } from "@/lib/seo-content";
export const dynamic = "force-static";
const xml = (value: string) => value.replace(/[<>&"']/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!);
export function GET() {
  const articles = [...insights].sort((a, b) => b.published.localeCompare(a.published));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${BUSINESS.name} Blog</title><link>${SITE_ORIGIN}/blog</link><description>Practical website, application and software planning guides.</description><language>en-IN</language><atom:link href="${SITE_ORIGIN}/feed.xml" rel="self" type="application/rss+xml"/>${articles.map(article => `<item><title>${xml(article.h1)}</title><link>${SITE_ORIGIN}/blog/${article.slug}</link><guid isPermaLink="true">${SITE_ORIGIN}/blog/${article.slug}</guid><pubDate>${new Date(article.published).toUTCString()}</pubDate><description>${xml(article.answer)}</description><category>${xml(article.category)}</category></item>`).join("")}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
