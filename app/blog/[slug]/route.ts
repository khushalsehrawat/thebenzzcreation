import { renderResource } from "@/lib/seo";
import { insights } from "@/lib/resources";
export const dynamic = "force-static";
export function generateStaticParams() { return insights.map(({ slug }) => ({ slug })); }
export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const html = insights.some((item) => item.slug === slug) ? await renderResource(`/blog/${slug}`) : undefined;
  return new Response(html ?? "Not found", { status: html ? 200 : 404, headers: { "Content-Type": "text/html; charset=utf-8", ...(!html ? { "X-Robots-Tag": "noindex" } : {}) } });
}
