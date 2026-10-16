import type { ACContent } from "../_shared/types";
import { acBrands, acFaqs, acSteps } from "../_shared/defaults";

export type ContractorContent = ACContent & {
  /** Every line the shop answers, shown in the info bar and footer */
  lines: { label: string; display: string; tel: string }[];
  trust: { value: string; label: string; body: string }[];
  about: { title: string; paragraphs: string[] };
  posts: { title: string; excerpt: string; author: string }[];
};

/**
 * Sample business for the Contractor template.
 * Swap these values for a real client. Nothing else needs to change.
 */
const content: ContractorContent = {
  business: {
    name: "JMC Airconditioning Services",
    shortName: "JMC",
    tagline: "Heating, ventilating & air-conditioning contractor",
    phone: { display: "0927 418 5502", e164: "+639274185502" },
    landline: "(02) 8912 3346",
    email: "info@jmcaircon.ph",
    address: { street: "47 Rd 3, Project 4", city: "Quezon City", province: "Metro Manila 1109" },
    hours: [{ days: "Monday – Saturday", time: "8:00 AM – 5:00 PM" }],
    socials: { facebook: "https://facebook.com/", instagram: "https://instagram.com/" },
    messenger: "jmcaircon",
    since: 2004,
  },
  lines: [
    { label: "Globe", display: "0927 418 5502", tel: "tel:+639274185502" },
    { label: "Smart", display: "0961 223 7409", tel: "tel:+639612237409" },
    { label: "Landline", display: "(02) 8912 3346", tel: "tel:+63289123346" },
  ],
  hero: {
    eyebrow: "",
    headline: "JMC Airconditioning",
    subheadline: "Heating, ventilating & air-conditioning contractor",
    primaryCta: "Inquire Now",
    secondaryCta: "Call Now",
    highlights: [],
  },
  trust: [
    { value: "100%", label: "", body: "Guaranteed satisfaction" },
    { value: "30", label: "Minutes response", body: "Quick replies by text and email" },
    { value: "1", label: "Year guarantee", body: "On all installations completed by us" },
  ],
  stats: [],
  certifications: [],
  services: [
    { kind: "installation", name: "Installation", description: "Supply and installation of window, split, floor-mounted and ceiling cassette units.", startingAt: 4000, unit: "per unit" },
    { kind: "cleaning", name: "Cleaning", description: "General cleaning and full pull-out chemical wash.", startingAt: 700, unit: "per unit" },
    { kind: "repair", name: "Repair", description: "Troubleshooting of electrical, compressor, leak and drainage problems.", startingAt: 500, unit: "check-up" },
    { kind: "maintenance", name: "Preventive Maintenance", description: "Monthly or quarterly PMS for offices, clinics, schools and restaurants.", startingAt: 2500, unit: "per unit / year" },
    { kind: "freon", name: "Freon Charging", description: "Leak testing and refrigerant charging for all unit types.", startingAt: 1200, unit: "per unit" },
    { kind: "relocation", name: "Dismantling & Relocation", description: "Pull-out, transfer and re-installation, including new piping.", startingAt: 3000, unit: "per unit" },
  ],
  brands: [...acBrands.slice(0, 10), "Gree", "Haier"],
  pricing: {
    headline: "Service Rates",
    note: "Rates per unit, Metro Manila. Materials beyond standard (piping, brackets, wiring) are quoted after inspection.",
    packages: [
      {
        name: "Window Type",
        price: 700,
        unit: "cleaning per unit",
        description: "0.5 HP to 2.5 HP",
        features: ["General cleaning ₱700", "Chemical cleaning ₱1,300", "Freon charging from ₱1,200", "Installation from ₱4,000"],
      },
      {
        name: "Split Type",
        price: 1200,
        unit: "cleaning per unit",
        description: "1.0 HP to 3.0 HP",
        features: ["General cleaning ₱1,200", "Pull-out chemical wash ₱2,500", "Freon charging from ₱1,800", "Installation from ₱6,000"],
        popular: true,
      },
      {
        name: "Commercial",
        price: 2500,
        unit: "PMS per unit / year",
        description: "Floor-mounted, cassette, ducted",
        features: ["Quarterly preventive maintenance", "Service report per visit", "Priority emergency calls", "Billing terms for companies"],
      },
    ],
  },
  steps: acSteps,
  serviceArea: {
    headline: "Service Area",
    description: "We cater to customers anywhere in Metro Manila, and Rizal and Bulacan by schedule.",
    areas: [
      { name: "Quezon City" },
      { name: "Marikina" },
      { name: "San Juan" },
      { name: "Mandaluyong" },
      { name: "Pasig" },
      { name: "Manila" },
      { name: "Caloocan" },
      { name: "Makati" },
      { name: "Taguig" },
      { name: "Antipolo", note: "By schedule" },
      { name: "Cainta", note: "By schedule" },
      { name: "Meycauayan", note: "By schedule" },
    ],
  },
  testimonials: [
    {
      name: "Arch. Liza Marquez",
      location: "Project 4, QC",
      quote: "We've used JMC for our office units for six years now. Hindi kayo bibiguin. Honest pricing and they always show up.",
      rating: 5,
      service: "Preventive maintenance",
    },
    {
      name: "Rodel Bautista",
      location: "Marikina",
      quote: "Called in the morning, they were here after lunch. The technician found a loose wire that two other shops missed.",
      rating: 5,
      service: "Repair",
    },
    {
      name: "Mrs. Cora Villanueva",
      location: "Cubao, QC",
      quote: "Installed three split types in our house. Neat work, they cleaned up everything before leaving.",
      rating: 5,
      service: "Installation",
    },
  ],
  faqs: acFaqs,
  about: {
    title: "About Us",
    paragraphs: [
      "JMC Airconditioning Services is primarily engaged in the supply, installation, repair and maintenance of air-conditioning and ventilation systems.",
      "Our workers are highly competent and well trained, with experience from both local and international companies. We are committed to honesty, integrity, sincerity and excellence.",
    ],
  },
  posts: [
    {
      title: "Ways to save on electricity without giving up your aircon",
      excerpt: "Got your Meralco bill and almost had a heart attack? Here are simple habits that bring it down without sweating it out at home…",
      author: "JMC",
    },
  ],
  finalCta: {
    headline: "Need an aircon contractor today?",
    subheadline: "Call or text any of our lines. We reply within 30 minutes during office hours.",
  },
};

export default content;
