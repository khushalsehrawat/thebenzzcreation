import { archivesFor } from "@/lib/blog-archives";
import { insights } from "@/lib/resources";
import { renderBlogArchive } from "@/lib/seo";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return archivesFor(insights).filter(item => item.kind === "tag").map(item => ({ value: item.path.split("/").at(-1)! }));
}
export async function GET(_request: Request, { params }: { params: Promise<{ value: string }> }) {
  const { value } = await params;
  const html = await renderBlogArchive(`/blog/tag/${value}`);
  return new Response(html || "Not found", { status: html ? 200 : 404, headers: { "Content-Type": "text/html; charset=utf-8", ...(html ? {} : { "X-Robots-Tag": "noindex" }) } });
}
