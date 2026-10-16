import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/templates/_kit/BrandIcons";
import type { contactLinks } from "../../_shared/links";
import type { DispatchContent } from "../content";
import { Logo } from "./Header";

type Links = ReturnType<typeof contactLinks>;

export function FinalCta({ c, links }: { c: DispatchContent; links: Links }) {
  return (
    <section className="bg-(--c-ice) py-16" aria-labelledby="dp-final">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center">
        <div>
          <h2 id="dp-final" className="text-[2rem] leading-tight font-semibold text-black">
            {c.finalCta.headline}
          </h2>
          <p className="mt-2 max-w-xl text-(--c-ink)/85">{c.finalCta.subheadline}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#book"
            className="rounded-[5px] bg-(--c-blue) px-7 py-4 text-[1.1rem] font-semibold text-white transition-colors hover:bg-(--c-ink)"
          >
            Book a Service
          </a>
          <a
            href={links.tel}
            className="inline-flex items-center gap-2 rounded-[5px] border border-(--c-blue) bg-white px-7 py-4 text-[1.1rem] font-semibold text-(--c-blue) transition-colors hover:bg-(--c-blue) hover:text-white"
          >
            <Phone className="size-5" aria-hidden="true" /> Call us
          </a>
        </div>
      </div>
    </section>
  );
}

const columns = [
  { title: "Services", links: ["Aircon cleaning", "Aircon repair", "Installation", "Freon recharge"], href: "#services" },
  { title: "Company", links: ["About us", "Join as a technician", "Pricing", "Blog"], href: "#pricing" },
  { title: "Get help", links: ["Support", "Track a booking", "Warranty claims"], href: "#faq" },
];

export function Footer({ c, links }: { c: DispatchContent; links: Links }) {
  const b = c.business;
  const socials = [
    { href: b.socials.tiktok, Icon: TikTokIcon, label: "TikTok" },
    { href: b.socials.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: b.socials.facebook, Icon: FacebookIcon, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-(--c-blue) pt-14 pb-8 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo name={b.shortName} light />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/90">{c.footerBlurb}</p>
          <ul className="mt-6 space-y-2 text-[15px] text-white/90">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={links.tel} className="hover:underline">{b.phone.display}</a>
              {b.landline && <span>· {b.landline}</span>}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={links.email} className="hover:underline">{b.email}</a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {b.address.street}, {b.address.city}, {b.address.province}
            </li>
            {b.hours.map((h) => (
              <li key={h.days} className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-semibold">{col.title}</h2>
            <ul className="mt-4 space-y-3 text-[15px] text-white/90">
              {col.links.map((l) => (
                <li key={l}>
                  <a href={col.href} className="hover:underline">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-white/90">
        <p>
          © {b.name} · Since {b.since} · <a href="#faq" className="hover:underline">Privacy</a> |{" "}
          <a href="#faq" className="hover:underline">Terms</a>
        </p>
        <ul className="flex gap-2">
          {socials.map(({ href, Icon, label }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-9 place-items-center rounded-full bg-white text-(--c-blue) transition-transform hover:scale-105"
              >
                <Icon className="size-5" />
                <span className="sr-only">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
