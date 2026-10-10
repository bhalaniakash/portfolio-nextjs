import { articles } from "@/data/writing";

// Set NEXT_PUBLIC_SITE_URL to the production domain before deploying.
// It drives canonical URLs, the sitemap, robots.txt and Open Graph tags.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bhalaniakash.github.io").replace(/\/$/, "");

export const siteTitle = "Akash Bhalani, Full Stack Web Developer";
export const siteDescription =
  "Akash Bhalani is a full stack web developer in Ahmedabad, India, working in Laravel and Python: REST APIs, authentication, Django and FastAPI services, LLM integrations and dashboards.";

// Existing Formspree form from the original portfolio. The form posts here
// directly from the browser, so no server secret is involved.
export const contactEndpoint = "https://formspree.io/f/mldnlylp";

export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  ...(articles.length > 0 ? [{ id: "writing", label: "Writing" }] : []),
  { id: "contact", label: "Contact" },
];

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Serialises JSON-LD safely for a script tag. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
