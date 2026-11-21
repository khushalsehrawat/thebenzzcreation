import { renderedPages } from "./render-pages";
import { mkdir, writeFile } from "node:fs/promises";
import { homepageMarkdown } from "../lib/agents";
import { articleMarkdown } from "../lib/editorial-markdown";
import { insights } from "../lib/resources";
import { services, BUSINESS, SITE_ORIGIN, PRIMARY_MARKETS } from "../lib/seo-content";

async function main() {
await mkdir("public", { recursive: true });
await writeFile("public/llms.txt", `# ${BUSINESS.name}\n\n> Digital development studio based in New Delhi, India. Remote delivery for ${PRIMARY_MARKETS.join(", ")}.\n\nEmail: ${BUSINESS.email}\nPhone: ${BUSINESS.telephone}\n\n## Services\n${services.map(s => `- [${s.name}](${SITE_ORIGIN}/services/${s.slug}): ${s.intro}`).join("\n")}\n\n## Key pages\n- [About](${SITE_ORIGIN}/about)\n- [Work](${SITE_ORIGIN}/work)\n- [Pricing process](${SITE_ORIGIN}/pricing)\n- [Blog](${SITE_ORIGIN}/blog)\n- [Full content](${SITE_ORIGIN}/llms-full.txt)\n- [Contact](${SITE_ORIGIN}/contact)\n\n## Citation guidance\nPreferred citation: TheBenzzCreations, article or page title, canonical page URL. Cite specific pages rather than this index. Prices, delivery dates and support are scoped individually. No verified founder biography or measured client outcomes are published. Access does not guarantee citation.\n`);
const pages = await renderedPages();
const mainPages = [...pages].filter(([route]) => !route.startsWith("/blog")).map(([route, html]) => {
  const main = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g, (_, tag: string, text: string) => `\n\n${"#".repeat(Number(tag[1]))} ${text.replace(/<[^>]+>/g, " ")}\n\n`)
    .replace(/<li\b[^>]*>/g, "\n- ").replace(/<\/(p|div|section|dd)>/g, "\n\n")
    .replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\n{3,}/g, "\n\n").trim();
  return `Canonical source: ${SITE_ORIGIN}${route}\n\n${main}`;
}).join("\n\n---\n\n");
await writeFile("public/llms-full.txt", homepageMarkdown() + "\n\n" + mainPages + "\n\n" + insights.map(article => articleMarkdown(article, SITE_ORIGIN)).join("\n\n---\n\n"));
const key = process.env.INDEXNOW_KEY;
if (key) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("INDEXNOW_KEY must contain 8–128 letters, digits or hyphens");
  await writeFile(`public/${key}.txt`, key);
}
console.log(`Generated AI discovery resources from ${insights.length} articles; IndexNow ${key ? "key written" : "not configured"}.`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
