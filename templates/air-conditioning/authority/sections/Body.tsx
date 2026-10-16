import { Check, Plus, ShieldCheck } from "lucide-react";
import { formatPeso } from "@/lib/utils";
import type { AuthorityContent } from "../content";
import { AirLines, Arrow, L, Title, pillNavy } from "../ui";

const wrap = "mx-auto max-w-[1440px] px-5 sm:px-10";

export function Pricing({ c }: { c: AuthorityContent }) {
  return (
    <section id="pricing" className="scroll-mt-24 bg-(--c-mist) py-24" aria-labelledby="au-pricing">
      <div className={wrap}>
        <Title id="au-pricing" label="Rates" title={c.pricing.headline} />
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {c.pricing.packages.map((p) => (
            <li key={p.name} className={`flex flex-col p-8 ${p.popular ? "bg-(--c-navy) text-white" : "bg-white text-(--c-ink)"}`}>
              <p className={`${L} text-[1rem] tracking-[0.04em] uppercase ${p.popular ? "text-white/80" : ""}`}>
                {p.popular ? "Most requested" : p.unit}
              </p>
              <h3 className={`mt-2 text-[2rem] font-light ${p.popular ? "text-white" : "text-(--c-navy)"}`}>{p.name}</h3>
              <p className="mt-6 text-[3rem] leading-none font-light tabular-nums">{formatPeso(p.price)}</p>
              <p className={`mt-2 text-[0.95rem] ${p.popular ? "text-white/80" : ""}`}>
                {p.popular ? p.unit : p.description}
              </p>
              <ul className={`mt-8 flex-1 space-y-3 border-t pt-8 ${p.popular ? "border-white/20" : "border-(--c-sky)"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className={`mt-0.5 size-5 shrink-0 ${p.popular ? "text-white" : "text-(--c-cyan)"}`} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                className={`${L} mt-10 inline-flex items-center gap-2.5 self-start rounded-full px-7 py-3.5 text-[1.05rem] font-medium transition-colors ${
                  p.popular ? "bg-white text-(--c-navy) hover:bg-(--c-sky)" : "bg-(--c-navy) text-white hover:bg-(--c-cyan)"
                }`}
              >
                Book {p.name} <Arrow />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.95rem] text-(--c-ink)">{c.pricing.note}</p>
      </div>
    </section>
  );
}

export function Process({ c }: { c: AuthorityContent }) {
  return (
    <section className="py-24" aria-labelledby="au-process">
      <div className={wrap}>
        <Title id="au-process" label="How it works" title="Four steps," accent="no surprises" />
        <ol className="mt-14 grid gap-10 border-t border-(--c-navy)/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title}>
              <span className="text-[3.5rem] leading-none font-light text-(--c-cyan) tabular-nums">{i + 1}</span>
              <h3 className="mt-4 text-[1.6rem] font-light text-(--c-navy)">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-(--c-ink)">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Brands({ c }: { c: AuthorityContent }) {
  return (
    <section className="border-y border-(--c-navy)/10 py-14" aria-labelledby="au-brands">
      <div className={`${wrap} grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-center`}>
        <h2 id="au-brands" className="text-[1.6rem] leading-tight font-light text-(--c-navy)">
          We service every major brand
        </h2>
        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {c.brands.map((b) => (
            <li key={b} className="text-[1.3rem] font-medium tracking-tight text-(--c-ink)/60">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Coverage({ c }: { c: AuthorityContent }) {
  return (
    <section className="py-24" aria-labelledby="au-area">
      <div className={`${wrap} grid gap-14 lg:grid-cols-[1fr_1.4fr]`}>
        <div>
          <Title id="au-area" label="Coverage" title={c.serviceArea.headline} />
          <p className="mt-6 max-w-md text-[1.15rem] leading-relaxed text-(--c-ink)">{c.serviceArea.description}</p>
        </div>
        <ul className="grid grid-cols-2 gap-x-10 sm:grid-cols-3">
          {c.serviceArea.areas.map((a) => (
            <li key={a.name} className="border-b border-(--c-navy)/10 py-4">
              <span className="block text-[1.15rem] text-(--c-navy)">{a.name}</span>
              <span className={`${L} text-[0.95rem] text-(--c-ink) uppercase`}>{a.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Testimonials({ c }: { c: AuthorityContent }) {
  const [lead, ...rest] = c.testimonials;
  return (
    <section className="bg-(--c-sky) py-24" aria-labelledby="au-reviews">
      <div className={wrap}>
        <p className={`${L} text-[1.2rem] font-medium tracking-[0.04em] text-(--c-ink) uppercase`} id="au-reviews">
          From our clients
        </p>
        <figure className="mt-6 max-w-5xl">
          <blockquote className="text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.15] font-light text-(--c-navy)">&ldquo;{lead.quote}&rdquo;</blockquote>
          <figcaption className="mt-6 text-[1.05rem] text-(--c-ink)">
            <span className="font-medium text-(--c-navy)">{lead.name}</span> · {lead.location}
          </figcaption>
        </figure>
        <ul className="mt-16 grid gap-10 border-t border-(--c-navy)/15 pt-10 md:grid-cols-2">
          {rest.map((t) => (
            <li key={t.name}>
              <figure>
                <blockquote className="text-[1.3rem] leading-snug font-light text-(--c-navy)">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-[0.95rem] text-(--c-ink)">
                  <span className="font-medium text-(--c-navy)">{t.name}</span> · {t.location} · {t.service}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ c }: { c: AuthorityContent }) {
  return (
    <section id="faq" className="scroll-mt-24 py-24" aria-labelledby="au-faq">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.6fr]`}>
        <Title id="au-faq" label="Support" title="Questions," accent="answered" />
        <div className="border-t border-(--c-navy)/15">
          {c.faqs.map((f) => (
            <details key={f.question} className="group border-b border-(--c-navy)/15">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[1.25rem] text-(--c-navy)">
                {f.question}
                <Plus className="size-6 shrink-0 text-(--c-cyan) transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-2xl pb-6 text-[1.05rem] leading-relaxed text-(--c-ink)">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Warranty({ c }: { c: AuthorityContent }) {
  return (
    <section className="relative overflow-hidden py-24" aria-labelledby="au-warranty">
      <AirLines className="absolute inset-x-0 bottom-0 h-48 w-full text-(--c-cyan)/70" />
      <div className={`${wrap} relative grid items-center gap-12 md:grid-cols-[1fr_1.6fr]`}>
        <div className="flex items-center gap-4 text-(--c-navy)">
          <ShieldCheck className="size-24 text-(--c-cyan)" strokeWidth={1} aria-hidden="true" />
          <span className="text-[2.2rem] leading-none font-medium tracking-[-0.02em]">
            {c.warranty.label.split(" ")[0]}
            <span className="block text-[1.6rem] font-light text-(--c-cyan)">{c.warranty.label.split(" ").slice(1).join(" ")}</span>
          </span>
        </div>
        <div>
          <p className={`${L} text-[1.05rem] tracking-[0.04em] text-(--c-ink) uppercase`}>{c.warranty.label}</p>
          <h2 id="au-warranty" className="mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-light text-(--c-navy)">
            {c.warranty.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.2rem] leading-relaxed text-(--c-ink)">{c.warranty.body}</p>
          <a href="#book" className={`${pillNavy} mt-8`}>
            {c.warranty.cta} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
