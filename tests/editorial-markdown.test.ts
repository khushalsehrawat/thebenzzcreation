import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../app/blog/[slug]/index.md/route";
import { insights } from "../lib/resources";
import { buyingGuides } from "../lib/editorial-buying-guides";
import { llmsText } from "../lib/agents";
import { SITE_ORIGIN } from "../lib/seo-content";
import { renderResource } from "../lib/seo";

test("all articles expose matching Markdown answers, citations and canonical source", async () => {
  for (const article of insights) {
    const pathname = `/blog/${article.slug}`;
    const response = await GET(new Request(SITE_ORIGIN + pathname + "/index.md"), { params: Promise.resolve({ slug: article.slug }) });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /^text\/markdown/);
    assert.equal(response.headers.get("x-robots-tag"), "noindex");
    assert.equal(response.headers.get("link"), `<${SITE_ORIGIN}${pathname}>; rel="canonical"`);
    const markdown = await response.text();
    assert.ok(markdown.startsWith(`# ${article.h1}\n`));
    assert.ok(markdown.includes(article.answer));
    assert.ok(markdown.includes(`${SITE_ORIGIN}${pathname}`));
    assert.ok(markdown.includes(`${SITE_ORIGIN}/services/${article.service}`));
    assert.ok(!/<\/?(?:p|div|table|td|th|ul|li|a)\b[^>]*>/.test(markdown), article.slug);
    for (const [heading] of article.sections) assert.ok(markdown.includes(`## ${heading}`));
    for (const faq of article.faqs) assert.ok(markdown.includes(faq.answer));
    for (const ref of article.sources) assert.ok(markdown.includes(`](${ref.url})`));
    assert.ok(llmsText().includes(`${SITE_ORIGIN}${pathname}/index.md`));
    assert.ok((await renderResource(pathname))!.includes(`type="text/markdown" href="${SITE_ORIGIN}${pathname}/index.md"`));
  }
});

test("comparison tables preserve columns while unapproved prices stay unpublished", async () => {
  const response = await GET(new Request(SITE_ORIGIN), { params: Promise.resolve({ slug: "ecommerce-website-india-payment-gateways" }) });
  const markdown = await response.text();
  assert.ok(markdown.includes("| Approach | Can suit | Confirm before committing |\n| --- | --- | --- |"));
  assert.ok(!/USD\s?\d|INR\s?\d/.test(markdown));
  assert.equal(buyingGuides.length, 12);
  assert.equal(new Set(insights.map(({ slug }) => slug)).size, insights.length);
});

test("unknown Markdown articles return 404 rather than a valid-looking document", async () => {
  const response = await GET(new Request(SITE_ORIGIN), { params: Promise.resolve({ slug: "missing-guide" }) });
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("x-robots-tag"), "noindex");
  assert.equal(response.headers.get("link"), null);
});
