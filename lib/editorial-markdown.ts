import type { EditorialArticle } from "./editorial-types";

// Converts the trusted, authored editorial HTML subset, not arbitrary user HTML.
function markdownBody(html: string, origin: string): string {
  const inline = (text: string): string => text
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,
      (_, href: string, label: string) => `[${label.replace(/<[^>]+>/g, "")}](${new URL(href, origin).href})`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, "**$2**")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  return html
    .replace(/<table>([\s\S]*?)<\/table>/g, (_, body: string) => {
      const caption = body.match(/<caption>([\s\S]*?)<\/caption>/)?.[1];
      const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(([, row]) =>
        [...row.matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/g)]
          .map(([, cell]) => inline(cell).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim()));
      if (!rows.length) return "";
      return `\n\n${caption ? inline(caption) + "\n\n" : ""}${rows.map((row, index) =>
        `| ${row.join(" | ")} |${index === 0 ? `\n| ${row.map(() => "---").join(" | ")} |` : ""}`).join("\n")}\n\n`;
    })
    .replace(/<p>([\s\S]*?)<\/p>/g, (_, body: string) => `\n\n${inline(body)}\n\n`)
    .replace(/<li>([\s\S]*?)<\/li>/g, (_, body: string) => `\n- ${inline(body)}`)
    .replace(/<\/(?:ul|ol)>/g, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n").trim();
}

export function articleMarkdown(article: EditorialArticle, origin: string): string {
  const canonical = `${origin}/blog/${article.slug}`;
  return `# ${article.h1}

Canonical source: ${canonical}
Publisher: TheBenzzCreations — independent development studio, New Delhi, India.
Published: ${article.published}
Updated: ${article.updated}

${article.intro}

## The direct answer

${article.answer}

${article.sections.map(([heading, body]) => `## ${heading}\n\n${markdownBody(body, origin)}`).join("\n\n")}

${article.faqs.length ? `## Frequently asked questions\n\n${article.faqs.map(({ question, answer }) => `### ${question}\n\n${answer}`).join("\n\n")}\n\n` : ""}${article.sources.length ? `## Sources and review notes\n\nOfficial references checked on ${article.updated}. Provider capabilities and policies can change. Illustrative budgets are identified in the article.\n\n${article.sources.map(({ label, url }) => `- [${label}](${url})`).join("\n")}\n\n` : ""}## Related reading

${article.related.map((slug) => `- [${slug.replaceAll("-", " ")}](${origin}/blog/${slug})`).join("\n")}

## Discuss your requirements

${article.cta}
[Related service](${origin}/services/${article.service}) · [Contact TheBenzzCreations](${origin}/contact)
Project scope, pricing and availability require an individual proposal.
`;
}
