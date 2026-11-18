# SEO audit ? 2026-11-18

## Scope and baseline
Next.js 16.4.5, React 19.3.1, TypeScript. This repository intentionally serves complete HTML through App Router Route Handlers, not React page components. `lib/seo.ts` owns server metadata and HTML; migrating to a second metadata mechanism would duplicate head tags. Relevant installed Next route-handler and sitemap guides were read before editing.

Baseline: clean Git working tree; production build, ESLint and TypeScript passed. Unit suite passed 20/21; privacy copy omitted the tested analytics choices phrase. Existing browser expectations that About and Contact redirect were stale relative to the existing public route implementation.

## Existing architecture preserved
- Seven service detail routes, service index, three portfolio detail routes and work index.
- About, Contact, Pricing, Privacy, Terms and homepage: eighteen indexable pages before this revision.
- Custom local CSS, Manrope / Space Grotesk / JetBrains Mono fonts, red accent, neutral surfaces, scroll-driven Three.js hero, service previews, project carousel and mobile menu.
- Main responsive changes at 1000, 860 and 600px, with further privacy layout changes at 480px. Existing design CSS has additional breakpoints.
- Consent-gated GA4; one `generate_lead` event after provider acceptance, service category only. No additional tracker installed.
- Web3Forms browser delivery after server validation; optional server SMTP; payload limits, origin validation, honeypot, rate limiter and validation tests already present. Provider success does not guarantee inbox placement.
- Node-compatible hosting remains necessary. No deployment configuration or provider credentials changed.
- Markdown, llms.txt, read-only MCP and browser agent tools derive page discovery from the same registry.

## Confirmed issues and changes
| Finding | Resolution |
| --- | --- |
| `/faq` redirected to the homepage fragment | Dedicated indexable FAQ; `/faq.html` now redirects to it; homepage fragment preserved |
| No international delivery resource | One substantial `/global-services`, no country doorway pages |
| Thin About and Contact pages | Added capabilities, project references, international delivery and enquiry preparation |
| No maintained planning resource | Insights index plus two original decision guides |
| No Bing verification environment support | Optional escaped `msvalidate.01` token, no invented default |
| Uniform lastModified on every sitemap URL | Removed; no build timestamps represented as editorial updates |
| Entity description not shared | Factual brand description reused in About and Organization |
| Homepage hero copy focused only on websites | Supporting copy names apps, software and automation, clearer project CTA |
| Missing new content navigation | Footer, homepage, service and resource contextual links |
| Privacy wording regression | Restored explicit explanation of analytics choices |

## Existing strengths retained
Self canonicals, unique metadata, OG/Twitter cards, branded 1200?630 images, server-visible content, 404 handling, legacy redirects, apex-to-www redirect, forwarded-HTTP redirect, API noindex headers, responsive portfolio AVIF/WebP, font preloads and reduced-motion styles were already implemented. Native details/summary supplies accessible FAQ behaviour. No extra framework dependencies added.

## Live evidence and limits
The production homepage was readable through the web tool. https://www.nsar2026.org/ was readable and credits TheBenzzCreations as creator/maintainer. The therapist example was readable; its credentials and claims are not adopted by the studio. The web tool could not retrieve SwiftPDF; this is an unverified destination, not proof of an HTTP 404. INOX was not found in the inspected source and was not added. Existing project stacks, contracts and commercial outcomes are not inferred from screenshots.

External ownership/profile URLs, provider inbox delivery and production redirects need owner/hosting verification. Local Chrome runs measure accessibility and simulated loading, not field Core Web Vitals. Search engine indexing, Search Console, Bing submission and Google Rich Results Test require separate production/account checks. No rankings or AI placement are promised.

## Priorities
1. Completed: technical consistency, FAQ and useful international architecture.
2. Completed: clearer project paths, factual entity and compact planning resources.
3. Owner follow-up: account verification, production crawl and business evidence.

The complete route/intent inventory is in seo-keyword-map.md. Existing legacy docs describe prior work and are historical, not this revision's validation record.
