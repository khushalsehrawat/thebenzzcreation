import type { EditorialArticle } from "./editorial-types";
export const PAGE_SIZE = 9;
export const archiveSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function archivesFor(articles: EditorialArticle[]) {
  const categories = [...new Set(articles.map(article => article.category))];
  const tags = [...new Set(articles.flatMap(article => article.tags || [article.service]))];
  return [
    ...categories.map(label => ({ path: `/blog/category/${archiveSlug(label)}`, label, kind: "category", articles: articles.filter(article => article.category === label) })),
    ...tags.map(label => ({ path: `/blog/tag/${archiveSlug(label)}`, label, kind: "tag", articles: articles.filter(article => (article.tags || [article.service]).includes(label)) })),
    ...Array.from({ length: Math.ceil(articles.length / PAGE_SIZE) - 1 }, (_, index) => ({ path: `/blog/page/${index + 2}`, label: `page ${index + 2}`, kind: "page", articles: articles.slice((index + 1) * PAGE_SIZE, (index + 2) * PAGE_SIZE) })),
  ];
}
export function archiveMetadata(item: ReturnType<typeof archivesFor>[number]) {
  const label = item.label.replaceAll("-", " ");
  const subject = label.replace(/\b\w/g, c => c.toUpperCase()) + (item.kind === "tag" ? " Topics" : "");
  const suffixes = [": Practical Business Guides", ": Business Planning Guides for 2026", ": Practical Guides for Business Owners in 2026", " Guides: Planning Your Next Business Project in 2026", ": Business Guides | TheBenzzCreations", ": Studio Planning Library"];
  const title = suffixes.map(suffix => subject + suffix).find(candidate => candidate.length >= 50 && candidate.length <= 60) || `${subject}: Practical Guides | Studio Blog`;
  return {
    path: item.path, key: "insights", title,
    description: `Explore ${label} ${item.kind} guides with project decisions, checklists and related services from TheBenzzCreations, ${label.length > 17 ? "a" : "a digital"} studio in New Delhi, India.`,
  };
}
