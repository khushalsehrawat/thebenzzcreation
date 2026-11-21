# Blog internal linking

Updated 21 November 2026. Routes below are canonical paths on the existing www domain.

## Discovery paths

- The shared navigation now includes Blog. The existing footer guide link remains.
- The homepage retains its planning-guide entry point.
- `/blog` features the startup cornerstone and exposes all twenty guides in initial HTML.
- Article breadcrumbs return to Home and Blog. Related reading links form a bounded, deliberate topic cluster.
- Related service pages show matching guides. `llms.txt`, Markdown homepage resources and existing read-only discovery tools use the expanded public registry automatically.
- The static sitemap contains 49 URLs after the twelve-guide expansion. All hub/article entries use `/blog`; unrelated supplied URLs, including the previously requested query URLs, remain preserved. Old `/insights` URLs redirect permanently and are excluded from the sitemap. Sitemap membership does not guarantee indexing.
- All twenty guides expose full-text Markdown at `/blog/{slug}/index.md`, advertised by HTML alternate links and `llms.txt`. Markdown cites the canonical article, sources, related guides, service and contact URLs. It is excluded from independent search indexing with a response header; canonical HTML stays in the sitemap.
- The twelve buying guides in `lib/editorial-buying-guides.ts` each point to three related guides and the matching existing service. The ERP comparison, budget and partner-selection guides link as a procurement cluster. Other additions connect to the existing app, website, commerce, AI and build-versus-buy guides. Their complete intent/service map is in `blog-keyword-map.md`.

## Guide-to-guide and commercial mapping

| Guide slug | Related guides | Related service |
| --- | --- | --- |
| `software-needed-to-start-a-business` | website cost; AI automation; custom vs off-the-shelf | `/services/custom-software-development` |
| `website-development-cost-2026` | project brief; WordPress/Next.js/Shopify; startup software | `/services/website-development` |
| `ai-automation-for-small-business` | startup software; custom vs off-the-shelf; project brief | `/services/ai-integration-automation` |
| `wordpress-vs-nextjs-vs-shopify` | commerce comparison; website cost; project brief | `/services/website-development` |
| `mobile-app-development-cost-2026` | startup software; website cost; custom vs off-the-shelf | `/services/mobile-app-development` |
| `shopify-vs-woocommerce-vs-custom-ecommerce` | WordPress/Next.js/Shopify; startup software; website cost | `/services/ecommerce-development` |
| `website-project-brief` | website cost; WordPress/Next.js/Shopify; startup software | `/services/website-development` |
| `custom-software-vs-off-the-shelf` | startup software; AI automation; mobile app cost | `/services/custom-software-development` |

Body links add context beyond the related-card list. Examples include the startup decision framework pointing to the existing buy-or-build article and the website-cost guide referencing the project brief and platform comparison. The cost guide links the published NSAR Workshop page as a visual reference, explicitly avoiding an unsupported budget or results claim.

## Conversion paths

Articles contain a lightweight inline service link and an end-of-article project discussion link to the existing `/contact` experience. This keeps submission validation, delivery providers and confirmed-enquiry tracking in the existing implementation. There is no separate blog lead endpoint and no automatic external sharing.

LinkedIn, email and optional clipboard sharing use the absolute canonical article URL. Clipboard failure has a visible status message and leaves the ordinary share options usable.

## Maintenance rules

1. Add articles through the typed editorial registry and assign a relevant existing service.
2. Link only to a published guide with distinct intent. Keep the existing brief and buy-or-build routes stable.
3. Review source links and the article's updated date together after substantive revisions.
4. Run `npm run sitemap:sync` for additions. It normalizes legacy `/insights` URLs to `/blog` and appends missing guides. Unrelated supplied entries remain unchanged; manual removal or date corrections require an explicit sitemap edit.
5. Run unit and browser checks to detect stale related slugs, missing destinations, broken TOC fragments, inconsistent metadata and 404 regressions.
6. If retiring an article later, plan a relevant redirect and update its body links, registry, sitemap and related cards in the same change.

## Verification

`tests/editorial.test.ts` verifies registry links, section IDs, dates, article schema, sitemap inclusion and service backlinks. `scripts/blog-check.ts` requests 27 unique internal destinations referenced from article documents, verifies native article behavior without JavaScript and checks canonical sharing. Official external references were researched separately; local browser QA does not establish continued availability of every external service.
