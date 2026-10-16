import { ArrowUpRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/templates/_kit/BrandIcons";
import type { contactLinks } from "../../_shared/links";
import type { ShowroomContent } from "../content";
import { D, pill, textLink } from "./Top";

type Links = ReturnType<typeof contactLinks>;

export function FinalCta({ c, links }: { c: ShowroomContent; links: Links }) {
  return (
    <section className="bg-(--c-tile) px-6 py-24 text-center" aria-labelledby="sr-final">
      <h2 id="sr-final" className={`${D} mx-auto max-w-3xl text-[2.2rem] leading-[1.1] font-bold tracking-[-0.02em] md:text-[3rem]`}>
        {c.finalCta.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-[1.05rem] text-(--c-ink)">{c.finalCta.subheadline}</p>
      <div className="mt-8 flex items-center justify-center gap-6">
        <a href={links.messenger} target="_blank" rel="noopener noreferrer" className={textLink}>
          Message us
        </a>
        <a href="#book" className={pill}>
          {c.hero.secondaryCta}
        </a>
      </div>
    </section>
  );
}

export function Footer({ c, links }: { c: ShowroomContent; links: Links }) {
  const b = c.business;
  const columns = [
    { title: "Shop", items: c.unitTypes.map((u) => ({ label: u.name, href: "#units" })) },
    { title: "Services", items: c.services.map((s) => ({ label: s.name, href: "#services" })) },
    {
      title: "Support",
      items: [
        { label: "FAQs", href: "#support" },
        { label: "Book a service", href: "#book" },
        { label: "Warranty", href: "#support" },
        { label: "Call us", href: links.tel },
      ],
    },
    {
      title: "Visit",
      items: [
        { label: b.address.street, href: "#book" },
        { label: `${b.address.city}, ${b.address.province}`, href: "#book" },
        ...b.hours.map((h) => ({ label: `${h.days}: ${h.time}`, href: "#book" })),
      ],
    },
    {
      title: "Contact",
      items: [
        { label: b.phone.display, href: links.tel },
        ...(b.landline ? [{ label: b.landline, href: links.tel }] : []),
        { label: b.email, href: links.email },
        { label: "Messenger", href: links.messenger },
      ],
    },
  ];
  const socials = [
    { href: b.socials.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: b.socials.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: b.socials.tiktok, Icon: TikTokIcon, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <footer>
      <div className="bg-(--c-tile) px-6 pb-10">
        <div className="mx-auto max-w-[1440px] space-y-3 border-t border-(--c-line) pt-10 text-[0.8rem] text-(--c-gray)">
          {c.disclaimers.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-[1440px] sm:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => (
          <div key={col.title} className="border-b border-(--c-line) px-6 py-8 lg:border-r lg:border-b-0 lg:last:border-r-0">
            <h2 className="text-[1.05rem] font-bold">{col.title}</h2>
            <ul className="mt-5 space-y-3 text-[0.95rem] text-(--c-ink)">
              {col.items.map((i) => (
                <li key={i.label}>
                  <a href={i.href} className="hover:underline">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-(--c-line)">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-6 text-[0.85rem]">
          <p>
            <span className="font-bold">Philippines/English</span>
            <span className="mx-4 text-(--c-line)" aria-hidden="true">|</span>© {b.name} since {b.since}
          </p>
          <div className="flex items-center gap-4">
            <span>Stay in the loop?</span>
            {socials.map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                <Icon className="size-6" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
            <a href={links.messenger} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold hover:underline">
              Chat <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
