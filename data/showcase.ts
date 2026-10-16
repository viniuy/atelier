import type { ShowcaseSite } from "@/lib/types";

/**
 * Real websites shown in the gallery, separate from Atelier's templates.
 *
 * - kind "work": sites you built for real clients. Shown as your portfolio.
 * - kind "inspiration": other businesses' sites, clearly labelled as
 *   references, never as your work. Templates link back to what inspired them.
 *
 * Screenshots live in /public/showcase/<slug>.jpg. Run `npm run showcase`
 * to capture them (or `npm run showcase -- <slug>` for one).
 * Set `embeddable: true` only if the site allows being shown in an iframe
 * (most big brands block it); then the detail page shows a live preview.
 */
export const showcase: ShowcaseSite[] = [
  // Example client entry (uncomment and edit once you have one):
  // {
  //   slug: "cool-breeze-bacoor",
  //   name: "Cool Breeze Aircon",
  //   url: "https://coolbreezeaircon.ph",
  //   kind: "work",
  //   category: "air-conditioning",
  //   summary: "Booking site for a 6-technician aircon shop in Bacoor.",
  //   template: "dispatch",
  //   year: 2026,
  //   screenshot: "/showcase/cool-breeze-bacoor.jpg",
  //   embeddable: true,
  // },
  {
    slug: "teko",
    name: "Teko",
    url: "https://teko.ph",
    kind: "inspiration",
    category: "air-conditioning",
    summary: "On-demand technician marketplace for aircon, appliance, TV and computer service.",
    notes: [
      "Hero rotates through one headline per service",
      "Service tiles before any long copy",
      "Guarantee banner with a real technician's photo",
      "Review scores from Google and Facebook up front",
    ],
    template: "dispatch",
    screenshot: "/showcase/teko.jpg",
  },
  {
    slug: "samsung-ph",
    name: "Samsung Philippines",
    url: "https://www.samsung.com/ph/",
    kind: "inspiration",
    category: "air-conditioning",
    summary: "Electronics brand store. Campaign banners, product tiles and a sale-price shelf.",
    notes: [
      "Near-monochrome UI so product photos carry the color",
      "Text link plus outline pill as the only two button styles",
      "Grey square tiles for product categories",
      "Scrolling recommended shelf with savings shown in blue",
    ],
    template: "showroom",
    screenshot: "/showcase/samsung-ph.jpg",
  },
  {
    slug: "carrier-ph",
    name: "Carrier Philippines",
    url: "https://carrier.com.ph",
    kind: "inspiration",
    category: "air-conditioning",
    summary: "Corporate HVAC brand site with separate paths for homes and businesses.",
    notes: [
      "Huge light-weight headline over full-bleed photography",
      "Hotline in a utility bar on every page",
      "Image tiles with round arrow buttons",
      "Scroll-driven \"why choose us\" sequence",
    ],
    template: "authority",
    screenshot: "/showcase/carrier-ph.jpg",
  },
  {
    slug: "rgl-aircon",
    name: "RGL Airconditioning Services",
    url: "https://www.rglairconditioning.com",
    kind: "inspiration",
    category: "air-conditioning",
    summary: "Quezon City HVAC contractor. Phone-first, bold and traditional.",
    notes: [
      "Hours and every phone line in a top info bar",
      "Bold uppercase headings and a CALL NOW button",
      "Real crew photos in framed shapes",
      "Brand wall of the units they supply",
    ],
    template: "contractor",
    screenshot: "/showcase/rgl-aircon.jpg",
  },
];

// Catch config mistakes at build time.
{
  const seen = new Set<string>();
  for (const s of showcase) {
    if (seen.has(s.slug)) throw new Error(`Duplicate showcase slug "${s.slug}"`);
    seen.add(s.slug);
  }
}

export const getSite = (slug: string) => showcase.find((s) => s.slug === slug);
export const getWork = () => showcase.filter((s) => s.kind === "work");
export const getInspiration = () => showcase.filter((s) => s.kind === "inspiration");
export const getInspirationFor = (template: string) =>
  showcase.filter((s) => s.kind === "inspiration" && s.template === template);
