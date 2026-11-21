import assert from "node:assert/strict";
import { renderedPages } from "./render-pages";

type Node = Record<string, unknown>;
export function validateSchema(html: string, route: string) {
  const text = (value: string) => value.replace(/<span\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/g, "").replace(/<\/?(?:a|span|strong|em|b)\b[^>]*>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
  const visibleFaqs = [...html.matchAll(/<details\b[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>[\s\S]*?<\/details>/g)].map(([, question, answer]) => ({ question: text(question), answer: text(answer) }));
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length, `${route}: missing JSON-LD`);
  for (const [, source] of scripts) {
    const data = JSON.parse(source);
    assert.equal(data["@context"], "https://schema.org", route);
    assert.ok(Array.isArray(data["@graph"]), `${route}: missing graph`);
    const graph = data["@graph"] as Node[];
    const ids = graph.map(node => node["@id"]);
    assert.equal(new Set(ids).size, ids.length, `${route}: duplicate entity identifiers`);
    for (const node of graph) {
      assert.ok(node["@type"] && node["@id"], `${route}: missing type or identifier`);
      if (["Article", "BlogPosting"].includes(String(node["@type"]))) {
        for (const field of ["headline", "datePublished", "dateModified", "author", "publisher", "image", "mainEntityOfPage"]) assert.ok(node[field], `${route}: Article missing ${field}`);
      }
      if (node["@type"] === "Service") for (const field of ["provider", "areaServed", "serviceType", "description"]) assert.ok(node[field], `${route}: Service missing ${field}`);
      if (node["@type"] === "FAQPage") {
        for (const question of node.mainEntity as { name: string; acceptedAnswer: { text: string } }[]) {
          assert.ok(question.name && question.acceptedAnswer.text, `${route}: incomplete FAQ`);
          assert.ok(visibleFaqs.some(item => item.question === question.name && item.answer === question.acceptedAnswer.text), `${route}: FAQ schema differs from visible answer: ${question.name}`);
        }
      }
    }
    assert.ok(!/"(?:AggregateRating|Review)"|"ratingValue"/.test(source), `${route}: reviews need a separately verified data source`);
  }
}
if (process.argv[1]?.replaceAll("\\", "/").endsWith("/validate-schema.ts")) {
  async function main() {
  const pages = await renderedPages();
  for (const [route, html] of pages) validateSchema(html, route);
  console.log(`PASS JSON-LD syntax, entity identifiers and required fields on ${pages.size} pages. External rich-result eligibility is separate.`);
  }
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
