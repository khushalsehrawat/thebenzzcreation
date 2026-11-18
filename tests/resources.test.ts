import assert from "node:assert/strict";
import test from "node:test";
import { faqs, insights, resourcePages, BRAND_DESCRIPTION } from "../lib/resources";
import { publicPages, SITE_ORIGIN } from "../lib/seo-content";
import { renderResource, schemaFor } from "../lib/seo";
import sitemap from "../app/sitemap";

test("resources render descriptive HTML, canonical metadata and valid entity references", async () => {
  for (const page of resourcePages) {
    const html = (await renderResource(page.path))!;
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(html.includes(`href="${SITE_ORIGIN}${page.path}"`));
    assert.ok(html.includes('href="/contact"'));
    const graph = JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)![1])["@graph"];
    assert.equal(graph.filter((node: { "@type": string }) => node["@type"] === "Organization").length, 1);
    assert.ok(!html.includes("hreflang="));
    assert.ok(schemaFor(page, [["Home", "/"], [page.title, page.path]]));
  }
  assert.equal(await renderResource("/missing"), undefined);
});

test("FAQ answers and ten categories are server-visible with valid contextual destinations", async () => {
  const html = (await renderResource("/faq"))!;
  assert.equal(new Set(faqs.map((item) => item.category)).size, 10);
  assert.equal(new Set(faqs.map((item) => item.id)).size, faqs.length);
  for (const item of faqs) {
    assert.ok(html.includes(item.question));
    assert.ok(html.includes(item.answer.replaceAll("'", "&#39;")));
    assert.ok(publicPages.some((page) => page.path === item.path));
  }
  assert.ok(html.includes('type="search"'));
});

test("sitemap covers the registry exactly without unverifiable dates or private endpoints", () => {
  const entries = sitemap();
  assert.deepEqual(entries.map((item) => item.url).sort(), publicPages.map((item) => SITE_ORIGIN + item.path).sort());
  assert.ok(entries.every((item) => !item.lastModified && !/\/api\/|\/mcp|#|\?/.test(item.url)));
});

test("guides have substantial distinct content and factual organization identity", async () => {
  for (const guide of insights) {
    const page = resourcePages.find((item) => item.path === `/insights/${guide.slug}`)!;
    const graph = schemaFor(page, [["Home", "/"], [guide.h1, page.path]])["@graph"];
    assert.ok(graph.some((item) => item["@type"] === "Article"));
    assert.ok(guide.sections.map((item) => item[1]).join(" ").length > 1800);
  }
  assert.ok(BRAND_DESCRIPTION.includes("New Delhi"));
});
