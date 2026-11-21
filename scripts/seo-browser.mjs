import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3011";
const browser = await chromium.launch({ executablePath: process.env.TEST_BROWSER_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const errors = [], results = [];
await mkdir("artifacts/seo", { recursive: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/", "/services/website-development", "/about", "/global-services", "/pricing", "/blog", "/blog/react-native-vs-native-vs-flutter", "/blog/mobile-app-development-process", "/blog/category/mobile-applications", "/blog/tag/seo", "/blog/page/2", "/work/nsar-workshop"]) {
    assert.equal((await page.goto(base + path, { waitUntil: "networkidle" })).status(), 200);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: overflow at ${width}px`);
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {})));
    });
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    assert.equal(axe.violations.length, 0, `${path}: ${JSON.stringify(axe.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) })))}`);
    assert.equal(await page.locator("h1").count(), 1);
    if (["/", "/services/website-development", "/blog/react-native-vs-native-vs-flutter"].includes(path)) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: `artifacts/seo/${path === "/" ? "home" : path.split("/").at(-1)}-mobile.png`, fullPage: true });
    }
    results.push({ path, widths: [390, 768, 1440], accessibilityViolations: 0 });
    console.log(`PASS browser layout and accessibility ${path}`);
  }
  assert.equal(errors.length, 0, errors.join("\n"));
  await context.close();

  // Enable a test-only ID in the intercepted HTML; production files remain unchanged.
  const consent = await browser.newContext();
  const requests = [];
  await consent.route(/https:\/\/(?:www\.)?(?:googletagmanager\.com|google-analytics\.com)\//, route => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: "application/javascript", body: "/* intercepted QA traffic */" });
  });
  await consent.route(base + "/faq", async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/"measurementId":"[^"]*"/, '"measurementId":"G-QATEST1234"');
    await route.fulfill({ response, body });
  });
  const tab = await consent.newPage();
  await tab.goto(base + "/faq", { waitUntil: "networkidle" });
  assert.equal(requests.length, 0, "No Google requests before consent");
  await tab.locator('[data-choice="granted"]').click();
  await tab.waitForFunction(() => window.dataLayer.some(args => args[0] === "event" && args[1] === "page_view"));
  await tab.waitForFunction(() => document.querySelector('script[data-consent="analytics"]'));
  await tab.evaluate(() => document.addEventListener("click", event => { if (event.target.closest("a")) event.preventDefault(); }));
  for (const selector of ['a[href^="https://wa.me/"]', 'a[href^="tel:"]', 'a.btn']) {
    const link = tab.locator(selector).first();
    if (await link.count()) await link.dispatchEvent("click");
  }
  const events = await tab.evaluate(() => window.dataLayer.filter(args => args[0] === "event").map(args => args[1]));
  assert.ok(events.includes("whatsapp_click") && events.includes("call_click") && events.includes("cta_click"));
  await tab.locator('[data-analytics-settings]').last().click();
  await tab.locator('[data-choice="denied"]').click();
  const before = await tab.evaluate(() => window.dataLayer.filter(args => args[0] === "event").length);
  await tab.locator("a.btn").first().dispatchEvent("click");
  assert.equal(await tab.evaluate(() => window.dataLayer.filter(args => args[0] === "event").length), before);
  await consent.close();
  await writeFile("artifacts/seo/browser-audit.json", JSON.stringify({ pages: results, runtimeErrors: errors, consent: "passed", contactEvents: events }, null, 2));
  console.log("PASS consent gating, CTA/WhatsApp events and consent withdrawal; external analytics requests intercepted.");
} finally { await browser.close(); }
