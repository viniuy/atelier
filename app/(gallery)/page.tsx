import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { countByCategory, getTemplatesByCategory, templates, toCardData } from "@/data/templates";
import { TemplateCard } from "@/components/gallery/TemplateCard";

const steps = [
  {
    title: "Browse together",
    body: "Open the templates for your client's industry. Each one is a full working site, so you can click through it on desktop, tablet or phone.",
  },
  {
    title: "Pick one",
    body: "When they say “that one”, hit I like this one. It sends us the template name and a preview link.",
  },
  {
    title: "Swap in their details",
    body: "Business name, services, prices, photos, service area. It's all one content file per template.",
  },
  {
    title: "Launch",
    body: "Their site goes live on their own domain, usually within the week.",
  },
];

export default function HomePage() {
  const counts = countByCategory();
  const live = categories.filter((c) => c.status === "live" && (counts[c.slug] ?? 0) > 0);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 md:pt-28 md:pb-24">
        <h1 className="max-w-3xl text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance">
          Show a client their website before you build it.
        </h1>
        <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-muted">
          Complete website templates for local businesses, sorted by industry. Open one, click around as if it were
          live, and when a client says &ldquo;that one&rdquo;, we build their site on it.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="#templates"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink-2"
          >
            Browse templates <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="#process" className="text-[15px] underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            How it works
          </Link>
        </div>
      </section>

      <div id="templates" className="scroll-mt-16">
        {live.map((c) => {
          const items = getTemplatesByCategory(c.slug).map(toCardData);
          return (
            <section key={c.slug} aria-labelledby={`cat-${c.slug}`} className="border-t border-line">
              <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                <div className="mb-10 flex items-baseline justify-between gap-6">
                  <h2 id={`cat-${c.slug}`} className="text-[22px] font-semibold tracking-[-0.02em]">
                    {c.name} <span className="font-normal text-muted">{items.length}</span>
                  </h2>
                  <Link
                    href={`/c/${c.slug}`}
                    className="text-[14px] text-muted underline-offset-4 hover:text-ink hover:underline"
                  >
                    Filter by style
                  </Link>
                </div>
                <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
                  {items.map((t, i) => (
                    <li key={t.slug}>
                      <TemplateCard template={t} eager={i < 2} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <section id="industries" aria-labelledby="industries-title" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="industries-title" className="text-[22px] font-semibold tracking-[-0.02em]">
              Industries
            </h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">
              {live.length === 1 ? "One industry is" : `${live.length} industries are`} live. The rest are being
              designed; ask if you need one sooner.
            </p>
          </div>
          <ul className="border-t border-line">
            {categories.map((c) => {
              const n = counts[c.slug] ?? 0;
              const isLive = c.status === "live" && n > 0;
              return (
                <li key={c.slug} className="border-b border-line">
                  <Link
                    href={`/c/${c.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 sm:grid-cols-[12rem_1fr_auto]"
                  >
                    <span className={isLive ? "font-medium" : "font-medium text-muted"}>{c.name}</span>
                    <span className="order-3 col-span-2 text-[14px] text-muted sm:order-none sm:col-span-1">
                      {c.description}
                    </span>
                    <span className="flex items-center gap-2 text-[13px] text-muted">
                      {isLive ? `${n} templates` : "Coming soon"}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="process" aria-labelledby="process-title" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 id="process-title" className="text-[22px] font-semibold tracking-[-0.02em]">
            From preview to launch
          </h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="font-mono text-[13px] text-muted">{i + 1}</span>
                <h3 className="mt-3 font-medium">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-14 text-[14px] text-muted">
            {templates.length} templates across {live.length} {live.length === 1 ? "industry" : "industries"} so far.
          </p>
        </div>
      </section>
    </>
  );
}
