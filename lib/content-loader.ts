import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { EditorialArticle } from "./editorial-types";

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function inline(value: string) {
  return escape(value).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    if (!/^(?:\/|https:\/\/)/.test(href)) throw new Error(`Unsupported editorial link: ${href}`);
    return `<a href="${href}">${label}</a>`;
  }).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
/** Intentionally small Markdown subset: no executable MDX or runtime compiler. */
export function markdownHtml(body: string): string {
  return body.trim().split(/\n\s*\n/).map(block => {
    const lines = block.trim().split("\n");
    if (lines.every(line => /^[-*] /.test(line))) return `<ul>${lines.map(line => `<li>${inline(line.slice(2))}</li>`).join("")}</ul>`;
    if (lines.every(line => /^\d+\. /.test(line))) return `<ol>${lines.map(line => `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
    if (lines[0].startsWith("### ")) return `<h3>${inline(lines[0].slice(4))}</h3>${lines.length > 1 ? `<p>${inline(lines.slice(1).join(" "))}</p>` : ""}`;
    if (lines[0].startsWith("|")) {
      const cells = (line: string) => line.replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
      const head = cells(lines[0]);
      return `<div class="editorial-table-scroll"><table><caption>Decision comparison</caption><thead><tr>${head.map(cell => `<th scope="col">${inline(cell)}</th>`).join("")}</tr></thead><tbody>${lines.slice(2).map(line => `<tr>${cells(line).map(cell => `<td>${inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    return `<p>${inline(lines.join(" "))}</p>`;
  }).join("");
}

export function loadArticles(): EditorialArticle[] {
  const directory = path.join(process.cwd(), "content", "blog");
  return readdirSync(directory).filter(file => file.endsWith(".md")).sort().map(file => {
    const source = readFileSync(path.join(directory, file), "utf8").replace(/\r\n/g, "\n");
    const match = source.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error(`${file}: missing JSON-compatible YAML frontmatter`);
    const front = JSON.parse(match[1]);
    for (const field of ["title", "description", "date", "updated", "author", "tags", "faq", "service", "h1", "intro", "answer", "category"]) {
      if (front[field] === undefined) throw new Error(`${file}: missing ${field}`);
    }
    const slug = file.slice(0, -3);
    const sections: [string, string][] = match[2].split(/^## /m).filter(Boolean).map(section => {
      const end = section.indexOf("\n");
      return [section.slice(0, end).trim(), front.format === "trusted-html" ? section.slice(end).trim() : markdownHtml(section.slice(end))];
    });
    return { ...front, slug, key: slug, published: front.date, faqs: front.faq, sections } as EditorialArticle;
  });
}
