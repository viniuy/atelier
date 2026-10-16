import { ChevronRight, MapPin, Plus, Quote, Star, UserRound } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { formatPeso } from "@/lib/utils";
import { SlotImage } from "@/templates/_kit/SlotImage";
import type { ContractorContent } from "../content";
import { H } from "./Top";

const wrap = "mx-auto max-w-6xl px-5";

function Heading({ id, children, light = false }: { id?: string; children: React.ReactNode; light?: boolean }) {
  return (
    <h2 id={id} className={`${H} text-center text-[clamp(2.2rem,5vw,3.4rem)] leading-none ${light ? "text-white" : "text-(--c-navy)"}`}>
      {children}
    </h2>
  );
}

function Intro({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mx-auto mt-6 max-w-3xl text-center text-[1.1rem] leading-snug font-semibold ${light ? "text-white/90" : "text-(--c-navy)"}`}>
      {children}
    </p>
  );
}

export function Services({ c, images }: { c: ContractorContent; images: Record<string, ImageSlot> }) {
  return (
    <section id="services" className="scroll-mt-28 py-20" aria-labelledby="ct-services">
      <div className={wrap}>
        <Heading id="ct-services">Our Services</Heading>
        <Intro>
          We&rsquo;re committed to customer satisfaction and know the importance of doing exceptional work. We cater to
          customers anywhere in Metro Manila.
        </Intro>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.map((s) => (
            <li key={s.kind} className="flex flex-col overflow-hidden bg-white shadow-[0_2px_12px_rgb(6_34_96/0.12)]">
              <div className="relative aspect-[10/7]">
                <SlotImage image={images[s.kind]} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
                <span className={`${H} absolute inset-x-0 bottom-0 bg-(--c-royal)/90 px-5 py-3 text-[1.05rem] tracking-[0.04em] text-white`}>
                  {s.name}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex-1 leading-relaxed text-(--c-ink)">{s.description}</p>
                <p className="mt-4 flex items-center justify-between border-t border-(--c-cloud) pt-4">
                  <span className="text-[0.9rem] text-(--c-ink)/75">Starts at</span>
                  <span className="text-[1.2rem] font-extrabold text-(--c-navy)">{formatPeso(s.startingAt)}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Rates({ c }: { c: ContractorContent }) {
  return (
    <section className="bg-(--c-cloud) py-20" aria-labelledby="ct-rates">
      <div className={wrap}>
        <Heading id="ct-rates">{c.pricing.headline}</Heading>
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {c.pricing.packages.map((p) => (
            <li key={p.name} className={`flex flex-col bg-white ${p.popular ? "ring-4 ring-(--c-gold)" : ""}`}>
              <div className="bg-(--c-navy) px-6 py-5 text-white">
                <h3 className={`${H} text-[1.4rem]`}>{p.name}</h3>
                <p className="text-[0.95rem] text-white/80">{p.description}</p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-(--c-ink)">
                  <span className="text-[2.6rem] font-extrabold text-(--c-navy)">{formatPeso(p.price)}</span> {p.unit}
                </p>
                <ul className="mt-5 flex-1 divide-y divide-(--c-cloud)">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 py-2.5 text-(--c-ink)">
                      <ChevronRight className="size-4 text-(--c-royal)" strokeWidth={3} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#inquire" className={`${H} mt-6 rounded-md bg-(--c-royal) px-5 py-3.5 text-center tracking-[0.06em] text-white hover:bg-(--c-navy)`}>
                  Inquire
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-[0.95rem] text-(--c-ink)">{c.pricing.note}</p>
      </div>
    </section>
  );
}

export function Steps({ c }: { c: ContractorContent }) {
  return (
    <section className="bg-(--c-royal) py-16 text-white" aria-labelledby="ct-steps">
      <div className={wrap}>
        <Heading id="ct-steps" light>
          How We Work
        </Heading>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="border-t-4 border-(--c-gold) pt-5">
              <p className={`${H} text-[1.3rem]`}>
                <span className="text-(--c-sky)">{String(i + 1).padStart(2, "0")}</span> {s.title}
              </p>
              <p className="mt-2 leading-relaxed text-white/90">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Products({ c }: { c: ContractorContent }) {
  return (
    <section id="products" className="scroll-mt-28 py-20" aria-labelledby="ct-products">
      <div className={wrap}>
        <Heading id="ct-products">Our Products</Heading>
        <Intro>We supply and install units from these brands, and service all of them.</Intro>
        <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-14 gap-y-8">
          {c.brands.map((b) => (
            <li key={b} className="text-[1.8rem] font-black tracking-tight text-(--c-royal) italic">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function About({ c, images }: { c: ContractorContent; images: Record<string, ImageSlot> }) {
  return (
    <section id="about" className="relative isolate scroll-mt-28 overflow-hidden py-20" aria-labelledby="ct-about">
      <SlotImage image={images.city} sizes="100vw" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-white/60" />
      <div className={wrap}>
        <h2 id="ct-about" className={`${H} text-center text-[clamp(2.2rem,5vw,3.4rem)] leading-none text-(--c-navy)`}>
          {c.about.title}
        </h2>
        <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="border-[6px] border-white bg-white shadow-lg">
            <div className="relative aspect-[8/5]">
              <SlotImage image={images.about} sizes="(min-width: 768px) 60vw, 100vw" className="absolute inset-0 size-full object-cover" />
            </div>
          </div>
          <div className="text-[1.05rem] leading-relaxed text-(--c-ink)">
            {c.about.paragraphs.map((p) => (
              <p key={p} className="mb-4">
                {p}
              </p>
            ))}
            <p className="mb-6 font-bold text-(--c-navy)">Serving customers since {c.business.since}.</p>
            <a href="#inquire" className="inline-flex items-center gap-1 rounded-md bg-(--c-navy) px-6 py-3.5 font-bold text-white hover:bg-(--c-royal)">
              Read More <ChevronRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Area({ c }: { c: ContractorContent }) {
  return (
    <section className="py-20" aria-labelledby="ct-area">
      <div className={wrap}>
        <Heading id="ct-area">{c.serviceArea.headline}</Heading>
        <Intro>{c.serviceArea.description}</Intro>
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {c.serviceArea.areas.map((a) => (
            <li key={a.name} className="flex items-center gap-2 bg-(--c-cloud) px-4 py-3 font-semibold text-(--c-navy)">
              <MapPin className="size-4 shrink-0 text-(--c-royal)" aria-hidden="true" />
              <span>
                {a.name}
                {a.note && <span className="block text-[0.8rem] font-normal text-(--c-ink)">{a.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Testimonials({ c }: { c: ContractorContent }) {
  return (
    <section className="bg-(--c-cloud) py-20" aria-labelledby="ct-reviews">
      <div className={wrap}>
        <Heading id="ct-reviews">Testimonials</Heading>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {c.testimonials.map((t) => (
            <li key={t.name} className="flex flex-col bg-white p-7 shadow-sm">
              <Quote className="size-9 fill-(--c-sky) text-(--c-sky)" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-(--c-ink)">{t.quote}</blockquote>
              <div className="mt-6 flex gap-0.5 text-(--c-gold)" role="img" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }, (_, k) => (
                  <Star key={k} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-2 font-extrabold text-(--c-navy)">{t.name}</p>
              <p className="text-[0.9rem] text-(--c-ink)/80">
                {t.location} · {t.service}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ c }: { c: ContractorContent }) {
  return (
    <section className="py-20" aria-labelledby="ct-faq">
      <div className="mx-auto max-w-4xl px-5">
        <Heading id="ct-faq">FAQ</Heading>
        <div className="mt-10 space-y-2">
          {c.faqs.map((f) => (
            <details key={f.question} className="group bg-(--c-cloud)">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-bold text-(--c-navy)">
                {f.question}
                <Plus className="size-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-(--c-ink)">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function News({ c, image }: { c: ContractorContent; image: ImageSlot }) {
  return (
    <section id="news" className="scroll-mt-28 pb-20" aria-labelledby="ct-news">
      <div className="mx-auto max-w-5xl px-5">
        <Heading id="ct-news">What&rsquo;s New</Heading>
        {c.posts.map((p) => (
          <article key={p.title} className="mt-12 grid border border-black/10 md:grid-cols-2">
            <div className="relative aspect-[4/3]">
              <SlotImage image={image} sizes="(min-width: 768px) 480px, 100vw" className="absolute inset-0 size-full object-cover" />
            </div>
            <div className="p-8">
              <p className="flex items-center gap-2 text-[0.9rem] text-(--c-ink)">
                <span className="grid size-8 place-items-center rounded-full bg-(--c-cloud)">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                {p.author}
              </p>
              <h3 className="mt-5 text-[1.8rem] leading-tight text-(--c-ink)">{p.title}</h3>
              <p className="mt-4 leading-relaxed text-(--c-ink)/85">{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
