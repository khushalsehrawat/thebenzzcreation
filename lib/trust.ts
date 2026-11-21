/** Populate only with permission and evidence. Empty configurations publish nothing. */
export const testimonials: { quote: string; name: string; role: string; sourceUrl: string }[] = [];
export const reviewBadges: { label: string; url: string }[] = [];

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export function testimonialsMarkup() {
  return testimonials.length ? `<section aria-label="Client testimonials">${testimonials.map(item => `<figure><blockquote>${escape(item.quote)}</blockquote><figcaption><a href="${escape(item.sourceUrl)}">${escape(item.name)}, ${escape(item.role)}</a></figcaption></figure>`).join("")}</section>` : "";
}
export function reviewBadgesMarkup() {
  return reviewBadges.length ? `<nav aria-label="Independent review profiles">${reviewBadges.map(item => `<a href="${escape(item.url)}">${escape(item.label)}</a>`).join("")}</nav>` : "";
}
export const trustMarkup = () => testimonialsMarkup() + reviewBadgesMarkup();
