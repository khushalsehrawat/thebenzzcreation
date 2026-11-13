import { renderHome } from "@/lib/seo";
<<<<<<< HEAD
import { agentLinks, homepageMarkdown, prefersMarkdown } from "@/lib/agents";
export async function GET(request: Request) {
  const markdown = prefersMarkdown(request.headers.get("accept"));
  return new Response(markdown ? homepageMarkdown() : await renderHome(), {
    headers: { "Content-Type": `${markdown ? "text/markdown" : "text/html"}; charset=utf-8`, Vary: "Accept", Link: agentLinks },
=======
export const dynamic = "force-static";
export async function GET() {
  return new Response(await renderHome(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
>>>>>>> 9e1490581b4e85378653d92164c448ef1945e3e4
  });
}
