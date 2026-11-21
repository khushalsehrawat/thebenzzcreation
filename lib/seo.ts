import { entityContent } from "./entity-content";
import { homeAnswer, serviceAnswers } from "./answer-content";
import { jsonLdMarkup } from "../src/components/JsonLd";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { BRAND_DESCRIPTION, faqs, insights } from "./resources";
import { renderEditorialArticle, renderEditorialIndex } from "./editorial-view";
import {
  BUSINESS,
  CONTENT_UPDATED,
  PRIMARY_MARKETS,
  SITE_ORIGIN,
  corePages,
  homepageFaqs,
  projects,
  publicPages,
  services,
  type Service,
} from "./seo-content";

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
export const absoluteUrl = (pathname: string) => `${SITE_ORIGIN}${pathname}`;
const safeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");
export type PageInfo = (typeof publicPages)[number];

export function analyticsConfig() {
  // Public measurement ID verified in the existing live site's HTML. Empty override disables analytics.
  const candidate =
    process.env.NEXT_PUBLIC_GA_ID ??
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.GA4_MEASUREMENT_ID ??
    "";
  return {
    measurementId: /^G-[A-Z0-9]{4,20}$/.test(candidate) ? candidate : "",
    consentVersion: 1,
  };
}

export function schemaFor(
  page: PageInfo,
  breadcrumb: [string, string][],
  service?: Service,
) {
  const organizationId = `${SITE_ORIGIN}/#organization`,
    websiteId = `${SITE_ORIGIN}/#website`;
  const url = absoluteUrl(page.path);
  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: BUSINESS.name,
    description: BRAND_DESCRIPTION,
    url: `${SITE_ORIGIN}/`,
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    ...(BUSINESS.sameAs.length ? { sameAs: BUSINESS.sameAs } : {}),
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/brand-mark.png`,
      width: 512,
      height: 512,
    },
    address: BUSINESS.address,
    image: `${SITE_ORIGIN}/social/home.jpg`,
    knowsAbout: services.map(item => item.name),
    ...(BUSINESS.founder ? { founder: { "@type": "Person", name: BUSINESS.founder.name, jobTitle: BUSINESS.founder.role } } : {}),
    areaServed: [
      { "@type": "Place", name: "Worldwide" },
      ...PRIMARY_MARKETS.map((name) => ({ "@type": "Country", name })),
    ],
  };
  const serviceNode = (item: Service) => ({
    "@type": "Service",
    "@id": `${SITE_ORIGIN}/services/${item.slug}#service`,
    name: item.name,
    serviceType: item.name,
    url: `${SITE_ORIGIN}/services/${item.slug}`,
    description: item.description,
    provider: { "@id": organizationId },
    areaServed: organization.areaServed,
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      { ...organization, "@type": "ProfessionalService", "@id": `${SITE_ORIGIN}/#professional-service`, parentOrganization: { "@id": organizationId } },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${SITE_ORIGIN}/`,
        name: BUSINESS.name,
        publisher: { "@id": organizationId },
        inLanguage: "en-IN",
      },
      {
        "@type": page.path === "/about" ? "AboutPage" : page.path === "/contact" ? "ContactPage" : "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": websiteId },
        about: { "@id": service ? `${url}#service` : organizationId },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/social/${page.key}.jpg`,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumb.map(([name, item], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          item: absoluteUrl(item),
        })),
      },
      ...(service
        ? [serviceNode(service)]
        : ["/", "/services"].includes(page.path)
          ? services.map(serviceNode)
          : []),
      ...insights.filter((item) => page.path === `/blog/${item.slug}`).map((item) => ({
        "@type": "Article", "@id": `${url}#article`, headline: item.h1,
        description: item.description, datePublished: item.published, dateModified: item.updated,
        mainEntityOfPage: { "@id": `${url}#webpage` }, publisher: { "@id": organizationId },
        author: { "@id": organizationId },
        ...(item.sources.length ? { citation: item.sources.map(({ label, url: sourceUrl }) => ({ "@type": "CreativeWork", name: label, url: sourceUrl })) } : {}),
        image: `${SITE_ORIGIN}/social/${page.key}.jpg`, inLanguage: "en-IN",
        articleSection: item.category, isPartOf: { "@id": `${SITE_ORIGIN}/blog#blog` },
        ...(item.faqs.length ? { hasPart: { "@id": `${url}#faq` } } : {}),
      })),
      ...(page.path === "/blog" ? [{
        "@type": "Blog", "@id": `${SITE_ORIGIN}/blog#blog`,
        url, name: "TheBenzzCreations Blog", description: page.description,
        publisher: { "@id": organizationId }, isPartOf: { "@id": websiteId },
        blogPost: insights.map((item) => ({ "@id": `${SITE_ORIGIN}/blog/${item.slug}#article` })),
      }] : []),
      ...insights.filter((item) => page.path === `/blog/${item.slug}` && item.faqs.length).map((item) => ({
        "@type": "FAQPage", "@id": `${url}#faq`, isPartOf: { "@id": `${url}#webpage` },
        mainEntity: item.faqs.map(({ question, answer }) => ({
          "@type": "Question", name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      })),
      ...((service || ["/", "/faq"].includes(page.path)) ? [{
        "@type": "FAQPage", "@id": `${url}#faq`,
        mainEntity: (service ? service.faq : page.path === "/" ? homepageFaqs : faqs.map(item => [item.question, `${item.answer} ${item.link}.`])).map(([question, answer]) => ({
          "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }] : []),
      ...projects.filter(item => page.path === `/work/${item.slug}`).map(item => ({
        "@type": "CreativeWork", "@id": `${url}#work`, name: item.name, description: item.summary,
        url, image: `${SITE_ORIGIN}/images/${item.image}-1440.webp`, creator: { "@id": organizationId },
        mainEntityOfPage: { "@id": `${url}#webpage` },
      })),
      ...(page.path === "/services"
        ? [
            {
              "@type": "ItemList",
              name: "Digital services",
              itemListElement: services.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: `${SITE_ORIGIN}/services/${item.slug}`,
              })),
            },
          ]
        : []),
    ],
  };
}

export function renderHead(
  page: PageInfo,
  breadcrumb: [string, string][],
  service?: Service,
  homepage = false,
) {
  const url = absoluteUrl(page.path),
    image = `${SITE_ORIGIN}/social/${page.key}.jpg`;
  const article = insights.find((item) => page.path === `/blog/${item.slug}`);
  // Preserve the public ownership token already published by the verified live domain.
  const verification =
    process.env.GOOGLE_SITE_VERIFICATION ??
    "8MsySZqeSGdkv-ve9SoSqPVqLD5NZ5vmL2MfO2t8LVI";
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}">
<link rel="canonical" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><link rel="alternate" type="application/rss+xml" title="TheBenzzCreations Blog" href="/feed.xml">${insights.some((article) => page.path === `/blog/${article.slug}`) ? `<link rel="alternate" type="text/markdown" href="${url}/index.md">` : ""}<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta property="og:type" content="${article ? "article" : "website"}">${article ? `<meta property="article:published_time" content="${article.published}"><meta property="article:modified_time" content="${article.updated}"><meta property="article:section" content="${escapeHtml(article.category)}">` : ""}<meta property="og:site_name" content="TheBenzzCreations"><meta property="og:locale" content="en_IN"><meta property="og:url" content="${url}"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:image" content="${image}"><meta property="og:image:secure_url" content="${image}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(page.title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(page.title)}"><meta name="twitter:description" content="${escapeHtml(page.description)}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${escapeHtml(page.title)}"><meta name="theme-color" content="#141518">
${verification ? `<meta name="google-site-verification" content="${escapeHtml(verification)}">` : ""}
${process.env.BING_SITE_VERIFICATION ? `<meta name="msvalidate.01" content="${escapeHtml(process.env.BING_SITE_VERIFICATION)}">` : ""}
${homepage ? '<link rel="alternate" type="text/markdown" href="/index.md">' : ""}<link rel="describedby" type="text/plain" href="/llms.txt"><script defer src="/reference/agents.js"></script>
<link rel="icon" href="/icon.svg"><link rel="apple-touch-icon" href="/brand-mark.png">
<link rel="preload" href="/fonts/space-grotesk-700.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/manrope-variable.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.classList.replace('no-js','js')</script>
<link rel="stylesheet" href="/reference/fonts.css"><link rel="stylesheet" href="/reference/design.css"><link rel="stylesheet" href="/reference/alignment.css"><link rel="stylesheet" href="/reference/seo.css">
${page.path.startsWith("/blog") ? '<link rel="stylesheet" href="/reference/editorial.css">' : ""}
${jsonLdMarkup(schemaFor(page, breadcrumb, service))}
<script type="application/json" id="site-analytics-config">${safeJson(analyticsConfig())}</script><script defer src="/reference/analytics.js"></script>
${homepage ? '<script defer src="/reference/background-loader.js"></script>' : ""}`;
}

function seoFooter() {
  return `<div class="wrap seo-footer-links"><nav aria-label="Service information">${services.map((item) => `<a href="/services/${item.slug}">${escapeHtml(item.name)}</a>`).join("")}</nav><div><a href="/services">All services</a><a href="/work">Project details</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/pricing">Pricing</a><a href="/global-services">Working internationally</a><a href="/faq">FAQ</a><a href="/blog">Blog</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a><button type="button" class="analytics-settings" data-analytics-settings hidden>Analytics settings</button></div></div>`;
}

const readTemplate = () =>
  readFile(path.join(process.cwd(), "site", "index.html"), "utf8").then((html) =>
    html.replace('<a href="#faq">FAQ</a>', '<a href="/blog">Blog</a><a href="#faq">FAQ</a>'),
  );

export function serviceRows() {
  return services
    .map(
      (item, index) =>
        `<div class="sr${index === 0 ? " on" : ""}"><h3 class="service-heading"><button class="sh2" aria-expanded="${index === 0}" aria-controls="b${index}"><span>0${index + 1}</span><span class="service-name">${escapeHtml(item.frontendName)}</span></button></h3><div class="sb" id="b${index}"><div><p>${escapeHtml(item.frontendDescription)}</p><ul>${item.frontendBullets.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul><div class="service-actions"><a class="btn k" href="#contact" data-svc="${escapeHtml(item.frontendName)}">Discuss this</a><a class="service-detail-link" href="/services/${item.slug}">Explore ${escapeHtml(item.name)} <span aria-hidden="true">↗</span></a></div></div></div></div>`,
    )
    .join("");
}

export async function renderHome() {
  let html = await readTemplate();
  const page = corePages[0];
  html = html
    .replace(/<html lang="en(?:-IN)?">/, '<html lang="en-IN" class="no-js">')
    .replace(
      /<head>[\s\S]*?<\/head>/i,
      `<head>${renderHead(page, [["Home", "/"]], undefined, true)}</head>`,
    );
  html = html.replace(
    '<div id="sr"></div>',
    `<div id="sr" data-prerendered="true">${serviceRows()}</div>`,
  );
  html = html.replace(
    '<div class="fq" id="fq"></div>',
    `<div class="fq" id="fq" data-prerendered="true">${homepageFaqs.map(([question, answer]) => `<details name="faq"><summary>${escapeHtml(question)}<span class="pl" aria-hidden="true">+</span></summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div>`,
  );
  html = html.replace(
    '<select name="svc" id="ssel"></select>',
    `<select name="svc" id="ssel" required><option value="">Choose a service</option>${services.map((item) => `<option>${escapeHtml(item.frontendName)}</option>`).join("")}<option>Not sure yet</option></select>`,
  );
  html = html.replace(
    /<p class="sub rv">One independent team covering[^<]*<\/p>/,
    '<p class="sub rv">One independent team covering design, front end, back end, mobile and AI integration. Based in New Delhi, we collaborate remotely worldwide, with a focus on India, the United States, United Kingdom, United Arab Emirates and Canada.</p>',
  );
  html = html.replace(
    '<p class="sub rv">Hover or tap a category to see what we build and what it does for your business.</p>',
    '<p class="sub rv">Scroll or swipe to explore each service, or select a category to jump ahead. <a class="inline-service-link" href="/services">Explore all development and design services.</a></p>',
  );
  projects.forEach((project) => {
    const externalLink = `<a class="btn" href="${project.external}" target="_blank" rel="noopener">Visit live site</a>`;
    html = html.replace(
      externalLink,
      `${externalLink}<a class="project-details-link" href="/work/${project.slug}" aria-label="Project details: ${escapeHtml(project.name)}">Project details <span aria-hidden="true">↗</span></a>`,
    );
  });
  html = html.replace('</main>', '<section class="wrap seo-content"><h2>Build with a team that works worldwide.</h2><p>From New Delhi, we welcome project enquiries from the United States, United Kingdom, Canada, UAE including Dubai, India and beyond. Agree the scope, review schedule and launch responsibilities before development begins.</p><a class="seo-text-link" href="/global-services">How international delivery works</a><a class="seo-text-link" href="/faq">Read project FAQs</a><a class="seo-text-link" href="/blog">Prepare your project</a></section></main>');
  html = html.replace("</footer>", `${seoFooter()}</footer>`);
  html = html.replace('</head>', '<link rel="stylesheet" href="/reference/service-scroll.css"></head>');
  html = html.replace('</body>', '<script defer src="/reference/service-scroll.js"></script></body>');
  // The head loads Three.js with defer; dependent scripts retain their existing order.
  html = html.replace('<script src="/vendor/three-r128.min.js"></script>', "");
  html = html.replace(
    /<script src="(\/reference\/[^\"]+\.js)"><\/script>/g,
    '<script defer src="$1"></script>',
  );
  html = html.replace(/(<main\b[^>]*>)/, `$1${quickAnswer(homeAnswer)}`).replace('</main>', `${revisionNote()}</main>`);
  return html;
}

function revisionNote() {
  return `<p class="wrap seo-revision">By <a href="/about">TheBenzzCreations</a> ? Last updated <time datetime="${CONTENT_UPDATED}">${CONTENT_UPDATED}</time></p>`;
}
function quickAnswer(answer: string) {
  return `<section class="wrap seo-content quick-answer" aria-label="Quick answer"><h2>Quick answer</h2><p>${escapeHtml(answer)}</p></section>`;
}
function breadcrumbs(items: [string, string][]) {
  return `<nav class="seo-breadcrumbs" aria-label="Breadcrumb"><ol>${items.map(([name, href], index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escapeHtml(name)}</span>` : `<a href="${href}">${escapeHtml(name)}</a>`}</li>`).join("")}</ol></nav>`;
}

export async function pageShell(
  page: PageInfo,
  crumbs: [string, string][],
  content: string,
  service?: Service,
) {
  const template = await readTemplate();
  const header =
    template
      .match(/<header[\s\S]*?<\/header>/)?.[0]
      .replace(/href="#/g, 'href="/#') || "";
  const footer =
    template
      .match(/<footer[\s\S]*?<\/footer>/)?.[0]
      .replace(/href="#/g, 'href="/#')
      .replace("</footer>", `${seoFooter()}</footer>`) || "";
  const guides = service ? insights.filter((item) => item.service === service.slug || (item.tags || []).includes(service.slug)).concat(insights.filter(item => item.service !== service.slug).slice(0, 3)).filter((item, index, all) => all.findIndex(other => other.slug === item.slug) === index).slice(0, 6) : [];
  const reading = guides.length ? `<section class="wrap seo-content"><h2>Plan before you build</h2><div class="seo-service-grid">${guides.map((item) => `<article class="seo-card"><h3><a href="/blog/${item.slug}">${escapeHtml(item.h1)}</a></h3><p>${escapeHtml(item.description)}</p></article>`).join("")}</div></section>` : "";
  return `<!DOCTYPE html><html lang="en-IN" class="no-js"><head>${renderHead(page, crumbs, service)}</head><body id="top" class="seo-page"><a class="skip" href="#main">Skip to content</a>${header}<main id="main" tabindex="-1"><div class="wrap">${breadcrumbs(crumbs)}</div>${service ? quickAnswer(serviceAnswers[service.slug]) : ""}${content}${entityContent(page.path)}${reading}${revisionNote()}</main>${footer}<script defer src="/reference/navigation.js"></script></body></html>`;
}

function serviceCards(items: Service[]) {
  return `<div class="seo-service-grid">${items.map((item) => `<article class="seo-card"><p class="mono">${escapeHtml(item.eyebrow)}</p><h2><a href="/services/${item.slug}">${escapeHtml(item.name)}</a></h2><p>${escapeHtml(item.intro)}</p><a class="seo-text-link" href="/services/${item.slug}">Explore this service <span aria-hidden="true">↗</span></a></article>`).join("")}</div>`;
}

function projectImage(
  project: (typeof projects)[number],
  eager = false,
  thumbnail = false,
) {
  const srcset = (format: string) =>
    [640, 960, 1440]
      .map((width) => `/images/${project.image}-${width}.${format} ${width}w`)
      .join(", ");
  const sizes = thumbnail
    ? "(max-width:600px) 90vw, (max-width:1000px) 45vw, 30vw"
    : "(max-width:1400px) 90vw, 1200px";
  return `<picture><source type="image/avif" srcset="${srcset("avif")}" sizes="${sizes}"><source type="image/webp" srcset="${srcset("webp")}" sizes="${sizes}"><img src="/images/${project.image}-960.webp" width="${project.width}" height="${project.height}" alt="${escapeHtml(project.alt)}" loading="${eager ? "eager" : "lazy"}" ${eager ? 'fetchpriority="high"' : ""} decoding="async"></picture>`;
}

function projectCards(items: typeof projects) {
  return `<div class="seo-project-grid">${items.map((project) => `<article class="seo-card"><a href="/work/${project.slug}" class="seo-project-preview">${projectImage(project, false, true)}</a><h3><a href="/work/${project.slug}">${escapeHtml(project.name)}</a></h3><p>${escapeHtml(project.summary)}</p><a class="seo-text-link" href="/work/${project.slug}">View project details <span aria-hidden="true">↗</span></a></article>`).join("")}</div>`;
}

export async function renderServiceIndex() {
  const page = corePages[1];
  return pageShell(
    page,
    [
      ["Home", "/"],
      ["Services", "/services"],
    ],
    `<section class="seo-intro wrap"><p class="mono">Design + development / Worldwide</p><h1>Digital services.<br><span>Connected to your business.</span></h1><p>Custom websites, mobile applications, business software, AI integrations and digital design for businesses worldwide. From New Delhi, we collaborate remotely with teams in India, the United States, United Kingdom, United Arab Emirates and Canada.</p></section><section class="wrap seo-content" aria-label="Development and design services">${serviceCards(services)}</section>${contactBand()}`,
  );
}

function contactBand(service?: Service) {
  const href = service ? `/?service=${service.enquiry}#contact` : "/#contact";
  return `<section class="wrap seo-contact-band"><p class="mono">A clear starting point</p><h2>Tell us what<br>you want to build.</h2><p>Share the business need, the people using the product and any important dates. We can discuss scope, dependencies and the next step.</p><a class="btn" href="${href}">Discuss your project</a></section>`;
}

export async function renderService(slug: string) {
  const service = services.find((item) => item.slug === slug);
  const page = publicPages.find((item) => item.path === `/services/${slug}`);
  if (!service || !page) return undefined;
  const actualProjects = projects.filter((item) =>
    service.projects.includes(item.slug),
  );
  return pageShell(
    page,
    [
      ["Home", "/"],
      ["Services", "/services"],
      [service.name, page.path],
    ],
    `<section class="wrap seo-intro"><p class="mono">${escapeHtml(service.eyebrow)}</p><h1>${escapeHtml(service.name)}<span>Built around your business.</span></h1><p>${escapeHtml(service.intro)}</p><a class="btn" href="/?service=${service.enquiry}#contact">Discuss ${escapeHtml(service.name.toLowerCase())}</a></section><section class="wrap seo-content seo-detail"><div><h2>What we can build.</h2>${service.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}<p><a href="/global-services">Plan international collaboration</a> or <a href="/faq">browse project FAQs</a>.</p><h2>Is this the right fit?</h2><p>${escapeHtml(service.fit)}</p></div><aside class="seo-card"><h2>What the scope can include</h2><ul>${service.deliverables.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul><p>Deliverables, integrations, third-party costs, timeline and support are defined in your proposal.</p><a class="seo-text-link" href="/#process">How our process works ↗</a></aside></section><section class="wrap seo-content"><h2 class="seo-section-title">Questions about ${escapeHtml(service.name.toLowerCase())}.</h2><div class="fq">${service.faq.map(([question, answer]) => `<details><summary>${escapeHtml(question)}<span class="pl" aria-hidden="true">+</span></summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></section>${actualProjects.length ? `<section class="wrap seo-content"><h2 class="seo-section-title">Related published projects.</h2>${projectCards(actualProjects)}</section>` : `<section class="wrap seo-content seo-note"><h2>Explore the studio's work.</h2><p>Our published portfolio currently contains website and interface projects. Product concepts on the homepage illustrate possibilities and are not additional client projects.</p><a class="seo-text-link" href="/work/nsar-workshop">Explore the NSAR Workshop website example</a><p>This example shows website work, rather than evidence of a delivered mobile or AI product.</p><a class="seo-text-link" href="/work">View the published portfolio ↗</a></section>`}<section class="wrap seo-content"><h2 class="seo-section-title">Services that connect.</h2>${serviceCards(services.filter((item) => service.related.includes(item.slug)))}</section>${contactBand(service)}`,
    service,
  );
}

export async function renderWorkIndex() {
  const page = corePages[2];
  return pageShell(
    page,
    [
      ["Home", "/"],
      ["Work", "/work"],
    ],
    `<section class="wrap seo-intro"><p class="mono">Selected work / Real destinations</p><h1>Published projects.<br><span>Clear purpose.</span></h1><p>Explore the website and interface projects already linked from the studio's public portfolio. These previews show the actual published interfaces, while the homepage's animated previews remain illustrative.</p></section><section class="wrap seo-content">${projectCards(projects)}</section><section class="wrap seo-content seo-note"><h2>From a brief to a working interface.</h2><p>The projects connect website development with user journeys, content hierarchy and responsive interface design. Explore the services behind this kind of work.</p><a class="seo-text-link" href="/services/website-development">Website development ↗</a><a class="seo-text-link" href="/services/ui-ux-design">UI/UX design ↗</a></section>${contactBand()}`,
  );
}

export async function renderProject(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  const page = publicPages.find((item) => item.path === `/work/${slug}`);
  if (!project || !page) return undefined;
  return pageShell(
    page,
    [
      ["Home", "/"],
      ["Work", "/work"],
      [project.name, page.path],
    ],
    `<section class="wrap seo-intro"><p class="mono">Published website / Interface project</p><h1>${escapeHtml(project.name)}<span>A purpose-built digital experience.</span></h1><p>${escapeHtml(project.summary)}</p><a class="btn" href="${project.external}" target="_blank" rel="noopener noreferrer">Visit the published website ↗</a></section><figure class="wrap seo-project-image">${projectImage(project, true)}<figcaption>Preview from the studio's existing published portfolio.</figcaption></figure><section class="wrap seo-content seo-detail"><div><h2>The challenge.</h2><p>${escapeHtml(project.challenge)}</p><h2>The approach.</h2><p>${escapeHtml(project.approach)}</p><h2>Published outcome</h2><p>The linked interface and screenshot show the published work. No independently measured conversion, revenue or usage outcomes are available on this page.</p><h2>Stack and project timeline</h2><p>Implementation stack, commissioning status and delivery dates have not been confirmed for public attribution. Contact the studio to discuss relevant implementation requirements for your own project.</p></div><aside class="seo-card"><h2>Related services</h2><ul>${project.services
      .map((slug) => {
        const item = services.find((service) => service.slug === slug)!;
        return `<li><a href="/services/${item.slug}">${escapeHtml(item.name)}</a></li>`;
      })
      .join(
        "",
      )}</ul><p>Explore these services for a new project with a similar website or interface requirement.</p></aside></section><section class="wrap seo-content"><h2 class="seo-section-title">More published work.</h2>${projectCards(projects.filter((item) => item.slug !== project.slug))}</section>${contactBand()}`,
  );
}

export async function renderPrivacy() {
  const page = corePages[3];
  return pageShell(
    page,
    [
      ["Home", "/"],
      ["Privacy", "/privacy"],
    ],
    `<section class="wrap seo-intro"><p class="mono">Your information / Your choices</p><h1>Your privacy.<span>Your choices.</span></h1><p>Updated ${CONTENT_UPDATED}. This policy explains enquiry handling and your analytics choices when you visit the site or contact TheBenzzCreations.</p></section><div class="wrap privacy-layout"><aside class="privacy-sidebar"><nav aria-label="Privacy policy contents"><p class="mono">On this page</p><ol><li><a href="#privacy-enquiries">Your project enquiry</a></li><li><a href="#privacy-storage">Delivery and storage</a></li><li><a href="#privacy-analytics">Optional Google Analytics</a></li><li><a href="#privacy-hosting">Local assets and hosting</a></li><li><a href="#privacy-contact">Your choices and contact</a></li></ol></nav><div class="privacy-contact"><p class="mono">Questions about your data?</p><p>Get in touch with the studio.</p><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></div></aside><article class="seo-content seo-legal privacy-policy" aria-label="Privacy policy"><section id="privacy-enquiries" aria-labelledby="privacy-heading-enquiries"><p class="mono privacy-number">01</p><h2 id="privacy-heading-enquiries">Your project enquiry</h2><p>We use your name, email, chosen service and project description to respond to your enquiry. Phone, business, budget and timeline are optional. Please avoid sharing sensitive personal information.</p></section><section id="privacy-storage" aria-labelledby="privacy-heading-storage"><p class="mono privacy-number">02</p><h2 id="privacy-heading-storage">Delivery and storage</h2><p>Enquiries are validated by this website and delivered through Web3Forms or a configured email provider. The details you submit are shared with that provider for delivery and may remain in the studio's inbox while handling your enquiry or project. This site does not maintain a separate enquiry database.</p></section><section id="privacy-analytics" aria-labelledby="privacy-heading-analytics"><p class="mono privacy-number">03</p><h2 id="privacy-heading-analytics">Optional Google Analytics</h2><p>If Google Analytics 4 is configured, it is blocked until you choose to allow analytics. Choosing &ldquo;Decline&rdquo; keeps it disabled. Advertising storage, advertising user data and personalised advertising remain denied. Your preference is stored locally so the site can remember it.</p><p>After consent, analytics can measure page views, confirmed enquiry submissions and contact or project CTA clicks. Lead events contain a service category and form identifier; they do not include your name, email, phone or message. Page URLs sent by this implementation omit query strings and fragments. Google may process device, browser and usage information under its own policies.</p><p>You can review or withdraw your choice through <button type="button" class="inline-button" data-analytics-settings>Analytics settings</button>. Withdrawing stops subsequent site analytics events and removes accessible first-party Google Analytics cookies. Existing data already sent to Google is not removed by changing this preference.</p></section><section id="privacy-hosting" aria-labelledby="privacy-heading-hosting"><p class="mono privacy-number">04</p><h2 id="privacy-heading-hosting">Local assets and hosting</h2><p>Fonts, images and animation libraries are served locally. Hosting infrastructure may process ordinary request logs to deliver and protect the site. Third-party project links and direct email or WhatsApp links follow their respective providers' privacy practices.</p></section><section id="privacy-contact" aria-labelledby="privacy-heading-contact"><p class="mono privacy-number">05</p><h2 id="privacy-heading-contact">Your choices and contact</h2><p>You can ask about or request deletion of information you supplied by contacting <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>. You can also contact the studio directly instead of using the enquiry form.</p></section></article></div>`,
  );
}

export async function renderInformation(pathname: string) {
  const page = publicPages.find((item) => item.path === pathname)!;
  const contact = `<p>Email: <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></p><p>Telephone: <a href="tel:${BUSINESS.telephone}">${BUSINESS.telephone}</a></p><p>Based in ${BUSINESS.location}. We collaborate remotely worldwide.</p><a class="btn" href="/#contact">Send a project enquiry</a>`;
  const content = pathname === "/pricing"
    ? `<h1>Project pricing</h1><p>Every project is scoped individually for clients worldwide. Prices are available on request, based on your scope, requirements and timeline.</p><h2>Essential Presence</h2><p>A website or landing page for a credible online presence. Pricing on request.</p><h2>Signature Digital Experience</h2><p>A custom website with a stronger identity and a clear enquiry journey. Custom quote.</p><h2>Custom Product Engineering</h2><p>Mobile apps, software platforms, e-commerce systems and AI integrations. Custom quote.</p><h2>Ongoing Partnership</h2><p>Maintenance, deployment, optimisation and development support. Pricing on request.</p><h2>What determines the quote?</h2><p>Page count, content preparation, custom functionality, integrations and review requirements determine the quote. Deliverables, third-party costs, timeline and support are defined in your individual proposal.</p><h2>Request an estimate</h2><p>Share your goals, required features, budget and important dates. You can contact us directly without JavaScript or an account.</p>${contact}`
    : pathname === "/about"
    ? `<h1>About TheBenzzCreations</h1><p>${BRAND_DESCRIPTION}</p><h2>Design and engineering in one scope</h2><p>Published capabilities include React and Next.js websites, React Native applications, Node.js and Java / Spring Boot backends, business dashboards, e-commerce and AI integration. The technology follows your users, workflow and maintenance requirements.</p><h2>Published work</h2><p>Explore <a href="/work/nsar-workshop">NSAR Workshop</a>, <a href="/work/swiftpdf">SwiftPDF</a> and a <a href="/work/therapist-website">therapist website</a>. These pages describe published interfaces without claiming unverified customer results.</p><h2>Working across borders</h2><p>We welcome enquiries from the United States, United Kingdom, Canada, UAE including Dubai, India and other markets. Review overlap, channels and milestones are agreed for each engagement. <a href="/global-services">See how to plan international delivery</a>.</p><p>Explore our <a href="/services">services</a>, <a href="/work">published projects</a> and <a href="/#process">process</a>.</p>${contact}`
    : pathname === "/contact"
      ? `<h1>Contact TheBenzzCreations</h1><p>Share your business need, intended users, country or time zone and important dates so we can discuss scope and the next step. Include essential features and any existing systems that need to connect. Budget and timeline details are optional; every estimate follows a scope review. Please avoid sending passwords or sensitive customer data. See our <a href="/privacy">privacy policy</a> for enquiry handling and <a href="/blog/website-project-brief">project brief guide</a> for a useful starting point.</p>${contact}`
      : `<h1>Website terms of use</h1><p>Updated ${CONTENT_UPDATED}.</p><h2>Website information</h2><p>This website describes our services and published portfolio. Illustrative product concepts are identified separately from published projects. External websites are operated by their respective providers.</p><h2>Project enquiries</h2><p>Sending an enquiry starts a discussion. Project deliverables, integrations, third-party costs, timeline and support are defined in an individual proposal agreed with you.</p><h2>Privacy and contact</h2><p>See our <a href="/privacy">privacy policy</a> for enquiry handling and optional analytics choices. For questions about this website, <a href="/contact">contact us</a>.</p>`;
  return pageShell(page, [["Home", "/"], [pathname.slice(1), pathname]], `<article class="wrap seo-intro seo-legal">${content}</article>`);
}

export async function renderResource(pathname: string) {
  const page = publicPages.find((item) => item.path === pathname);
  if (!page) return undefined;
  const guide = insights.find((item) => pathname === `/blog/${item.slug}`);
  if (guide || pathname === "/blog") {
    const crumbs: [string, string][] = [["Home", "/"], ["Blog", "/blog"]];
    if (guide) crumbs.push([guide.h1, pathname]);
    return pageShell(page, crumbs, guide
      ? renderEditorialArticle(guide, insights, SITE_ORIGIN)
      : renderEditorialIndex(insights) + contactBand());
  }
  const content = pathname === "/faq"
    ? `<section class="wrap seo-intro"><p class="mono">Project questions / Practical answers</p><h1>Before we build.<span>Your questions, answered.</span></h1><p>Explore scope, technology choices, estimates and international collaboration. Project-specific commitments are confirmed in your proposal.</p></section><div class="wrap seo-content"><div class="faq-search" hidden><label for="faq-query">Search questions and answers</label><input id="faq-query" type="search" autocomplete="off" placeholder="Try payments, timeline or source code"><p id="faq-results" role="status" aria-live="polite"></p></div><nav class="faq-categories" aria-label="FAQ categories">${[...new Set(faqs.map((item) => item.category))].map((category, i) => `<a href="#category-${i}">${escapeHtml(category)}</a>`).join("")}</nav>${[...new Set(faqs.map((item) => item.category))].map((category, i) => `<section data-faq-category id="category-${i}"><h2>${escapeHtml(category)}</h2><div class="fq">${faqs.filter((item) => item.category === category).map((item) => `<details id="${item.id}" data-faq><summary>${escapeHtml(item.question)}<span class="pl" aria-hidden="true">+</span></summary><p>${escapeHtml(item.answer)} <a href="${item.path}">${escapeHtml(item.link)}</a>.</p></details>`).join("")}</div></section>`).join("")}</div><script defer src="/reference/faq.js"></script>`
    : pathname === "/global-services"
      ? `<section class="wrap seo-intro"><p class="mono">New Delhi / Working worldwide</p><h1>International projects.<span>A clear way to work together.</span></h1><p>Custom websites, mobile apps, business software and automation for startups and growing businesses. Based in New Delhi, India, we welcome remote enquiries from the United States, United Kingdom, Canada, UAE including Dubai, and worldwide.</p><a class="btn" href="/#contact">Discuss your project</a></section><section class="wrap seo-content seo-detail"><div><h2>Start with the business workflow</h2><p>Share the audience, the task they need to complete and the systems already in place. Separate essential launch features from later ideas. We review the requirements before agreeing deliverables, dependencies and a schedule.</p><h2>Plan reviews across time zones</h2><p>Tell us your country and time zone when enquiring. Meeting overlap, communication channels, decision makers and feedback milestones are agreed for the engagement. Consolidated written feedback helps keep asynchronous work clear.</p><h2>Design for the market you serve</h2><p>A US or Canadian launch may need regional date formats, multiple time zones and suitable payment options. UK projects may need their own content and billing conventions. UAE projects may involve AED pricing or a separately scoped Arabic interface. India-focused products may need INR and local payment workflows. These are discovery questions, not default features or claims of regulatory compliance.</p><p>Currency, payment provider availability, invoicing, privacy requirements and data hosting constraints depend on your business and customers. Your team approves business rules and obtains any specialist advice needed; technical requirements are agreed before implementation.</p><h2>Make launch responsibilities explicit</h2><p>Define who provides content, approves designs, owns domains and provider accounts, tests the workflow and maintains the system. Confirm source-code terms, third-party fees and support scope in the proposal. We do not list overseas offices or promise round-the-clock availability.</p></div><aside class="seo-card"><h2>A useful first message</h2><ul><li>Your business and intended users</li><li>Country, time zone and review availability</li><li>Core workflow and essential features</li><li>Existing website or system integrations</li><li>Target launch date and constraints</li><li>Optional budget range</li></ul><a href="/blog/website-project-brief">Prepare your brief</a><p><a href="/pricing">How project estimates work</a></p></aside></section><section class="wrap seo-content"><h2>Choose a starting point</h2>${serviceCards(services.slice(0, 5))}<p><a href="/faq#international">International project FAQs</a> · <a href="/about">Meet the studio</a> · <a href="/work">Published projects</a></p></section>`
      : "";
  return pageShell(page, [["Home", "/"], [pathname === "/faq" ? "FAQ" : "Working internationally", pathname]], content + contactBand());
}
