import { renderResource } from "@/lib/seo";
export const dynamic = "force-static";
export async function GET() {
  return new Response(await renderResource("/global-services"), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
