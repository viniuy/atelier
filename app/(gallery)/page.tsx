import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import { countByCategory, getTemplatesByCategory, templates, toCardData } from "@/data/templates";
import { CategoryWheel } from "@/components/gallery/CategoryWheel";
import { contactHrefForCategory, site } from "@/data/site";
import { SiteCard } from "@/components/gallery/SiteCard";
import { BandReveal, BuildRule, FadeUp, RiseText, Stagger } from "@/components/gallery/Build";
import { LaunchStory } from "@/components/gallery/LaunchStory";
import { MorphField } from "@/components/gallery/MorphField";
import { HeroHalftone } from "@/components/gallery/HeroHalftone";
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

      <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center bg-[#120f17] px-4 text-center text-[#f4f1ea]">
        <h1
          data-morph="word"
          data-morph-rest="hide"
          data-morph-color="#f4f1ea"
          className="relative text-[clamp(5.5rem,22vw,16rem)] leading-none font-bold tracking-[-0.06em] transition-colors duration-500"
        >
          {site.name}
          <HeroHalftone />
        </h1>
        <p className="relative z-10 mt-6 text-[13px] tracking-[0.32em] text-[#f4f1ea]/60 uppercase sm:text-[14px]">Website library</p>
        <Link
          href="#templates"
          className="absolute bottom-8 flex flex-col items-center gap-3 text-[12px] tracking-[0.2em] text-[#f4f1ea]/60 uppercase transition-colors hover:text-[#f4f1ea]"
        >
          Scroll
          <span className="h-10 w-px bg-[#f4f1ea]/30" aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="library-title">
        <BuildRule />
        <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 md:py-40">
          <h2
            id="library-title"
            className="max-w-5xl text-[clamp(2.75rem,7.4vw,6.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            <RiseText>
              Show a client their{" "}
              <span data-morph="word" className="transition-colors duration-500">
                website
              </span>{" "}
              before you build it.
            </RiseText>
          </h2>
          <FadeUp delay={0.55} className="mt-14 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-xl text-[19px] leading-relaxed text-muted">
              Complete website templates for local businesses, sorted by industry. Open one, click around as if it were
              live, and when a client says &ldquo;that one&rdquo;, we build their site on it.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="#templates"
                className="inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3.5 text-[16px] font-medium text-paper transition-colors hover:bg-ink-2"
              >
                Browse templates <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="#process" className="text-[16px] underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                How it works
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <section id="templates" aria-labelledby="templates-title" className="scroll-mt-16">
        <BuildRule />
        <span id="industries" className="block scroll-mt-16" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <h2 id="templates-title" className="sr-only">
            Templates by industry
          </h2>
          <FadeUp delay={0.25}>
          <CategoryWheel
            categories={categories.map((c) => ({
              slug: c.slug,
              name: c.name,
              description: c.description,
              live: c.status === "live" && (counts[c.slug] ?? 0) > 0,
              templates: getTemplatesByCategory(c.slug).map(toCardData),
              askHref: contactHrefForCategory(c.name),
            }))}
          />
          </FadeUp>
        </div>
      </section>

      {showcase.length > 0 && (
        <section aria-labelledby="sites-title">
          <BuildRule />
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-10 flex items-center justify-between gap-6">
              <div>
                <h2 id="sites-title" className="text-[22px] font-semibold tracking-[-0.02em]">
                  <RiseText>Real sites</RiseText>
                </h2>
                <FadeUp delay={0.3}>
                  <p className="mt-2 max-w-lg text-[14px] text-muted">
                    Live client work, plus the real businesses whose sites shaped our templates.
                  </p>
                </FadeUp>
              </div>
              <div className="flex shrink-0 items-center gap-10">
                <div data-morph="globe" aria-hidden="true" className="hidden size-[150px] md:block" />
                <Link href="/sites" className="text-[14px] text-muted underline-offset-4 hover:text-ink hover:underline">
                  View all
                </Link>
              </div>
            </div>
            <Stagger
              className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
              delay={0.35}
              items={[...showcase]
                .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "work" ? -1 : 1))
                .slice(0, 4)
                .map((s) => ({
                  key: s.slug,
                  node: <SiteCard site={s} sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw" />,
                }))}
            />
          </div>
        </section>
      )}

      <BandReveal id="process" labelledBy="process-title" className="relative isolate mt-20 scroll-mt-16 overflow-clip bg-ink text-paper">
        <LaunchStory
          steps={steps}
          title={
            <h2 id="process-title" className="max-w-xl text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em]">
              <RiseText>From preview to launch</RiseText>
            </h2>
          }
        />
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <BuildRule dark />
          <FadeUp delay={0.2} className="flex flex-wrap items-center justify-between gap-6 pt-10">
            <p className="text-[14px] text-[#a8a6a0]">
              {templates.length} templates across {live.length} {live.length === 1 ? "industry" : "industries"} so far.
            </p>
            <Link
              href="#templates"
              className="inline-flex items-center gap-2 rounded-md bg-paper px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white"
            >
              Start browsing <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </FadeUp>
        </div>
      </BandReveal>
    </>
  );
}
