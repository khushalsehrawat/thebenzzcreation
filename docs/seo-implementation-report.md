# SEO implementation report — 2026-11-18

## Delivered

Five new indexable pages bring the shared registry to 23 canonical public pages:

- `/faq`: 17 practical answers across ten categories, client search with live result counts, native keyboard-accessible accordions, stable answer IDs and useful contextual links. Every answer remains in server HTML without JavaScript.
- `/global-services`: international discovery, time-zone planning, market considerations, dependencies and handover, linked throughout the site.
- `/insights`: a small maintainable planning hub.
- `/insights/website-project-brief`: actionable briefing, scope and acceptance guidance.
- `/insights/custom-software-vs-off-the-shelf`: workflow fit, operating cost, integration and build/buy trade-offs.

Preserved the existing visual identity, hero, animations, carousel, seven genuine services, three portfolio examples, routes, form providers and consent-based analytics. Improved homepage supporting positioning and project CTA, About identity/capabilities/project links, Contact enquiry preparation, and contextual service links. Fixed information-page mobile overflow and CTA contrast, active service contrast, and privacy wording. Corrected stale browser redirect expectations.

## Technical SEO, entity and discovery

- Existing server-rendered HTML architecture retained; new pages reuse the central canonical, title, description, OG/Twitter, JSON-LD and breadcrumb utilities.
- `/faq` now serves its own resource; `/faq.html` redirects there. Existing homepage FAQ fragment remains available.
- All new routes enter the sitemap, Markdown, llms.txt and public page catalogue through the central registry. Conventional discovery remains the priority.
- Removed unverified site-wide lastModified dates. No dynamic timestamps substitute for editorial changes.
- Added optional Bing verification token configuration; retained existing Google verification and analytics settings.
- Reused factual entity description; one stable Organization ID. Added Article schema for the two dated guides without invented individual authors.
- Five branded 1200×630 JPEG previews generated through the existing asset pipeline. Responsive portfolio assets retained.
- Commercial FAQPage markup omitted; no promised rich results. No artificial hreflang, ratings, overseas offices or localized doorway pages.

## Source changes

| Area | Files |
| --- | --- |
| Routes | app/faq/route.ts, app/global-services/route.ts, app/insights/route.ts, app/insights/[slug]/route.ts |
| Content and rendering | lib/resources.ts, lib/seo-content.ts, lib/seo.ts, site/index.html |
| Discovery/configuration | app/sitemap.ts, next.config.ts, .env.example |
| Interaction and style | public/reference/faq.js, public/reference/seo.css |
| Asset generation | scripts/generate-seo-assets.tsx; public/social/faq.jpg, global-services.jpg, insights.jpg, website-project-brief.jpg, custom-software-vs-off-the-shelf.jpg |
| Validation | tests/resources.test.ts, tests/seo.test.ts, scripts/seo-check.mjs, scripts/browser-check.mjs |
| Maintainable intent inventory | scripts/write-keyword-map.ts; regenerate with `npx tsx scripts/write-keyword-map.ts` |
| Documentation | seo-audit.md, seo-keyword-map.md, international-seo.md, seo-implementation-report.md, search-console-setup.md, brand-facts.md, external-link-inventory.md |

## Validation

- Baseline: build, lint and typecheck passed; tests 20/21 (privacy copy failure).
- Updated unit suite: 25/25 passed, including new metadata/schema, FAQ, contextual destination, sitemap and guide assertions.
- ESLint and TypeScript: passed.
- Final production build: passed; all five new pages prerendered.
- Browser regression: 23/23 passed, including 360–1920px layouts, navigation, menu keyboard/focus, previews, concepts, FAQ, mocked form success/failure, consent, reduced motion and runtime errors.
- Eight targeted desktop/mobile accessibility rechecks passed after correcting contrast and wrapping defects found by the first broad scan.
- Final complete SEO/browser crawl: **79/79 passed**, covering all 23 canonical routes, internal URL/fragment targets, sitemap, redirects, asset validation, **46 desktop/mobile axe scans with zero violations**, FAQ interactions, consent/conversions and simulated mobile loading. No browser runtime errors.
- Git whitespace check: passed.

Local browser reports and screenshots are in ignored `artifacts/`. Mocked forms do not send real enquiries. Lab LCP/CLS values are not field Core Web Vitals; no field INP or guaranteed performance outcome is claimed. Schema JSON syntax and entity structure are checked locally; external Rich Results Test remains a manual action.

Final local mobile lab (390px viewport, 4× CPU slowdown, 1.6Mbps download, 150ms latency): homepage LCP 1.704s / CLS 0; website service LCP 1.036s / CLS 0. Long tasks were still observed (839ms total homepage, 397ms service); these measurements do not establish field INP. Retain real-user monitoring as a follow-up rather than claiming all performance targets are proven.

## Owner actions and verification limits

Follow [search-console-setup.md](search-console-setup.md) for Google/Bing ownership, sitemap submission and production inspections. No deployment, console submission, indexing request, external message or DNS change occurred.

Confirm project contribution, stack, commissioned/demo status and measured outcomes before expanding case studies. INOX lacks repository evidence and was not added. SwiftPDF could not be retrieved by the web tool; verify its existing destination manually. NSAR's live footer credits the studio; the therapist example's professional claims are not endorsed. Confirm provider origin restrictions and actual inbox delivery separately. Keep production forwarding headers trusted and use a shared rate limiter if deploying multiple instances.

Regional pages, standalone technology pages, fixed prices, code ownership promises and response guarantees were deliberately not fabricated. Keyword themes are hypotheses requiring query/account data. The latest Semrush retry connected successfully, but every keyword report was marked unavailable because the connected account has no API units left. No volume, difficulty or CPC figures were fabricated. Review https://www.semrush.com/mcp-access for the account access reported by the connector; no subscription or credit changes were made. Future work should follow verified demand and approved project evidence, rather than expanding page count alone.
