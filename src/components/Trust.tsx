import { testimonials, reviewBadges, testimonialsMarkup, reviewBadgesMarkup } from "../../lib/trust";
export function Testimonials() {
  return testimonials.length ? <div dangerouslySetInnerHTML={{ __html: testimonialsMarkup() }} /> : null;
}
export function ReviewBadges() {
  return reviewBadges.length ? <div dangerouslySetInnerHTML={{ __html: reviewBadgesMarkup() }} /> : null;
}
