import type { ACContent } from "../_shared/types";
import { acAreas, acBrands, acFaqs, acSteps } from "../_shared/defaults";

export type DispatchContent = ACContent & {
  /** Hero rotates through these (one per main service) */
  slides: { title: string; subtitle: string }[];
  valueProps: { title: string; body: string }[];
  rates: { unit: string; cleaning: number; chemical: number }[];
  plan: { title: string; audience: string; perks: string[]; blurb: string; cta: string };
  guarantee: string[];
  ratings: { score: string; count: string; source: string }[];
  footerBlurb: string;
};

/**
 * Sample business for the Dispatch template.
 * Swap these values for a real client. Nothing else needs to change.
 */
const content: DispatchContent = {
  business: {
    name: "Ayos Aircon Services",
    shortName: "Ayos",
    tagline: "On-demand aircon technicians in Cavite and Metro Manila",
    phone: { display: "0917 640 2297", e164: "+639176402297" },
    landline: "(02) 8536 1180",
    email: "book@ayosaircon.ph",
    address: { street: "2F Molino Commercial Center, Molino Blvd", city: "Bacoor", province: "Cavite" },
    hours: [
      { days: "Mon to Sun", time: "7:00 AM – 8:00 PM" },
      { days: "Holidays", time: "8:00 AM – 5:00 PM" },
    ],
    socials: { facebook: "https://facebook.com/", instagram: "https://instagram.com/", tiktok: "https://tiktok.com/" },
    messenger: "ayosaircon",
    since: 2017,
  },
  hero: {
    eyebrow: "",
    headline: "On-demand Aircon Technicians",
    subheadline: "Affordable, background-checked technicians at your door, same day.",
    primaryCta: "Book a Service",
    secondaryCta: "Get an Instant Quote",
    highlights: [],
  },
  slides: [
    { title: "On-demand Aircon Cleaning", subtitle: "Affordable, background-checked technicians at your door, same day." },
    { title: "On-demand Aircon Repair", subtitle: "Not cooling? Leaking? We diagnose first and quote before we fix." },
    { title: "On-demand Aircon Installation", subtitle: "Proper piping, vacuum and leak test, with a 1-year workmanship warranty." },
  ],
  stats: [],
  certifications: [],
  services: [
    { kind: "cleaning", name: "Cleaning", description: "General cleaning or full chemical wash.", startingAt: 700, unit: "per unit" },
    { kind: "repair", name: "Repair", description: "Diagnosis first, fixed price before work.", startingAt: 500, unit: "check-up fee" },
    { kind: "installation", name: "Installation", description: "Window, split, floor-mounted, cassette.", startingAt: 3800, unit: "per unit" },
    { kind: "maintenance", name: "Maintenance", description: "Quarterly visits on a yearly plan.", startingAt: 2600, unit: "per year" },
    { kind: "freon", name: "Freon Recharge", description: "R32, R410A and R22 with leak test.", startingAt: 1300, unit: "per unit" },
    { kind: "relocation", name: "Relocation", description: "Dismantle, move and reinstall.", startingAt: 3200, unit: "per unit" },
  ],
  valueProps: [
    {
      title: "Convenient",
      body: "Book from your phone in under a minute. Pick a time, add your unit details, and we handle the rest.",
    },
    {
      title: "Trusted",
      body: "You get the name and photo of your background-checked technician before they arrive.",
    },
    {
      title: "Guaranteed",
      body: "Pay after the job is done. If we can't fix it, you don't pay the service fee.",
    },
  ],
  brands: acBrands,
  rates: [
    { unit: "Window type (0.5 – 1.0 HP)", cleaning: 700, chemical: 1400 },
    { unit: "Window type (1.5 – 2.5 HP)", cleaning: 900, chemical: 1700 },
    { unit: "Split type (1.0 – 2.0 HP)", cleaning: 1200, chemical: 2300 },
    { unit: "Split type (2.5 – 3.0 HP)", cleaning: 1500, chemical: 2800 },
    { unit: "Floor mounted / cassette", cleaning: 2200, chemical: 3800 },
  ],
  pricing: {
    headline: "Aircon cleaning rates",
    note: "Prices per unit, inclusive of VAT. A ₱150 transportation fee applies outside our same-day areas.",
    packages: [
      {
        name: "Annual Maintenance Plan",
        price: 2600,
        unit: "per unit / year",
        description: "Up to 4 cleanings a year, booked for you.",
        features: [
          "Up to 4 cleaning services per year",
          "10% off your first cleaning and all repairs",
          "Easy online sign-up with paperless tracking",
          "Schedule tuned to how often you use your aircon",
        ],
        popular: true,
      },
    ],
  },
  plan: {
    title: "Annual Aircon Maintenance Plan",
    audience: "Ideal for homes and businesses",
    perks: [
      "Up to 4 cleaning services per year",
      "10% off your first cleaning and all repairs",
      "Easy online sign-up with paperless tracking",
      "Schedule tuned to how often you use your aircon",
    ],
    blurb: "Extend the life of your aircon and bring down your electric bill.",
    cta: "Get an instant quote",
  },
  guarantee: [
    "Affordable, background-checked and certified technicians",
    "Genuine parts, tidy work, and no mess left behind",
    "Upfront pricing before any work, no hidden fees",
    "₱100,000 property protection on every booking",
  ],
  steps: acSteps,
  serviceArea: {
    headline: "Where we dispatch",
    description: "Technicians start from Bacoor and Pasay every morning. Same-day slots fill up by noon.",
    areas: acAreas,
  },
  ratings: [
    { score: "4.8", count: "2,140", source: "Google reviews" },
    { score: "4.9", count: "610", source: "Facebook reviews" },
  ],
  testimonials: [
    {
      name: "Joseph P.",
      location: "Imus, Cavite",
      quote:
        "The technician was efficient and honest about what he found. He gave me options and explained the problem with my unit clearly. Salamat po!",
      rating: 5,
      service: "Repair",
    },
    {
      name: "Teresa V.",
      location: "Las Piñas",
      quote:
        "Polite, on time, and the price was exactly what the app said. I've booked Ayos four times now and it's been consistent every time.",
      rating: 5,
      service: "Cleaning",
    },
    {
      name: "Mark Anthony R.",
      location: "Parañaque",
      quote: "Booked at 9 AM, technician was here before lunch. Aircon is cold again and the room smells clean.",
      rating: 5,
      service: "Chemical wash",
    },
  ],
  faqs: acFaqs,
  finalCta: {
    headline: "Need an aircon tech today?",
    subheadline: "Same-day slots open every morning. Book now and get a confirmation within 15 minutes.",
  },
  footerBlurb:
    "Ayos is an on-demand home service team for aircon cleaning, repair and installation. Book online, track your technician, pay when the job is done.",
};

export default content;
