import type { TemplateMeta } from "@/lib/types";

const dir = "/placeholders/air-conditioning/authority";

const slot = (name: string, width: number, height: number, alt: string, prompt: string) => ({
  src: `${dir}/${name}.jpg`,
  alt,
  width,
  height,
  prompt,
});

const lifestyle =
  "bright airy Filipino home, white walls, natural daylight, soft cool tones, premium air-conditioning brand lifestyle photography";

const meta = {
  slug: "authority",
  name: "Authority",
  category: "air-conditioning",
  tagline: "Corporate and confident. Navy, light type, big photography.",
  description:
    "Modeled on established HVAC brand sites like Carrier PH: a hotline bar, a huge light-weight headline over full-bleed photography, image tiles with round arrow buttons, separate home and business paths, and a sticky \"why choose us\" sequence. It reads like the market leader, which suits companies that want to look established.",
  tags: ["Light", "Corporate"],
  palette: {
    navy: "#152C73",
    cyan: "#0086C0",
    sky: "#E5F5FB",
    mist: "#F7FAFC",
    ink: "#2D3748",
    white: "#FFFFFF",
  },
  fonts: { heading: "Geist", body: "Geist", accent: "Barlow Semi Condensed" },
  bestFor: [
    "Established contractors and brand dealers",
    "Companies serving both homes and businesses",
    "Teams with a commercial or franchise arm",
    "Clients with strong lifestyle photography",
  ],
  features: [
    "Hotline utility bar and sticky header with click-to-call",
    "Full-bleed hero with a featured-service card",
    "Asymmetric service tiles with starting prices",
    "Home and business paths",
    "Sticky, scroll-driven \"why choose us\" section",
    "Packages, process, brands, coverage, reviews, FAQ",
    "Warranty registration block",
    "Booking form with validation and confirmation",
    "Newsletter footer and floating chat button",
  ],
  thumbnail: `${dir}/thumbnail.jpg`,
  thumbnailMobile: `${dir}/thumbnail-mobile.jpg`,
  images: {
    hero: slot(
      "hero",
      2400,
      1300,
      "Bright modern lobby with a tall floor-standing aircon and a receptionist",
      "Wide shot of a bright modern Filipino office lobby with timber slat wall, indoor plants and big windows, a tall white floor-standing air conditioner on the left, a receptionist behind a wooden desk, a woman working on a laptop on a lounge chair, upper third of the frame is soft pale sky-colored wall for a headline, premium HVAC brand campaign photography, 24:13",
    ),
    installation: slot("installation", 1600, 720, "Woman relaxing in a bedroom with a window-type aircon", `Woman hugging a pillow on a white bed, a window-type aircon set in the wall behind her, ${lifestyle}, 20:9`),
    cleaning: slot("cleaning", 900, 720, "Slim split-type aircon on a pale wall", `Close crop of a slim white split-type aircon indoor unit on a pale blue-white wall, soft airflow lines, ${lifestyle}, 5:4`),
    repair: slot("repair", 900, 720, "Technician checking an aircon indoor unit", `Technician in navy gloves inspecting the opened front of a white split-type aircon, ${lifestyle}, 5:4`),
    maintenance: slot("maintenance", 1600, 720, "Mother and child playing near a floor-mounted aircon", `Mother and daughter stretching and laughing on the floor of a minimalist living room with a tall white floor-mounted aircon, ${lifestyle}, 20:9`),
    freon: slot("freon", 1200, 720, "Pressure gauges connected to an outdoor unit", `Close-up of refrigerant pressure gauges connected to a clean white outdoor aircon unit, crisp product detail, cool tones, 5:3`),
    relocation: slot("relocation", 1200, 720, "Two technicians carrying an indoor unit", `Two technicians in navy uniforms carefully carrying a wrapped split-type indoor unit through a bright condo hallway, ${lifestyle}, 5:3`),
    businessSmall: slot("business-small", 2400, 720, "Busy café with ceiling-mounted aircon", "Wide shot of a busy modern Manila specialty café with baristas and customers, ceiling cassette aircon visible, bright left side washed toward white for text, editorial commercial photography, 10:3"),
    businessLarge: slot("business-large", 2400, 720, "Airport-style hall with large glass windows", "Wide shot of a large bright glass-walled terminal or mall atrium with travelers on lounge chairs, left side washed toward white for text, commercial HVAC photography, 10:3"),
    serviceHome: slot("service-home", 1200, 680, "Gloved hands cleaning an aircon's coils", "Close-up of gloved hands removing the front grille of a white split-type aircon to reveal blue coils, bright clean light, 30:17"),
    serviceExpert: slot("service-expert", 1200, 680, "Engineer reviewing a cooling plan at a desk", "Filipino-Chinese engineer in a navy shirt and glasses reviewing printed HVAC plans at a desk with a laptop in a glass-walled office, 30:17"),
    why1: slot("why-1", 800, 540, "Family on a sofa under a floor-standing aircon", `Young Filipino family of four relaxing on a white sofa next to a floor-standing aircon, ${lifestyle}, 40:27`),
    why2: slot("why-2", 800, 540, "Father and kids having a pillow fight", `Father with kids having a pillow fight on a bed under a wall-mounted split aircon, ${lifestyle}, 40:27`),
    why3: slot("why-3", 800, 540, "Two kids reading in bed in a cool room", `Two children reading in bed in a calm pale blue bedroom with a window-type aircon, ${lifestyle}, 40:27`),
    why4: slot("why-4", 800, 540, "Woman calling the service hotline", "Smiling Filipina woman calling on her phone in a bright apartment, deep navy blue gradient background on the right, 40:27"),
  },
  featured: true,
} satisfies TemplateMeta;

export default meta;
