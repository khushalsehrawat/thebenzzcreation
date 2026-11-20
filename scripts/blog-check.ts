import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { insights } from "../lib/resources";
import { SITE_ORIGIN, publicPages } from "../lib/seo-content";

async function main() {
  const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3011";
  const browser = await chromium.launch({
    executablePath: process.env.TEST_BROWSER_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const googleRequests: string[] = [];
  const errors: string[] = [];
  await context.route(/https:\/\/(?:www\.)?(?:googletagmanager\.com|google-analytics\.com)\//, (route) => {
    googleRequests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "/* QA: no real tracking */" });
  });
  const report: { pages: unknown[]; checks: string[] } = { pages: [], checks: [] };
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await mkdir("artifacts/blog", { recursive: true });
  try {
    for (const path of ["/blog", ...insights.map(({ slug }) => `/blog/${slug}`)]) {
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, path);
      await page.evaluate(() => document.fonts.ready);
      if (await page.locator('.analytics-panel:not([hidden])').count()) {
        assert.equal(googleRequests.length, 0);
        await page.locator('[data-choice="denied"]').click();
      }
      assert.equal(await page.locator("h1").count(), 1);
      const meta = publicPages.find((item) => item.path === path)!;
      assert.equal(await page.title(), meta.title);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), SITE_ORIGIN + path);
      assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), meta.description);
      const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
      assert.ok(graph.some((node: Record<string, unknown>) => node["@type"] === (path === "/blog" ? "Blog" : "Article")));
      for (const width of [390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} overflow at ${width}px`);
      }
      if (path === "/blog" || path.endsWith("website-development-cost-2026")) {
        await page.locator("footer").scrollIntoViewIfNeeded();
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.screenshot({ path: `artifacts/blog/${meta.key}-desktop.png`, fullPage: true });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      if (path === "/blog" || path.endsWith("website-development-cost-2026")) {
        await page.screenshot({ path: `artifacts/blog/${meta.key}-mobile.png`, fullPage: true });
      }
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.equal(result.violations.length, 0, `${path}: ${JSON.stringify(result.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(({ target }) => target) })))}`);
      const missing = await page.locator("main img").evaluateAll((images) => images.filter((image) => !(image as HTMLImageElement).complete || !(image as HTMLImageElement).naturalWidth).map((image) => (image as HTMLImageElement).src));
      // Related cards are lazy: validate their assets through HTTP below.
      for (const src of missing) assert.equal((await context.request.get(src)).status(), 200);
      report.pages.push({ path, status: 200, widths: [390, 768, 1024, 1440], accessibilityViolations: result.violations.length });
      console.log(`PASS metadata, responsive layout and accessibility ${path}`);
    }
    await page.goto(base + "/blog", { waitUntil: "networkidle" });
    await page.locator("#guide-search").fill("website cost");
    assert.equal(await page.locator("[data-article]:visible").count(), 1);
    await page.locator("#guide-category").selectOption("AI & Automation");
    assert.equal(await page.locator("[data-article]:visible").count(), 0);
    assert.ok(await page.locator("[data-editorial-empty]").isVisible());
    await page.getByRole("button", { name: "Reset filters" }).click();
    await page.waitForFunction(() => document.querySelectorAll("[data-article]:not([hidden])").length === 8);
    await page.locator("#guide-category").selectOption("AI & Automation");
    assert.equal(await page.locator("[data-article]:visible").count(), 1);
    report.checks.push("Search, category intersection, empty state and reset");

    await page.goto(base + "/blog/website-development-cost-2026", { waitUntil: "networkidle" });
    await page.getByRole("navigation", { name: "On this page", exact: true }).getByRole("link", { name: "Frequently asked questions" }).click();
    const summary = page.locator(".editorial-faq summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    assert.ok(await page.locator(".editorial-faq details").first().getAttribute("open") !== null);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy link" }).click();
    await page.waitForFunction(() => document.querySelector("[data-copy-status]")?.textContent === "Link copied.");
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), SITE_ORIGIN + "/blog/website-development-cost-2026");
    report.checks.push("TOC anchor, keyboard FAQ and canonical clipboard link");
    assert.equal(googleRequests.length, 0, "No Google requests before consent");
    await page.locator("footer [data-analytics-settings]").click();
    await page.locator('[data-choice="granted"]').click();
    await page.waitForFunction(() => document.querySelectorAll('script[src*="googletagmanager.com"]').length === 2);
    assert.equal(await page.locator('script[src*="gtm.js?id=GTM-PGV57RK3"]').count(), 1);
    await page.locator("footer [data-analytics-settings]").click();
    await page.locator('[data-choice="denied"]').click();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('script[src*="googletagmanager.com"]').count(), 0);
    report.checks.push("GTM and GA consent loading, single container and persisted withdrawal");

    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    try {
      const plain = await nojs.newPage();
      await plain.goto(base + "/blog");
      assert.equal(await plain.locator("[data-article]").count(), 8);
      await plain.goto(base + "/blog/website-development-cost-2026");
      assert.ok((await plain.locator(".editorial-prose").innerText()).includes("USD 6,000"));
      await plain.locator(".editorial-faq summary").first().click();
      assert.ok(await plain.locator(".editorial-faq details p").first().isVisible());
    } finally { await nojs.close(); }
    report.checks.push("All guides, article text and native FAQ work without JavaScript");

    for (const slug of ["missing-guide", "website-development-cost-2025"]) {
      assert.equal((await context.request.get(base + "/blog/" + slug)).status(), 404);
    }
    for (const suffix of ["", ...insights.map(({ slug }) => "/" + slug)]) {
      const legacy = await context.request.get(base + "/insights" + suffix + "?ref=migration", { maxRedirects: 0 });
      assert.equal(legacy.status(), 308);
      const destination = new URL(legacy.headers().location, base);
      assert.equal(destination.pathname, "/blog" + suffix);
      assert.equal(destination.search, "?ref=migration");
    }
    report.checks.push("Nine permanent Insights redirects preserve article slugs and query strings");
    const xml = await (await context.request.get(base + "/sitemap.xml")).text();
    const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    assert.equal(sitemapUrls.length, new Set(sitemapUrls).size);
    assert.ok(!sitemapUrls.some((url) => new URL(url).pathname.startsWith("/insights")));
    for (const article of insights) assert.ok(sitemapUrls.includes(SITE_ORIGIN + `/blog/${article.slug}`));
    assert.ok((await (await context.request.get(base + "/robots.txt")).text()).includes("Sitemap: " + SITE_ORIGIN + "/sitemap.xml"));
    const links = new Set<string>();
    for (const article of insights) {
      const doc = await (await context.request.get(base + `/blog/${article.slug}`)).text();
      for (const [, href] of doc.matchAll(/<a\b[^>]*href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) links.add(href);
    }
    for (const href of links) assert.equal((await context.request.get(base + href)).status(), 200, href);
    report.checks.push(`Sitemap, robots, missing-route 404s and ${links.size} internal destinations`);
    assert.deepEqual(errors, []);
    await writeFile("artifacts/blog/report.json", JSON.stringify(report, null, 2));
    console.log(`PASS ${report.pages.length} pages; ${report.checks.length} behavior groups; no browser errors`);
  } finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
