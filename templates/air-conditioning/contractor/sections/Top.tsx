import { Clock3, Menu, ShieldCheck, Target, Timer, X } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { SlotImage } from "@/templates/_kit/SlotImage";
import { FacebookIcon, InstagramIcon } from "@/templates/_kit/BrandIcons";
import type { ContractorContent } from "../content";

export const H = "font-extrabold tracking-[0.01em] uppercase";
const HEX = "[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]";

const nav = [
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#about", label: "About Us" },
  { href: "#news", label: "Blog" },
  { href: "#inquire", label: "Contact Us" },
];

export function Logo({ c, light = false }: { c: ContractorContent; light?: boolean }) {
  return (
    <span className="relative inline-flex flex-col pl-7">
      <svg viewBox="0 0 40 60" className={`absolute top-1/2 left-0 h-[130%] -translate-y-1/2 ${light ? "text-white" : "text-(--c-royal)"}`} aria-hidden="true">
        <path d="M36 4C14 8 4 22 4 32s10 22 32 26" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M30 12C18 16 12 24 12 32s6 15 18 18" fill="none" stroke="var(--c-sky)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className={`text-[2rem] leading-none font-black tracking-tight italic ${light ? "text-white" : "text-(--c-royal)"}`}>
        {c.business.shortName}
      </span>
      <span className={`text-[0.55rem] font-bold tracking-wide whitespace-nowrap uppercase ${light ? "text-white" : "text-(--c-navy)"}`}>
        Airconditioning Services
      </span>
    </span>
  );
}

export function InfoBar({ c }: { c: ContractorContent }) {
  return (
    <div className="bg-(--c-royal) text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 text-[0.9rem]">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" aria-hidden="true" />
            Open {c.business.hours[0].time} : {c.business.hours[0].days}
          </span>
          {c.lines.map((l, i) => (
            <a key={l.label} href={l.tel} className={`hover:underline ${i > 0 ? "hidden md:inline" : ""}`}>
              {l.display}
            </a>
          ))}
        </p>
        <p className="flex items-center gap-3">
          {c.business.socials.facebook && (
            <a href={c.business.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon className="size-5" />
            </a>
          )}
          {c.business.socials.instagram && (
            <a href={c.business.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="size-5" />
            </a>
          )}
        </p>
      </div>
    </div>
  );
}

export function Header({ c, tel }: { c: ContractorContent; tel: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
      <div className="mx-auto flex h-24 max-w-6xl items-center gap-4 px-5 sm:gap-8">
        <a href="#top" aria-label={`${c.business.name} home`}>
          <Logo c={c} />
        </a>
        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className={`${H} flex gap-7 text-[1.05rem] tracking-[0.06em] text-(--c-ink)`}>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-(--c-royal)">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={tel}
          className={`${H} ml-auto rounded-md bg-(--c-navy) px-4 py-2.5 text-[0.9rem] whitespace-nowrap tracking-[0.06em] text-white sm:px-5 sm:py-3 sm:text-[1rem] transition-colors hover:bg-(--c-royal) lg:ml-0`}
        >
          Call Now
        </a>
        <details className="group relative lg:hidden">
          <summary className="grid size-11 cursor-pointer place-items-center text-(--c-navy)" aria-label="Menu">
            <Menu className="size-7 group-open:hidden" aria-hidden="true" />
            <X className="hidden size-7 group-open:block" aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile" className="absolute top-full right-0 mt-4 w-60 bg-white p-2 shadow-xl">
            <ul className={`${H} text-[1rem] tracking-[0.06em] text-(--c-ink)`}>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="block px-3 py-3 hover:bg-(--c-cloud)">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

function Hex({ image, className = "" }: { image: ImageSlot; className?: string }) {
  return (
    <div className={`${HEX} bg-(--c-gold) p-[3px] ${className}`}>
      <div className={`${HEX} bg-(--c-royal) p-2`}>
        <div className={`${HEX} relative aspect-[0.866] overflow-hidden`}>
          <SlotImage image={image} sizes="240px" className="absolute inset-0 size-full object-cover" loading="eager" />
        </div>
      </div>
    </div>
  );
}

export function Hero({ c, images }: { c: ContractorContent; images: Record<string, ImageSlot> }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-(--c-royal) text-white">
      <SlotImage image={images.heroBg} sizes="100vw" className="absolute inset-0 -z-20 size-full object-cover opacity-35 mix-blend-luminosity" fetchPriority="high" loading="eager" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-(--c-royal) via-(--c-royal)/85 to-(--c-navy)" />
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-14 text-center md:pt-20">
        <h1 className={`${H} text-[clamp(2.2rem,7vw,4.6rem)] leading-[1.02]`}>{c.hero.headline}</h1>
        <p className={`${H} mt-3 text-[clamp(0.95rem,2.2vw,1.6rem)] leading-tight`}>{c.hero.subheadline}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#inquire" className={`${H} rounded-md bg-white px-7 py-4 text-[1.05rem] tracking-[0.08em] text-(--c-navy) transition-colors hover:bg-(--c-cloud)`}>
            {c.hero.primaryCta}
          </a>
          <a href="#services" className={`${H} rounded-md border-2 border-white px-7 py-4 text-[1.05rem] tracking-[0.08em] transition-colors hover:bg-white hover:text-(--c-navy)`}>
            Our Services
          </a>
        </div>
        <div className="mt-12 flex items-start justify-center gap-4 md:justify-start" aria-hidden="true">
          <Hex image={images.hex1} className="w-36 sm:w-52 md:-mt-2" />
          <Hex image={images.hex2} className="mt-16 w-36 sm:w-52" />
        </div>
      </div>
    </section>
  );
}

export function Trust({ c }: { c: ContractorContent }) {
  const icons = [ShieldCheck, Timer, Target];
  return (
    <section aria-label="Our guarantees" className="border-b border-(--c-cloud) bg-white py-10">
      <ul className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3">
        {c.trust.map((t, i) => {
          const Icon = icons[i % icons.length];
          return (
            <li key={t.body} className="text-center">
              <p className="flex items-center justify-center gap-2 text-(--c-navy)">
                <Icon className="size-10 text-(--c-royal)" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[2.2rem] leading-none font-extrabold">{t.value}</span>
                {t.label && <span className="max-w-[7rem] text-left text-[0.95rem] leading-tight font-bold">{t.label}</span>}
              </p>
              <p className="mt-3 text-(--c-ink)">{t.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
