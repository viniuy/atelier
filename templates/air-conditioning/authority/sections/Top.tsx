import { Building2, Home, Menu, Phone, X } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { formatPeso } from "@/lib/utils";
import { SlotImage } from "@/templates/_kit/SlotImage";
import type { AuthorityContent } from "../content";
import { AirLines, Arrow, L, RoundArrow, Title, pillNavy } from "../ui";

const nav = [
  { href: "#homes", label: "For Homes" },
  { href: "#business", label: "For Businesses" },
  { href: "#pricing", label: "Services" },
  { href: "#why", label: "About" },
  { href: "#faq", label: "Support" },
];

export function Wordmark({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <span className={`flex items-center gap-2 ${light ? "text-white" : "text-(--c-navy)"}`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6 18c4-6 8-6 10-2s6 4 10-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-[1.6rem] font-medium tracking-[-0.03em]">{name}</span>
    </span>
  );
}

export function Header({ c, tel }: { c: AuthorityContent; tel: string }) {
  return (
    <>
      <div className="bg-(--c-navy) text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-2.5 text-[0.85rem] font-medium sm:px-10">
          <p>
            <span className="hidden sm:inline">For questions and inquiries, call: </span>
            <a href={tel} className="hover:underline">
              {c.business.landline ?? c.business.phone.display}
            </a>
          </p>
          <ul className="flex items-center gap-4">
            <li>
              <a href="#book" className="flex items-center gap-1.5 hover:underline">
                <Home className="size-4" aria-hidden="true" /> <span className="hidden sm:inline">Book a Home Service</span>
                <span className="sm:hidden">Book</span>
              </a>
            </li>
            <li className="hidden h-4 w-px bg-white/40 sm:block" aria-hidden="true" />
            <li className="hidden sm:block">
              <a href="#business" className="flex items-center gap-1.5 hover:underline">
                <Building2 className="size-4" aria-hidden="true" /> Speak to an Expert
              </a>
            </li>
          </ul>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_rgb(0_0_0/0.06)]">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-10 px-5 sm:px-10">
          <a href="#top" aria-label={`${c.business.name} home`}>
            <Wordmark name={c.business.shortName} />
          </a>
          <nav aria-label="Main" className="mx-auto hidden xl:block">
            <ul className={`${L} flex gap-8 text-[1.1rem] text-(--c-ink)`}>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-(--c-cyan)">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4 xl:ml-0">
            <span className={`${L} hidden text-[1.1rem] text-(--c-ink) md:inline`}>{c.business.phone.display}</span>
            <a
              href={tel}
              className="grid size-14 place-items-center rounded-full bg-(--c-navy) text-white transition-colors hover:bg-(--c-cyan)"
              aria-label={`Call ${c.business.phone.display}`}
            >
              <Phone className="size-5" aria-hidden="true" />
            </a>
            <details className="group relative xl:hidden">
              <summary className="grid size-12 cursor-pointer place-items-center text-(--c-navy)" aria-label="Menu">
                <Menu className="size-6 group-open:hidden" aria-hidden="true" />
                <X className="hidden size-6 group-open:block" aria-hidden="true" />
              </summary>
              <nav aria-label="Mobile" className="absolute top-full right-0 mt-3 w-64 rounded-md bg-white p-3 shadow-xl">
                <ul className={`${L} text-[1.15rem] text-(--c-navy)`}>
                  {nav.map((n) => (
                    <li key={n.href}>
                      <a href={n.href} className="block rounded px-3 py-2.5 hover:bg-(--c-sky)">
                        {n.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

export function Hero({ c, image }: { c: AuthorityContent; image: ImageSlot }) {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <SlotImage
        image={image}
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-[75%] bg-linear-to-b from-white via-white/85 to-transparent" />
      <AirLines className="absolute inset-x-0 top-0 -z-10 h-36 w-full text-(--c-cyan) opacity-70" />
      <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-56 text-center sm:px-10 md:pt-24 md:pb-80">
        <h1 className="mx-auto max-w-5xl text-[clamp(3rem,9vw,7rem)] leading-[0.98] font-light tracking-[-0.03em] text-(--c-navy)">
          {c.hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-[clamp(1.15rem,2.2vw,1.9rem)] leading-snug text-(--c-ink)">
          {c.hero.subheadline}
        </p>
        <a href="#book" className={`${pillNavy} mt-8`}>
          {c.hero.primaryCta} <Arrow />
        </a>
      </div>
      <a
        href="#homes"
        className="group absolute right-5 bottom-6 left-5 flex items-center gap-5 bg-white p-5 shadow-lg sm:left-auto sm:w-[26rem] md:right-10 md:bottom-10"
      >
        <span className="flex-1">
          <span className={`${L} block text-[0.95rem] text-(--c-ink) uppercase`}>{c.heroCard.label}</span>
          <span className="mt-1 block text-[1.3rem] text-(--c-navy)">{c.heroCard.title}</span>
          <span className="mt-1 block text-[0.9rem] text-(--c-ink)">{c.heroCard.body}</span>
          <span className="mt-2 inline-flex items-center gap-2 text-[0.95rem] font-medium text-(--c-navy)">
            View service <Arrow className="size-4" />
          </span>
        </span>
      </a>
    </section>
  );
}

/** Row layouts for the six service tiles: wide/narrow, narrow/wide, half/half. */
const span = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6"];

export function Homes({ c, images }: { c: AuthorityContent; images: Record<string, ImageSlot> }) {
  return (
    <section id="homes" className="scroll-mt-24 py-24" aria-labelledby="au-homes">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Title id="au-homes" label={c.homes.label} title={c.homes.title} accent={c.homes.accent} />
          <a href="#pricing" className={pillNavy}>
            View all <Arrow />
          </a>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-12">
          {c.services.map((s, i) => (
            <li key={s.kind} className={span[i]}>
              <a href="#book" className="group relative flex h-[22rem] items-end overflow-hidden bg-(--c-sky) md:h-[24rem]">
                <SlotImage
                  image={images[c.serviceImages[s.kind]]}
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-white/95 via-white/70 to-transparent" />
                <span className="relative flex w-full items-end justify-between gap-4 p-5">
                  <span>
                    <span className="block text-[2rem] leading-tight font-light text-(--c-navy)">{s.name}</span>
                    <span className="mt-1 block text-[1rem] text-(--c-ink)">
                      {s.description} From {formatPeso(s.startingAt)}.
                    </span>
                  </span>
                  <RoundArrow />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Business({ c, images }: { c: AuthorityContent; images: Record<string, ImageSlot> }) {
  return (
    <section id="business" className="scroll-mt-24 pb-24" aria-labelledby="au-biz">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Title id="au-biz" label={c.businesses.label} title={c.businesses.title} accent={c.businesses.accent} />
          <a href="#book" className={pillNavy}>
            Talk to us <Arrow />
          </a>
        </div>
        <ul className="mt-14 space-y-6">
          {c.businesses.items.map((b) => (
            <li key={b.title}>
              <a href="#book" className="group relative flex h-[22rem] items-end overflow-hidden bg-(--c-sky)">
                <SlotImage
                  image={images[b.image]}
                  sizes="100vw"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute inset-0 bg-linear-to-r from-white/90 via-white/50 to-transparent" />
                <span className="relative flex w-full items-end justify-between gap-4 p-5">
                  <span>
                    <span className="block text-[2rem] leading-tight font-light text-(--c-navy)">{b.title}</span>
                    <span className="mt-1 block max-w-xl text-[1rem] text-(--c-ink)">{b.body}</span>
                  </span>
                  <RoundArrow />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Support({ c, images }: { c: AuthorityContent; images: Record<string, ImageSlot> }) {
  return (
    <section className="relative overflow-hidden bg-(--c-navy) py-24 text-white" aria-labelledby="au-support">
      <AirLines className="absolute inset-x-0 top-0 h-64 w-full text-(--c-cyan)" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-10">
        <Title id="au-support" label={c.support.label} title={c.support.title} light />
        <p className="mt-6 text-[1.4rem]">{c.support.sub}</p>
        <ul className="mt-14 grid gap-10 md:grid-cols-2 md:gap-6">
          {c.support.cards.map((card) => (
            <li key={card.title}>
              <div className="relative aspect-[30/17] overflow-hidden">
                <SlotImage image={images[card.image]} sizes="(min-width: 768px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
              </div>
              <h3 className="mt-6 text-[2rem] font-light">{card.title}</h3>
              <p className="mt-4 max-w-xl text-[1.1rem] leading-relaxed text-white/90">{card.body}</p>
              <a
                href={card.href}
                className={`${L} mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[1.05rem] font-medium text-(--c-navy) transition-colors hover:bg-(--c-sky)`}
              >
                {card.cta} <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
