import { writeFile } from "node:fs/promises";
import { publicPages, services } from "../lib/seo-content";
import { renderHome, renderInformation, renderPrivacy, renderProject, renderResource, renderService, renderServiceIndex, renderWorkIndex } from "../lib/seo";
const themes: Record<string, string> = {
 '/': 'custom website, app and software development company',
 '/services': 'digital development services',
 '/services/website-development': 'custom website development company',
 '/services/mobile-app-development': 'mobile application development services',
 '/services/custom-software-development': 'custom software development company',
 '/services/ecommerce-development': 'e-commerce development agency',
 '/services/ai-integration-automation': 'AI automation services for businesses',
 '/services/ui-ux-design': 'UI UX design services',
 '/services/digital-marketing': 'technical SEO and digital marketing support',
 '/global-services': 'remote development team for international businesses',
 '/faq': 'website and software development project questions',
 '/blog': 'website and software project planning guides',
 '/blog/website-project-brief': 'what to prepare before hiring a web agency',
 '/blog/custom-software-vs-off-the-shelf': 'custom software vs off-the-shelf tools',
 '/pricing': 'custom website and software project estimate',
};
async function main() {
let doc = '# Keyword-to-page map\n\nAll keyword terms are hypotheses, not verified volume, difficulty or ranking data. Semrush connected successfully on the latest retry, but all keyword reports were marked unavailable because the connected account has no API units left. No keyword research account data was available. Validate with Search Console queries, real enquiry vocabulary and a research tool before expansion. This table is the complete indexable route inventory.\n\n| URL | Primary keyword hypothesis | Secondary themes | Intent | Audience | Title | H1 | Internal links | Status | Evidence/validation needed |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
for (const page of publicPages) {
 const path = page.path;
 const html = path === '/' ? await renderHome() : path === '/services' ? await renderServiceIndex() : path === '/work' ? await renderWorkIndex() : path === '/privacy' ? await renderPrivacy() : path.startsWith('/services/') ? await renderService(path.split('/').at(-1)!) : path.startsWith('/work/') ? await renderProject(path.split('/').at(-1)!) : ['/about','/contact','/pricing','/terms'].includes(path) ? await renderInformation(path) : await renderResource(path);
 const h1 = html!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)![1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 const service = services.find(item => path === `/services/${item.slug}`);
 const secondary = service ? service.frontendBullets.join(', ') : path === '/global-services' ? 'US startups, UK businesses, Canadian teams, UAE/Dubai, India, time zones, remote discovery' : path.startsWith('/work') ? 'published project, interface design, website portfolio' : 'project discovery, scope, business workflows';
 const intent = path.startsWith('/blog') || path === '/faq' ? 'Informational / commercial investigation' : ['/privacy','/terms'].includes(path) ? 'Policy / navigational' : path.startsWith('/work') || path === '/about' ? 'Proof / navigational' : 'Commercial / enquiry';
 doc += `| ${path} | ${themes[path] || page.title.split('|')[0].trim()} | ${secondary} | ${intent} | Founders, SMEs and business teams worldwide | ${page.title.replaceAll("|", "&#124;")} | ${h1} | Services, work, FAQ, global delivery, contact; related content contextually | ${['faq','global-services','insights','website-project-brief','custom-software-vs-off-the-shelf'].includes(page.key) ? 'New' : 'Existing; preserved or enhanced'} | Validate query intent; project pages need approved stack, contribution and outcomes before expansion |\n`;
}
doc += '\nTechnology intent is consolidated: React/Next.js and full-stack work → website-development; React Native → mobile-app-development; Java/Spring Boot, Node.js, APIs, dashboards → custom-software-development; deployment/maintenance → digital-marketing and FAQ as scoped. No empty technology pages.\n\nRegional themes map to /global-services and the relevant core service, rather than duplicate country pages. Delhi/New Delhi studio identity maps to /about. No physical overseas location is implied. Policy pages serve navigation, not commercial keyword targeting.\n';
await writeFile('docs/seo-keyword-map.md', doc);

}
main().catch((error) => { console.error(error); process.exitCode = 1; });
