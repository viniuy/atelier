import type { ACContent } from "./types";

/** Contact URLs derived from the business content. */
export function contactLinks(business: ACContent["business"]) {
  const digits = business.phone.e164.replace(/\D/g, "");
  const greeting = encodeURIComponent(`Hi ${business.shortName}! I'd like to ask about aircon service.`);
  return {
    tel: `tel:${business.phone.e164}`,
    email: `mailto:${business.email}`,
    messenger: `https://m.me/${business.messenger}`,
    viber: `viber://chat?number=%2B${digits}`,
    whatsapp: `https://wa.me/${digits}?text=${greeting}`,
  };
}
