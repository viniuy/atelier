import { ChevronDown, Star } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { formatPeso } from "@/lib/utils";
import { SlotImage } from "@/templates/_kit/SlotImage";
import { serviceIcons } from "../../_shared/icons";
import type { ShowroomContent } from "../content";
import { D, pill, pillSolid, textLink } from "./Top";

const wrap = "mx-auto max-w-[1440px] px-6";
const h2 = `${D} text-[2rem] font-bold tracking-[-0.02em] md:text-[2.5rem]`;

export function Services({ c }: { c: ShowroomContent }) {
  return (
    <section id="services" className="scroll-mt-24 pb-6" aria-labelledby="sr-services">
      <h2 id="sr-services" className="sr-only">Services</h2>
      <ul className="grid gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {c.services.map((s) => {
          const Icon = serviceIcons[s.kind];
          return (
            <li key={s.kind} className="flex flex-col items-center bg-(--c-tile) px-6 py-10 text-center md:py-12">
              <h3 className={`${D} text-[1.4rem] font-semibold`}>{s.name}</h3>
              <Icon className="my-6 size-14 md:my-8 md:size-16 text-(--c-black)" strokeWidth={1} aria-hidden="true" />
              <p className="max-w-xs text-[0.95rem] text-(--c-ink)">{s.description}</p>
              <p className="mt-3 text-[0.95rem] font-bold">
                From {formatPeso(s.startingAt)} <span className="font-normal text-(--c-gray)">{s.unit}</span>
              </p>
              <a href="#book" className={`${textLink} mt-6`}>
                Book now
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Banner({ c, image }: { c: ShowroomContent; image: ImageSlot }) {
  return (
    <section className="relative overflow-hidden bg-(--c-night) text-white" aria-labelledby="sr-banner">
      <div className="relative aspect-[4/3] md:aspect-[24/11] md:max-h-[720px] md:w-full">
        <SlotImage image={image} sizes="100vw" className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="px-6 py-12 md:absolute md:inset-y-0 md:left-0 md:flex md:w-1/2 md:flex-col md:justify-center md:px-[max(1.5rem,calc((100vw-1392px)/2))] md:py-0">
        <h2 id="sr-banner" className={`${D} text-[2.4rem] leading-[1.05] font-bold tracking-[-0.02em] md:text-[3.6rem]`}>
          {c.banner.title}
        </h2>
        <p className="mt-4 max-w-md text-[1.1rem] text-white/85">{c.banner.body}</p>
        <div className="mt-8">
          <a href="#packages" className="inline-flex items-center justify-center rounded-full border border-white px-6 py-2.5 text-[14px] font-bold transition-colors hover:bg-white hover:text-(--c-black)">
            {c.banner.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Packages({ c }: { c: ShowroomContent }) {
  return (
    <section id="packages" className="scroll-mt-24 border-t border-(--c-line) py-20" aria-labelledby="sr-packages">
      <div className={wrap}>
        <h2 id="sr-packages" className={h2}>
          {c.pricing.headline}
        </h2>
        <ul className="mt-10 grid gap-3 md:grid-cols-3 md:gap-6">
          {c.pricing.packages.map((p) => (
            <li key={p.name} className="flex flex-col bg-(--c-tile) p-8">
              <p className="flex items-center justify-between text-[0.9rem] text-(--c-gray)">
                {p.unit}
                {p.popular && <span className="font-bold text-(--c-blue)">Most booked</span>}
              </p>
              <h3 className={`${D} mt-2 text-[1.6rem] font-semibold`}>{p.name}</h3>
              <p className="mt-6 text-[2.2rem] leading-none font-bold tabular-nums">{formatPeso(p.price)}</p>
              <p className="mt-2 text-[0.95rem] text-(--c-gray)">{p.description}</p>
              <ul className="mt-6 flex-1 space-y-2 border-t border-(--c-line) pt-6 text-[0.95rem]">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#book" className={`${p.popular ? pillSolid : pill} mt-8 self-start`}>
                Book this
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.85rem] text-(--c-gray)">{c.pricing.note}</p>
      </div>
    </section>
  );
}

export function Steps({ c }: { c: ShowroomContent }) {
  return (
    <section className="py-20" aria-labelledby="sr-steps">
      <div className={wrap}>
        <h2 id="sr-steps" className={h2}>
          How it works
        </h2>
        <ol className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title}>
              <span className={`${D} flex h-32 items-end bg-(--c-tile) p-6 text-[4rem] sm:aspect-[4/3] sm:h-auto sm:text-[5rem] leading-none font-bold text-(--c-black)/90`}>
                {i + 1}
              </span>
              <h3 className="mt-5 text-[1.2rem] font-bold">{s.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-(--c-ink)">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function BrandsLine({ c }: { c: ShowroomContent }) {
  return (
    <section className="border-y border-(--c-line) py-10" aria-label="Brands we sell and service">
      <div className={`${wrap} text-center`}>
        <p className="text-[0.9rem] text-(--c-gray)">We sell and service</p>
        <p className={`${D} mx-auto mt-3 max-w-4xl text-[1.15rem] leading-loose font-semibold`}>
          {c.brands.map((b, i) => (
            <span key={b}>
              {i > 0 && <span className="mx-2 font-normal text-(--c-line)" aria-hidden="true">|</span>}
              {b}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

export function Reviews({ c }: { c: ShowroomContent }) {
  return (
    <section className="py-20" aria-labelledby="sr-reviews">
      <div className={wrap}>
        <h2 id="sr-reviews" className={h2}>
          What customers say
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          {c.testimonials.map((t) => (
            <li key={t.name}>
              <figure>
                <span className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }, (_, k) => (
                    <Star key={k} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </span>
                <blockquote className="mt-4 text-[1.1rem] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-[0.9rem]">
                  <span className="font-bold">{t.name}</span>
                  <span className="text-(--c-gray)"> · {t.location} · {t.service}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Coverage({ c }: { c: ShowroomContent }) {
  return (
    <section className="bg-(--c-tile) py-20" aria-labelledby="sr-area">
      <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_2fr]`}>
        <div>
          <h2 id="sr-area" className={h2}>
            {c.serviceArea.headline}
          </h2>
          <p className="mt-4 max-w-sm text-[1rem] text-(--c-ink)">{c.serviceArea.description}</p>
        </div>
        <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
          {c.serviceArea.areas.map((a) => (
            <li key={a.name} className="flex justify-between gap-3 border-b border-(--c-line) py-3 text-[0.95rem]">
              <span className="font-medium">{a.name}</span>
              <span className="text-(--c-gray)">{a.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ c }: { c: ShowroomContent }) {
  return (
    <section id="support" className="scroll-mt-24 py-20" aria-labelledby="sr-faq">
      <div className={`${wrap} max-w-4xl`}>
        <h2 id="sr-faq" className={h2}>
          FAQs
        </h2>
        <div className="mt-8 border-t border-(--c-black)">
          {c.faqs.map((f) => (
            <details key={f.question} className="group border-b border-(--c-line)">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[1.1rem] font-bold">
                {f.question}
                <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-6 text-[1rem] leading-relaxed text-(--c-ink)">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
