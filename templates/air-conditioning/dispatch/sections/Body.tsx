import { Check, Handshake, MapPin, MonitorSmartphone, Plus, ShieldCheck, ShieldPlus, Star } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { formatPeso } from "@/lib/utils";
import { SlotImage } from "@/templates/_kit/SlotImage";
import { FacebookIcon } from "@/templates/_kit/BrandIcons";
import { serviceIcons } from "../../_shared/icons";
import type { DispatchContent } from "../content";

function Heading({ children, blue = false, id }: { children: React.ReactNode; blue?: boolean; id?: string }) {
  return (
    <h2
      id={id}
      className={`text-center text-[2rem] leading-tight font-semibold sm:text-[2.5rem] ${blue ? "text-(--c-bright)" : "text-black"}`}
    >
      {children}
    </h2>
  );
}

export function Services({ c }: { c: DispatchContent }) {
  return (
    <section id="services" className="scroll-mt-20 py-20" aria-labelledby="dp-services">
      <div className="mx-auto max-w-6xl px-5">
        <Heading blue id="dp-services">
          On-site Services
        </Heading>
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {c.services.map((s) => {
            const Icon = serviceIcons[s.kind];
            return (
              <li key={s.kind}>
                <a
                  href="#book"
                  className="flex h-full flex-col items-center rounded-[5px] bg-(--c-ice) px-3 pt-7 pb-5 text-center transition-transform duration-200 hover:-translate-y-1"
                >
                  <Icon className="size-14 text-(--c-blue)" strokeWidth={1.25} aria-hidden="true" />
                  <span className="mt-5 text-[13px] font-semibold tracking-wide text-(--c-ink) uppercase">{s.name}</span>
                  <span className="mt-1 text-[13px] text-(--c-ink)/70">from {formatPeso(s.startingAt)}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ValueProps({ c }: { c: DispatchContent }) {
  const icons = [MonitorSmartphone, Handshake, ShieldCheck];
  return (
    <section className="bg-(--c-mist) py-20" aria-labelledby="dp-values">
      <div className="mx-auto max-w-6xl px-5">
        <Heading blue id="dp-values">
          We Stand Behind Our Work
        </Heading>
        <ul className="mt-14 grid gap-12 md:grid-cols-3">
          {c.valueProps.map((v, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={v.title} className="mx-auto max-w-xs">
                <Icon className="mx-auto size-20 text-(--c-bright)" strokeWidth={1} aria-hidden="true" />
                <h3 className="mt-6 text-center text-[1.2rem] font-bold text-(--c-blue)">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-(--c-ink)/85">{v.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Steps({ c }: { c: DispatchContent }) {
  return (
    <section className="py-20" aria-labelledby="dp-steps">
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="dp-steps">How Booking Works</Heading>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--c-blue) font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.1rem] font-bold text-(--c-ink)">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed text-(--c-ink)/80">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Pricing({ c }: { c: DispatchContent }) {
  return (
    <section id="pricing" className="scroll-mt-20 py-20" aria-labelledby="dp-pricing">
      <div className="mx-auto max-w-4xl px-5">
        <Heading id="dp-pricing">{c.pricing.headline}</Heading>
        <div className="mt-12 overflow-x-auto rounded-[5px] border border-black/10">
          <table className="w-full min-w-[30rem] text-left">
            <caption className="sr-only">Cleaning prices per unit type</caption>
            <thead className="bg-(--c-blue) text-white">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Unit type</th>
                <th scope="col" className="px-5 py-4 text-right font-semibold">General cleaning</th>
                <th scope="col" className="px-5 py-4 text-right font-semibold">Chemical wash</th>
              </tr>
            </thead>
            <tbody>
              {c.rates.map((r) => (
                <tr key={r.unit} className="border-t border-black/10 even:bg-(--c-mist)">
                  <th scope="row" className="px-5 py-4 font-normal text-(--c-ink)">{r.unit}</th>
                  <td className="px-5 py-4 text-right font-semibold text-(--c-ink) tabular-nums">{formatPeso(r.cleaning)}</td>
                  <td className="px-5 py-4 text-right font-semibold text-(--c-ink) tabular-nums">{formatPeso(r.chemical)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-sm text-(--c-ink)/70">{c.pricing.note}</p>
        <ul className="mt-10 grid gap-3 text-sm sm:grid-cols-3">
          {c.services
            .filter((s) => s.kind !== "cleaning" && s.kind !== "maintenance")
            .slice(0, 3)
            .map((s) => (
              <li key={s.kind} className="flex justify-between gap-3 border-b border-black/10 py-3">
                <span className="text-(--c-ink)">{s.name}</span>
                <span className="font-semibold text-(--c-ink)">from {formatPeso(s.startingAt)}</span>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export function Plan({ c }: { c: DispatchContent }) {
  const pkg = c.pricing.packages[0];
  return (
    <section id="plan" className="scroll-mt-20 bg-(--c-mist) py-20" aria-labelledby="dp-plan">
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="dp-plan">{c.plan.title}</Heading>
        <div className="mx-auto mt-12 grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-[1.2rem] font-bold text-black">{c.plan.audience}</h3>
            <ul className="mt-5 space-y-3">
              {c.plan.perks.map((p) => (
                <li key={p} className="flex gap-2.5 text-(--c-ink)">
                  <Check className="mt-0.5 size-5 shrink-0 text-(--c-blue)" strokeWidth={3} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[5px] bg-(--c-ice) px-8 py-10 text-center shadow-[0_1px_4px_rgb(0_0_0/0.08)]">
            <ShieldPlus className="mx-auto size-16 text-(--c-blue)" strokeWidth={1.25} aria-hidden="true" />
            <p className="mt-5 text-(--c-ink)">{c.plan.blurb}</p>
            {pkg && (
              <p className="mt-4 text-(--c-ink)">
                <span className="text-3xl font-bold">{formatPeso(pkg.price)}</span>{" "}
                <span className="text-sm">{pkg.unit}</span>
              </p>
            )}
            <a
              href="#book"
              className="mt-6 inline-flex rounded-[3px] bg-(--c-amber) px-6 py-3 font-semibold tracking-wide text-(--c-ink) uppercase shadow-[0_2px_4px_rgb(0_0_0/0.12)] transition-colors hover:bg-[#f5a21f]"
            >
              {c.plan.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Brands({ c }: { c: DispatchContent }) {
  return (
    <section className="py-20" aria-labelledby="dp-brands">
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="dp-brands">All Brands Serviced</Heading>
        <p className="mt-3 text-center text-(--c-ink)">We offer every essential service for every brand and unit type.</p>
        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
          {c.brands.map((b) => (
            <li key={b} className="text-center text-lg font-extrabold sm:text-[1.35rem] tracking-tight text-(--c-ink)/55 italic">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Guarantee({ c, image }: { c: DispatchContent; image: ImageSlot }) {
  return (
    <section className="bg-(--c-mist) py-10" aria-labelledby="dp-guarantee">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid overflow-hidden rounded-[18px] bg-(--c-blue) shadow-[0_4px_12px_rgb(0_0_0/0.15)] md:grid-cols-[2fr_3fr]">
          <div className="relative h-72 md:h-auto">
            <SlotImage image={image} sizes="(min-width: 768px) 40vw, 100vw" className="absolute inset-0 size-full object-cover object-top" />
          </div>
          <div className="px-8 py-10 md:py-14">
            <h2 id="dp-guarantee" className="text-[1.5rem] font-bold text-white">
              Our Guarantee
            </h2>
            <ul className="mt-6 space-y-4">
              {c.guarantee.map((g) => (
                <li key={g} className="flex gap-2.5 text-white">
                  <Check className="mt-0.5 size-5 shrink-0 text-(--c-amber)" strokeWidth={3} aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Coverage({ c }: { c: DispatchContent }) {
  return (
    <section className="py-20" aria-labelledby="dp-area">
      <div className="mx-auto max-w-5xl px-5">
        <Heading id="dp-area">{c.serviceArea.headline}</Heading>
        <p className="mx-auto mt-3 max-w-xl text-center text-(--c-ink)">{c.serviceArea.description}</p>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {c.serviceArea.areas.map((a) => (
            <li
              key={a.name}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[15px] text-(--c-ink)"
            >
              <MapPin className="size-4 text-(--c-blue)" aria-hidden="true" />
              {a.name}
              {a.note && <span className="text-(--c-ink)/60">· {a.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Reviews({ c, image }: { c: DispatchContent; image: ImageSlot }) {
  return (
    <section id="reviews" className="scroll-mt-20 py-20" aria-labelledby="dp-reviews">
      <div className="mx-auto max-w-6xl px-5">
        <h2 id="dp-reviews" className="text-[2.5rem] font-semibold text-black">
          Reviews
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-[2fr_3fr]">
          <div className="relative hidden aspect-square overflow-hidden rounded-[5px] md:block">
            <SlotImage image={image} sizes="40vw" className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 rounded-[3px] bg-(--c-blue) px-6 py-5 text-white">
              {c.ratings.map((r) => (
                <div key={r.source} className="text-center">
                  <p className="flex items-center gap-3 text-2xl">
                    {r.score}
                    <span className="flex gap-1 text-(--c-amber)" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, k) => (
                        <Star key={k} className="size-4 fill-current" />
                      ))}
                    </span>
                  </p>
                  <p className="mt-1">
                    {r.count} {r.source}
                  </p>
                </div>
              ))}
            </div>
            {c.testimonials.map((t) => (
              <figure key={t.name} className="rounded-[3px] border border-black/10 bg-white p-6 shadow-[0_1px_3px_rgb(0_0_0/0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <figcaption className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-full bg-(--c-ice) font-bold text-(--c-blue)" aria-hidden="true">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-bold text-black">{t.name}</span>
                      <span className="text-sm text-(--c-ink)/70">
                        {t.location} · {t.service}
                      </span>
                    </span>
                  </figcaption>
                  <FacebookIcon className="size-8 text-black/30" />
                </div>
                <blockquote className="mt-4 leading-relaxed text-(--c-ink)">&ldquo;{t.quote}&rdquo;</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ c }: { c: DispatchContent }) {
  return (
    <section id="faq" className="scroll-mt-20 bg-(--c-mist) py-20" aria-labelledby="dp-faq">
      <div className="mx-auto max-w-3xl px-5">
        <Heading id="dp-faq">Frequently Asked Questions</Heading>
        <div className="mt-10 space-y-3">
          {c.faqs.map((f) => (
            <details key={f.question} className="group rounded-[5px] border border-black/10 bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-(--c-ink)">
                {f.question}
                <Plus className="size-5 shrink-0 text-(--c-blue) transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-(--c-ink)/85">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
