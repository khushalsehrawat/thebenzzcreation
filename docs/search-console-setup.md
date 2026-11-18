# Search discovery setup

These actions are pending; no account access, sitemap submission or indexing request was performed.

1. Google Search Console: select/add the correct Domain property and verify through owner-controlled DNS, or verify the canonical HTTPS www URL-prefix property with HTML metadata. The existing public Google token remains the default; set `GOOGLE_SITE_VERIFICATION` to the property's actual token or an empty string to disable it. Rebuild after changing build-time variables.
2. Bing Webmaster Tools: add the canonical site (or import the verified Google property). Set `BING_SITE_VERIFICATION` to the supplied HTML verification token only, then rebuild and verify the rendered `msvalidate.01` tag. Do not copy another site's token.
3. After an authorised deployment, confirm HTTPS and www redirects at the trusted edge, robots.txt and https://www.thebenzzcreations.com/sitemap.xml. Submit that sitemap in both consoles.
4. Inspect the homepage, one service, `/faq`, `/global-services` and an insight. Confirm 200 status, rendered text, declared/selected canonical and indexability; request indexing if appropriate. Submission does not ensure indexing.
5. Review crawl/indexing reports, search queries by country, mobile usability and field Core Web Vitals after real data becomes available. Investigate exclusions rather than repeatedly submitting URLs.
6. Validate relevant production structured data in Google's Rich Results Test and Schema.org's validator. Generic Organization, WebPage or Service markup is not itself a promise of a rich result. Commercial FAQ rich results are not assumed; FAQPage schema was deliberately omitted. See [Google FAQ guidance](https://developers.google.com/search/blog/2023/08/howto-faq-changes).
7. Preserve the existing consent-gated GA4 integration. Verify the actual property, consent decisions, a single page_view and one generate_lead after confirmed acceptance in an approved test. No personal form data belongs in analytics. Do not add GTM or duplicate GA4. Do not send a real test enquiry without approval.
8. Confirm Web3Forms account origin restrictions and real inbox delivery, or configure SMTP using server-only environment settings. Multi-instance production needs a shared limiter/trusted edge IP configuration. These are existing deployment dependencies, not completed account actions.

IndexNow was not added: there is no owner-issued key or automated publishing pipeline in scope. The existing llms.txt and public read-only tools remain supplementary discovery aids, not ranking factors.
