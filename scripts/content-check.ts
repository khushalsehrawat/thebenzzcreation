import assert from "node:assert/strict";
import { loadArticles } from "../lib/content-loader";
import { articleText } from "../lib/editorial-types";
const articles = loadArticles();
assert.equal(articles.length, 12, "Expected twelve starter guides");
for (const article of articles) {
  const words = articleText(article).trim().split(/\s+/).length;
  assert.ok(words >= 1200 && words <= 1800, `${article.slug}: ${words} words, expected 1200–1800`);
  assert.ok(article.faqs.length >= 3 && article.tags?.length && article.author);
  assert.ok(article.related.length >= 2 && article.service);
  assert.ok(article.updated >= article.published && new Date(article.updated).getTime() <= Date.now(), article.slug);
}
console.log(`PASS ${articles.length} starter guides, each 1200–1800 words with author, dates, tags, FAQs and related links.`);
