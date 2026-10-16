import type { ACContent } from "./types";

/**
 * Sensible Philippine defaults shared by the AC sample content. Each
 * template's content.ts spreads these and overrides what it needs, so a
 * client site only has to change one file.
 */

export const acBrands: ACContent["brands"] = [
  "Daikin",
  "Carrier",
  "Panasonic",
  "LG",
  "Samsung",
  "Condura",
  "Koppel",
  "Kolin",
  "Aux",
  "Midea",
  "Hitachi",
  "Fujidenzo",
];

export const acAreas: ACContent["serviceArea"]["areas"] = [
  { name: "Bacoor", note: "Same-day" },
  { name: "Imus", note: "Same-day" },
  { name: "Dasmariñas", note: "Same-day" },
  { name: "General Trias", note: "Next-day" },
  { name: "Kawit", note: "Same-day" },
  { name: "Las Piñas", note: "Same-day" },
  { name: "Parañaque", note: "Same-day" },
  { name: "Muntinlupa", note: "Next-day" },
  { name: "Makati", note: "Next-day" },
  { name: "Taguig", note: "Next-day" },
  { name: "Pasay", note: "Next-day" },
  { name: "Silang", note: "By schedule" },
];

export const acFaqs: ACContent["faqs"] = [
  {
    question: "Gaano kadalas dapat linisin ang aircon?",
    answer:
      "For homes, every 3 to 6 months. If the unit runs 8+ hours a day, or you have pets or live near a busy road, go with every 3 months. Regular cleaning keeps it cold, cuts your Meralco bill, and prevents bigger repairs.",
  },
  {
    question: "Do you service inverter units?",
    answer:
      "Yes. Our technicians are trained on inverter and non-inverter window, split-type, floor-mounted and cassette units from all major brands.",
  },
  {
    question: "How long does a cleaning take?",
    answer:
      "Around 45 minutes to 1 hour per window-type unit, and 1 to 1.5 hours per split-type unit for a full chemical wash. We protect your walls and floors and clean up after.",
  },
  {
    question: "May warranty po ba?",
    answer:
      "Yes. Cleaning and repairs come with a service warranty (30 to 90 days depending on the job), and installations include a workmanship warranty on top of the manufacturer's warranty.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Cash, GCash, Maya and bank transfer. We send an official receipt after every job. Corporate clients can request billing terms.",
  },
  {
    question: "Is there an ocular or transportation fee?",
    answer:
      "Inspection is free within our service area when you push through with the job. A small transportation fee may apply for areas outside our regular coverage. We'll always tell you before we go.",
  },
];

export const acSteps: ACContent["steps"] = [
  { title: "Book", description: "Call, message us, or fill out the form. We confirm your slot within the hour." },
  { title: "Inspect", description: "Our technician checks the unit and gives you a clear price before any work starts." },
  { title: "Service", description: "We clean, fix or install, then test everything with you before we leave." },
  { title: "Warranty", description: "Every job is covered. If something's off, we come back at no extra cost." },
];
