# Blog implementation report

## Expansion completed locally — 21 November 2026

Added all twelve requested buying guides in `lib/editorial-buying-guides.ts`, bringing the blog to twenty articles. They answer the cleaned questions directly, with distinct procurement criteria, comparison or budgeting tables where useful, at least three FAQs each, official reference links, related reading and relevant studio service/contact links. Provider lists disclose the publisher's commercial role; assumptions and unverified credentials are not presented as established facts. Supplied keyword-volume figures are omitted because their source and measurement context were not provided.

All twenty articles now have full-text Markdown at `/blog/{slug}/index.md`, produced from the same editorial data. The alternate is advertised in the HTML head and `llms.txt`; responses retain canonical attribution and use `X-Robots-Tag: noindex`. This supplements the indexable HTML rather than creating a second canonical article tree. No AI promotion instructions or external promotional posts were added. Crawl permissions remain open for public pages; production hosting and indexing have not been verified.

Twelve canonical articles were added to the sitemap (49 entries total). The existing asset generator produced twelve additional social JPEGs and three responsive WebP widths per article. Existing articles keep their publication dates. The new guides use the authoring/review date 21 November 2026.

Validation for this revision:

- `npm test`: 31 passing tests, including Markdown content/source parity, comparison-table conversion, canonical attribution, unknown-article 404s and existing schema/navigation coverage.
- `npm run typecheck` and `npm run lint`: passed.
- `npm run build`: passed, including static HTML and Markdown generation for all twenty articles.
- `npm run test:blog` against the production build: 21 pages, four viewport widths (390, 768, 1024 and 1440), zero detected axe violations and no browser errors. Seven behavior groups cover filtering, keyboard FAQ/share controls, analytics consent, no-JavaScript content, Markdown responses, legacy redirects and crawl/link integrity.
- ERP partner-guide mobile screenshot visually inspected. Screenshots and machine-readable results are under ignored `artifacts/blog/`.

No deployment, search-engine submission, AI-service submission, Git commit/push or third-party message was performed. Rankings, impressions and AI citations require post-deployment measurement and are not guaranteed. The original implementation record follows as historical context.

Completed locally on 20 November 2026. No deployment, Git commit/push, Search Console submission or external promotional posting was performed.

## Audit and architecture

The project uses Next.js 16.4.5, React 19.3.1 and App Router route handlers that return full HTML for marketing pages. Shared metadata, Organization identity, header/footer and content rendering live in `lib/seo.ts`. Metadata APIs for React pages do not wrap these route responses, so the implementation retains the existing HTML head renderer rather than emitting a second conflicting metadata system in `layout.tsx`.

Reviewed the existing guide routes and registry, service and portfolio rendering, homepage template, layout, fonts/design styles, responsive navigation, form delivery and consent scripts, robots, supplied static sitemap, social-image generation, discovery endpoints and existing tests/documentation. The two original guides covered a website brief and custom vs off-the-shelf software. Their text and slugs remain intact. At the owner's request, `/insights` and its article URLs now permanently redirect to matching `/blog` URLs with status 308; canonical links, navigation, schema, discovery resources and sitemap use `/blog`.

## Content delivered

Six new complete guides are implemented under `/blog`:

1. `software-needed-to-start-a-business`: cornerstone with eight business types, records ownership, security, buying/building decisions and implementation checklist.
2. `website-development-cost-2026`: scope/rate planning, five independent currency scenarios, recurring costs, supplier comparison and first-year worksheet.
3. `ai-automation-for-small-business`: fifteen workflows, each describing problem, integration, qualitative complexity, limitations, privacy and human approval.
4. `wordpress-vs-nextjs-vs-shopify`: distinct CMS/framework/platform roles, operational comparison and business-specific selection criteria.
5. `mobile-app-development-cost-2026`: illustrative MVP/moderate/complex budgets, Android/iOS/cross-platform tradeoffs, backend/admin, release and maintenance.
6. `shopify-vs-woocommerce-vs-custom-ecommerce`: catalog, stock, payments, fulfilment, international eligibility, migration, ownership and maintenance.

The existing `website-project-brief` and `custom-software-vs-off-the-shelf` receive the reusable editorial layout, calculated reading times, related reading, sharing and service connections. Their original publication dates remain unchanged. No overlapping SaaS article or speculative supporting pages were added. Future topic opportunities and unposted excerpts are documented in the strategy.

## Visual and technical changes

- Typed editorial content in `lib/editorial.ts`, shared types/reading estimates in `lib/editorial-types.ts`, and reusable index/article HTML in `lib/editorial-view.ts`.
- New editorial CSS scoped to Blog and a small optional enhancement script. Site fonts, colors, branding, header/footer and existing interactions remain in use.
- Featured article, responsive cards, search/category intersection, reset and empty state; all articles available without filtering JavaScript.
- Article contents navigation, direct answer, readable prose, scrollable accessible comparison tables, native FAQs, contextual service CTA, publisher and source notes, canonical sharing and related cards.
- The inherited global `header` rule initially affected the nested article header during QA. A scoped static-position override fixes the conflict; the real site navigation remains fixed.
- Branded typographic social artwork, responsive WebP variants, explicit image dimensions, eager article hero and lazy cards. No new external font, animation or UI dependency.
- Article date/category metadata, Blog hub schema, visible-content-aligned Article/FAQPage schema, shared Organization/WebSite/WebPage/BreadcrumbList identifiers.
- Main navigation and relevant service backlinks. Existing discovery resources inherit the registry additions.
- Six sitemap additions produce 37 entries. Nine hub/article URLs have moved from `/insights` to `/blog`; unrelated supplied entries and existing dates remain unchanged. `sitemap:sync` normalizes legacy blog paths, appends missing articles and runs before production builds.
- GTM `GTM-PGV57RK3` remains installed. Its loader now runs inside the existing consent flow alongside GA, once after consent. No extra Tag Manager instance or no-JavaScript tracking iframe was added. Confirmed-enquiry delivery/events and personal-data minimization remain in the existing integration.

The complete layout, titles and descriptions are inspectable in source; no runtime content-generation API or secret is required.

## Verified references

Official references researched on 20 November 2026:

- [Shopify plans](https://www.shopify.com/pricing): US Basic annual billing displayed at USD 29/month equivalent; distinguish annual, monthly and promotional terms.
- [WooCommerce pricing model](https://woocommerce.com/pricing/): free core software, separately budgeted hosting/extensions/processing. Competitor comparison figures were not used as independent market evidence.
- [Apple enrollment](https://developer.apple.com/programs/enroll/): USD 99 annual membership with possible regional differences.
- [Google Play account setup](https://support.google.com/googleplay/android-developer/answer/6112435): USD 25 one-time registration plus verification and applicable testing requirements.
- [WordPress features](https://wordpress.org/about/features/) and [hardening](https://developer.wordpress.org/advanced-administration/security/hardening/).
- [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying): deployment choice and feature limitations.
- [React Native platform-specific code](https://reactnative.dev/docs/platform-specific-code) and [Flutter architecture](https://docs.flutter.dev/resources/architectural-overview).
- [Shopify Payments supported countries](https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries) and [international selling](https://help.shopify.com/en/manual/international).
- [NCSC small-organisations security guidance](https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security) and [NIST AI risk resources](https://www.nist.gov/itl/ai-risk-management-framework). CISA fetches returned 403, so the article uses the accessible NCSC source.

Development budgets and local hourly rates are labeled editorial assumptions, not sourced market estimates, measured savings or studio quotes. No live exchange-rate conversion is claimed. Platform recommendations are editorial analysis of business requirements, not vendor certifications.

## Executed validation

| Check | Result |
| --- | --- |
| `npm test` | 28 tests passed, including three editorial validation groups |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; all eight article paths statically generated |
| `npm run test:blog` against production server | Passed after migration: hub + eight articles; six behavior groups, including nine old-URL redirects with query preservation |
| Responsive checks | Nine pages at 390, 768, 1024 and 1440 pixels; no horizontal document overflow |
| Axe accessibility | Nine mobile page scans; zero WCAG 2 A/AA and 2.1 AA violations in the automated scan |
| Targeted existing SEO suite | 32 checks passed: metadata on all 29 public routes, sitemap/robots/redirects, consent/enquiry behavior and browser errors |
| Post-migration SEO rerun | 30 checks passed: metadata on all 29 public routes and sitemap/robots/canonical redirects using `/blog` |
| Blog interaction checks | Search/category/reset/empty state, keyboard FAQ, TOC anchor, canonical clipboard, no-JS content, 404s and 27 internal destinations passed |
| Consent checks | No Google requests before consent or after persisted withdrawal; one GTM instance after grant; confirmed enquiries counted only with consent |
| Schema checks | JSON parsing, shared entity uniqueness, Article dates/headline, FAQ consistency and Blog presence passed |

Automated schema checks validate the project's syntax and visible-content consistency. Google Rich Results Test / Schema Markup Validator were not submitted remotely, and eligibility for a search feature is not established by these tests. Automated Axe results do not replace a complete manual assistive-technology audit. The full unfiltered historic browser/SEO suite was not run; the exact targeted checks above were executed.

Browser screenshots and JSON reports are in ignored `artifacts/blog/`. The initial inherited-header failure was fixed, and the complete blog check then passed. The production check server is a temporary local verification tool, not a deployment.

## Performance evidence

Single local Chrome lab samples, 390-pixel mobile viewport, 4× CPU throttle, 1.6 Mbps download, 150 ms latency, cold browser cache:

| Route | LCP | CLS | Resource transfer |
| --- | --- | --- | --- |
| `/blog` | 1.356 s | 0 | 118,014 bytes |
| `/blog/website-development-cost-2026` | 1.192 s | 0 | 104,516 bytes |

Both samples met the requested LCP/CLS goals in this local profile. These are diagnostic samples from localhost, not field Core Web Vitals or global-user results. INP was not measured. Production hosting, third-party tags after consent, traffic, devices and network conditions can change results. The source suite records long tasks but does not equate them with INP.

## Owner follow-up after deployment

1. Review the content and illustrative budgets, then deploy through the existing process when ready.
2. Recheck dated provider references and publication dates if release is delayed.
3. Inspect sitemap delivery and canonical URLs in Search Console/Bing Webmaster Tools with authorized access.
4. Review GTM container contents and GA settings to prevent duplicated page-view/GA configuration tags; confirm consent behavior inside each configured tag.
5. Test a deliberate consented enquiry in analytics debug tools. QA used mocked delivery and Google scripts, not real customer messages or measurement hits.
6. Collect actual search, enquiry and field performance data before assessing acquisition outcomes or expanding the topic cluster.

No ranking, indexing, AI citation, sales, traffic or enquiry outcome has yet been measured or promised.
