import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { insights } from "../lib/resources";
import { flagshipArticles } from "../lib/editorial";
import { articleText, readingMinutes } from "../lib/editorial-types";
import { publicPages, SITE_ORIGIN } from "../lib/seo-content";
import { renderResource, renderService } from "../lib/seo";

test("six distinct flagship guides preserve existing slugs and have resolvable topic links", async () => {
  assert.equal(flagshipArticles.length, 6);
  assert.equal(insights.length, 8);
  for (const slug of ["website-project-brief", "custom-software-vs-off-the-shelf"]) {
    assert.ok(insights.some((item) => item.slug === slug));
  }
  const sitemap = await readFile(new URL("../app/sitemap.xml", import.meta.url), "utf8");
  for (const article of insights) {
    assert.ok(sitemap.includes(`<loc>${SITE_ORIGIN}/blog/${article.slug}</loc>`));
    assert.equal(readingMinutes(article), Math.ceil(articleText(article).trim().split(/\s+/).length / 220));
    assert.ok(article.updated >= article.published);
    for (const slug of article.related) assert.ok(insights.some((item) => item.slug === slug));
  }
  for (const article of flagshipArticles) {
    assert.ok(articleText(article).split(/\s+/).length > 750, article.slug);
    assert.ok(article.faqs.length >= 3);
    assert.ok(article.sources.every((source) => new URL(source.url).protocol === "https:"));
  }
});

test("article HTML, schema, FAQ answers and navigation agree", async () => {
  for (const article of insights) {
    const html = (await renderResource(`/blog/${article.slug}`))!;
    assert.ok(!html.includes('href="/insights'));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    const graph = JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)![1])["@graph"];
    const node = graph.find((item: Record<string, unknown>) => item["@type"] === "Article");
    assert.equal(node.headline, article.h1);
    assert.equal(node.datePublished, article.published);
    assert.equal(node.dateModified, article.updated);
    assert.ok(html.includes(`datetime="${article.updated}"`));
    const faq = graph.find((item: Record<string, unknown>) => item["@type"] === "FAQPage");
    assert.equal(faq?.mainEntity.length || 0, article.faqs.length);
    assert.equal(graph.filter((item: Record<string, unknown>) => item["@type"] === "Organization").length, 1);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const match of html.matchAll(/<a\b[^>]*href="(#[^"]+|\/[^"?]*)"/g)) {
      const target = new URL(match[1], SITE_ORIGIN + `/blog/${article.slug}`);
      if (match[1].startsWith("#")) assert.ok(ids.includes(target.hash.slice(1)), match[1]);
      else assert.ok(publicPages.some((page) => page.path === target.pathname), match[1]);
    }
    assert.match(html, /loading="eager" decoding="async" fetchpriority="high"/);
    assert.match(html, /aria-label="On this page"/);
    assert.ok(!html.includes('<script async src="https://www.googletagmanager.com/gtm.js'));
  }
});

test("hub and services expose the topic cluster without requiring browser JavaScript", async () => {
  const html = (await renderResource("/blog"))!;
  for (const article of insights) {
    assert.ok(html.includes(`href="/blog/${article.slug}"`));
    assert.ok((await renderService(article.service))!.includes(`href="/blog/${article.slug}"`));
  }
  assert.equal((html.match(/data-article /g) || []).length, 8);
  assert.match(html, /data-editorial-filters hidden/);
  assert.match(html, /"@type":"Blog"/);
  const automation = flagshipArticles.find((article) => article.slug === "ai-automation-for-small-business")!;
  assert.equal(automation.sections.filter(([heading]) => /^\d+\./.test(heading)).length, 15);
});
