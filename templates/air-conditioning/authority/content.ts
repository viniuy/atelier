import type { ACContent, ServiceKind } from "../_shared/types";
import { acAreas, acBrands, acFaqs, acSteps } from "../_shared/defaults";

export type AuthorityContent = ACContent & {
  /** Headline split so the last words can take the accent color */
  homes: { label: string; title: string; accent: string };
  businesses: {
    label: string;
    title: string;
    accent: string;
    items: { image: "businessSmall" | "businessLarge"; title: string; body: string }[];
  };
  support: {
    label: string;
    title: string;
    sub: string;
    cards: { image: "serviceHome" | "serviceExpert"; title: string; body: string; cta: string; href: string }[];
  };
  heroCard: { label: string; title: string; body: string };
  reasons: { image: "why1" | "why2" | "why3" | "why4"; title: string; caption: string; body: string }[];
  warranty: { label: string; title: string; body: string; cta: string };
  newsletter: { title: string; body: string };
  /** Which image slot each service tile uses */
  serviceImages: Record<ServiceKind, string>;
};

/**
 * Sample business for the Authority template.
 * Swap these values for a real client. Nothing else needs to change.
 */
const content: AuthorityContent = {
  business: {
    name: "Arkon Air Solutions",
    shortName: "Arkon",
    tagline: "Air-conditioning for homes and businesses since 1998",
    phone: { display: "0917 702 4400", e164: "+639177024400" },
    landline: "(02) 8710 4400",
    email: "care@arkonair.ph",
    address: { street: "Km 21 West Service Road, Cupang", city: "Muntinlupa", province: "Metro Manila" },
    hours: [
      { days: "Mon to Fri", time: "8:00 AM – 6:00 PM" },
      { days: "Saturday", time: "8:00 AM – 12:00 NN" },
    ],
    socials: { facebook: "https://facebook.com/", instagram: "https://instagram.com/", tiktok: "https://tiktok.com/" },
    messenger: "arkonair",
    since: 1998,
  },
  hero: {
    eyebrow: "",
    headline: "Cooling, done properly",
    subheadline: "Installation, cleaning and repair for homes and businesses across southern Metro Manila and Cavite.",
    primaryCta: "Book a Home Service",
    secondaryCta: "Speak to an Expert",
    highlights: [],
  },
  heroCard: {
    label: "For homes",
    title: "Inverter split installation",
    body: "Vacuum-tested, leak-checked, with a 1-year workmanship warranty.",
  },
  stats: [],
  certifications: [],
  homes: { label: "Arkon for homes", title: "Service for", accent: "every home" },
  services: [
    { kind: "installation", name: "Installation", description: "Window, split, floor-mounted and cassette units, installed to spec.", startingAt: 4500, unit: "per unit" },
    { kind: "cleaning", name: "Cleaning", description: "General cleaning and chemical wash.", startingAt: 900, unit: "per unit" },
    { kind: "repair", name: "Repair", description: "Diagnosis first, fixed quote after.", startingAt: 700, unit: "check-up" },
    { kind: "maintenance", name: "Maintenance", description: "Scheduled preventive maintenance for every unit in your home.", startingAt: 3000, unit: "per unit / year" },
    { kind: "freon", name: "Freon Recharge", description: "R32, R410A and R22 with pressure and leak test.", startingAt: 1600, unit: "per unit" },
    { kind: "relocation", name: "Relocation", description: "Careful dismantling, transport and reinstallation.", startingAt: 3800, unit: "per unit" },
  ],
  serviceImages: {
    installation: "installation",
    cleaning: "cleaning",
    repair: "repair",
    maintenance: "maintenance",
    freon: "freon",
    relocation: "relocation",
  },
  businesses: {
    label: "Arkon for businesses",
    title: "Air solutions for",
    accent: "every business",
    items: [
      {
        image: "businessSmall",
        title: "Small-scale solutions",
        body: "For cafés, clinics, boutiques and offices with up to 20 units.",
      },
      {
        image: "businessLarge",
        title: "Large-scale solutions",
        body: "VRF and ducted systems for office floors, hotels, malls and warehouses.",
      },
    ],
  },
  support: {
    label: "Customer service",
    title: "Expert service for every need",
    sub: "Reliable, efficient service for homes and businesses",
    cards: [
      {
        image: "serviceHome",
        title: "Book a home service",
        body: "Installation, maintenance and repair that keeps your home cool and your bill in check all year.",
        cta: "Book an appointment",
        href: "#book",
      },
      {
        image: "serviceExpert",
        title: "Speak to a commercial expert",
        body: "Site surveys, load calculations and maintenance contracts for your business.",
        cta: "Book a consultation",
        href: "#book",
      },
    ],
  },
  reasons: [
    { image: "why1", title: "We know air", caption: "28 years of cooling Filipino homes", body: "Since 1998, from single window units to entire office floors." },
    { image: "why2", title: "We build it to last", caption: "Installed for the climate", body: "Proper piping, insulation and drainage that stand up to heat, humidity and typhoon season." },
    { image: "why3", title: "We keep bills low", caption: "Efficiency on every job", body: "We size units properly and keep them clean, so they use less power." },
    { image: "why4", title: "We pick up the phone", caption: "A real team behind every booking", body: "One hotline, real people, and a technician at your door within the week." },
  ],
  brands: acBrands,
  pricing: {
    headline: "Service packages",
    note: "Rates per unit, VAT inclusive. Free inspection within our service area when you push through.",
    packages: [
      {
        name: "Home Clean",
        price: 900,
        unit: "per window-type unit",
        description: "Regular cleaning every 3 to 6 months.",
        features: ["Filter and panel wash", "Coil and fin cleaning", "Drain check", "30-day warranty"],
      },
      {
        name: "Deep Clean",
        price: 2400,
        unit: "per split-type unit",
        description: "Chemical wash for weak or smelly units.",
        features: ["Full indoor disassembly", "Chemical wash, coil and blower", "Outdoor unit cleaning", "Pressure check", "60-day warranty"],
        popular: true,
      },
      {
        name: "Care Plan",
        price: 3000,
        unit: "per unit / year",
        description: "Four scheduled visits a year.",
        features: ["Quarterly cleaning", "Priority repair slots", "10% off parts", "Service report every visit"],
      },
    ],
  },
  steps: acSteps,
  serviceArea: {
    headline: "Where we work",
    description: "Teams dispatched daily from Muntinlupa to southern Metro Manila and Cavite.",
    areas: acAreas,
  },
  testimonials: [
    {
      name: "Engr. Paolo Santiago",
      location: "Facilities, Alabang office tower",
      quote: "Arkon handles 120 units for us. Reports come on time and they flag problems before they turn into downtime.",
      rating: 5,
      service: "Commercial maintenance",
    },
    {
      name: "Grace Uy",
      location: "Ayala Alabang",
      quote: "Professional from the first call. The installers protected our floors and walls and explained everything.",
      rating: 5,
      service: "Installation",
    },
    {
      name: "Dennis Ramos",
      location: "Bacoor, Cavite",
      quote: "Fair, clear pricing and the unit has been running quietly since.",
      rating: 5,
      service: "Repair",
    },
  ],
  faqs: acFaqs,
  warranty: {
    label: "Arkon Assurance",
    title: "Guaranteed coverage for your investment",
    body: "Register your installation and get a 1-year workmanship warranty, on top of the manufacturer's warranty.",
    cta: "Register your unit",
  },
  finalCta: {
    headline: "Book a home service",
    subheadline: "We confirm your schedule within one business day.",
  },
  newsletter: { title: "Join our community", body: "Maintenance reminders and seasonal offers, once a month." },
};

export default content;
