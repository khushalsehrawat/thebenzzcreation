/** Public facts retained from the supplied site. Unknown facts stay unpublished. */
export const site = {
  name: "TheBenzzCreations",
  url: "https://www.thebenzzcreations.com",
  email: "thebenzzcreationsofficial@gmail.com",
  telephone: "+919899788325",
  location: "New Delhi, India",
  sameAs: ["https://www.instagram.com/thebenzzcreations/"],
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" },
  founder: null as null | { name: string; role: string; biography: string; image?: string },
  bookingUrl: null as string | null,
  markets: ["India", "United States", "United Kingdom", "United Arab Emirates", "Canada"],
  updated: "2026-11-21",
};
