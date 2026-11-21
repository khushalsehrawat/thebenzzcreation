import { insights } from "@/lib/resources";
import { articleMarkdown } from "@/lib/editorial-markdown";
import { SITE_ORIGIN } from "@/lib/seo-content";

export const dynamic = "force-static";
export function generateStaticParams() { return insights.map(({ slug }) => ({ slug })); }

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const article = insights.find((item) => item.slug === slug);
  return new Response(article ? articleMarkdown(article, SITE_ORIGIN) : "Not found", {
    status: article ? 200 : 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      ...(article ? { Link: `<${SITE_ORIGIN}/blog/${slug}>; rel="canonical"` } : {}),
    },
  });
}
