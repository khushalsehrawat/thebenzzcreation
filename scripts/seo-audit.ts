import assert from "node:assert/strict";
import { stat, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { publicPages, SITE_ORIGIN } from "../lib/seo-content";
import { insights } from "../lib/resources";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { renderedPages } from "./render-pages";
import { validateSchema } from "./validate-schema";

const decode = (value: string) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
async function main() {
const pages = await renderedPages();
let child: ReturnType<typeof spawn> | undefined;
let base = "";
try {
  if (process.argv.includes("--built")) {
    const socket = createServer();
    await new Promise<void>(resolve => socket.listen(0, "127.0.0.1", resolve));
    const address = socket.address();
    assert.ok(address && typeof address !== "string");
    const port = address.port;
    await new Promise<void>(resolve => socket.close(() => resolve()));
    base = `http://127.0.0.1:${port}`;
    child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "pipe", windowsHide: true });
    let output = "";
    child.stderr?.on("data", data => { output += data; });
    child.stdout?.on("data", data => { output += data; });
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (child.exitCode !== null) throw new Error(`Production server exited: ${output}`);
      try { ready = (await fetch(base + "/robots.txt")).ok; } catch {}
      if (ready) break;
      await delay(250);
    }
    assert.ok(ready, `Production server did not start: ${output}`);
    for (const route of pages.keys()) {
      const response = await fetch(base + route, { redirect: "manual" });
      assert.equal(response.status, 200, route);
      pages.set(route, await response.text());
      assert.equal(response.headers.get("x-content-type-options"), "nosniff", route);
    }
    const missing = await fetch(base + "/this-page-does-not-exist");
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /noindex/);
    // Node fetch does not reliably transmit a custom Host; use the raw HTTP client.
    for (const host of ["thebenzzcreations.com", "www.thebenzzcreations.com"]) {
      const redirect = await new Promise<{ status: number; location?: string }>((resolve, reject) => {
        const request = httpRequest(base + "/about", { headers: { host, "x-forwarded-proto": "http" } }, response => {
          response.resume(); resolve({ status: response.statusCode!, location: response.headers.location });
        });
        request.on("error", reject); request.end();
      });
      assert.equal(redirect.status, 301, host);
      assert.equal(redirect.location, SITE_ORIGIN + "/about");
    }
    const xml = await (await fetch(base + "/sitemap.xml")).text();
    for (const page of publicPages) assert.ok(xml.includes(`<loc>${SITE_ORIGIN}${page.path}</loc>`), `HTTP sitemap: ${page.path}`);
    for (const path of ["/feed.xml", "/llms.txt", "/llms-full.txt"]) assert.equal((await fetch(base + path)).status, 200, path);
  }
  const titles = new Set<string>(), descriptions = new Set<string>(), headings = new Set<string>();
  const ids = new Map([...pages].map(([route, html]) => [route, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))]));
  for (const page of publicPages) {
    const html = pages.get(page.path)!;
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)![1]);
    const description = decode(attr(html.match(/<meta\b[^>]*name="description"[^>]*>/)![0], "content")!);
    const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => decode(match[1].replace(/<[^>]*>/g, " ")));
    assert.equal(h1.length, 1, `${page.path}: expected one H1`);
    assert.ok(title.length >= 50 && title.length <= 60, `${page.path}: title length ${title.length}`);
    assert.ok(description.length >= 140 && description.length <= 160, `${page.path}: description length ${description.length}`);
    for (const [value, seen, label] of [[title, titles, "title"], [description, descriptions, "description"], [h1[0].toLowerCase(), headings, "H1"]] as const) {
      assert.ok(!seen.has(value), `${page.path}: duplicate ${label}`); seen.add(value);
    }
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
    assert.equal(canonicals.length, 1, page.path);
    assert.equal(attr(canonicals[0][0], "href"), SITE_ORIGIN + page.path);
    for (const field of ["og:title", "og:description", "og:image", "og:url", "og:locale", "twitter:card"]) assert.ok(html.includes(`="${field}"`), `${page.path}: missing ${field}`);
    assert.match(html, /<meta name="robots" content="index,follow/);
    validateSchema(html, page.path);
    for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/g)) {
      assert.ok(/\balt="[^"]*"/.test(tag), `${page.path}: image missing alt`);
      assert.ok(attr(tag, "width") && attr(tag, "height"), `${page.path}: image missing dimensions`);
    }
    for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
      if (!href || /^(mailto:|tel:|https?:\/\/)/.test(href) && !href.startsWith(SITE_ORIGIN)) continue;
      const target = new URL(decode(href), SITE_ORIGIN + page.path);
      if (target.origin !== SITE_ORIGIN) continue;
      if (pages.has(target.pathname)) {
        if (target.hash) assert.ok(ids.get(target.pathname)!.has(decodeURIComponent(target.hash.slice(1))), `${page.path}: broken fragment ${href}`);
      } else if (!["/feed.xml", "/llms.txt", "/llms-full.txt"].includes(target.pathname)) {
        await stat(`public${decodeURIComponent(target.pathname)}`).catch(() => { throw new Error(`${page.path}: broken internal link ${href}`); });
      }
    }
    for (const [, src] of html.matchAll(/(?:<img\b[^>]*src|<script\b[^>]*src|<link\b[^>]*href)="(\/[^"?#]+)"/g)) {
      if (pages.has(src) || ["/icon.svg", "/feed.xml", "/index.md"].includes(src) || src.endsWith("/index.md")) continue;
      await stat(`public${src}`).catch(() => { throw new Error(`${page.path}: missing asset ${src}`); });
    }
  }
  const mapped = sitemap().map(item => item.url);
  assert.deepEqual(new Set(mapped), new Set(publicPages.map(page => SITE_ORIGIN + page.path)));
  const rules = robots().rules;
  assert.ok(Array.isArray(rules));
  for (const agent of ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"]) assert.ok(rules.some(rule => rule.userAgent === agent && rule.allow === "/"), agent);
  for (const article of insights) for (const slug of article.related) assert.ok(insights.some(item => item.slug === slug), `${article.slug}: missing related ${slug}`);
  await mkdir("artifacts/seo", { recursive: true });
  await writeFile("artifacts/seo/build-audit.json", JSON.stringify({ mode: base ? "production HTTP" : "rendered source", pages: [...pages.keys()], passed: true }, null, 2));
  console.log(`PASS ${pages.size} pages: unique metadata/H1/canonical, JSON-LD, links/fragments, assets, image attributes, sitemap and explicit crawler rules${base ? ", production HTTP routes and 301/404 responses" : ""}.`);
} finally { child?.kill(); }

}
main().catch(error => { console.error(error); process.exitCode = 1; });
