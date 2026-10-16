import type { ACContent } from "../_shared/types";
import { acAreas, acFaqs, acSteps } from "../_shared/defaults";

export type UnitType = "window" | "split" | "floor" | "cassette";

export type ShowroomContent = ACContent & {
  campaign: { kicker: string; title: string; body: string };
  banner: { title: string; body: string; cta: string };
  unitTypes: { type: UnitType; name: string }[];
  products: { name: string; type: UnitType; price: number; was?: number; note: string }[];
  disclaimers: string[];
};

/**
 * Sample business for the Showroom template.
 * Swap these values for a real client. Nothing else needs to change.
 */
const content: ShowroomContent = {
  business: {
    name: "Altura Aircon Center",
    shortName: "Altura",
    tagline: "Aircon sales, installation and service in Quezon City",
    phone: { display: "0998 214 6630", e164: "+639982146630" },
    landline: "(02) 8921 0475",
    email: "hello@alturaaircon.ph",
    address: { street: "118 Kalayaan Ave, Diliman", city: "Quezon City", province: "Metro Manila" },
    hours: [
      { days: "Mon to Sat", time: "9:00 AM – 7:00 PM" },
      { days: "Sunday", time: "10:00 AM – 5:00 PM" },
    ],
    socials: { facebook: "https://facebook.com/", instagram: "https://instagram.com/", tiktok: "https://tiktok.com/" },
    messenger: "alturaaircon",
    since: 2009,
  },
  hero: {
    eyebrow: "",
    headline: "Inverter Split-Type Series",
    subheadline: "Up to 60% lower power use. Installed by our own team, same week.",
    primaryCta: "Book a Service",
    secondaryCta: "Get a Free Quote",
    highlights: [],
  },
  campaign: {
    kicker: "Summer 2026",
    title: "Inverter Split-Type Series",
    body: "Up to 60% lower power use. Installed by our own team, same week.",
  },
  banner: {
    title: "Installed right, the first time",
    body: "Our own licensed installers, not subcontractors. Vacuum-tested, leak-checked, 1-year workmanship warranty.",
    cta: "View all services",
  },
  unitTypes: [
    { type: "window", name: "Window Type" },
    { type: "split", name: "Split Type" },
    { type: "floor", name: "Floor Mounted" },
    { type: "cassette", name: "Ceiling Cassette" },
  ],
  products: [
    { name: "1.0 HP Window Type Inverter", type: "window", price: 21499, was: 25495, note: "Installation included" },
    { name: "1.5 HP Split Type Inverter", type: "split", price: 38999, was: 44990, note: "+ ₱6,500 standard install" },
    { name: "2.0 HP Split Type Inverter", type: "split", price: 47499, was: 52990, note: "+ ₱6,500 standard install" },
    { name: "3.0 TR Floor Mounted", type: "floor", price: 89990, note: "Free site survey" },
    { name: "2.5 TR Ceiling Cassette", type: "cassette", price: 96500, was: 104000, note: "Free site survey" },
    { name: "0.75 HP Window Type Manual", type: "window", price: 14299, note: "Installation included" },
  ],
  stats: [],
  certifications: [],
  services: [
    { kind: "installation", name: "Installation", description: "All unit types, with piping, vacuum and leak test.", startingAt: 4500, unit: "per unit" },
    { kind: "cleaning", name: "Cleaning", description: "General cleaning or full chemical wash.", startingAt: 800, unit: "per unit" },
    { kind: "repair", name: "Repair", description: "Diagnosis and a fixed quote before work starts.", startingAt: 600, unit: "check-up" },
    { kind: "maintenance", name: "Maintenance", description: "Quarterly preventive maintenance contracts.", startingAt: 2800, unit: "per year" },
    { kind: "freon", name: "Freon Recharge", description: "R32, R410A and R22 with pressure test.", startingAt: 1500, unit: "per unit" },
    { kind: "relocation", name: "Relocation", description: "Dismantle, move and reinstall your units.", startingAt: 3500, unit: "per unit" },
  ],
  brands: ["Samsung", "LG", "Daikin", "Carrier", "Panasonic", "Kolin", "Condura", "Midea", "Aux", "Hitachi"],
  pricing: {
    headline: "Service packages",
    note: "Per unit, VAT inclusive. Copper piping beyond 10 ft is ₱450/ft.",
    packages: [
      {
        name: "Cleaning",
        price: 800,
        unit: "window type",
        description: "Split type from ₱1,300.",
        features: ["Filter and panel wash", "Coil and blower cleaning", "Drain check", "30-day warranty"],
      },
      {
        name: "Chemical Wash",
        price: 2200,
        unit: "split type",
        description: "For weak, smelly or dripping units.",
        features: ["Full disassembly", "Coil and blower chemical wash", "Outdoor unit cleaning", "60-day warranty"],
        popular: true,
      },
      {
        name: "Installation",
        price: 6500,
        unit: "split type",
        description: "1.0 – 2.0 HP, 10 ft piping.",
        features: ["Bracket and mounting", "10 ft piping and insulation", "Vacuum and leak test", "1-year warranty"],
      },
    ],
  },
  steps: acSteps,
  serviceArea: {
    headline: "Service area",
    description: "Installers and technicians go out from our Diliman showroom every day.",
    areas: [
      { name: "Quezon City", note: "Same-day" },
      { name: "San Juan", note: "Same-day" },
      { name: "Mandaluyong", note: "Same-day" },
      { name: "Marikina", note: "Same-day" },
      { name: "Manila", note: "Next-day" },
      { name: "Pasig", note: "Next-day" },
      { name: "Makati", note: "Next-day" },
      { name: "Caloocan", note: "Next-day" },
      ...acAreas.slice(0, 4).map((a) => ({ ...a, note: "By schedule" })),
    ],
  },
  testimonials: [
    {
      name: "Patricia G.",
      location: "Teachers Village, QC",
      quote: "Bought two split types on a Tuesday, installed by Thursday. The installers were neat and explained the remote and the cleaning schedule.",
      rating: 5,
      service: "Purchase + installation",
    },
    {
      name: "Rommel A.",
      location: "Marikina",
      quote: "Fair price for the chemical wash and they didn't try to upsell me a new unit. Cold na ulit.",
      rating: 5,
      service: "Chemical wash",
    },
    {
      name: "Lianne C.",
      location: "San Juan",
      quote: "We use them for the PMS of our café's three units. Always on schedule, always with a service report.",
      rating: 5,
      service: "Maintenance",
    },
  ],
  faqs: [
    {
      question: "Is installation included when I buy a unit?",
      answer: "Window types include standard installation. Split types have a flat ₱6,500 standard installation (10 ft piping). We quote anything extra before the visit.",
    },
    ...acFaqs,
  ],
  finalCta: {
    headline: "Not sure which unit fits your room?",
    subheadline: "Send us the room size and we'll recommend the right horsepower, free.",
  },
  disclaimers: [
    "*Energy savings compared with a non-inverter unit of the same capacity under typical use. Actual savings vary.",
    "*Sale prices valid while stocks last. Images are for illustration only.",
    "*Installation schedule depends on your area and site conditions.",
  ],
};

export default content;
