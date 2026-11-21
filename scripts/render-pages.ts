import { publicPages } from "../lib/seo-content";
import { renderHome, renderService, renderServiceIndex, renderProject, renderWorkIndex, renderPrivacy, renderInformation, renderResource, renderBlogArchive } from "../lib/seo";
export async function renderedPages() {
  const pages = new Map<string, string>();
  for (const page of publicPages) {
    const route = page.path;
    const html = route === "/" ? await renderHome()
      : route === "/services" ? await renderServiceIndex()
      : route.startsWith("/services/") ? await renderService(route.split("/")[2])
      : route === "/work" ? await renderWorkIndex()
      : route.startsWith("/work/") ? await renderProject(route.split("/")[2])
      : route === "/privacy" ? await renderPrivacy()
      : ["/about", "/contact", "/pricing", "/terms"].includes(route) ? await renderInformation(route)
      : /^\/blog\/(category|tag|page)\//.test(route) ? await renderBlogArchive(route)
      : await renderResource(route);
    if (!html) throw new Error(`No renderer for registered page ${route}`);
    pages.set(route, html);
  }
  return pages;
}
