import type { TemplateMeta } from "@/lib/types";

const dir = "/placeholders/air-conditioning/contractor";

const slot = (name: string, width: number, height: number, alt: string, prompt: string) => ({
  src: `${dir}/${name}.jpg`,
  alt,
  width,
  height,
  prompt,
});

const crew =
  "Filipino aircon technician in a grey company shirt with a blue logo on the back, real on-site documentary photography, natural light";

const meta = {
  slug: "contractor",
  name: "Contractor",
  category: "air-conditioning",
  tagline: "Old-school local contractor. Bold, blue, every number up top.",
  description:
    "Modeled on established neighborhood HVAC contractors like RGL: an info bar with hours and every phone line (Globe, Smart, landline), bold uppercase headings, a royal-blue hero with gold-framed hexagon photos, a brand wall and an about section over a city backdrop. Direct and no-nonsense, for shops that get their work by phone.",
  tags: ["Bold", "Local"],
  palette: {
    royal: "#0A3394",
    navy: "#062260",
    sky: "#4FB6E8",
    gold: "#C9A24A",
    cloud: "#F5F7FA",
    ink: "#1B1F2A",
  },
  fonts: { heading: "Archivo", body: "Archivo" },
  bestFor: [
    "Long-running local contractors",
    "Shops that book mostly by phone or text",
    "Supply, installation and repair outfits",
    "Owners with real photos of their crew and shop",
  ],
  features: [
    "Info bar with hours, multiple phone lines and socials",
    "Sticky header with CALL NOW button",
    "Royal-blue hero with hexagon photo frames",
    "Trust stats row",
    "Photo service cards and a rate table",
    "Brand wall, about section, coverage and FAQ",
    "Testimonials and a news card",
    "Inquiry form with validation and confirmation",
    "Chat-style floating contact button",
  ],
  thumbnail: `${dir}/thumbnail.jpg`,
  thumbnailMobile: `${dir}/thumbnail-mobile.jpg`,
  images: {
    heroBg: slot("hero-bg", 2400, 1200, "Several indoor aircon units stacked in a warehouse", "Several new white split-type and ceiling cassette aircon indoor units stacked in a clean supply warehouse, shot at an angle, heavy royal blue color grade, low contrast, used as a background, 2:1"),
    hex1: slot("hex-1", 700, 700, "Technician cleaning a split-type unit, seen from behind", `${crew}, seen from behind while cleaning a wall-mounted split aircon, square 1:1`),
    hex2: slot("hex-2", 700, 700, "Technician working on a ceiling unit", `${crew}, reaching up to service a ceiling-mounted aircon in an office, square 1:1`),
    installation: slot("installation", 800, 560, "Crew installing an outdoor unit", `Two technicians mounting an outdoor aircon condenser on a wall bracket, ${crew}, 10:7`),
    cleaning: slot("cleaning", 800, 560, "Technician pressure-washing a coil", `Technician spraying an aircon coil with a pressure washer, cleaning bag attached, ${crew}, 10:7`),
    repair: slot("repair", 800, 560, "Technician testing with a multimeter", `Technician testing an aircon control board with a multimeter, ${crew}, 10:7`),
    maintenance: slot("maintenance", 800, 560, "Technician on a ladder in an office ceiling", `Technician on a ladder checking a ceiling cassette unit in an office, ${crew}, 10:7`),
    freon: slot("freon", 800, 560, "Gauges attached to a condenser", `Close-up of manifold gauges attached to an outdoor aircon unit, technician's hands, ${crew}, 10:7`),
    relocation: slot("relocation", 800, 560, "Unit being loaded onto a service van", `Technicians loading a wrapped aircon unit into a white service van on a Quezon City street, ${crew}, 10:7`),
    city: slot("city", 2400, 1000, "Glass office towers", "Looking up at blue glass office towers in Ortigas or BGC, strong blue tint, slightly blurred, used as a section background, 12:5"),
    about: slot("about", 1200, 750, "The crew in front of the shop", "Group of twelve Filipino aircon technicians in matching black shirts standing in front of their small aircon service shop with a blue signboard, motorcycles and a service van parked in front, Quezon City street, daytime, real photo, 8:5"),
    post: slot("post", 1200, 900, "Man surprised by his electric bill", "Filipino man in a grey t-shirt looking shocked while reading a paper electric bill, plain light grey wall background, 4:3"),
  },
  featured: true,
} satisfies TemplateMeta;

export default meta;
