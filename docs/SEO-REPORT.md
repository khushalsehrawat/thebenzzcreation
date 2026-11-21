# SEO, AEO and GEO implementation report

Revision: 21 November 2026. Canonical origin: https://www.thebenzzcreations.com. Local repository work; no production deployment or external submission was performed.

## What changed

The supplied Next.js 16.4.5 / React 19.3.1 site uses App Router **route handlers returning complete HTML documents**, not React page components. The implementation extends that architecture and preserves existing public URLs, styling, portfolio evidence, enquiries and Markdown negotiation.

| Area | Before | After |
| --- | --- | --- |
| Indexable registry | 41 pages; 20 articles | 80 pages; 28 articles, 11 category archives, 17 tag archives and three additional pagination pages |
| Business facts | Distributed constants | `src/lib/site.ts` with verified-from-repository contact data and nullable founder/booking fields |
| Metadata | Shared renderer; some lengths outside targets | Unique 50–60 character titles, 140–160 character descriptions, canonicals, OG/Twitter and x-default links verified for every indexable page |
| Sitemap | Checked-in XML with accumulated/query entries | `app/sitemap.ts`, generated from the current canonical registry with editorial modification dates |
| Crawlers | Wildcard plus a conflicting training signal | Explicit allow rules for all twelve requested named crawlers, plus wildcard; private endpoints excluded |
| Host/security | Permanent host redirect and several headers | Explicit 301 apex/HTTPS redirects, HSTS, existing security/cache headers and compression |
| Structured data | Organisation, services and articles | ProfessionalService, typed About/Contact pages, exact visible FAQ markup, CreativeWork portfolio nodes and a visible/marked-up HowTo process |
| Service answers | Three FAQs per service | Twelve FAQs per service, 40–60 word quick answers and planning links |
| Evidence | Limited factual portfolio | Explicit problem/approach, screenshots, observable outcome and disclosure where stack/timeline/results lack evidence |
| Editorial engine | TypeScript article records | Twelve frontmatter-backed starter guides, each 1,200–1,800 words; existing records retained for other articles |
| Discovery | HTML, Markdown and dynamic llms index | Concise build-generated `/llms.txt`, expanded `/llms-full.txt`, RSS at `/feed.xml` |
| Navigation | Blog library and existing footer | Crawlable pagination/categories/tags, topic links, related reading, service links and consistent contact CTAs |
| Trust | Existing contact/about/privacy/terms | Expanded facts/process/estimating guidance; testimonials and review badges empty until supplied with real evidence |
| Analytics | Consent controls plus hardcoded GA/GTM defaults | Environment-driven GA4 defaulting off, no hardcoded GTM container, consent-gated lead/contact/CTA events |
| QA | Existing unit/browser scripts | Build-blocking schema/content/source checks and postbuild HTTP audit; mobile Lighthouse CI budgets |

## Architecture choices and deliberate limits

- Route handlers do not support Next.js `metadata`/`generateMetadata` exports. The shared `renderHead` generates the equivalent tags from the canonical registry, including dynamic article/service/work/archive data. The actual production responses are checked, not unused exports.
- Existing responsive AVIF/WebP picture sources, explicit dimensions, alt text, lazy loading, and local WOFF2 fonts with `font-display: swap` remain in the complete-document renderer. They were not replaced with `next/image`/`next/font`, which would require moving these routes into React pages and changing their asset/rendering pipeline. Responsive LCP image preloads were added to articles and case studies; the homepage's measured LCP is text.
- The blog uses a dependency-free Markdown subset and JSON-compatible YAML frontmatter, rather than executing MDX/JSX. Existing authored HTML imports are explicitly marked `trusted-html`. Never accept untrusted HTML in that path. This is an intentional deviation from an executable MDX engine.
- Studio attribution is an Organisation, not an invented Person. Founder and individual author Person data remain withheld until the owner supplies and approves them. No unverified founding date, team size, starting price, outcome metric, testimonial, rating, guarantee, overseas office or booking URL is published.
- Hypothetical numeric rate tables in older cost articles are withheld by `approvedPricingContent`. Pricing is explained through scope and proposal processes. No SearchAction is emitted because the site has no global search endpoint. Portfolio pages use CreativeWork rather than claiming all examples are SoftwareApplications.
- JSON-LD checks cover syntax, identifiers, required implemented fields, and FAQ parity. They are not an assertion of Google rich-result eligibility or a full Schema.org vocabulary certification. External validators and production Search Console checks remain owner actions.
- Local metrics do not establish production field INP or guarantee indexing, rankings, rich results or answer-engine citations. HTTPS redirects still depend on the trusted proxy forwarding the correct protocol in production.

## Twelve starter guides

Four existing URLs were revised: `website-development-cost-2026`, `web-development-companies-international-businesses`, `wordpress-vs-nextjs-vs-shopify`, and `custom-software-vs-off-the-shelf`.

Eight new guides cover React Native/native/Flutter, Indian e-commerce payments, AI in existing software, workflow automation, the mobile development process, maintenance, offshore collaboration, and a website SEO launch checklist. Each includes a direct-answer/TL;DR, H2 sections, visible FAQs, service links, related reading, tags, publisher attribution and authored dates. The file inventory below lists every source.

## Validation and how to run it

Use Node and the installed dependency versions from the repository:

```powershell
npm run lint
npm run typecheck
npm test
npm run content:check
npm run schema:check
npm run seo:check
npm run build
```

`build` runs content checks, generates responsive/social assets and AI resources, validates JSON-LD and every source-rendered page, compiles Next.js, then launches a temporary production server for `seo:check:built`. An error exits nonzero. The HTTP audit covers all 80 indexable URLs, metadata/H1 uniqueness, JSON-LD, internal page/fragment links, assets, image attributes, sitemap coverage, crawler rules, security headers, actual 301 responses and a noindex 404. It also checks RSS and AI resources are reachable. Internal link checks do not claim to verify external website availability.

Browser validation uses the installed Chrome and Playwright:

```powershell
# Terminal one
npm run start -- --port 3011
# Terminal two
npm run test:seo:browser
```

Override `TEST_BASE_URL` or `TEST_BROWSER_PATH` when needed. The focused browser audit checks twelve representative routes at 390, 768 and 1440px, WCAG A/AA checks with axe, runtime errors and consent gating/withdrawal. Test analytics requests are intercepted; no real telemetry is sent. It verifies WhatsApp, telephone and CTA events. Existing enquiry unit tests continue to verify validation and truthful delivery states.

```powershell
npm run lighthouse
```

Lighthouse CI is downloaded temporarily through npx, rather than added to production dependencies. `lighthouserc.cjs` runs three mobile measurements each for the homepage, website service and website-cost article. Assertions require all four categories >=0.95, LCP <=2,000ms and CLS <=0.05. Reports are written under `artifacts/lighthouse`; source/HTTP/browser audit evidence is under `artifacts/seo`. These generated QA artifacts are ignored by Git.

Confirmed checks: lint passes with one pre-existing unused catch-variable warning in `hero-3d.js`; type-check passes; all 31 unit tests pass; twelve content-length checks pass; JSON-LD and source audit pass on 80 pages; the built HTTP audit passes; the twelve-route browser audit passes at all three widths with zero axe violations/runtime errors; consent and all three contact/CTA events pass.

The initial Lighthouse homepage performance was 87–93. Mobile WebGL initialisation now follows interaction; desktop decorative behaviour is retained and reduced-motion preferences disable it. The second Lighthouse CI run passed every configured assertion. Mobile results (three runs per URL):

| Page | Performance | Accessibility | Best practices | SEO | Median LCP | Maximum CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | 98?99 | 99 | 100 | 100 | 1.975s | 0.00094 |
| Website development | 99 | 100 | 100 | 100 | 1.664s | 0 |
| Website cost guide | 99 | 100 | 100 | 100 | 1.820s | 0 |

One cold homepage sample reached 2.053s LCP; CI aggregation passed, but the strict sub-2s target is not a guarantee for every load. Production field INP remains unmeasured. A later small visual fix clears the quick-answer label below the fixed header and changes a decorative mockup H4 into styled paragraph text to correct heading order; mobile browser checks were repeated after those changes.

## Configuration and owner work

Set `NEXT_PUBLIC_GA_ID` before building. Legacy `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `GA4_MEASUREMENT_ID` aliases remain supported if the preferred variable is absent. An explicitly empty preferred variable disables measurement. Optional verification variables are `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`.

Set a public verification `INDEXNOW_KEY` containing 8–128 letters/digits/hyphens before build; generation writes `public/<key>.txt`. After deployment, explicitly run `npm run indexnow:ping`. The command verifies the live key URL before submitting the canonical registry. It was not run against the live site during this task. A key should be set in the deploy environment, not invented as an active production configuration here.

See [TODO-MANUAL.md](TODO-MANUAL.md) for founder/author evidence, approved ranges and timelines, case-study facts, review permissions, legal review, booking details, production performance, webmaster setup, listings, backlinks and monthly answer-engine monitoring.

## Complete file inventory

The generated inventory below includes added, modified and removed files across this implementation, including generated social assets. It is relative to the repository state when this task started.

Baseline commit: `23e44b30f723c73c00e059f45018740f7c79f73e`.

| Status | File |
| --- | --- |
| Modified | `.env.example` |
| Modified | `.gitignore` |
| Added | `app/blog/category/[value]/route.ts` |
| Added | `app/blog/page/[value]/route.ts` |
| Added | `app/blog/tag/[value]/route.ts` |
| Added | `app/feed.xml/route.ts` |
| Removed | `app/llms.txt/route.ts` |
| Modified | `app/not-found.tsx` |
| Modified | `app/robots.ts` |
| Added | `app/sitemap.ts` |
| Removed | `app/sitemap.xml` |
| Added | `content/README.md` |
| Added | `content/blog/ai-integration-existing-business-software.md` |
| Added | `content/blog/custom-software-vs-off-the-shelf.md` |
| Added | `content/blog/ecommerce-website-india-payment-gateways.md` |
| Added | `content/blog/mobile-app-development-process.md` |
| Added | `content/blog/offshore-development-studio-checklist.md` |
| Added | `content/blog/react-native-vs-native-vs-flutter.md` |
| Added | `content/blog/seo-checklist-new-business-website.md` |
| Added | `content/blog/web-development-companies-international-businesses.md` |
| Added | `content/blog/website-development-cost-2026.md` |
| Added | `content/blog/website-maintenance-guide.md` |
| Added | `content/blog/wordpress-vs-nextjs-vs-shopify.md` |
| Added | `content/blog/workflow-automation-where-to-start.md` |
| Added | `docs/SEO-REPORT.md` |
| Added | `docs/TODO-MANUAL.md` |
| Added | `lib/answer-content.ts` |
| Added | `lib/blog-archives.ts` |
| Added | `lib/content-loader.ts` |
| Modified | `lib/editorial-buying-guides.ts` |
| Added | `lib/editorial-pricing.ts` |
| Modified | `lib/editorial-types.ts` |
| Modified | `lib/editorial-view.ts` |
| Added | `lib/entity-content.ts` |
| Modified | `lib/resources.ts` |
| Modified | `lib/seo-content.ts` |
| Modified | `lib/seo.ts` |
| Added | `lib/trust.ts` |
| Added | `lighthouserc.cjs` |
| Modified | `next-env.d.ts` |
| Modified | `next.config.ts` |
| Modified | `package.json` |
| Added | `public/llms-full.txt` |
| Added | `public/llms.txt` |
| Modified | `public/reference/analytics.js` |
| Modified | `public/reference/background-loader.js` |
| Modified | `public/reference/runtime.js` |
| Modified | `public/reference/seo.css` |
| Modified | `public/social/about.jpg` |
| Added | `public/social/ai-integration-existing-business-software-1200.webp` |
| Added | `public/social/ai-integration-existing-business-software-480.webp` |
| Added | `public/social/ai-integration-existing-business-software-800.webp` |
| Added | `public/social/ai-integration-existing-business-software.jpg` |
| Modified | `public/social/choose-erp-implementation-partner-1200.webp` |
| Modified | `public/social/choose-erp-implementation-partner-480.webp` |
| Modified | `public/social/choose-erp-implementation-partner-800.webp` |
| Modified | `public/social/choose-erp-implementation-partner.jpg` |
| Modified | `public/social/contact.jpg` |
| Added | `public/social/ecommerce-website-india-payment-gateways-1200.webp` |
| Added | `public/social/ecommerce-website-india-payment-gateways-480.webp` |
| Added | `public/social/ecommerce-website-india-payment-gateways-800.webp` |
| Added | `public/social/ecommerce-website-india-payment-gateways.jpg` |
| Added | `public/social/insights-1200.webp` |
| Added | `public/social/insights-480.webp` |
| Added | `public/social/insights-800.webp` |
| Added | `public/social/mobile-app-development-process-1200.webp` |
| Added | `public/social/mobile-app-development-process-480.webp` |
| Added | `public/social/mobile-app-development-process-800.webp` |
| Added | `public/social/mobile-app-development-process.jpg` |
| Added | `public/social/offshore-development-studio-checklist-1200.webp` |
| Added | `public/social/offshore-development-studio-checklist-480.webp` |
| Added | `public/social/offshore-development-studio-checklist-800.webp` |
| Added | `public/social/offshore-development-studio-checklist.jpg` |
| Added | `public/social/react-native-vs-native-vs-flutter-1200.webp` |
| Added | `public/social/react-native-vs-native-vs-flutter-480.webp` |
| Added | `public/social/react-native-vs-native-vs-flutter-800.webp` |
| Added | `public/social/react-native-vs-native-vs-flutter.jpg` |
| Added | `public/social/seo-checklist-new-business-website-1200.webp` |
| Added | `public/social/seo-checklist-new-business-website-480.webp` |
| Added | `public/social/seo-checklist-new-business-website-800.webp` |
| Added | `public/social/seo-checklist-new-business-website.jpg` |
| Modified | `public/social/terms.jpg` |
| Modified | `public/social/ui-ux-design-agencies-apps-ecommerce-1200.webp` |
| Modified | `public/social/ui-ux-design-agencies-apps-ecommerce-480.webp` |
| Modified | `public/social/ui-ux-design-agencies-apps-ecommerce-800.webp` |
| Modified | `public/social/ui-ux-design-agencies-apps-ecommerce.jpg` |
| Added | `public/social/website-maintenance-guide-1200.webp` |
| Added | `public/social/website-maintenance-guide-480.webp` |
| Added | `public/social/website-maintenance-guide-800.webp` |
| Added | `public/social/website-maintenance-guide.jpg` |
| Added | `public/social/workflow-automation-where-to-start-1200.webp` |
| Added | `public/social/workflow-automation-where-to-start-480.webp` |
| Added | `public/social/workflow-automation-where-to-start-800.webp` |
| Added | `public/social/workflow-automation-where-to-start.jpg` |
| Added | `scripts/content-check.ts` |
| Added | `scripts/generate-discovery.ts` |
| Modified | `scripts/generate-seo-assets.tsx` |
| Added | `scripts/indexnow.ts` |
| Added | `scripts/render-pages.ts` |
| Added | `scripts/seo-audit.ts` |
| Added | `scripts/seo-browser.mjs` |
| Modified | `scripts/sync-blog-sitemap.ts` |
| Added | `scripts/validate-schema.ts` |
| Added | `src/components/JsonLd.tsx` |
| Added | `src/components/Trust.tsx` |
| Added | `src/lib/site.ts` |
| Modified | `tests/agents.test.ts` |
| Modified | `tests/editorial-markdown.test.ts` |
| Modified | `tests/editorial.test.ts` |
| Modified | `tests/resources.test.ts` |
| Modified | `tests/seo.test.ts` |
