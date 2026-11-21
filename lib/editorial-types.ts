export type EditorialArticle = {
  slug: string;
  tags?: string[];
  author?: string;
  steps?: { name: string; text: string }[];
  key: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  answer: string;
  category: string;
  service: string;
  published: string;
  updated: string;
  sections: [string, string][];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  related: string[];
  cta: string;
};

export function articleText(article: EditorialArticle) {
  return [article.h1, article.intro, article.answer,
    ...article.sections.flat(),
    ...article.faqs.flatMap(({ question, answer }) => [question, answer]),
    ...article.sources.map(({ label }) => label), article.cta,
  ].join(" ").replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ");
}

// 220 words per minute; includes the article's tables, FAQs and source labels.
export function readingMinutes(article: EditorialArticle) {
  return Math.max(1, Math.ceil(articleText(article).trim().split(/\s+/).length / 220));
}
