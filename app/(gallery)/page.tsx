import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { countByCategory, getTemplatesByCategory, templates, toCardData } from "@/data/templates";
import { TemplateCard } from "@/components/gallery/TemplateCard";
import { SiteCard } from "@/components/gallery/SiteCard";
import { DarkDots } from "@/components/gallery/Backgrounds";
import { MorphField } from "@/components/gallery/MorphField";
import { site } from "@/data/site";
import { showcase } from "@/data/showcase";

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
      <MorphField />

      <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-4 text-center">
        <h1
          data-morph="word"
         
          className="text-[clamp(5.5rem,22vw,16rem)] leading-none font-bold tracking-[-0.06em] transition-colors duration-500"
        >
          {site.name}
        </h1>
        <p className="mt-6 text-[13px] tracking-[0.32em] text-muted uppercase sm:text-[14px]">Website library</p>
        <Link
          href="#templates"
          className="absolute bottom-8 flex flex-col items-center gap-3 text-[12px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink"
        >
          Scroll
          <span className="h-10 w-px bg-line-strong" aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="library-title" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-20 pb-6 sm:px-6 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <h2 id="library-title" className="text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">
              Show a client their website before you build it.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              Complete website templates for local businesses, sorted by industry. Open one, click around as if it were
              live, and when a client says &ldquo;that one&rdquo;, we build their site on it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
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
          </div>
          <div data-morph="browser" aria-hidden="true" className="hidden h-[200px] w-[320px] md:block" />
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

      {showcase.length > 0 && (
        <section aria-labelledby="sites-title" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-10 flex items-center justify-between gap-6">
              <div>
                <h2 id="sites-title" className="text-[22px] font-semibold tracking-[-0.02em]">
                  Real sites
                </h2>
                <p className="mt-2 max-w-lg text-[14px] text-muted">
                  Live client work, plus the real businesses whose sites shaped our templates.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-10">
                <div data-morph="globe" aria-hidden="true" className="hidden size-[150px] md:block" />
                <Link href="/sites" className="text-[14px] text-muted underline-offset-4 hover:text-ink hover:underline">
                  View all
                </Link>
              </div>
            </div>
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {[...showcase]
                .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "work" ? -1 : 1))
                .slice(0, 4)
                .map((s) => (
                  <li key={s.slug}>
                    <SiteCard site={s} sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw" />
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

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
            <div
              data-morph="grid"
              data-morph-count={categories.length}
             
              aria-hidden="true"
              className="mt-14 hidden h-[110px] w-[210px] md:block"
            />
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

      <section id="process" aria-labelledby="process-title" className="relative isolate mt-20 scroll-mt-16 overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 -z-10">
          <DarkDots />
        </div>
        <div className="pointer-events-none mx-auto max-w-6xl px-4 py-24 sm:px-6 [&_a]:pointer-events-auto">
          <div className="flex items-center justify-between gap-10">
            <h2 id="process-title" className="max-w-xl text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em]">
              From preview to launch
            </h2>
            <div
              data-morph="steps"
              data-morph-color="#e9e7e1"
             
              aria-hidden="true"
              className="hidden h-[130px] w-[240px] md:block"
            />
          </div>
          <ol className="mt-14 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="font-mono text-[13px] text-[#a8a6a0]">{i + 1}</span>
                <h3 className="mt-3 font-medium">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a8a6a0]">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-10">
            <p className="text-[14px] text-[#a8a6a0]">
              {templates.length} templates across {live.length} {live.length === 1 ? "industry" : "industries"} so far.
            </p>
            <Link
              href="#templates"
              className="inline-flex items-center gap-2 rounded-md bg-paper px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white"
            >
              Start browsing <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
