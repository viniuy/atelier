/**
 * Gallery-wide settings. This is the only file you need to touch to change
 * how prospective clients reach you from the "I like this one" button.
 */

export type ContactMethod = "mailto" | "messenger";

export const site = {
  name: "Atelier",
  studio: "Atelier Web Studio",
  description:
    "Ready-to-launch website templates for local businesses. Pick a look you love and we'll build your site on it.",

  /** Used for absolute URLs (metadata, shareable preview links). */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  contact: {
    /** Which channel the "I like this one" CTA opens. */
    method: "messenger" as ContactMethod,
    /** Used when method is "mailto" (and shown in the footer). */
    email: "vincent.enolpe@gmail.com",
    /** Facebook Page or profile username → https://m.me/<messenger> */
    messenger: "Vincent",
    /** Message prefilled into the email body / Messenger chat. */
    message: (template: { name: string; previewUrl: string }) =>
      `Hi! I like the "${template.name}" template. Can you build my website based on it?\n\nPreview: ${template.previewUrl}\n\nMy business name:\nWhat I do:\nBest number to reach me:`,
  },
};

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}

/** Builds the href for the "I like this one" CTA. */
export function contactHref(template: { name: string; slug: string }) {
  const previewUrl = absoluteUrl(`/preview/${template.slug}`);
  const message = site.contact.message({ name: template.name, previewUrl });

  if (site.contact.method === "messenger") {
    return `https://m.me/${site.contact.messenger}?text=${encodeURIComponent(message)}`;
  }

  const subject = `Website inquiry: ${template.name}`;
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

/** Contact link for a category that has no templates yet. */
export function contactHrefForCategory(categoryName: string) {
  const message = `Hi! I'm interested in a ${categoryName} website. Can we talk?`;
  if (site.contact.method === "messenger") {
    return `https://m.me/${site.contact.messenger}?text=${encodeURIComponent(message)}`;
  }
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(`${categoryName} website`)}&body=${encodeURIComponent(message)}`;
}
