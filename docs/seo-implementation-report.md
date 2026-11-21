# SEO implementation report — 2026-11-18

## Site-wide audit — 21 November 2026

This section supersedes the historical inventory below. Scope: local source and production-build checks, direct public HTTP inspection of `https://www.thebenzzcreations.com`, official search documentation and a small backlink sample. It is not a Search Console property inspection, exhaustive backlink database audit, production field-performance measurement or proof of AI citations.

### Verified production evidence

- All 41 registered HTML pages returned HTTP 200 with one H1, a description, a declared canonical and index/follow directives. Titles were unique in this sample. This establishes accessibility to the audit client, not indexing.
- `robots.txt`, `sitemap.xml` and `llms.txt` returned 200. The sitemap contains 49 entries: 41 HTML pages, seven enquiry-preselection query variants and the llms text resource. The blog has twenty articles.
- The sampled full-text ERP article Markdown endpoint returned 200 with `X-Robots-Tag: noindex`, preserving HTML as the indexable primary version. A deliberately nonexistent page returned 404.
- Homepage requests using the Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot user-agent strings returned 200. These are indicative access probes from this audit client, not verified crawler IPs, evidence of a crawler visit or proof of access from all networks. The wildcard robots rule permits public content; `/api/` remains excluded.
- HTTP requests redirect to HTTPS with 308. The HTTPS apex/non-www homepage redirects to www with **307**, a temporary redirect. A permanent 301/308 at the hosting/domain layer is the recommended follow-up. The local Next configuration already requests a permanent canonical-host redirect, so an upstream hosting rule needs review.
- The sampled trailing-slash URL redirects with 308 to its slashless canonical. `/insights` redirects with 308 toward `/blog/`; check for a needless trailing-slash normalization hop when adjusting host redirects.
- The existing Google verification token and GA4 ID `G-Q9JRF078F9` appear in public HTML. The source configures consent-gated `GTM-PGV57RK3`. No Bing HTML verification tag was observed; that does not establish an unverified Bing property because DNS verification/import may be used.
- [NSAR 2026](https://www.nsar2026.org/) has a public footer credit linking to TheBenzzCreations. This is at least one independently observed backlink source, not a total link/referring-domain count or endorsement of every service.

Evidence files are ignored local artifacts: `artifacts/live-seo-audit.json`, `artifacts/link-audit-report.json` and `artifacts/seo-report.json`. Public HTTP requests initially hit execution-sandbox network restrictions; the direct audit succeeded outside that network restriction. The earlier access failures must not be reported as website outages.

### Local improvements in this audit

The broader accessibility pass found `label-content-name-mismatch` on the shared blog-card link: visible text was “Read guide” while its accessible name was “Read {title}”. Its accessible name now begins “Read guide: {title}”, preserving both the visible phrase and destination context. The earlier blog-only audit used a narrower rule selection; it now also includes WCAG 2.2 AA and best-practice tags.

Article JSON-LD now references the actual studio Organization as author, in addition to publisher, and includes the visible official source URLs as CreativeWork citations. It does not invent an individual author, qualification or reviewer. Article sharing metadata now uses `og:type=article` with authored publication/revision dates and category. These changes improve consistency and attribution; they are not guaranteed ranking factors or AI-citation triggers. Deploy these local fixes through the existing release workflow after review; this audit did not publish them.

Validation: 31 unit tests, type checking, lint and production build passed. The original broad production-build audit completed 135 checks: 93 passed and 42 failed on the same shared blog-card accessible-name defect. After the fix, the targeted rerun passed **84 checks with zero failures**: metadata/HTML for all 41 pages, 42 desktop/mobile blog accessibility scans and runtime-error checks. The updated blog suite also passed all 21 pages at four layout widths and seven behavior groups, including its expanded accessibility rules. Reports are in `artifacts/seo-before-audit-fix.json`, `artifacts/seo-targeted-report.json` and `artifacts/blog/report.json`. Local throttled lab samples recorded LCP approximately 1.01–1.52 seconds and CLS 0 for four representative routes; these are diagnostics, not production field measurements or a performance guarantee.

### Remaining work, in priority order

| Priority | Action | Why / evidence needed |
| --- | --- | --- |
| High | Inspect the actual Google and Bing properties | Confirm verified ownership, submitted sitemap, index coverage, selected canonicals, search queries and country/device performance. Public tags cannot show this. |
| High | Check the hosting apex-to-www redirect | Public HTTPS apex response is 307. Make permanent and reduce avoidable redirect hops. |
| High | Add original evidence to the three existing portfolio pages | Confirm project role, constraints, implementation details, screenshots, release dates and any approved outcomes. Do not invent client references or metrics. |
| High | Establish backlink and citation baseline | Connected Semrush reports are unavailable because the account has no API units left. Export Search Console Links and/or obtain a usable backlink report; no authority score or total is asserted. |
| Medium | Review sitemap hygiene | Seven `?service=` variants canonicalize to the homepage and do not need separate search entries; llms.txt is a discovery resource rather than a commercial landing page. These inherited entries were preserved because earlier project requirements requested them. Consider a canonical-HTML-only sitemap while retaining the actual preselection links and llms discovery elsewhere. |
| Medium | Verify analytics consent and conversion in the actual properties | Local consent and event checks cannot audit container contents, production retention or inbox acceptance. Avoid duplicate GA4 page-view configuration in GTM. |
| Medium | Measure production page experience | Use PageSpeed Insights and Search Console field data where available. Local lab LCP/CLS diagnostics do not establish production CWV or INP. |
| Medium | Confirm genuine local-business eligibility and profiles | Current verified location is New Delhi, India. Add a Google Business Profile/Maps identity only when eligible and owner-confirmed. No invented office, postal address, opening hours or overseas location is appropriate. |
| Medium | Expand editorial identity and review evidence | The studio is the current responsible publishing entity. Add real author/reviewer biographies and relevant project experience only when confirmed. Only Instagram is currently owner-confirmed in `sameAs`; add a real LinkedIn/company profile if supplied. |
| Later | Add localized equivalents where there is actual demand | Current English pages target India, US, UK, UAE and Canada through substantive service/delivery content. Lack of hreflang is intentional because equivalent localized versions do not exist. |

### Practical expansion plan

There is no search-engine maximum or useful universal ideal page count. Recommended next batch: **6–8 genuinely new pages over roughly 8–12 weeks**, paced by available evidence and indexing results, plus improvements to the three existing work pages. This is editorial planning judgment, not a Google quota or traffic forecast.

Prioritize one evidence-backed New Delhi service page, two workflow/industry implementation guides grounded in real delivery knowledge, two or three original checklists or worked examples, and one editorial process/author page when identity information is available. Do not create overlapping ERP-cost or provider lists already covered by the twenty articles. A second country page is justified only by useful market-specific details, not a country-name substitution. A later Hindi, Arabic or French version needs a real translation and maintenance owner, separate URLs and reciprocal hreflang. Review query data before expanding further.

Earn additional mentions through accurate company profiles, approved project credits, useful original resources and relevant industry contributions. Do not buy bulk backlinks, create fake reviews, or publish hundreds of city-swapped doorway pages. Linking out to Google, Salesforce or another authoritative source does not create an inbound backlink to this site.

### Search and AI expectations

[Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) says that indexable, snippet-eligible pages and normal SEO fundamentals apply to AI Overviews/AI Mode; no special AI text file or schema is required. Existing llms.txt, Markdown and MCP resources are supplementary and do not prove ChatGPT, Claude, Gemini, Grok or Perplexity will consume or cite them. Actual citations and referrals need observation. Bing's [AI Performance reporting](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) can show supported Microsoft/partner experiences, not every AI platform.

Google's [documentation updates](https://developers.google.com/search/updates) state that FAQ rich results stopped appearing in May 2026. Visible FAQs remain useful, and matching FAQPage markup may remain semantic metadata; do not promise Google FAQ rich results. [Article author guidance](https://developers.google.com/search/docs/appearance/structured-data/article), [international site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) and [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) informed the recommendations.

The [search-console setup document](search-console-setup.md) now contains the direct Google/Bing setup, validation and measurement links. Tokens, account verification, business listings, sitemap submissions, backlink outreach and production deployment were not changed by this audit.

## Historical implementation — 18 November 2026

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
