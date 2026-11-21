# Search discovery setup

Reviewed 21 November 2026. Public HTTP checks confirm that the 41 registered HTML pages, robots.txt, sitemap and llms.txt are live. That does not prove search-engine indexing or account ownership. No Search Console/Bing account action or sitemap submission was performed by this agent.

1. Google Search Console: select/add the correct Domain property and verify through owner-controlled DNS, or verify the canonical HTTPS www URL-prefix property with HTML metadata. The existing public Google token remains the default; set `GOOGLE_SITE_VERIFICATION` to the property's actual token or an empty string to disable it. Rebuild after changing build-time variables.
2. Bing Webmaster Tools: add the canonical site (or import the verified Google property). Set `BING_SITE_VERIFICATION` to the supplied HTML verification token only, then rebuild and verify the rendered `msvalidate.01` tag. Do not copy another site's token.
3. After an authorised deployment, confirm HTTPS and www redirects at the trusted edge, robots.txt and https://www.thebenzzcreations.com/sitemap.xml. Submit that sitemap in both consoles.
4. Inspect the homepage, one service, `/faq`, `/global-services` and a `/blog` article. Confirm 200 status, rendered text, declared/selected canonical and indexability; request indexing if appropriate. Submission does not ensure indexing.
5. Review crawl/indexing reports, search queries by country, mobile usability and field Core Web Vitals after real data becomes available. Investigate exclusions rather than repeatedly submitting URLs.
6. Validate relevant production structured data in Google's Rich Results Test and Schema.org's validator. Generic Organization, WebPage or Service markup is not itself a promise of a rich result. Blog FAQPage nodes mirror visible answers for semantic clarity; Google has discontinued FAQ rich results. See the [current documentation changelog](https://developers.google.com/search/updates). Do not describe FAQ markup as a Google rich-result opportunity.
7. Preserve the existing consent-gated GA4 and GTM integration. Verify the actual property, consent decisions, a single page_view and one generate_lead after confirmed acceptance in an approved test. No personal form data belongs in analytics. Audit the existing GTM container for duplicate GA configuration and page-view tags before enabling additional measurement. Do not add another container or send a real test enquiry during a read-only audit.
8. Confirm Web3Forms account origin restrictions and real inbox delivery, or configure SMTP using server-only environment settings. Multi-instance production needs a shared limiter/trusted edge IP configuration. These are existing deployment dependencies, not completed account actions.

IndexNow was not added: there is no owner-issued key or automated publishing pipeline in scope. The existing llms.txt and public read-only tools remain supplementary discovery aids, not ranking factors.

## Direct setup and validation links

- [Google Search Console](https://search.google.com/search-console): select the verified property; check Pages, Sitemaps, Performance, Links and URL Inspection. The public verification tag does not confirm that verification is complete.
- [Published sitemap](https://www.thebenzzcreations.com/sitemap.xml): submit this in the verified property, then inspect representative canonical pages.
- [Google Rich Results Test](https://search.google.com/test/rich-results): test a live article after deploying metadata changes; Organization and Service nodes need not qualify for a special Google display.
- [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.thebenzzcreations.com%2F): check lab diagnostics and any available field data. Local timings are not evidence of production Core Web Vitals.
- [Google Analytics](https://analytics.google.com/): confirm access to the property behind `G-Q9JRF078F9`, then validate consented page and confirmed-enquiry events.
- [Google Tag Manager](https://tagmanager.google.com/): inspect the existing `GTM-PGV57RK3` container for duplicate tags and correct consent handling.
- [Bing Webmaster Tools](https://www.bing.com/webmasters/): verify or import the site and review crawl, index, search and supported AI Performance reports. An absent HTML verification tag does not rule out DNS verification or Google import.
- [Google Business Profile](https://business.google.com/): use only if the business meets the [eligibility requirements](https://support.google.com/business/answer/3038177), such as a genuine customer-facing location or eligible in-person service. Do not create overseas offices or service areas merely for ranking.
- [Search Console Links report guidance](https://support.google.com/webmasters/answer/9049606): export external links and referring sites for the next backlink review; this report is a sample, not every backlink on the web.

Verification tokens belong in configuration; account ownership and successful verification cannot be inferred from tags alone. Meta-keywords and invented geographic tags are not substitutes for useful content, actual service coverage and correct indexing. Only add hreflang when genuine language or regional equivalents exist.
