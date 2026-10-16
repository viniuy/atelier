import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { SlotImage } from "@/templates/_kit/SlotImage";
import type { ShowroomContent } from "../content";

export const D = "font-(family-name:--font-sr-display)";

/** Outline pill and underlined text link: the two button styles of the template. */
export const pill =
  "inline-flex items-center justify-center rounded-full border border-current px-6 py-2.5 text-[14px] font-bold transition-colors hover:bg-(--c-black) hover:text-white hover:border-(--c-black)";
export const pillSolid =
  "inline-flex items-center justify-center rounded-full bg-(--c-black) px-6 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-(--c-ink)/80";
export const textLink = "border-b-2 border-current pb-0.5 text-[14px] font-bold";

const nav = [
  { href: "#shop", label: "Shop" },
  { href: "#units", label: "Units" },
  { href: "#services", label: "Services" },
  { href: "#packages", label: "Packages" },
  { href: "#support", label: "Support" },
];

export function Wordmark({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`${D} text-[1.4rem] font-bold tracking-[0.18em] uppercase ${className}`}>{name}</span>;
}

export function Header({ c, tel }: { c: ShowroomContent; tel: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="mx-auto hidden max-w-[1440px] justify-end gap-6 px-6 pt-3 text-[13px] font-bold md:flex">
        <a href="#support" className="hover:underline">Support</a>
        <a href="#book" className="inline-flex items-center gap-0.5 hover:underline">
          For Business <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-10 px-6">
        <a href="#top" aria-label={`${c.business.name} home`}>
          <Wordmark name={c.business.shortName} />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-7 text-[15px] font-bold">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="border-b-2 border-transparent pb-1 hover:border-current">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <a href={tel} className="flex items-center gap-2 text-[15px] font-bold">
            <Phone className="size-5" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden sm:inline">{c.business.phone.display}</span>
            <span className="sr-only sm:hidden">Call {c.business.phone.display}</span>
          </a>
          <a href="#book" className={`${pillSolid} hidden px-5 py-2 sm:inline-flex`}>
            Book
          </a>
          <details className="group relative lg:hidden">
            <summary className="grid size-10 cursor-pointer place-items-center" aria-label="Menu">
              <Menu className="size-6 group-open:hidden" strokeWidth={1.5} aria-hidden="true" />
              <X className="hidden size-6 group-open:block" strokeWidth={1.5} aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile" className="fixed inset-x-0 top-[64px] border-t border-(--c-line) bg-white px-6 pb-8 shadow-lg md:top-[100px]">
              <ul className={`${D} text-xl font-semibold`}>
                {[...nav, { href: "#book", label: "Book a service" }].map((n) => (
                  <li key={n.href} className="border-b border-(--c-line)">
                    <a href={n.href} className="block py-4">
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
  );
}

export function Hero({ c, image }: { c: ShowroomContent; image: ImageSlot }) {
  return (
    <section id="top" className="bg-white">
      <div className="px-6 pt-14 pb-10 text-center md:pt-20 md:pb-14">
        <p className={`${D} text-[1.15rem] font-semibold text-(--c-blue) md:text-[1.35rem]`}>{c.campaign.kicker}</p>
        <h1
          className={`${D} mx-auto mt-3 max-w-5xl text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[1.02] font-bold tracking-[-0.03em] text-balance text-(--c-black)`}
        >
          {c.campaign.title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[1.1rem] text-(--c-ink)">{c.campaign.body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a href="#book" className={`${pillSolid} px-7 py-3 text-[15px]`}>
            {c.hero.primaryCta}
          </a>
          <a href="#units" className={textLink}>
            See units and prices
          </a>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-(--c-tile) sm:aspect-[12/5] md:mx-6 md:rounded-[28px] 2xl:mx-auto 2xl:max-w-[1392px]">
        <SlotImage
          image={image}
          sizes="(min-width: 1440px) 1440px, 100vw"
          className="absolute inset-0 size-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}

export function Highlights({ c }: { c: ShowroomContent }) {
  return (
    <section aria-label="Why buy here" className="border-b border-(--c-line) py-10 md:py-12">
      <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-8 px-6 md:grid-cols-4">
        {c.highlights.map((h, i) => (
          <li key={h.title} className={`px-2 text-center md:px-6 ${i > 0 ? "md:border-l md:border-(--c-line)" : ""}`}>
            <p className={`${D} text-[1.2rem] font-semibold md:text-[1.35rem]`}>{h.title}</p>
            <p className="mt-1 text-[0.9rem] text-(--c-gray)">{h.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function UnitTiles({ c, images }: { c: ShowroomContent; images: Record<string, ImageSlot> }) {
  return (
    <section id="shop" aria-labelledby="sr-shop" className="scroll-mt-24 pt-20 pb-6">
      <h2 id="sr-shop" className={`${D} px-6 text-[2rem] font-bold tracking-[-0.02em] md:px-[max(1.5rem,calc((100vw-1392px)/2))] md:text-[2.5rem]`}>
        Shop by unit type
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        {c.unitTypes.map((u) => (
          <li key={u.type}>
            <a href="#units" className="group flex aspect-square flex-col items-center bg-(--c-tile) px-4 pt-6 md:pt-8">
              <span className={`${D} text-center text-[1.05rem] font-semibold md:text-[1.4rem]`}>{u.name}</span>
              <span className="relative mt-4 w-[70%] flex-1">
                <SlotImage
                  image={images[u.type]}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="absolute inset-0 size-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
