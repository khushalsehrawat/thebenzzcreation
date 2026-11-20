import { readFile, writeFile } from "node:fs/promises";
import { insights } from "../lib/resources";
import { SITE_ORIGIN } from "../lib/seo-content";

async function main() {
  const target = new URL("../app/sitemap.xml", import.meta.url);
  const original = await readFile(target, "utf8");
  let xml = original.replaceAll(`${SITE_ORIGIN}/insights`, `${SITE_ORIGIN}/blog`);
  const entries = insights.filter((item) => !xml.includes(`<loc>${SITE_ORIGIN}/blog/${item.slug}</loc>`));
  if (entries.length) {
    const additions = entries.map((item) => `  <url>\n    <loc>${SITE_ORIGIN}/blog/${item.slug}</loc>\n    <lastmod>${item.updated}</lastmod>\n    <priority>0.7000</priority>\n  </url>\n`).join("");
    xml = xml.replace("</urlset>", additions + "</urlset>");
  }
  if (xml !== original) await writeFile(target, xml);
  console.log(`Sitemap: added ${entries.length} articles; canonical blog URLs synchronized.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
