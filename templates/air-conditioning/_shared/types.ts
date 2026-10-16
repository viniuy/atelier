/**
 * The content contract every Air Conditioning template renders from.
 * To build a real client's site, copy a template's `content.ts` and replace
 * the values. No component code needs to change.
 */

export type ServiceKind =
  | "installation"
  | "cleaning"
  | "repair"
  | "maintenance"
  | "freon"
  | "relocation";

export type ACService = {
  kind: ServiceKind;
  name: string;
  description: string;
  /** Lowest price, in pesos */
  startingAt: number;
  /** e.g. "per unit", "per visit" */
  unit: string;
};

export type ACPackage = {
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export type ACTestimonial = {
  name: string;
  location: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  service: string;
};

export type ACContent = {
  business: {
    name: string;
    shortName: string;
    tagline: string;
    /** display: how it's printed; e164: used for tel:, Viber and WhatsApp links */
    phone: { display: string; e164: string };
    landline?: string;
    email: string;
    address: { street: string; city: string; province: string };
    hours: { days: string; time: string }[];
    socials: { facebook?: string; instagram?: string; tiktok?: string };
    /** Messenger username (m.me/<x>); Viber and WhatsApp use phone.e164 */
    messenger: string;
    since: number;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: string[];
  };
  stats: { value: string; label: string }[];
  certifications: string[];
  services: ACService[];
  brands: string[];
  pricing: { headline: string; note: string; packages: ACPackage[] };
  steps: { title: string; description: string }[];
  serviceArea: {
    headline: string;
    description: string;
    areas: { name: string; note?: string }[];
  };
  testimonials: ACTestimonial[];
  faqs: { question: string; answer: string }[];
  finalCta: { headline: string; subheadline: string };
};
