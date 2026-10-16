import type { TemplateMeta } from "@/lib/types";

const dir = "/placeholders/air-conditioning/showroom";

const product = (name: string, alt: string, prompt: string) => ({
  src: `${dir}/${name}.jpg`,
  alt,
  width: 800,
  height: 800,
  prompt: `${prompt}, centered product shot on a seamless very light grey background (#F4F4F4), soft even studio lighting, subtle floor reflection, e-commerce catalog style, square 1:1`,
});

const meta = {
  slug: "showroom",
  name: "Showroom",
  category: "air-conditioning",
  tagline: "Product-first and monochrome, like an electronics brand store.",
  description:
    "Modeled on big electronics brand sites like Samsung PH: full-bleed campaign banners, grey product tiles, a scrolling \"recommended\" shelf with sale prices, and thin pill buttons. Almost all black and white, so the units and photos carry the page. For dealers that sell and install units as well as service them.",
  tags: ["Light", "Minimal", "Retail"],
  palette: {
    black: "#000000",
    ink: "#1A1A1A",
    gray: "#6E6E6E",
    tile: "#F4F4F4",
    line: "#DDDDDD",
    blue: "#1259C3",
    night: "#0B1A33",
  },
  fonts: { heading: "Outfit", body: "Hanken Grotesk" },
  bestFor: [
    "Aircon dealers and appliance centers",
    "Brand-authorized resellers with installation teams",
    "Shops running seasonal promos and sale prices",
    "Businesses with good product photography",
  ],
  features: [
    "Utility bar plus sticky header with click-to-call",
    "Full-bleed campaign hero with pill buttons",
    "Grey product-category tiles",
    "Recommended-units shelf with sale prices and scroll progress",
    "Service tiles, packages and a dark promo banner",
    "Brands line, reviews, coverage and FAQ list",
    "Booking form with validation and confirmation",
    "Dense multi-column footer",
    "Messenger / Viber / WhatsApp floating button",
  ],
  thumbnail: `${dir}/thumbnail.jpg`,
  thumbnailMobile: `${dir}/thumbnail-mobile.jpg`,
  images: {
    hero: {
      src: `${dir}/hero.jpg`,
      alt: "A slim white inverter split-type aircon above a sofa in a bright living room",
      width: 2400,
      height: 1200,
      prompt:
        "Minimal bright Filipino condo living room, slim matte white wall-mounted inverter split-type air conditioner above a light grey sofa, the unit and sofa on the left half, right half is clean pale wall for headline text, soft morning daylight, premium electronics brand campaign photography, 2:1",
    },
    banner: {
      src: `${dir}/banner.jpg`,
      alt: "Technician mounting an outdoor aircon unit at dusk",
      width: 2400,
      height: 1100,
      prompt:
        "Dramatic deep navy blue dusk scene, a single modern outdoor aircon condenser unit lit by a soft top spotlight, technician's gloved hands tightening a valve, subject on the right half, left half dark for white headline text, cinematic premium brand campaign photography, 24:11",
    },
    window: product("window", "Window-type inverter aircon", "Modern white window-type inverter air conditioner, front three-quarter view"),
    split: product("split", "Split-type inverter aircon indoor unit", "Slim white wall-mounted split-type inverter air conditioner indoor unit, front view"),
    floor: product("floor", "Floor-mounted aircon", "Tall white floor-standing air conditioner, front three-quarter view"),
    cassette: product("cassette", "Ceiling cassette aircon", "Square white four-way ceiling cassette air conditioner panel, seen from slightly below"),
  },
  featured: true,
} satisfies TemplateMeta;

export default meta;
