import type { TemplateMeta } from "@/lib/types";

const dir = "/placeholders/air-conditioning/dispatch";

const meta = {
  slug: "dispatch",
  name: "Dispatch",
  category: "air-conditioning",
  tagline: "On-demand booking site. Book a tech in three taps.",
  description:
    "Modeled on app-style service marketplaces like Teko: a bright, friendly booking site that treats aircon service like ordering a ride. A big cut-out technician hero, service tiles, a plain rate table, a maintenance plan, a guarantee banner and review scores up front. Built for businesses that run on volume and fast scheduling.",
  tags: ["Light", "Booking-first"],
  palette: {
    blue: "#1F6FD1",
    bright: "#4696EF",
    amber: "#FEB13B",
    mist: "#F3F5F3",
    ice: "#DBF4FF",
    ink: "#2B3036",
  },
  fonts: { heading: "Open Sans", body: "Open Sans" },
  bestFor: [
    "High-volume cleaning and repair outfits",
    "Businesses with online booking and dispatch",
    "Multi-technician teams covering several cities",
    "Companies selling annual maintenance plans",
  ],
  features: [
    "Sticky header with click-to-call and Book button",
    "Rotating hero for cleaning, repair and installation",
    "Service tiles with starting prices",
    "Rate table by unit type",
    "Annual maintenance plan with quote CTA",
    "Guarantee banner and review scores",
    "Brands grid, coverage list, FAQ",
    "Booking form with validation and confirmation",
    "Messenger / Viber / WhatsApp floating button",
  ],
  thumbnail: `${dir}/thumbnail.jpg`,
  thumbnailMobile: `${dir}/thumbnail-mobile.jpg`,
  images: {
    hero: {
      src: `${dir}/hero.jpg`,
      alt: "Technician in a blue uniform lifting the cover off a split-type aircon",
      width: 1200,
      height: 1100,
      prompt:
        "Filipino aircon technician in a light blue polo uniform reaching up to open the front panel of a white wall-mounted split-type air conditioner, shot from slightly below, subject placed on the right, plain very light grey seamless background on the left half for text, bright even studio light, commercial service-app photography, 12:11",
    },
    guarantee: {
      src: `${dir}/guarantee.jpg`,
      alt: "Smiling technician giving a thumbs up",
      width: 800,
      height: 900,
      prompt:
        "Friendly Filipino male technician in a white polo shirt with a small logo, smiling and giving a thumbs up, waist-up portrait, isolated on a solid medium blue background (#1F6FD1), soft studio light, 8:9",
    },
    customer: {
      src: `${dir}/customer.jpg`,
      alt: "Homeowner chatting with a technician after a service",
      width: 900,
      height: 900,
      prompt:
        "Filipino homeowner woman in her 40s smiling while talking with an aircon technician in a light blue uniform inside a bright condo living room, split-type aircon on the wall behind them, natural daylight, candid lifestyle photography, square 1:1",
    },
  },
  featured: true,
} satisfies TemplateMeta;

export default meta;
