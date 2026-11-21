import { testimonials, reviewBadges } from "../../lib/trust";
export function Testimonials() {
  if (!testimonials.length) return null;
  return <section aria-label="Client testimonials">{testimonials.map(item => <figure key={item.sourceUrl}><blockquote>{item.quote}</blockquote><figcaption><a href={item.sourceUrl}>{item.name}, {item.role}</a></figcaption></figure>)}</section>;
}
export function ReviewBadges() {
  if (!reviewBadges.length) return null;
  return <nav aria-label="Independent review profiles">{reviewBadges.map(item => <a key={item.url} href={item.url}>{item.label}</a>)}</nav>;
}
